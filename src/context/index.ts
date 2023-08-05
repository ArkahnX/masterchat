import * as cheerio from "cheerio";
import {
  MembersOnlyError,
  NoPermissionError,
  NoStreamRecordingError,
  UnavailableError,
} from "../errors";
import { runsToString, stringify  } from "../utils";
import { YTInitialData, YTPlayabilityStatus, PurpleStyle, ResultsResults } from "../interfaces/yt/context";
import { DC } from "../constants";

// OK duration=">0" => Archived (replay chat may be available)
// OK duration="0" => Live (chat may be available)
// LIVE_STREAM_OFFLINE => Offline (chat may be available)
function assertPlayability(playabilityStatus: YTPlayabilityStatus | undefined, html: string) {
  if (!playabilityStatus) {
    console.error("Watch HTML", html);
    throw new Error("playabilityStatus missing");
  }
  switch (playabilityStatus.status) {
    case "ERROR":
      throw new UnavailableError(playabilityStatus.reason!);
    case "LOGIN_REQUIRED":
      throw new NoPermissionError(playabilityStatus.reason!);
    case "UNPLAYABLE": {
      if (
        "playerLegacyDesktopYpcOfferRenderer" in playabilityStatus.errorScreen!
      ) {
        throw new MembersOnlyError(playabilityStatus.reason!);
      }
      throw new NoStreamRecordingError(playabilityStatus.reason!);
    }
    case "LIVE_STREAM_OFFLINE":
    case "OK":
  }
}

export function findCfg(data: string) {
  const match = /ytcfg\.set\s*\(\s*({.+?})\s*\)\s*;/.exec(data);
  if (!match) {console.error(`No match found for "findCfg"`);
  return;
}
  return JSON.parse(match[1]);
}

export function findIPR(data: string): unknown {
  const match = /ytInitialPlayerResponse\s*=\s*({.+?})\s*;\s*(?:var\s+(?:meta|head)|<\/script|\n)/.exec(data);
  if (!match) {console.error(`No match found for "findIPR"`);
  return;
}
  return JSON.parse(match[1]);
}

function findClientVersion(data: string) {
	const result = findCfg(data)?.INNERTUBE_CONTEXT_CLIENT_VERSION;
	if (result && typeof result === "string") {
		if (result !== DC.clientVersion) {
			console.error(`current masterchat version ${DC.clientVersion} does not match live ${result}`);
		}
		DC.clientVersion = result;
	}
}

export function findInitialData(data: string): YTInitialData | undefined {
  const match =
  /(?:window\s*\[\s*["']ytInitialData["']\s*\]|ytInitialData)\s*=\s*({.+?})\s*;\s*(?:var\s+(?:meta|head)|<\/script|\n)/.exec(
      data
    );
  if (!match) {console.error(`No match found for "findInitialData"`);
  return;
}
  return JSON.parse(match[1]);
}

function getVideoPrimaryInfoRenderer(results: ResultsResults) {
	for(const entry of results.contents) {
		if("videoPrimaryInfoRenderer" in entry) {
			return entry;
		}
	}
	throw new Error(`Unable to find "videoPrimaryInfoRenderer" ${JSON.stringify(results)}`);
}
function getVideoSecondaryInfoRenderer(results: ResultsResults) {
	for(const entry of results.contents) {
		if("videoSecondaryInfoRenderer" in entry) {
			return entry;
		}
	}
	throw new Error(`Unable to find "videoSecondaryInfoRenderer" ${JSON.stringify(results)}`);
}

export function findEPR(data: string) {
  return findCfg(data)?.PLAYER_VARS?.embedded_player_response;
}

export function findPlayabilityStatus(
  data: string
): YTPlayabilityStatus | undefined {
  const ipr = findIPR(data);
  return (ipr as any)?.playabilityStatus;
}
// embed disabled https://www.youtube.com/embed/JfJYHfrOGgQ
// unavailable video https://www.youtube.com/embed/YEAINgb2xfo
// private video https://www.youtube.com/embed/UUjdYGda4N4
// 200 OK

export async function parseMetadataFromEmbed(html: string) {
  const epr = findEPR(html);

  const ps = epr.previewPlayabilityStatus;
  if (!epr || !ps) {
		console.error("missing epr or ps");
	}
  assertPlayability(ps, html);

  const ep = epr.embedPreview;

  const prevRdr = ep.thumbnailPreviewRenderer;
  const vdRdr = prevRdr.videoDetails.embeddedPlayerOverlayVideoDetailsRenderer;
  const expRdr =
    vdRdr.expandedRenderer.embeddedPlayerOverlayVideoDetailsExpandedRenderer;

  const title = runsToString(prevRdr.title.runs);
  const thumbnail =
    prevRdr.defaultThumbnail.thumbnails[
      prevRdr.defaultThumbnail.thumbnails.length - 1
    ].url;
  const channelId = expRdr.subscribeButton.subscribeButtonRenderer.channelId;
  const channelName = runsToString(expRdr.title.runs);
  const channelThumbnail = vdRdr.channelThumbnail.thumbnails[0].url;
  const duration = Number(prevRdr.videoDurationSeconds);

  return {
    title,
    thumbnail,
    channelId,
    channelName,
    channelThumbnail,
    duration,
    status: ps.status,
    statusText: ps.reason,
  };
}

function getMembershipBadge(primaryInfo) {
	if ("badges" in primaryInfo) {
		for (const entry of primaryInfo.badges) {
			if ("metadataBadgeRenderer" in entry && entry.metadataBadgeRenderer.style === "BADGE_STYLE_TYPE_MEMBERS_ONLY") {
				return true;
			}
		}
	}
	return false;
}
function hasLiveChat(initialData) {
	const conversationBar = initialData.contents?.twoColumnWatchNextResults?.conversationBar;
	if (conversationBar && "liveChatRenderer" in conversationBar) {
		return true;
	}
	return false;
}

export function parseMetadataFromWatch(html: string) {
  findClientVersion(html);
  const initialData = findInitialData(html)!;

  const playabilityStatus = findPlayabilityStatus(html);
  // assertPlayability(playabilityStatus);

  // TODO: initialData.contents.twoColumnWatchNextResults.conversationBar.conversationBarRenderer.availabilityMessage.messageRenderer.text.runs[0].text === 'Chat is disabled for this live stream.'
  const results =
    initialData.contents?.twoColumnWatchNextResults?.results.results!;

    const primaryInfo = getVideoPrimaryInfoRenderer(results).videoPrimaryInfoRenderer;
    const videoOwner = getVideoSecondaryInfoRenderer(results).videoSecondaryInfoRenderer.owner.videoOwnerRenderer;
    const isMembership = getMembershipBadge(primaryInfo);
	const hasChat = hasLiveChat(initialData);

  const title = runsToString(primaryInfo.title.runs);
  const channelId = videoOwner.navigationEndpoint.browseEndpoint.browseId;
  const channelName = runsToString(videoOwner.title.runs);
  const metadata = parseVideoMetadataFromHtml(html);
  let isLive = false;
	if (isMembership && hasChat && "viewCount" in primaryInfo) {
		isLive = true;
	}
	if (isMembership === false && hasChat && "viewCount" in primaryInfo) {
		isLive = primaryInfo.viewCount?.videoViewCountRenderer.isLive ?? false;
	}
  const isMembersOnly =
    primaryInfo.badges?.some?.(
      (v) =>
        v.metadataBadgeRenderer.style === PurpleStyle.BadgeStyleTypeMembersOnly
    ) ?? false;

  const viewCount = primaryInfo.viewCount?.videoViewCountRenderer.isLive
  ? Number(
      stringify(primaryInfo.viewCount?.videoViewCountRenderer.viewCount)
        .replace("watching now", "")
        .trim()
        .replace(/,/g, "")
    )
  : 0;

  return {
    title,
    channelId,
    channelName,
    isLive,
    viewCount,
    isMembersOnly,
  };
}

/**
 * @see http://schema.org/VideoObject
 */
function parseVideoMetadataFromHtml(html: string) {
  const $ = cheerio.load(html);
  const meta = parseVideoMetadataFromElement(
    $("[itemtype=http://schema.org/VideoObject]")?.[0]
  );
  return meta;
}

function parseVideoMetadataFromElement(
  root: any,
  meta: Record<string, any> = {}
) {
  root?.children?.forEach((child: cheerio.Element) => {
    const attributes = child?.attribs;
    const key = attributes?.itemprop;
    if (!key) {
      return;
    }

    if (child.children.length) {
      meta[key] = parseVideoMetadataFromElement(child);
      return;
    }

    const value = parseVideoMetaValueByKey(
      key,
      attributes?.href || attributes?.content
    );
    meta[key] = value;
  });

  return meta;
}

function parseVideoMetaValueByKey(key: string, value: string) {
  switch (key) {
    case "paid":
    case "unlisted":
    case "isFamilyFriendly":
    case "interactionCount":
    case "isLiveBroadcast":
      return /true/i.test(value);
    case "width":
    case "height":
      return Number(value);
  }
  return value;
}
