import { exportActionTypes } from "../actions";
import { ColorName } from "../misc";
import { AuthorBadges } from "./common";

export interface AddMembershipItemAction {
	type: exportActionTypes.addMembershipItemAction;
	id:                       string;
    timestamp:            number;
    timestampText?:           number;
    authorChannelId:  string;
    color: ColorName;
    headerSubtext?:            string;
    method: string;
    tier?: string;
    authorName?:               string;
    authorPhoto:              string;
    authorBadges?:             AuthorBadges;
    // contextMenuEndpoint:      ContextMenuEndpoint;
    // contextMenuAccessibility: Accessibility;
    // trackingParams:           string;
}
