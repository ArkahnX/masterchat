import { debugLog } from "../utils";
import {
	YTAuthorBadge,
	YTLiveChatMembershipItemRenderer,
	YTLiveChatPaidMessageRenderer,
	YTLiveChatPaidStickerRenderer,
	YTLiveChatSponsorshipsGiftRedemptionAnnouncementRenderer,
	YTLiveChatSponsorshipsHeaderRenderer,
	YTLiveChatTextMessageRenderer,
} from "../interfaces/yt/chat";
import { Membership } from "../interfaces/misc";
import hololiveChannels from "../hololive-channels.json";
import { AuthorBadges } from "../interfaces/Superchats/common";
import { pickThumbUrl } from "./utils";

export function parseMembership(badge?: YTAuthorBadge): Membership | undefined {
	if (!badge) return;
	const renderer = badge?.liveChatAuthorBadgeRenderer;
	if (!renderer?.customThumbnail) return;

	const match = /^(.+?)(?:\s\((.+)\))?$/.exec(renderer.tooltip);
	if (match) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [_, status, since] = match;
		const membership = {
			status,
			since,
			thumbnail: pickThumbUrl(renderer.customThumbnail),
		};
		return membership;
	}
}

export function parseBadges(
	renderer:
		| YTLiveChatTextMessageRenderer
		| YTLiveChatPaidMessageRenderer
		| YTLiveChatPaidStickerRenderer
		| YTLiveChatMembershipItemRenderer
		| YTLiveChatSponsorshipsHeaderRenderer
		| YTLiveChatSponsorshipsGiftRedemptionAnnouncementRenderer
) {
	const badges: AuthorBadges = {};
	if ("authorExternalChannelId" in renderer && renderer.authorExternalChannelId in hololiveChannels) {
		badges.hololive = true;
	}

	if ("authorBadges" in renderer && renderer.authorBadges) {
		for (const badge of renderer.authorBadges) {
			const badgeRenderer = badge.liveChatAuthorBadgeRenderer;
			const iconType = badgeRenderer.icon?.iconType;
			if (iconType === "VERIFIED") {
				badges.verified = true;
			} else if (iconType === "OWNER") {
				badges.owner = true;
			} else if (iconType === "MODERATOR") {
				badges.moderator = true;
			} else if (badgeRenderer.customThumbnail) {
				const membership = parseMembership(badge);
				badges.duration = membership?.since ?? membership?.status;
				badges.thumbnail = membership?.thumbnail;
			} else {
				debugLog("[action required] Unrecognized iconType:", iconType, JSON.stringify(badgeRenderer));
				throw new Error(`Unrecognized iconType: ${iconType ?? ""}`);
			}
		}
	}
	if(Object.keys(badges).length === 0) {
		return undefined;
	}
	return badges;
}
