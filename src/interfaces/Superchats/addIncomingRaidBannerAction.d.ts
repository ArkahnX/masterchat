import { exportActionTypes } from "../actions";
import { ColorName } from "../misc";

export interface AddIncomingRaidBannerAction {
	type: exportActionTypes.addIncomingRaidBannerAction;
	timestamp: number;
	authorName: string;
	authorPhoto: string;
	color:ColorName.raid;
	// inlineActionButton: InlineActionButton;
	// style:           string;
	// size:            string;
	// isDisabled:      boolean;
	// text:            RunContainer;
	// trackingParams?: string;
	// command:         OutgoingRaidCommand;
	// clickTrackingParams?: string;
	// commandMetadata:      NavigationEndpointCommandMetadata;
	// watchEndpoint:        WatchEndpoint;
	// videoId: string;
	// contextMenuButton:  ContextMenuButton;
	// icon:              Icon;
	// accessibility:     AccessibilityLabel;
	// trackingParams?:   string;
	// accessibilityData: Accessibility;
	// command:           PurpleCommand;
	// clickTrackingParams?:            string;
	// commandMetadata:                 IgnoreNavigationCommandMetadata;
	// liveChatItemContextMenuEndpoint: LiveChatItemContextMenuEndpoint;
	id: string;
	// viewerIsCreator:  boolean;
	// targetId:         string;
	// isStackable:      boolean;
	// backgroundType:   string;
	// bannerProperties: BannerProperties;
	// bannerType: string;
}
