export const chatItemProperties = [
	"message",
	"authorName",
	"authorPhoto",
	"contextMenuEndpoint",
	"id",
	"timestampUsec",
	"authorExternalChannelId",
	"contextMenuAccessibility",
	"timestampText",
	"trackingParams",
	"authorBadges",
];

export const superChatItemProperties = [
	"id",
	"authorUsername",
	"timestampUsec",
	"authorName",
	"authorPhoto",
	"purchaseAmountText",
	"message",
	"headerBackgroundColor",
	"headerTextColor",
	"bodyBackgroundColor",
	"bodyTextColor",
	"authorExternalChannelId",
	"authorNameTextColor",
	"contextMenuEndpoint",
	"timestampColor",
	"contextMenuAccessibility",
	"timestampText",
	"trackingParams",
	"authorBadges",
	"textInputBackgroundColor",
	"creatorHeartButton",
	"headerOverlayImage",
	"lowerBumper",
	"buyButton",
	"pdgPurchasedNoveltyLoggingDirectives",
];

export const superStickerItemProperties = [
	"id",
	"contextMenuEndpoint",
	"contextMenuAccessibility",
	"timestampUsec",
	"authorPhoto",
	"authorName",
	"authorExternalChannelId",
	"timestampText",
	"sticker",
	"authorBadges",
	"moneyChipBackgroundColor",
	"moneyChipTextColor",
	"purchaseAmountText",
	"stickerDisplayWidth",
	"stickerDisplayHeight",
	"backgroundColor",
	"authorNameTextColor",
	"trackingParams",
	"buyButton",
	"headerOverlayImage",
	"lowerBumper",
];

export const membershipMilestoneItemProperties = [
	"id",
	"timestampUsec",
	"timestampText",
	"authorExternalChannelId",
	"headerPrimaryText",
	"headerSubtext",
	"duration",
	"message",
	"authorName",
	"authorPhoto",
	"authorBadges",
	"contextMenuEndpoint",
	"contextMenuAccessibility",
	"trackingParams",
	"empty",
	"footerButton",
];

export const membershipItemProperties = [
	"id",
	"timestampUsec",
	"timestampText",
	"authorExternalChannelId",
	"headerSubtext",
	"authorName",
	"authorPhoto",
	"authorBadges",
	"contextMenuEndpoint",
	"contextMenuAccessibility",
	"trackingParams",
	"footerButton",
];

export const membershipGiftPurchaseProperties = ["id", "timestampUsec", "authorExternalChannelId", "header", "optInPrompt"];

export const membershipGiftPurchaseHeaderProperties = [
	"authorName",
	"authorPhoto",
	"primaryText",
	"authorBadges",
	"contextMenuEndpoint",
	"contextMenuAccessibility",
	"image",
	"optInPrompt",
];

export const membershipGiftPurchaseTickerProperties = ["authorExternalChannelId", "header", "optInPrompt"];

export const membershipGiftPurchaseTickerHeaderProperties = [
	"authorName",
	"authorPhoto",
	"primaryText",
	"authorBadges",
	"contextMenuEndpoint",
	"contextMenuAccessibility",
	"image",
	"optInPrompt",
];

export const updatePollProperties = ["choices", "liveChatPollId", "header", "trackingParams"];

export const updatePollHeaderProperties = ["pollQuestion", "thumbnail", "metadataText", "liveChatPollType", "contextMenuButton"];

export const superChatTickerProperties = [
	"id",
	"amount",
	"amountTextColor",
	"startBackgroundColor",
	"endBackgroundColor",
	"authorPhoto",
	"authorUsername",
	"durationSec",
	"showItemEndpoint",
	"authorExternalChannelId",
	"fullDurationSec",
	"trackingParams",
];

export const superStickerTickerProperties = [
	"id",
	"authorPhoto",
	"startBackgroundColor",
	"endBackgroundColor",
	"durationSec",
	"fullDurationSec",
	"showItemEndpoint",
	"authorExternalChannelId",
	"tickerThumbnails",
	"trackingParams",
];

export const membershipTickerProperties = [
	"id",
	"detailText",
	"detailTextColor",
	"startBackgroundColor",
	"endBackgroundColor",
	"sponsorPhoto",
	"durationSec",
	"showItemEndpoint",
	"authorExternalChannelId",
	"fullDurationSec",
	"trackingParams",
	"detailIcon",
	"footerButton",
];
