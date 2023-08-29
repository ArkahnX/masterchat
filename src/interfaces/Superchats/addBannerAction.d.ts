import { exportActionTypes } from "../actions";
import { AuthorBadges, Emote } from "./common";

export interface AddBannerAction {
	type: exportActionTypes.addBannerAction;
	// header:           Header;
	title?: string;
	// contents:         LiveChatTextMessageRendererContents | LiveChatBannerRedirectRendererContents;
	message: string;
	emotes?: Emote[];
	authorName: string;
	authorPhoto: string;
	id: string;
	timestamp: number;
	authorBadges?: AuthorBadges;
	authorChannelId: string;
	timestampText?: number;
	// trackingParams?:         string;
	// actionId:         string;
	// viewerIsCreator:  boolean;
	// targetId:         string;
	// isStackable:      boolean;
	// backgroundType:   string;
	// bannerProperties: BannerProperties;
	// bannerType: string;
}
