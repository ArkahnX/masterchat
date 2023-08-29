import { exportActionTypes, ClosePanelAction } from "../../interfaces/actions";
import { YTCloseLiveChatActionPanelAction } from "../../interfaces/yt/chat";

export function parseCloseLiveChatActionPanelAction(payload: YTCloseLiveChatActionPanelAction) {
	const parsed: ClosePanelAction = {
		type: exportActionTypes.closePanelAction,
		targetPanelId: payload.targetPanelId,
		skipOnDismissCommand: payload.skipOnDismissCommand,
	};
	return parsed;
}
