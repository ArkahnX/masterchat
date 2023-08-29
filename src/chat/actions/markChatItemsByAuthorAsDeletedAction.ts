import { exportActionTypes, MarkChatItemsByAuthorAsDeletedAction } from "../../interfaces/actions";
import { YTMarkChatItemsByAuthorAsDeletedAction } from "../../interfaces/yt/chat";

export function parseMarkChatItemsByAuthorAsDeletedAction(
	payload: YTMarkChatItemsByAuthorAsDeletedAction
): MarkChatItemsByAuthorAsDeletedAction {
	return {
		type: exportActionTypes.markChatItemsByAuthorAsDeletedAction,
		channelId: payload.externalChannelId,
		timestamp: Date.now(),
	};
}
