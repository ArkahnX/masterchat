import { exportActionTypes, RemoveBannerAction } from "../../interfaces/actions";
import { YTRemoveBannerForLiveChatCommand } from "../../interfaces/yt/chat";

export function parseRemoveBannerForLiveChatCommand(payload: YTRemoveBannerForLiveChatCommand) {
	// remove pinned item
	const parsed: RemoveBannerAction = {
		type: exportActionTypes.removeBannerAction,
		targetActionId: payload.targetActionId,
		timestamp: Date.now()
	};
	return parsed;
}
