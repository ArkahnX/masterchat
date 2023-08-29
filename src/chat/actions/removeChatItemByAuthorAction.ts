import { exportActionTypes, RemoveChatItemByAuthorAction } from "../../interfaces/actions";
import { YTRemoveChatItemByAuthorAction } from "../../interfaces/yt/chat";

export function parseRemoveChatItemByAuthorAction(payload: YTRemoveChatItemByAuthorAction) {
	const parsed: RemoveChatItemByAuthorAction = {
		type: exportActionTypes.removeChatItemByAuthorAction,
		channelId: payload.externalChannelId,
		timestamp: Date.now(),
	};
	return parsed;
}
