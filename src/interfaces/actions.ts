import {
	AddBannerAction,
	AddChatItemAction,
	AddIncomingRaidBannerAction,
	AddMembershipItemAction,
	AddMembershipMilestoneItemAction,
	AddOutgoingRaidBannerAction,
	AddSuperChatItemAction,
	AddSuperStickerItemAction,
	MembershipGiftPurchaseAction,
	MembershipGiftPurchaseTickerAction,
	MembershipGiftRedemptionAction,
	UpdatePollAction,
} from "./Superchats/actions";
import { AddPlaceholderItemAction } from "./Superchats/addPlaceholderItemAction";
import { AddViewerEngagementMessageAction } from "./Superchats/addViewerEngagementMessageAction";
import { ColorName } from "./misc";
import { YTLiveChatPollChoice, YTLiveChatPollType, YTRun, YTSimpleTextContainer, YTText } from "./yt/chat";

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
	| MembershipGiftPurchaseTickerAction
	| AddBannerAction
	| RemoveBannerAction
	| AddIncomingRaidBannerAction
	| AddOutgoingRaidBannerAction
	| AddProductBannerAction
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
	| ParserError;

export type UsefulActions =
	| AddChatItemAction
	| AddSuperChatItemAction
	| AddSuperStickerItemAction
	| AddMembershipItemAction
	| AddMembershipMilestoneItemAction
	| MembershipGiftPurchaseTickerAction
	| AddIncomingRaidBannerAction
	| AddOutgoingRaidBannerAction
	| UpdatePollAction
	| AddPollResultAction
	| MembershipGiftPurchaseAction
	| MembershipGiftRedemptionAction;

export type DebugActions =
	| ModerationMessageAction
	| MarkChatItemAsDeletedAction
	| MarkChatItemsByAuthorAsDeletedAction
	| RemoveChatItemAction
	| RemoveChatItemByAuthorAction;

export enum ItemActionTypes {
	addChatItemAction = "addChatItemAction",
	addSuperChatItemAction = "addSuperChatItemAction",
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
	showLiveChatTooltipCommand,
	showLiveChatActionPanelAction,
	updateLiveChatPollAction,
	closeLiveChatActionPanelAction,
	liveChatReportModerationStateCommand,
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
	amountTextColor: string;
	startBackgroundColor: string;
	endBackgroundColor: string;
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
	startBackgroundColor: string;
	endBackgroundColor: string;
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
	detailTextColor: string;
	startBackgroundColor: string;
	endBackgroundColor: string;
}

export interface RemoveBannerAction {
	type: exportActionTypes.removeBannerAction;
	targetActionId: string;
	timestamp: number;
}

export interface AddProductBannerAction {
	type: exportActionTypes.addProductBannerAction;
	timestamp: number;
	id: string;
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
	url?: string;
	dialogMessage: YTSimpleTextContainer[];
	isVerified: boolean;
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

export interface AddPollResultAction {
	type: exportActionTypes.addPollResultAction;
	authorName: string;
	timestamp: number;
	color: ColorName.poll;
	id: string;
	question?: string;
	total: string;
	choices: PollChoice[];
}

export interface PollChoice {
	text: string;
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

export type MembershipGiftPurchaseTickerContent = Omit<MembershipGiftPurchaseAction, "timestamp" | "timestampUsec" | "type">;

export interface ModerationMessageAction {
	type: exportActionTypes.moderationMessageAction;
	id: string;
	timestamp: number;
	timestampUsec: string;
	message: YTRun[];
}

export interface RemoveChatItemAction {
	type: exportActionTypes.removeChatItemAction;
	targetId: string;
	timestamp: number;
}

export interface RemoveChatItemByAuthorAction {
	type: exportActionTypes.removeChatItemByAuthorAction;
	channelId: string;
	timestamp: number;
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
