import { exportActionTypes } from "../actions";
import { ColorName } from "../misc";
import { AuthorBadges, Emote } from "./common";

export interface AddMembershipMilestoneItemAction {
	type: exportActionTypes.addMembershipMilestoneItemAction;
	id:                       string;
    timestamp:            number;
    timestampText?:           number;
    authorChannelId:  string;
    headerPrimaryText?:        string;
    headerSubtext?:            string;
    color:ColorName.message;
    message?:                 string|null;
    emotes?: Emote[];
    authorName:               string;
    authorPhoto:              string;
    authorBadges?:             AuthorBadges;
    // contextMenuEndpoint:      ContextMenuEndpoint;
    // contextMenuAccessibility: Accessibility;
    // trackingParams:           string;
    // empty?:                   boolean;
}
