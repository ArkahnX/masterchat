import { Badges, SuperChat, Color } from "./misc";
import {
	YTLiveChatPaidMessageRenderer,
	YTLiveChatPaidStickerRenderer,
	YTText,
	YTSimpleTextContainer,
	YTLiveChatPollType,
	YTLiveChatPollChoice,
	YTRun,
	YTTextRun,
	YTRunContainer,
} from "./yt/chat";
import { CreatorGoalAction } from "./Superchats/creatorGoalAction";
import { ColorName } from "./misc";
/**
 * Actions
 */

export type Action =
	| AddChatItemAction
	| AddSuperChatItemAction
	| AddSuperStickerItemAction
	| AddMembershipItemAction
	| AddMembershipMilestoneItemAction
	| AddPlaceholderItemAction
	| ReplaceChatItemAction
	| MarkChatItemAsDeletedAction
	| MarkChatItemsByAuthorAsDeletedAction
	| AddSuperChatTickerAction
	| AddSuperStickerTickerAction
	| AddMembershipTickerAction
	| AddBannerAction
	| RemoveBannerAction
	| AddRedirectBannerAction
	| AddIncomingRaidBannerAction
	| AddOutgoingRaidBannerAction
	| AddProductBannerAction
	| AddCallForQuestionsBannerAction
	| AddChatSummaryBannerAction
	| AddViewerEngagementMessageAction
	| ShowPanelAction
	| ShowPollPanelAction
	| ClosePanelAction
	| UpdatePollAction
	| AddPollResultAction
	| ShowTooltipAction
	| ModeChangeAction
	| MembershipGiftPurchaseAction
	| MembershipGiftRedemptionAction
	| ModerationMessageAction
	| RemoveChatItemAction
	| RemoveChatItemByAuthorAction
	| UnknownAction
	| ParserError
	| CreatorGoalAction;

export type UsefulActions =
	| AddChatItemAction
	| AddSuperChatItemAction
	| AddSuperStickerItemAction
	| AddMembershipItemAction
	| AddMembershipMilestoneItemAction
	| AddMembershipTickerAction
	| AddIncomingRaidBannerAction
	| AddOutgoingRaidBannerAction
	| UpdatePollAction
	| AddPollResultAction
	| MembershipGiftPurchaseAction
	| MembershipGiftRedemptionAction;

export type PollActions = UpdatePollAction | AddPollResultAction;

export type DebugActions =
	| ModerationMessageAction
	| MarkChatItemAsDeletedAction
	| MarkChatItemsByAuthorAsDeletedAction
	| RemoveChatItemAction
	| RemoveChatItemByAuthorAction;

export enum ItemActionTypes {
	addChatItemAction = "addChatItemAction",
	addSuperChatItemAction = "addSuperChatItemAction",
	addRedirectBannerAction = "addRedirectBannerAction",
	addCallForQuestionsBannerAction = "addCallForQuestionsBannerAction",
	addChatSummaryBannerAction = "addChatSummaryBannerAction",
	addSuperStickerItemAction = "addSuperStickerItemAction",
	addMembershipItemAction = "addMembershipItemAction",
	addMembershipMilestoneItemAction = "addMembershipMilestoneItemAction",
	addPlaceholderItemAction = "addPlaceholderItemAction",
	replaceChatItemAction = "replaceChatItemAction",
	markChatItemAsDeletedAction = "markChatItemAsDeletedAction",
	markChatItemsByAuthorAsDeletedAction = "markChatItemsByAuthorAsDeletedAction",
	membershipGiftPurchaseTickerAction = "membershipGiftPurchaseTickerAction",
	addBannerAction = "addBannerAction",
	removeBannerAction = "removeBannerAction",
	addIncomingRaidBannerAction = "addIncomingRaidBannerAction",
	addOutgoingRaidBannerAction = "addOutgoingRaidBannerAction",
	addProductBannerAction = "addProductBannerAction",
	addViewerEngagementMessageAction = "addViewerEngagementMessageAction",
	showPanelAction = "showPanelAction",
	showPollPanelAction = "showPollPanelAction",
	closePanelAction = "closePanelAction",
	updatePollAction = "updatePollAction",
	addPollResultAction = "addPollResultAction",
	showTooltipAction = "showTooltipAction",
	modeChangeAction = "modeChangeAction",
	membershipGiftPurchaseAction = "membershipGiftPurchaseAction",
	membershipGiftRedemptionAction = "membershipGiftRedemptionAction",
	moderationMessageAction = "moderationMessageAction",
	removeChatItemAction = "removeChatItemAction",
	removeChatItemByAuthorAction = "removeChatItemByAuthorAction",
	unknown = "unknown",
	parserError = "parserError",
	addSuperChatTickerAction = "addSuperChatTickerAction",
	addSuperStickerTickerAction = "addSuperStickerTickerAction",
	addMembershipTickerAction = "addMembershipTickerAction",
	addLiveChatTickerItemAction = "addLiveChatTickerItemAction",
	addBannerToLiveChatCommand = "addBannerToLiveChatCommand",
	removeBannerForLiveChatCommand = "removeBannerForLiveChatCommand",
	showLiveChatTooltipCommand = "showLiveChatTooltipCommand",
	showLiveChatActionPanelAction = "showLiveChatActionPanelAction",
	updateLiveChatPollAction = "updateLiveChatPollAction",
	closeLiveChatActionPanelAction = "closeLiveChatActionPanelAction",
	liveChatReportModerationStateCommand = "liveChatReportModerationStateCommand",
}

export enum exportActionTypes {
	addChatItemAction,
	addSuperChatItemAction,
	addSuperStickerItemAction,
	addMembershipItemAction,
	addMembershipMilestoneItemAction,
	addPlaceholderItemAction,
	replaceChatItemAction,
	markChatItemAsDeletedAction,
	markChatItemsByAuthorAsDeletedAction,
	membershipGiftPurchaseTickerAction,
	addBannerAction,
	removeBannerAction,
	addIncomingRaidBannerAction,
	addOutgoingRaidBannerAction,
	addProductBannerAction,
	addViewerEngagementMessageAction,
	showPanelAction,
	showPollPanelAction,
	closePanelAction,
	updatePollAction,
	addPollResultAction,
	showTooltipAction,
	modeChangeAction,
	membershipGiftPurchaseAction,
	membershipGiftRedemptionAction,
	moderationMessageAction,
	removeChatItemAction,
	removeChatItemByAuthorAction,
	unknown,
	parserError,
	addSuperChatTickerAction,
	addSuperStickerTickerAction,
	addMembershipTickerAction,
	addLiveChatTickerItemAction,
	addBannerToLiveChatCommand,
	removeBannerForLiveChatCommand,
	addRedirectBannerAction,
	addCallForQuestionsBannerAction,
	addChatSummaryBannerAction,
	showLiveChatTooltipCommand,
	/** @deprecated */
	showLiveChatActionPanelAction,
	/** @deprecated */
	updateLiveChatPollAction,
	/** @deprecated */
	closeLiveChatActionPanelAction,
	liveChatReportModerationStateCommand,
	addPollBannerAction,
	creatorGoalAction,
}

export interface AddChatItemAction extends Badges {
	type: exportActionTypes.addChatItemAction;
	id: string;
	timestamp: Date;
	timestampUsec: string;
	/**
	 * message can somehow be a blank (in quite rare occasion though).
	 * We've observed `message: {}` three or four times.
	 * In most cases just `action.message!` would works.
	 */
	message?: YTRun[];
	/** rare but can be undefined */
	authorName?: string;
	authorChannelId: string;
	authorPhoto: string;
	contextMenuEndpointParams: string;

	/** @deprecated use `message` */
	rawMessage?: YTRun[];
}

export interface AddSuperChatItemAction extends SuperChat<YTLiveChatPaidMessageRenderer>, Badges {
	type: exportActionTypes.addSuperChatItemAction;
	id: string;
	timestamp: Date;
	timestampUsec: string;
	/** rare but can be undefined */
	authorName?: string;
	authorChannelId: string;
	authorPhoto: string;
	message: YTRun[] | null;

	/** @deprecated use `message` */
	rawMessage: YTRun[] | undefined;

	/** @deprecated flattened */
	superchat: SuperChat<YTLiveChatPaidMessageRenderer>;
}

export interface AddSuperStickerItemAction extends SuperChat<YTLiveChatPaidStickerRenderer>, Badges {
	type: exportActionTypes.addSuperStickerItemAction;
	id: string;
	timestamp: Date;
	timestampUsec: string;
	authorName: string;
	authorChannelId: string;
	authorPhoto: string;
	stickerUrl: string;
	stickerText: string;
	stickerDisplayWidth: number;
	stickerDisplayHeight: number;
}

export interface AddMembershipItemAction extends Badges {
	type: exportActionTypes.addMembershipItemAction;
	id: string;
	timestamp: Date;
	timestampUsec: string;

	// `level` is only shown when there's multiple levels available
	level?: string;

	/** rare but can be undefined */
	authorName?: string;
	authorChannelId: string;
	authorPhoto: string;
}

export interface AddMembershipMilestoneItemAction extends Badges {
	type: exportActionTypes.addMembershipMilestoneItemAction;
	id: string;
	timestamp: Date;
	timestampUsec: string;

	/** `level` is only shown when there's multiple levels available */
	level?: string;

	authorName?: string;
	authorChannelId: string;
	authorPhoto: string;

	/**
	 * Membership duration in seconds
	 */
	duration: number;

	/**
	 * Human readable membership duration
	 */
	durationText: string;

	/**
	 * Milestone message
	 */
	message: YTRun[] | null;
}

export interface AddPlaceholderItemAction {
	type: exportActionTypes.addPlaceholderItemAction;
	id: string;
	timestamp: Date;
	timestampUsec: string;
}

export interface ReplaceChatItemAction {
	type: exportActionTypes.replaceChatItemAction;
	targetItemId: string;
	replacementItem: AddChatItemAction | AddPlaceholderItemAction | AddSuperChatItemAction;
	timestamp: number;
}

export interface MarkChatItemAsDeletedAction {
	type: exportActionTypes.markChatItemAsDeletedAction;
	retracted: boolean;
	targetId: string;
	executor?: string;
	timestamp: number;
}

export interface MarkChatItemsByAuthorAsDeletedAction {
	type: exportActionTypes.markChatItemsByAuthorAsDeletedAction;
	channelId: string;
	timestamp: number;
}

export interface AddSuperChatTickerAction {
	type: exportActionTypes.addSuperChatTickerAction;
	id: string;
	authorChannelId: string;
	authorPhoto: string;
	amountText: string;
	durationSec: number;
	fullDurationSec: number;
	contents: AddSuperChatItemAction;
	amountTextColor: Color;
	startBackgroundColor: Color;
	endBackgroundColor: Color;
}

export interface AddSuperStickerTickerAction {
	type: exportActionTypes.addSuperStickerTickerAction;
	id: string;
	authorName: string;
	authorChannelId: string;
	authorPhoto: string;
	durationSec: number;
	fullDurationSec: number;
	tickerPackName: string;
	tickerPackThumbnail: string;
	contents: AddSuperStickerItemAction;
	startBackgroundColor: Color;
	endBackgroundColor: Color;
}

export interface AddMembershipTickerAction {
	type: exportActionTypes.addMembershipTickerAction;
	id: string;
	authorChannelId: string;
	authorPhoto: string;
	durationSec: number;
	fullDurationSec: number;
	detailText: YTText;
	// TODO: check if AddMembershipMilestoneItemAction is actually appeared
	// TODO: wrap normal actions with TickerContent type
	contents: AddMembershipItemAction | AddMembershipMilestoneItemAction | MembershipGiftPurchaseTickerContent;
	detailTextColor: Color;
	startBackgroundColor: Color;
	endBackgroundColor: Color;
}

export interface AddBannerAction extends Badges {
	type: exportActionTypes.addBannerAction;
	actionId: string;
	targetId: string;
	id: string;
	title: YTRun[];
	message: YTRun[];
	timestamp: Date;
	timestampUsec: string;
	authorName: string;
	authorChannelId: string;
	authorPhoto: string;
	viewerIsCreator: boolean;
	contextMenuEndpointParams?: string;
}

export interface RemoveBannerAction {
	type: exportActionTypes.removeBannerAction;
	targetActionId: string;
	timestamp: number;
}

export interface AddRedirectBannerAction {
	type: exportActionTypes.addRedirectBannerAction;
	actionId: string;
	targetId: string;
	authorName: string;
	authorPhoto: string;
}

export interface AddIncomingRaidBannerAction {
	type: exportActionTypes.addIncomingRaidBannerAction;
	actionId: string;
	targetId: string;
	bannerType: string;
	sourceName: string;
	sourcePhoto: string;
	bannerMessage: YTRunContainer<YTTextRun>;
}

export interface AddOutgoingRaidBannerAction {
	type: exportActionTypes.addOutgoingRaidBannerAction;
	actionId: string;
	targetId: string;
	bannerType: string;
	targetName: string;
	targetPhoto: string;
	targetVideoId: string;
	bannerMessage: YTRunContainer<YTTextRun>;
}

export interface AddProductBannerAction {
	type: exportActionTypes.addProductBannerAction;
	timestamp: number;
	actionId: string;
	targetId: string;
	viewerIsCreator: boolean;
	isStackable?: boolean;
	title: string;
	description: string;
	thumbnail: string;
	price: string;
	vendorName: string;
	creatorMessage: string;
	creatorName: string;
	authorPhoto: string;
	url: string;
	dialogMessage: YTSimpleTextContainer[];
	isVerified: boolean;
}

export interface AddCallForQuestionsBannerAction {
	type: exportActionTypes.addCallForQuestionsBannerAction;
	actionId: string;
	targetId: string;
	isStackable?: boolean;
	bannerType?: string;
	creatorAvatar: string;
	creatorAuthorName: string;
	questionMessage: YTRun[];
}

export interface AddChatSummaryBannerAction {
	type: exportActionTypes.addChatSummaryBannerAction;
	id: string;
	actionId: string;
	targetId: string;
	isStackable?: boolean;
	bannerType?: string;
	timestamp: Date;
	timestampUsec: string;
	chatSummary: YTRun[];
}

export interface ShowTooltipAction {
	type: exportActionTypes.showTooltipAction;
	targetId: string;
	detailsText: YTText;
	suggestedPosition: string;
	dismissStrategy: string;
	promoConfig: any;
	dwellTimeMs?: number;
}

export interface AddViewerEngagementMessageAction {
	type: exportActionTypes.addViewerEngagementMessageAction;
	id: string;
	message: YTText;
	actionUrl?: string;
	timestamp: Date;
	timestampUsec: string;
}

// generic action for unknown panel type
export interface ShowPanelAction {
	type: exportActionTypes.showPanelAction;
	panelToShow: any;
}

export interface ClosePanelAction {
	type: exportActionTypes.closePanelAction;
	targetPanelId: string;
	skipOnDismissCommand: boolean;
}

export interface ShowPollPanelAction {
	type: exportActionTypes.showPollPanelAction;
	targetId: string;
	id: string;
	color: ColorName.poll;
	pollType: YTLiveChatPollType;
	question?: string;
	choices: YTLiveChatPollChoice[];
	authorName: string;
	authorPhoto: string;
}

export interface UpdatePollAction {
	type: exportActionTypes.updatePollAction;
	id: string;
	pollType: YTLiveChatPollType;
	authorName: string;
	authorPhoto: string;
	question?: string;
	choices: YTLiveChatPollChoice[];
	elapsedText: string;
	voteCount: number;
}

export interface AddPollResultAction {
	type: exportActionTypes.addPollResultAction;
	authorName: string;
	timestamp: number;
	color: ColorName.poll;
	id: string;
	question?: YTRun[];
	/** @deprecated use `voteCount` */
	total: string;
	voteCount: number;
	choices: PollChoice[];
}

export interface PollChoice {
	text: YTRun[];
	voteRatio: number;
	votePercentage: string;
}

export enum LiveChatMode {
	MembersOnly = "MEMBERS_ONLY",
	Slow = "SLOW",
	SubscribersOnly = "SUBSCRIBERS_ONLY",
	Unknown = "UNKNOWN",
}

export interface ModeChangeAction {
	type: exportActionTypes.modeChangeAction;
	mode: LiveChatMode;
	enabled: boolean;
	description: string;
}

export interface MembershipGiftPurchaseAction extends Badges {
	type: exportActionTypes.membershipGiftPurchaseAction;
	id: string;
	timestamp: Date;
	timestampUsec: string;
	channelName: string; // MEMO: is it limited for ¥500 membership?
	amount: number; // 5, 10, 20
	authorName: string;
	authorChannelId: string;
	authorPhoto: string;
	image: string; // always https://www.gstatic.com/youtube/img/sponsorships/sponsorships_gift_purchase_announcement_artwork.png
}

export type MembershipGiftPurchaseTickerContent = Omit<MembershipGiftPurchaseAction, "timestamp" | "timestampUsec">;

export interface MembershipGiftRedemptionAction extends Badges {
	type: exportActionTypes.membershipGiftRedemptionAction;
	id: string;
	timestamp: Date;
	timestampUsec: string;
	senderName: string; // author was gifted a membership by sender
	authorName: string;
	authorChannelId: string;
	authorPhoto: string;
}

export interface ModerationMessageAction {
	type: exportActionTypes.moderationMessageAction;
	id: string;
	timestamp: Date;
	timestampUsec: string;
	message: YTRun[];
}

export interface RemoveChatItemAction {
	type: exportActionTypes.removeChatItemAction;
	targetId: string;
	timestamp: Date;
}

export interface RemoveChatItemByAuthorAction {
	type: exportActionTypes.removeChatItemByAuthorAction;
	channelId: string;
	timestamp: Date;
}

export interface UnknownAction {
	type: exportActionTypes.unknown;
	authorName: string;
	timestamp: number;
	payload: unknown;
}

export interface ParserError {
	type: exportActionTypes.parserError;
	authorName: string;
	timestamp: number;
	error: unknown;
	payload: unknown;
}
