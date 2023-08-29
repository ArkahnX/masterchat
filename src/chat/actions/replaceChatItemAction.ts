import { exportActionTypes, ReplaceChatItemAction } from "../../interfaces/actions";
import { YTReplaceChatItemAction } from "../../interfaces/yt/chat";
import { debugLog } from "../../utils";
import { BackupTimestamp } from "../utils";
import {
	parseLiveChatPaidMessageRenderer,
	parseLiveChatPlaceholderItemRenderer,
	parseLiveChatTextMessageRenderer,
} from "./addChatItemAction";

export function parseReplaceChatItemAction(payload: YTReplaceChatItemAction, backupTimestamp: BackupTimestamp) {
	const parsedItem = parseReplacementItem(payload.replacementItem, backupTimestamp);

	const parsed: ReplaceChatItemAction = {
		type: exportActionTypes.replaceChatItemAction,
		targetItemId: payload.targetItemId,
		replacementItem: parsedItem,
		timestamp: Date.now()
	};
	return parsed;
}

function parseReplacementItem(item: YTReplaceChatItemAction["replacementItem"], backupTimestamp: BackupTimestamp) {
	if ("liveChatPlaceholderItemRenderer" in item) {
		return parseLiveChatPlaceholderItemRenderer(item.liveChatPlaceholderItemRenderer, backupTimestamp);
	} else if ("liveChatTextMessageRenderer" in item) {
		return parseLiveChatTextMessageRenderer(item.liveChatTextMessageRenderer, backupTimestamp);
	} else if ("liveChatPaidMessageRenderer" in item) {
		// TODO: check if YTLiveChatPaidMessageRendererContainer will actually appear
		debugLog("[action required] observed liveChatPaidMessageRenderer as a replacementItem");
		return parseLiveChatPaidMessageRenderer(item.liveChatPaidMessageRenderer, backupTimestamp);
	} else {
		debugLog("[action required] unrecognized replacementItem type:", JSON.stringify(item));
		return item;
	}
}
