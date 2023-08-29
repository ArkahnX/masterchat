import { exportActionTypes } from "../actions";

/**
 * @description Used for actions that need more data
 */
export interface UnknownAction extends Record<string, unknown> {
	type:
		| exportActionTypes.modeChangeAction
		| exportActionTypes.addPlaceholderItemAction
		| exportActionTypes.addPollResultAction
		| exportActionTypes.addViewerEngagementMessageAction
		| exportActionTypes.moderationMessageAction;
	isUnknown: true;
}
