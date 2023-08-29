import { exportActionTypes } from "../actions";
import { ColorName } from "../misc";
import { AuthorBadges } from "./common";

export interface MembershipGiftPurchaseTickerAction {
	type: exportActionTypes.membershipGiftPurchaseTickerAction;
	id: string;
	authorChannelId: string;
	// header:                  Header;
	timestamp: number;
	timestampText?: number;
	authorName: string;
	authorPhoto: string;
	primaryText: string;
	color:ColorName;
	amount: number;
	channelName: string;
	authorBadges?: AuthorBadges;
	// contextMenuEndpoint:      ContextMenuEndpoint;
	// contextMenuAccessibility: Accessibility;
	image: string;
}
