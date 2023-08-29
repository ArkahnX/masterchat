import { exportActionTypes } from "../actions";
import { ColorName } from "../misc";
import { AuthorBadges } from "./common";

export interface MembershipGiftPurchaseAction {
	type: exportActionTypes.membershipGiftPurchaseAction;
	id:                      string;
    timestamp:           number;
    timestampText?:           number;
    authorChannelId: string;
    // header:                  Header;
	authorName:               string;
    authorPhoto:              string;
    primaryText:              string;
    color:ColorName;
    amount:              number;
	channelName: string;
    authorBadges?:             AuthorBadges;
    // contextMenuEndpoint:      ContextMenuEndpoint;
    // contextMenuAccessibility: Accessibility;
    image:                    string;
}
