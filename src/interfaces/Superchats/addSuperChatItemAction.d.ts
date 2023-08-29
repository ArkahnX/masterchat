import { exportActionTypes } from "../actions";
import { ColorName } from "../misc";
import { AuthorBadges, Money } from "./common";

export interface AddSuperChatItemAction {
	type: exportActionTypes.addSuperChatItemAction;
	id: string;
	timestamp: number;
	authorName: string;
	authorPhoto: string;
	authorChannelId: string;
	authorBadges?: AuthorBadges;
	message: string|null;
	emotes?: Emote[];
	color:ColorName;
	money:Money;
	// significance: number;
	// color: string;
	// headerBackgroundColor: string;
	// headerTextColor:          number;
	backgroundColor: string;
	// bodyTextColor:            number;
	// authorNameTextColor:      number;
	// contextMenuEndpoint:      ContextMenuEndpoint;
	// timestampColor:           number;
	// contextMenuAccessibility: Accessibility;
	timestampText?: number;
	// trackingParams:           string;
	// textInputBackgroundColor: number;
	creatorHeart?: boolean;
	overlayImage?: string;
	overlayText?: string;
	// lowerBumper?:             LowerBumper;
	// trackingParams: string;
	// image:          BumperUserEduContentViewModelImage;
	// buyButton?:               BuyButton;
}
