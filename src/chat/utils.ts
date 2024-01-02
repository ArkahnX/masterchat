import {
	YTAction,
	YTLiveChatBannerPollRenderer,
	YTLiveChatMembershipItemRenderer,
	YTLiveChatPaidMessageRenderer,
	YTLiveChatPaidStickerRenderer,
	YTLiveChatPollRenderer,
	YTLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer,
	YTLiveChatSponsorshipsHeaderRenderer,
	YTLiveChatTextMessageRenderer,
	YTLiveChatTickerPaidMessageItemRenderer,
	YTLiveChatTickerPaidStickerItemRenderer,
	YTLiveChatTickerSponsorItemRenderer,
	YTThumbnailList,
} from "../interfaces/yt/chat";
import { tsToNumber } from "../utils";

export function pickThumbUrl(thumbList: YTThumbnailList): string {
	if ("thumbnails" in thumbList === false) {
		console.error("Unexpectedly missing thumbnails, refer to trace");
		console.trace();
		return "";
	}
	const fullThumbnail = thumbList.thumbnails[0].url;
	if (fullThumbnail.indexOf("=") > -1) {
		return fullThumbnail.split("=")[0];
	}
	return fullThumbnail;
}

export class BackupTimestamp {
	private timestamp = Date.now();

	get() {
		return this.timestamp;
	}

	set(timestampUsec: string) {
		this.timestamp = tsToNumber(timestampUsec);
	}
}

export function findUnexpectedProperties(
	expectedProperties: string[],
	renderer:
		| YTLiveChatTextMessageRenderer
		| YTLiveChatPaidMessageRenderer
		| YTLiveChatPaidStickerRenderer
		| YTLiveChatMembershipItemRenderer
		| YTLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer
		| YTLiveChatSponsorshipsHeaderRenderer
		| YTLiveChatPollRenderer
		| YTLiveChatPollRenderer["header"]["pollHeaderRenderer"]
		| YTLiveChatTickerPaidMessageItemRenderer
		| YTLiveChatTickerPaidStickerItemRenderer
		| YTLiveChatTickerSponsorItemRenderer
		| YTLiveChatBannerPollRenderer
) {
	const unexpectedProperties: Record<string, unknown> = {};
	for (const [property, value] of Object.entries(renderer)) {
		if (expectedProperties.includes(property) === false) {
			unexpectedProperties[property] = value;
		}
	}
	return unexpectedProperties;
}

export function parseColorCode(code: number): string {
	if (code > 4294967295) {
		throw new Error(`Invalid color code: ${code}`);
	}

	const b = code & 0xff;
	const g = (code >>> 8) & 0xff;
	const r = (code >>> 16) & 0xff;
	const opacity = code >>> 24;

	// return { r, g, b, opacity };
	return "#" + (256 + r).toString(16).slice(1) + ((1 << 24) | (g << 16) | (b << 8) | opacity).toString(16).slice(1);
}

const magnitudes = new Map([
	["K", 1000 ** 1],
	["M", 1000 ** 2],
	["G", 1000 ** 3],
	["T", 1000 ** 4],
	["P", 1000 ** 5],
	["E", 1000 ** 6],
] as const);
const unitRegex = /(?<value>[0-9]+(\.[0-9]*)?)(?<suffix>([KMGTPE]))?/;

export function unitsToNumber(text: string) {
	const unitsMatch = text.match(unitRegex);

	if (!unitsMatch?.groups) {
		return NaN;
	}

	const parsedValue = parseFloat(unitsMatch.groups.value);

	if (!unitsMatch.groups?.suffix) {
		return parsedValue;
	}

	const magnitude = magnitudes.get(unitsMatch.groups.suffix as never);

	if (!magnitude) {
		throw new Error("UnitRegex is wrong some how");
	}

	return parseInt((parsedValue * magnitude).toFixed(1));
}
