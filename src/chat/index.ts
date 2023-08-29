import { Action, ItemActionTypes, exportActionTypes, ParserError, UnknownAction } from "../interfaces/actions";
import { YTAction } from "../interfaces/yt/chat";
import { debugLog, omitTrackingParams } from "../utils";
import { parseAddBannerToLiveChatCommand } from "./actions/addBannerToLiveChatCommand";
import { parseAddChatItemAction } from "./actions/addChatItemAction";
import { parseAddLiveChatTickerItemAction } from "./actions/addLiveChatTickerItemAction";
import { parseCloseLiveChatActionPanelAction } from "./actions/closeLiveChatActionPanelAction";
import { parseMarkChatItemAsDeletedAction } from "./actions/markChatItemAsDeletedAction";
import { parseMarkChatItemsByAuthorAsDeletedAction } from "./actions/markChatItemsByAuthorAsDeletedAction";
import { parseRemoveBannerForLiveChatCommand } from "./actions/removeBannerForLiveChatCommand";
import { parseRemoveChatItemAction } from "./actions/removeChatItemAction";
import { parseRemoveChatItemByAuthorAction } from "./actions/removeChatItemByAuthorAction";
import { parseReplaceChatItemAction } from "./actions/replaceChatItemAction";
import { parseShowLiveChatActionPanelAction } from "./actions/showLiveChatActionPanelAction";
import { parseShowLiveChatTooltipCommand } from "./actions/showLiveChatTooltipCommand";
import { parseUpdateLiveChatPollAction } from "./actions/updateLiveChatPollAction";
import { BackupTimestamp } from "./utils";

/**
 * Parse raw action object and returns Action
 */
export function parseAction(action: YTAction, backupTimestamp: BackupTimestamp) {
	try {
		const filteredActions = omitTrackingParams(action);
		const type = Object.keys(filteredActions)[0] as keyof typeof filteredActions;

		if (type === ItemActionTypes.addChatItemAction && action.addChatItemAction) {
			return parseAddChatItemAction(action.addChatItemAction, backupTimestamp);
		}
		if (type === ItemActionTypes.markChatItemsByAuthorAsDeletedAction && action.markChatItemsByAuthorAsDeletedAction) {
			return parseMarkChatItemsByAuthorAsDeletedAction(action.markChatItemsByAuthorAsDeletedAction);
		}
		if (type === ItemActionTypes.markChatItemAsDeletedAction && action.markChatItemAsDeletedAction) {
			return parseMarkChatItemAsDeletedAction(action.markChatItemAsDeletedAction);
		}
		if (type === ItemActionTypes.addLiveChatTickerItemAction && action.addLiveChatTickerItemAction) {
			return parseAddLiveChatTickerItemAction(action.addLiveChatTickerItemAction, backupTimestamp);
		}
		if (type === ItemActionTypes.replaceChatItemAction && action.replaceChatItemAction) {
			return parseReplaceChatItemAction(action.replaceChatItemAction, backupTimestamp);
		}
		if (type === ItemActionTypes.addBannerToLiveChatCommand && action.addBannerToLiveChatCommand) {
			return parseAddBannerToLiveChatCommand(action.addBannerToLiveChatCommand, backupTimestamp);
		}
		if (type === ItemActionTypes.removeBannerForLiveChatCommand && action.removeBannerForLiveChatCommand) {
			return parseRemoveBannerForLiveChatCommand(action.removeBannerForLiveChatCommand);
		}
		if (type === ItemActionTypes.showLiveChatTooltipCommand && action.showLiveChatTooltipCommand) {
			return parseShowLiveChatTooltipCommand(action.showLiveChatTooltipCommand);
		}
		if (type === ItemActionTypes.showLiveChatActionPanelAction && action.showLiveChatActionPanelAction) {
			return parseShowLiveChatActionPanelAction(action.showLiveChatActionPanelAction, backupTimestamp);
		}
		if (type === ItemActionTypes.updateLiveChatPollAction && action.updateLiveChatPollAction) {
			return parseUpdateLiveChatPollAction(action.updateLiveChatPollAction, backupTimestamp);
		}
		if (type === ItemActionTypes.closeLiveChatActionPanelAction && action.closeLiveChatActionPanelAction) {
			return parseCloseLiveChatActionPanelAction(action.closeLiveChatActionPanelAction);
		}
		if (type === ItemActionTypes.removeChatItemAction && action.removeChatItemAction) {
			return parseRemoveChatItemAction(action.removeChatItemAction);
		}
		if (type === ItemActionTypes.removeChatItemByAuthorAction && action.removeChatItemByAuthorAction) {
			return parseRemoveChatItemByAuthorAction(action.removeChatItemByAuthorAction);
		}
		if (type === ItemActionTypes.liveChatReportModerationStateCommand && action.liveChatReportModerationStateCommand) {
			return {
				type: exportActionTypes.liveChatReportModerationStateCommand,
				authorName: ItemActionTypes.unknown,
				timestamp: Date.now(),
				...action.liveChatReportModerationStateCommand,
			};
		}


		debugLog("[action required] Unrecognized action type:", JSON.stringify(action));
		return unknown(action);
	} catch (error: any) {
		// debugLog("[action required] Error occurred while parsing action:", error.message || error, JSON.stringify(action));
		console.error(error,JSON.stringify(action));
		process.exit();
		return parserError(action, error);
	}
}

/** Unknown action used for unexpected payloads. You should implement an appropriate action parser as soon as you discover this action in the production.
 */
export function unknown(payload: unknown): UnknownAction {
	return {
		type: exportActionTypes.unknown,
		authorName: ItemActionTypes.unknown,
		timestamp: Date.now(),
		payload,
	};
}

export function parserError(payload: unknown, error: unknown): ParserError {
	return {
		type: exportActionTypes.parserError,
		authorName: "Parse Error",
		timestamp: Date.now(),
		error,
		payload,
	};
}
