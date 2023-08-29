import { exportActionTypes } from "../actions";
import { ColorName } from "../misc";
import { AuthorBadges, Emote } from "./common";

export interface AddChatItemAction {
	type: exportActionTypes.addChatItemAction;
	message: string|null;
	emotes?: Emote[];
	authorName: string;
	authorPhoto: string;
	authorChannelId: string;
	color:ColorName.chat,
	// contextMenuEndpoint:      ContextMenuEndpoint;
	id: string;
	timestamp: number;
	// contextMenuAccessibility: Accessibility;
	timestampText?: number;
	// trackingParams?:          string;
	authorBadges?: AuthorBadges;
}
