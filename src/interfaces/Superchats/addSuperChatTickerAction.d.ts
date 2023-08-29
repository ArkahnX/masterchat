import { ItemActionTypes } from "../actions";
import { AuthorBadges, Money } from "./common";

export interface AddSuperChatTickerAction {
	type: ItemActionTypes.addSuperChatTickerAction;
	id:                      string;
    startBackgroundColor:    number;
    endBackgroundColor:      number;
    durationSec:             number;
    fullDurationSec:         number;
    showItemEndpoint:        ShowItemEndpoint;
    authorExternalChannelId: string;
    tickerThumbnails:        ImageClass[];
    trackingParams:          string;

	timestamp: number;
	authorName: string;
	authorPhoto: string;
	authorChannelId: string;
	authorBadges?: AuthorBadges;
	message: string|null;
	emotes?: Emote[];
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
	timestampText?: string;
	// trackingParams:           string;
	// textInputBackgroundColor: number;
	creatorHeart?: boolean;
	overlayImage?: string;
	overlayText?: string;
}
