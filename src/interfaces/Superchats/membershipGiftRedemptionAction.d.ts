import { exportActionTypes } from "../actions";
import { ColorName } from "../misc";
import { AuthorBadges } from "./common";

export interface MembershipGiftRedemptionAction {
	type: exportActionTypes.membershipGiftRedemptionAction;
	id: string;
	timestamp: number;
	color:ColorName;
	timestampText?: number;
	authorChannelId: string;
	authorName: string;
	authorPhoto: string;
	message: string;
	senderName: string;
	authorBadges?: AuthorBadges;
	// contextMenuEndpoint:      ContextMenuEndpoint;
	// contextMenuAccessibility: Accessibility;
	// trackingParams?:          string;
}
