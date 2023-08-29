import { exportActionTypes } from "../actions";
import { AuthorBadges } from "./common";

export interface AddViewerEngagementMessageAction {
	type: exportActionTypes.addViewerEngagementMessageAction;
	id:             string;
    timestamp:  number;
    // icon:           string;
    message:        Message;
    // actionButton:   ActionButton;
    // trackingParams: string;
}
