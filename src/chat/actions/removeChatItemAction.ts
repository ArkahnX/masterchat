import { exportActionTypes, RemoveChatItemAction } from "../../interfaces/actions";
import { YTRemoveChatItemAction } from "../../interfaces/yt/chat";

export function parseRemoveChatItemAction(payload: YTRemoveChatItemAction) {
	const parsed: RemoveChatItemAction = {
		type: exportActionTypes.removeChatItemAction,
		targetId: payload.targetItemId,
		timestamp: Date.now(),
	};
	return parsed;
}
