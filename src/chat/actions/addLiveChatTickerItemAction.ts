import { unknown } from "..";
import {
	YTAddLiveChatTickerItem,
	YTAddLiveChatTickerItemAction,
	YTLiveChatTickerPaidMessageItemRenderer,
	YTLiveChatTickerPaidStickerItemRenderer,
	YTLiveChatTickerSponsorItemRenderer,
} from "../../interfaces/yt/chat";
import { debugLog } from "../../utils";
import { BackupTimestamp, findUnexpectedProperties } from "../utils";
import {
	parseLiveChatMembershipItemRenderer,
	parseLiveChatPaidMessageRenderer,
	parseLiveChatPaidStickerRenderer,
	parseLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer,
} from "./addChatItemAction";
import { membershipTickerProperties, superChatTickerProperties, superStickerTickerProperties } from "./properties";

export function parseAddLiveChatTickerItemAction(payload: YTAddLiveChatTickerItemAction, backupTimestamp: BackupTimestamp) {
	const rendererType = Object.keys(payload.item)[0] as keyof YTAddLiveChatTickerItem;

	if ("liveChatTickerPaidMessageItemRenderer" in payload.item && payload.item.liveChatTickerPaidMessageItemRenderer) {
		// superchats
		const renderer = payload.item.liveChatTickerPaidMessageItemRenderer;
		const unexpectedProperties = findUnexpectedProperties(superChatTickerProperties, renderer);
		const unexpectedKeys = [...Object.keys(unexpectedProperties)];
		if (unexpectedKeys.length > 0) {
			console.log("Unexpected keys found in [liveChatTickerPaidMessageItemRenderer]", unexpectedKeys);
		}
		const parsed = parseLiveChatTickerPaidMessageItemRenderer(renderer, backupTimestamp);
		const combined = Object.assign(unexpectedProperties, parsed);
		return combined;
	} else if ("liveChatTickerPaidStickerItemRenderer" in payload.item && payload.item.liveChatTickerPaidStickerItemRenderer) {
		// stickers
		const renderer = payload.item.liveChatTickerPaidStickerItemRenderer;
		const unexpectedProperties = findUnexpectedProperties(superStickerTickerProperties, renderer);
		const unexpectedKeys = [...Object.keys(unexpectedProperties)];
		if (unexpectedKeys.length > 0) {
			console.log("Unexpected keys found in [liveChatTickerPaidStickerItemRenderer]", unexpectedKeys);
		}
		const parsed = parseLiveChatTickerPaidStickerItemRenderer(renderer, backupTimestamp);
		const combined = Object.assign(unexpectedProperties, parsed);
		return combined;
	} else if ("liveChatTickerSponsorItemRenderer" in payload.item && payload.item.liveChatTickerSponsorItemRenderer) {
		// new members / gifts
		const renderer = payload.item.liveChatTickerSponsorItemRenderer;
		const unexpectedProperties = findUnexpectedProperties(membershipTickerProperties, renderer);
		const unexpectedKeys = [...Object.keys(unexpectedProperties)];
		if (unexpectedKeys.length > 0) {
			console.log("Unexpected keys found in [liveChatTickerSponsorItemRenderer]", unexpectedKeys);
		}
		const parsed = parseLiveChatTickerSponsorItemRenderer(renderer, backupTimestamp);
		const combined = Object.assign(unexpectedProperties, parsed);
		return combined;
	} else {
		debugLog("[action required] Unrecognized renderer type (addLiveChatTickerItemAction):", rendererType, JSON.stringify(payload.item));
	}
	return unknown(payload);
}

function parseLiveChatTickerPaidMessageItemRenderer(
	renderer: YTLiveChatTickerPaidMessageItemRenderer,
	backupTimestamp: BackupTimestamp /* , durationSec: string */
) {
	return parseLiveChatPaidMessageRenderer(
		renderer.showItemEndpoint.showLiveChatItemEndpoint.renderer.liveChatPaidMessageRenderer,
		backupTimestamp
	);
}

function parseLiveChatTickerPaidStickerItemRenderer(
	renderer: YTLiveChatTickerPaidStickerItemRenderer,
	backupTimestamp: BackupTimestamp /* ,
	durationSec: string */
) {
	return parseLiveChatPaidStickerRenderer(
		renderer.showItemEndpoint.showLiveChatItemEndpoint.renderer.liveChatPaidStickerRenderer,
		backupTimestamp
	);
}

function parseLiveChatTickerSponsorItemRenderer(
	renderer: YTLiveChatTickerSponsorItemRenderer,
	backupTimestamp: BackupTimestamp
) {

	/**
	 * - membership / membership milestone
	 * detailIcon -> undefined
	 * detailText -> {simpleText: "20"} // amount
	 * showItemEndpoint.showLiveChatItemEndpoint.renderer -> liveChatMembershipItemRenderer
	 *
	 * - membership gift
	 * detailIcon -> {iconType: "GIFT"}
	 * detailText -> {runs: [{text: "Member"}]}
	 * showItemEndpoint.showLiveChatItemEndpoint.renderer -> liveChatSponsorshipsGiftPurchaseAnnouncementRenderer
	 * also liveChatSponsorshipsGiftPurchaseAnnouncementRenderer missing timestampUsec
	 */
	const rdr = renderer.showItemEndpoint.showLiveChatItemEndpoint.renderer;
	if ("liveChatMembershipItemRenderer" in rdr) {
		return parseLiveChatMembershipItemRenderer(rdr.liveChatMembershipItemRenderer, backupTimestamp);
	} else if ("liveChatSponsorshipsGiftPurchaseAnnouncementRenderer" in rdr) {
		return parseLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer(
			rdr.liveChatSponsorshipsGiftPurchaseAnnouncementRenderer,
			backupTimestamp
		);
	} else {
		const key = Object.keys(rdr)[0];
		debugLog(`[action required] Unrecognized renderer '${key}' (parseLiveChatTickerSponsorItemRenderer):`, JSON.stringify(renderer));
		throw new Error(`Unrecognized renderer (parseLiveChatTickerSponsorItemRenderer): ${key}`);
	}
}
