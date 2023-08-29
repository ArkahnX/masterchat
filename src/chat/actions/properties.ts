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
];

export const membershipGiftPurchaseProperties = ["id", "timestampUsec", "authorExternalChannelId", "header"];

export const membershipGiftPurchaseHeaderProperties = [
	"authorName",
	"authorPhoto",
	"primaryText",
	"authorBadges",
	"contextMenuEndpoint",
	"contextMenuAccessibility",
	"image",
];

export const membershipGiftPurchaseTickerProperties = ["authorExternalChannelId", "header"];

export const membershipGiftPurchaseTickerHeaderProperties = [
	"authorName",
	"authorPhoto",
	"primaryText",
	"authorBadges",
	"contextMenuEndpoint",
	"contextMenuAccessibility",
	"image",
];

export const updatePollProperties = ["choices", "liveChatPollId", "header","trackingParams"];

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
];
