import { exportActionTypes } from "../actions";
import { ColorName } from "../misc";
import { AuthorBadges, Money } from "./common";

export interface AddSuperStickerItemAction {
	type: exportActionTypes.addSuperStickerItemAction;
	id:                       string;
    // contextMenuEndpoint:      ContextMenuEndpoint;
    // contextMenuAccessibility: Accessibility;
    timestamp:            number;
    authorPhoto:              string;
    authorName:               string;
    authorChannelId:  string;
    authorBadges?:            AuthorBadges;
    timestampText?:           number;
    color:ColorName;
    sticker:                  string;
	stickerLabel?: string;
    // moneyChipBackgroundColor: string;
    // moneyChipTextColor:       number;
    money:Money;
	// significance: number;
	// color: string;
    // stickerDisplayWidth:      number;
    // stickerDisplayHeight:     number;
    backgroundColor:          string;
    // authorNameTextColor:      number;
    // trackingParams:           string;
    // buyButton?:               BuyButton;
    // headerOverlayImage?:      ThumbnailContainer;
    // lowerBumper?:             LowerBumper;
	overlayImage?: string;
	overlayText?: string;
}
