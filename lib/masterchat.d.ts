/// <reference types="node" />
import { AxiosInstance } from "axios";
import { EventEmitter } from "events";
import { AsyncIterator } from "iterator-helpers-polyfill";

declare type EndReason = "privated" | "deleted" | "disabled" | "aborted" | null;
declare type ErrorCode =
  | "unavailable"
  | "disabled"
  | "private"
  | "membersOnly"
  | "unarchived"
  | "denied"
  | "invalid";
declare class MasterchatError extends Error {
  code: ErrorCode;
  constructor(code: ErrorCode, msg: string);
}
declare class UnavailableError extends MasterchatError {
  constructor(msg: string);
}
declare class DisabledChatError extends MasterchatError {
  constructor(msg: string);
}
declare class NoPermissionError extends MasterchatError {
  constructor(msg: string);
}
declare class MembersOnlyError extends MasterchatError {
  constructor(msg: string);
}
declare class NoStreamRecordingError extends MasterchatError {
  constructor(msg: string);
}
declare class AccessDeniedError extends MasterchatError {
  constructor(msg: string);
}
declare class InvalidArgumentError extends MasterchatError {
  constructor(msg: string);
}
declare class AbortError extends Error {}

declare const SUPERCHAT_SIGNIFICANCE_MAP: {
  readonly blue: 1;
  readonly lightblue: 2;
  readonly green: 3;
  readonly yellow: 4;
  readonly orange: 5;
  readonly magenta: 6;
  readonly red: 7;
};
/**
 * Map from headerBackgroundColor to color name
 */
declare const SUPERCHAT_COLOR_MAP: {
  readonly "4279592384": "blue";
  readonly "4278237396": "lightblue";
  readonly "4278239141": "green";
  readonly "4294947584": "yellow";
  readonly "4293284096": "orange";
  readonly "4290910299": "magenta";
  readonly "4291821568": "red";
};
/**
 * Components
 */
declare type SuperChatSignificance =
  typeof SUPERCHAT_SIGNIFICANCE_MAP[keyof typeof SUPERCHAT_SIGNIFICANCE_MAP];
declare type SuperChatColor =
  typeof SUPERCHAT_COLOR_MAP[keyof typeof SUPERCHAT_COLOR_MAP];
interface SuperChat {
  amount: number;
  currency: string;
  color: SuperChatColor;
  significance: SuperChatSignificance;
  authorNameTextColor: Color;
  timestampColor: Color;
  headerBackgroundColor: Color;
  headerTextColor: Color;
  bodyBackgroundColor: Color;
  bodyTextColor: Color;
}
interface Membership {
  status: string;
  since?: string;
  thumbnail: string;
}
/**
 * 0 - 255
 */
interface Color {
  r: number;
  g: number;
  b: number;
  opacity: number;
}
/**
 * Continuation
 */
interface ReloadContinuation {
  token: string;
}
interface TimedContinuation extends ReloadContinuation {
  timeoutMs: number;
}

interface YTNavigationEndpoint {
  clickTrackingParams: string;
  commandMetadata: YTAutoplayVideoCommandMetadata;
  watchEndpoint: YTAutoplayVideoWatchEndpoint;
}
interface YTAutoplayVideoCommandMetadata {
  webCommandMetadata: YTPurpleWebCommandMetadata;
}
interface YTPurpleWebCommandMetadata {
  url: string;
  webPageType: YTWebPageType;
  rootVe: number;
}
interface YTAutoplayVideoWatchEndpoint {
  videoId: string;
  params: string;
  playerParams: string;
  watchEndpointSupportedPrefetchConfig: YTWatchEndpointSupportedPrefetchConfig;
}
interface YTWatchEndpointSupportedPrefetchConfig {
  prefetchHintConfig: YTPrefetchHintConfig;
}
interface YTPrefetchHintConfig {
  prefetchPriority: number;
  countdownUiRelativeSecondsPrefetchCondition: number;
}
interface YTReloadContinuation {
  reloadContinuationData: YTReloadContinuationData;
}
interface YTReloadContinuationData {
  continuation: string;
  clickTrackingParams: string;
}
interface YTAccessibilityData {
  accessibilityData: YTAccessibilityLabel;
}
interface YTAccessibilityLabel {
  label: string;
}
interface StyleClass {
  styleType: StyleTypeEnum;
}
declare enum StyleTypeEnum {
  StyleDefaultActive = "STYLE_DEFAULT_ACTIVE",
  StyleText = "STYLE_TEXT",
}
interface YTBrowseEndpointContainer {
  browseEndpoint: YTBrowseEndpoint;
  commandMetadata: YTAutoplayVideoCommandMetadata;
  clickTrackingParams: string;
}
interface YTBrowseEndpoint {
  browseId: string;
}
interface YTContinuationEndpoint {
  clickTrackingParams: string;
  commandMetadata: YTApiEndpointMetadataContainer;
  continuationCommand: ContinuationCommand;
}
interface ContinuationCommand {
  token: string;
  request: string;
}
interface YTResponseContext {
  serviceTrackingParams: YTServiceTrackingParam[];
  webResponseContextExtensionData: WebResponseContextExtensionData;
}
interface YTServiceTrackingParam {
  service: string;
  params: YTParam[];
}
interface YTParam {
  key: string;
  value: string;
}
interface WebResponseContextExtensionData {
  ytConfigData: YTConfigData;
  webPrefetchData: WebPrefetchData;
  hasDecorated: boolean;
}
interface WebPrefetchData {
  navigationEndpoints: YTNavigationEndpoint[];
}
interface YTConfigData {
  visitorData: string;
  rootVisualElementType: number;
}

declare type YTText = YTSimpleTextContainer | YTRunContainer;
interface YTSimpleTextContainer {
  simpleText: string;
  accessibility?: YTAccessibilityData;
}
interface YTRunContainer<T = YTRun> {
  runs: T[];
}
declare type YTRun = YTTextRun | YTEmojiRun;
interface YTTextRun {
  text: string;
  bold?: boolean;
  italics?: boolean;
  navigationEndpoint?:
    | YTUrlEndpointContainer
    | YTBrowseEndpointContainer
    | YTWatchEndpointContainer;
}
interface YTEmojiRun {
  emoji: YTEmoji;
}
interface YTEmoji {
  emojiId: string;
  shortcuts: string[];
  searchTerms: string[];
  image: YTThumbnailList;
  isCustomEmoji?: boolean;
}
interface YTUrlEndpointContainer {
  urlEndpoint: YTUrlEndpoint;
  commandMetadata: YTWebPageMetadataContainer;
  clickTrackingParams?: string;
}
interface YTUrlEndpoint {
  url: string;
  target: YTTarget | string;
  nofollow?: boolean;
}
declare enum YTTarget {
  NewWindow = "TARGET_NEW_WINDOW",
}
interface YTChatError {
  code: number;
  message: string;
  errors: YTChatErrorDetail[];
  status: YTChatErrorStatus;
}
declare enum YTChatErrorStatus {
  Unavailable = "UNAVAILABLE",
  PermissionDenied = "PERMISSION_DENIED",
  Internal = "INTERNAL",
  Invalid = "INVALID_ARGUMENT",
  NotFound = "NOT_FOUND",
  Unauthenticated = "UNAUTHENTICATED",
}
interface YTChatErrorDetail {
  message: string;
  domain: "global";
  reason: "forbidden" | "backendError" | "badRequest" | "notFound";
}
interface YTActionResponse {
  responseContext: YTResponseContext;
  success: boolean;
  actions: YTAction[];
  timeoutDurationUsec?: string;
  errorMessage?: YTLiveChatTextActionsErrorMessageRenderer;
}
interface YTLiveChatTextActionsErrorMessageRenderer {
  errorText: YTRunContainer;
  editMessageText: YTRunContainer;
  clickToDismissText: YTRunContainer;
  originalRichMessage: {
    textSegments: YTTextRun[];
  };
}
interface YTTimedContinuationData {
  timeoutMs: number;
  continuation: string;
  clickTrackingParams: string;
}
interface YTCommandContainer<T> {
  clickTrackingParams: string;
  commandMetadata: T;
}
interface YTAction {
  clickTrackingParams: string;
  addChatItemAction?: YTAddChatItemAction;
  markChatItemsByAuthorAsDeletedAction?: YTMarkChatItemsByAuthorAsDeletedAction;
  markChatItemAsDeletedAction?: YTMarkChatItemAsDeletedAction;
  removeChatItemAction?: YTRemoveChatItemAction;
  addLiveChatTickerItemAction?: YTAddLiveChatTickerItemAction;
  addBannerToLiveChatCommand?: YTAddBannerToLiveChatCommand;
  removeBannerForLiveChatCommand?: YTRemoveBannerForLiveChatCommand;
  replaceChatItemAction: YTReplaceChatItemAction;
  showLiveChatTooltipCommand?: YTShowLiveChatTooltipCommand;
  showLiveChatActionPanelAction?: YTShowLiveChatActionPanelAction;
  updateLiveChatPollAction?: YTUpdateLiveChatPollAction;
  closeLiveChatActionPanelAction?: YTCloseLiveChatActionPanelAction;
}
interface YTAddChatItemAction {
  item: YTAddChatItemActionItem;
  clientId?: string;
}
declare type YTAddChatItemActionItem =
  | YTLiveChatTextMessageRendererContainer
  | YTLiveChatPaidMessageRendererContainer
  | YTLiveChatPaidStickerRendererContainer
  | YTLiveChatMembershipItemRendererContainer
  | YTLiveChatPlaceholderItemRendererContainer
  | YTLiveChatViewerEngagementMessageRendererContainer
  | YTLiveChatModeChangeMessageRendererContainer
  | YTLiveChatSponsorshipsGiftPurchaseAnnouncementRendererContainer
  | YTLiveChatSponsorshipsGiftRedemptionAnnouncementRendererContainer
  | YTLiveChatModerationMessageRendererContainer;
interface YTAddLiveChatTickerItemAction {
  item: YTAddLiveChatTickerItem;
  durationSec: string;
}
interface YTReplaceChatItemAction {
  targetItemId: string;
  replacementItem:
    | YTLiveChatPlaceholderItemRendererContainer
    | YTLiveChatTextMessageRendererContainer
    | YTLiveChatPaidMessageRendererContainer;
}
interface YTMarkChatItemAsDeletedAction {
  deletedStateMessage: YTRunContainer<YTTextRun>;
  targetItemId: string;
}
interface YTMarkChatItemsByAuthorAsDeletedAction {
  deletedStateMessage: YTRunContainer<YTTextRun>;
  externalChannelId: string;
}
interface YTRemoveChatItemAction {
  targetItemId: string;
}
interface YTAddBannerToLiveChatCommand {
  bannerRenderer: YTLiveChatBannerRendererContainer;
}
interface YTRemoveBannerForLiveChatCommand {
  targetActionId: string;
}
interface YTUpdateLiveChatPollAction {
  pollToUpdate: YTLiveChatPollRendererContainer;
}
interface YTShowLiveChatActionPanelAction {
  panelToShow: YTLiveChatActionPanelRendererContainer;
}
interface YTCloseLiveChatActionPanelAction {
  targetPanelId: string;
  skipOnDismissCommand: boolean;
}
interface YTLiveChatTextMessageRendererContainer {
  liveChatTextMessageRenderer: YTLiveChatTextMessageRenderer;
}
interface YTLiveChatPaidMessageRendererContainer {
  liveChatPaidMessageRenderer: YTLiveChatPaidMessageRenderer;
}
interface YTLiveChatPaidStickerRendererContainer {
  liveChatPaidStickerRenderer: YTLiveChatPaidStickerRenderer;
}
interface YTLiveChatMembershipItemRendererContainer {
  liveChatMembershipItemRenderer: YTLiveChatMembershipItemRenderer;
}
interface YTLiveChatPlaceholderItemRendererContainer {
  liveChatPlaceholderItemRenderer: YTLiveChatPlaceholderItemRenderer;
}
interface YTLiveChatBannerRendererContainer {
  liveChatBannerRenderer: YTLiveChatBannerRenderer;
}
interface YTLiveChatViewerEngagementMessageRendererContainer {
  liveChatViewerEngagementMessageRenderer: YTLiveChatViewerEngagementMessageRenderer;
}
interface YTTooltipRendererContainer {
  tooltipRenderer: YTTooltipRenderer;
}
interface YTLiveChatPollRendererContainer {
  pollRenderer: YTLiveChatPollRenderer;
}
interface YTLiveChatModeChangeMessageRendererContainer {
  liveChatModeChangeMessageRenderer: YTLiveChatModeChangeMessageRenderer;
}
interface YTLiveChatActionPanelRendererContainer {
  liveChatActionPanelRenderer: YTLiveChatActionPanelRenderer;
}
interface YTLiveChatSponsorshipsGiftPurchaseAnnouncementRendererContainer {
  liveChatSponsorshipsGiftPurchaseAnnouncementRenderer: YTLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer;
}
interface YTLiveChatSponsorshipsGiftRedemptionAnnouncementRendererContainer {
  liveChatSponsorshipsGiftRedemptionAnnouncementRenderer: YTLiveChatSponsorshipsGiftRedemptionAnnouncementRenderer;
}
interface YTLiveChatModerationMessageRendererContainer {
  liveChatModerationMessageRenderer: YTLiveChatModerationMessageRenderer;
}
interface YTLiveChatBannerRedirectRendererContainer {
  liveChatBannerRedirectRenderer: YTLiveChatBannerRedirectRenderer;
}
interface YTLiveChatProductItemRendererContainer {
  liveChatProductItemRenderer: YTLiveChatProductItemRenderer;
}
interface YTLiveChatTextMessageRenderer {
  id: string;
  timestampUsec: string;
  message: YTRunContainer;
  authorName: YTText;
  authorPhoto: YTThumbnailList;
  authorExternalChannelId: string;
  authorBadges?: YTAuthorBadge[];
  contextMenuEndpoint?: YTLiveChatItemContextMenuEndpointContainer;
  contextMenuAccessibility?: YTAccessibilityData;
}
interface YTLiveChatPaidMessageRenderer {
  id: string;
  timestampUsec: string;
  message?: YTRunContainer;
  authorName: YTText;
  authorPhoto: YTThumbnailList;
  authorExternalChannelId: string;
  contextMenuEndpoint: YTLiveChatItemContextMenuEndpointContainer;
  contextMenuAccessibility: YTAccessibilityData;
  purchaseAmountText: YTSimpleTextContainer;
  timestampColor: number;
  authorNameTextColor: number;
  headerBackgroundColor: number;
  headerTextColor: number;
  bodyBackgroundColor: number;
  bodyTextColor: number;
  trackingParams: string;
}
interface YTLiveChatPaidStickerRenderer {
  id: string;
  contextMenuEndpoint: YTLiveChatItemContextMenuEndpointContainer;
  contextMenuAccessibility: YTAccessibilityData;
  timestampUsec: string;
  authorPhoto: YTThumbnailList;
  authorName: YTText;
  authorExternalChannelId: string;
  sticker: YTThumbnailList;
  moneyChipBackgroundColor: number;
  moneyChipTextColor: number;
  purchaseAmountText: YTSimpleTextContainer;
  stickerDisplayWidth: number;
  stickerDisplayHeight: number;
  backgroundColor: number;
  authorNameTextColor: number;
  trackingParams: string;
}
/**
 * New Member:
 * headerPrimary: null
 * headerSub: Welcome <tenant> ! (YTRun)
 *
 * Milestone:
 * headerPrimary: Member for 11 months (YTRun)
 * headerSub: <tenant>
 * message: YTRun OR empty: true
 */
interface YTLiveChatMembershipItemRenderer {
  id: string;
  timestampUsec: string;
  timestampText?: YTSimpleTextContainer;
  authorExternalChannelId: string;
  headerPrimaryText?: YTRunContainer<YTTextRun>;
  headerSubtext: YTText;
  message?: YTRunContainer;
  empty?: true;
  authorName?: YTText;
  authorPhoto: YTThumbnailList;
  authorBadges: YTLiveChatAuthorBadgeRendererContainer[];
  contextMenuEndpoint: YTLiveChatItemContextMenuEndpointContainer;
  contextMenuAccessibility: YTAccessibilityData;
}
interface YTLiveChatPlaceholderItemRenderer {
  id: string;
  timestampUsec: string;
}
interface YTLiveChatBannerRenderer {
  actionId: string;
  targetId: "live-chat-banner" | string;
  contents:
    | YTLiveChatTextMessageRendererContainer
    | YTLiveChatBannerRedirectRendererContainer
    | YTLiveChatProductItemRendererContainer;
  viewerIsCreator: boolean;
  header?: YTLiveChatBannerRendererHeader;
  isStackable?: boolean;
  backgroundType?: "LIVE_CHAT_BANNER_BACKGROUND_TYPE_STATIC" | string;
}
interface YTLiveChatViewerEngagementMessageRenderer {
  id: string;
  timestampUsec?: string;
  icon: YTIcon;
  message: YTText;
  actionButton?: YTActionButtonRendererContainer;
  contextMenuEndpoint?: YTLiveChatItemContextMenuEndpointContainer;
}
interface YTTooltipRenderer {
  promoConfig: any;
  targetId: string;
  detailsText: YTText;
  suggestedPosition: YTType;
  dismissStrategy: YTType;
  trackingParams: string;
  dwellTimeMs?: string;
}
interface YTLiveChatPollRenderer {
  choices: YTLiveChatPollChoice[];
  liveChatPollId: string;
  header: {
    pollHeaderRenderer: {
      pollQuestion?: YTSimpleTextContainer;
      thumbnail: YTThumbnailList;
      metadataText: YTRunContainer<YTTextRun>;
      liveChatPollType: YTLiveChatPollType;
      contextMenuButton: YTContextMenuButtonRendererContainer;
    };
  };
}
interface YTLiveChatActionPanelRenderer {
  contents: YTLiveChatPollRendererContainer | any;
  id: string;
  targetId: string;
}
interface YTLiveChatBannerRedirectRenderer {
  /**
     * "runs": [
            {
              "text": "Athena Nightingale【AkioAIR】",
              "bold": true,
              "textColor": 4294967295,
              "fontFace": "FONT_FACE_ROBOTO_REGULAR"
            },
            {
              "text": " and their viewers just joined. Say hello!",
              "textColor": 4294967295,
              "fontFace": "FONT_FACE_ROBOTO_REGULAR"
            }
          ]
     */
  bannerMessage: YTRunContainer<YTTextRun>;
  authorPhoto: YTThumbnailList;
  inlineActionButton: YTContextMenuButtonRendererContainer<
    YTUrlEndpointContainer | YTWatchEndpointContainer
  >;
  contextMenuButton: YTContextMenuButtonRendererContainer;
}
interface YTLiveChatProductItemRenderer {
  title: string;
  accessibilityTitle: string;
  thumbnail: YTThumbnailList;
  price: string;
  vendorName: string;
  fromVendorText: string;
  informationButton: InformationButton;
  onClickCommand: YTUrlEndpointContainer;
  trackingParams: string;
  creatorMessage: string;
  creatorName: string;
  authorPhoto: YTThumbnailList;
  informationDialog: InformationDialog;
  isVerified: boolean;
}
interface InformationButton {
  buttonRenderer: InformationButtonButtonRenderer;
}
interface InformationButtonButtonRenderer {
  icon: YTIcon;
  accessibility: YTAccessibilityLabel;
  trackingParams: string;
}
interface InformationDialog {
  liveChatDialogRenderer: LiveChatDialogRenderer;
}
interface LiveChatDialogRenderer {
  trackingParams: string;
  dialogMessages: YTSimpleTextContainer[];
  confirmButton: CollapseButton;
}
interface YTLiveChatPollChoice {
  text: YTText;
  selected: boolean;
  signinEndpoint: YTSignInEndpointContainer;
  /** not available in showLiveChatActionPanelAction event */
  voteRatio?: number;
  /** not available in showLiveChatActionPanelAction event */
  votePercentage?: YTSimpleTextContainer;
}
declare enum YTLiveChatPollType {
  Creator = "LIVE_CHAT_POLL_TYPE_CREATOR",
}
/**
 * YTLiveChatModeChangeMessageRenderer
 *
 * ```
 * # Slow mode
 * icon:    YTIconType.SlowMode
 *          YTIconType.QuestionAnswer (?)
 * text:    [{"text":"Slow mode is on","bold":true}]
 * subtext: [{"text":"Send a message every ","italics":true},{"text":"1 second","italics":true}]
 *
 * # Members-only mode
 * icon:    YTIconType.MembersOnlyMode
 *          YTIconType.QuestionAnswer
 * text:    [{"text":"Members-only mode is on","bold":true}]
 *          [{"text":"Members-only mode is off","bold":true}]
 * subtext: [{"text":"Only members of this channel can send messages","italics":true}]
 *          [{"text":"This channel owner has opened chat to everyone","italics":true}]
 *
 * # Subscribers-only mode
 * icon:    YTIconType.TabSubscription
 *          YTIconType.QuestionAnswer
 * text:    [{"text":"<channel name>","bold":true},{"text":" turned on subscribers-only mode","bold":true}]
 *          [{"text":"<channel name>","bold":true},{"text":" turned off subscribers-only mode","bold":true}]
 * subtext: [{"text":"Only channel subscribers of ","italics":true},{"text":"10 minutes","italics":true},{"text":" or longer can send messages","italics":true}]
 *          [{"text":"Anyone can send a message","italics":true}]
 * ```
 */
interface YTLiveChatModeChangeMessageRenderer {
  id: string;
  timestampUsec: string;
  icon: YTIcon;
  text: YTText;
  subtext: YTText;
}
interface YTLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer {
  id: string;
  /** will be undefined if its container is a ticker */
  timestampUsec?: string;
  authorExternalChannelId: string;
  header: {
    liveChatSponsorshipsHeaderRenderer: YTLiveChatSponsorshipsHeaderRenderer;
  };
}
interface YTLiveChatSponsorshipsHeaderRenderer {
  authorName: YTSimpleTextContainer;
  authorPhoto: YTThumbnailList;
  primaryText: {
    runs: [
      {
        text: "Gifted ";
        bold: true;
      },
      {
        text: string;
        bold: true;
      },
      {
        text: " ";
        bold: true;
      },
      {
        text: string;
        bold: true;
      },
      {
        text: " memberships";
        bold: true;
      }
    ];
  };
  authorBadges?: YTLiveChatAuthorBadgeRendererContainer[];
  contextMenuEndpoint: YTLiveChatItemContextMenuEndpointContainer;
  contextMenuAccessibility: YTAccessibilityData;
  image: YTThumbnailList;
}
interface YTLiveChatSponsorshipsGiftRedemptionAnnouncementRenderer {
  id: string;
  timestampUsec: string;
  authorExternalChannelId: string;
  authorName: YTSimpleTextContainer;
  authorPhoto: YTThumbnailList;
  message: {
    runs: [
      {
        text: "was gifted a membership by ";
        italics: true;
      },
      {
        text: string;
        bold: true;
        italics: true;
      }
    ];
  };
  contextMenuEndpoint: YTLiveChatItemContextMenuEndpointContainer;
  contextMenuAccessibility: YTAccessibilityData;
  trackingParams: string;
}
interface YTLiveChatModerationMessageRenderer {
  message: {
    runs: [
      {
        text: string;
        bold: true;
        italics: true;
      },
      {
        text: " was hidden by " | " was unhidden by ";
        italics: true;
      },
      {
        text: string;
        bold: true;
        italics: true;
      },
      {
        text: ".";
        italics: true;
      }
    ];
  };
  id: string;
  timestampUsec: string;
}
interface YTAddLiveChatTickerItem {
  liveChatTickerPaidMessageItemRenderer?: YTLiveChatTickerPaidMessageItemRenderer;
  liveChatTickerPaidStickerItemRenderer?: YTLiveChatTickerPaidStickerItemRenderer;
  liveChatTickerSponsorItemRenderer?: YTLiveChatTickerSponsorItemRenderer;
}
interface YTLiveChatTickerPaidMessageItemRenderer {
  id: string;
  amount: YTSimpleTextContainer;
  amountTextColor: number;
  startBackgroundColor: number;
  endBackgroundColor: number;
  authorPhoto: YTThumbnailList;
  durationSec: number;
  showItemEndpoint: YTShowLiveChatItemEndpointContainer<YTLiveChatPaidMessageRendererContainer>;
  authorExternalChannelId: string;
  fullDurationSec: number;
  trackingParams: string;
}
interface YTLiveChatTickerPaidStickerItemRenderer {
  id: string;
  authorPhoto: YTThumbnailList;
  startBackgroundColor: number;
  endBackgroundColor: number;
  durationSec: number;
  fullDurationSec: number;
  showItemEndpoint: YTShowLiveChatItemEndpointContainer<YTLiveChatPaidStickerRendererContainer>;
  authorExternalChannelId: string;
  tickerThumbnails: YTThumbnailList[];
  trackingParams: string;
}
interface YTLiveChatTickerSponsorItemRenderer {
  id: string;
  detailIcon?: {
    iconType: "GIFT";
  };
  detailText: YTText;
  detailTextColor: number;
  startBackgroundColor: number;
  endBackgroundColor: number;
  sponsorPhoto: YTThumbnailList;
  durationSec: number;
  showItemEndpoint: YTShowLiveChatItemEndpointContainer<
    | YTLiveChatMembershipItemRendererContainer
    | YTLiveChatSponsorshipsGiftPurchaseAnnouncementRendererContainer
  >;
  authorExternalChannelId: string;
  fullDurationSec: number;
}
declare type YTShowLiveChatItemEndpointContainer<T> = {
  showLiveChatItemEndpoint: YTRendererContainer<T>;
} & YTCommandContainer<YTWebPageMetadataContainer>;
interface YTRendererContainer<T> {
  renderer: T;
  trackingParams: string;
}
declare type YTLiveChatItemContextMenuEndpointContainer =
  YTCommandContainer<YTIgnoreCommandMetadata> & {
    liveChatItemContextMenuEndpoint: YTEndpointParamsContainer;
  };
interface YTEndpointParamsContainer {
  params: string;
}
interface YTAuthorBadge {
  liveChatAuthorBadgeRenderer: {
    customThumbnail?: YTThumbnailList;
    icon?: YTIcon;
    tooltip: string;
    accessibility: YTAccessibilityData;
  };
}
interface YTSignInEndpointContainer {
  signInEndpoint: YTSignInEndpoint;
  commandMetadata: YTWebPageMetadataContainer;
  clickTrackingParams: string;
}
interface YTWatchEndpointContainer {
  watchEndpoint: YTWatchEndpoint;
  commandMetadata: YTIgnoreCommandMetadata | YTWebPageMetadataContainer;
  clickTrackingParams?: string;
}
interface YTSignInEndpoint {
  nextEndpoint: YTWatchEndpointContainer | {};
}
interface YTWatchEndpoint {
  videoId: string;
  playlistId?: string;
  index?: string;
  startTimeSeconds?: number;
  nofollow?: boolean;
  params?: string;
}
interface YTIgnoreCommandMetadata {
  webCommandMetadata: YTIgnoreWebCommandMetadata;
}
interface YTIgnoreWebCommandMetadata {
  ignoreNavigation: boolean;
}
interface YTWebPageMetadataContainer {
  webCommandMetadata: YTWebPageMetadata;
}
interface YTWebPageMetadata {
  url: string;
  webPageType: YTWebPageType | string;
  rootVe: number;
}
interface YTApiEndpointMetadataContainer {
  webCommandMetadata: YTApiEndpointMetadata;
}
interface YTApiEndpointMetadata {
  sendPost: boolean;
  apiUrl: string;
}
declare enum YTWebPageType {
  Unknown = "WEB_PAGE_TYPE_UNKNOWN",
  WebPageTypeBrowse = "WEB_PAGE_TYPE_BROWSE",
  WebPageTypeChannel = "WEB_PAGE_TYPE_CHANNEL",
  WebPageTypeSearch = "WEB_PAGE_TYPE_SEARCH",
  WebPageTypeUnknown = "WEB_PAGE_TYPE_UNKNOWN",
  WebPageTypeWatch = "WEB_PAGE_TYPE_WATCH",
}
interface YTIcon {
  iconType: YTIconType | string;
}
declare enum YTIconType {
  Keep = "KEEP",
  MoreVert = "MORE_VERT",
  QuestionAnswer = "QUESTION_ANSWER",
  SlowMode = "SLOW_MODE",
  MembersOnlyMode = "MEMBERS_ONLY_MODE",
  TabSubscriptions = "TAB_SUBSCRIPTIONS",
  BlockUser = "BLOCK_USER",
  ErrorOutline = "ERROR_OUTLINE",
}
interface YTLiveChatAuthorBadgeRendererContainer {
  liveChatAuthorBadgeRenderer: YTIconButtonRenderer;
}
interface YTThumbnailList {
  thumbnails: YTThumbnail[];
  accessibility?: YTAccessibilityData;
}
interface YTThumbnail {
  url: string;
  width?: number;
  height?: number;
}
interface YTButtonRenderer {
  icon?: YTIcon;
  text?: YTText;
  size?: string;
  style?: string;
  isDisabled?: boolean;
  accessibility: YTAccessibilityLabel;
}
interface YTLiveChatBannerRendererHeader {
  liveChatBannerHeaderRenderer: {
    icon: YTIcon;
    text: YTRunContainer;
    contextMenuButton: YTContextMenuButtonRendererContainer;
  };
}
interface YTContextMenuButtonRendererContainer<
  Command = YTLiveChatItemContextMenuEndpointContainer
> {
  buttonRenderer: {
    icon: YTIcon;
    style?: string;
    command: Command;
    accessibilityData: YTAccessibilityData;
    trackingParams: string;
  };
}
interface YTIconButtonRenderer {
  icon: YTIcon;
  tooltip: string;
  categoryId?: string;
  accessibility: YTAccessibilityData;
}
interface YTNavigationButtonRenderer<Endpoint> extends YTButtonRenderer {
  text: YTSimpleTextContainer;
  navigationEndpoint: Endpoint;
}
interface YTActionButtonRendererContainer {
  buttonRenderer: YTNavigationButtonRenderer<YTUrlEndpointContainer> & {
    accessibilityData: YTAccessibilityData;
  };
}
interface CollapseButton {
  buttonRenderer: YTButtonRenderer;
}
interface YTShowLiveChatTooltipCommand {
  tooltip: YTTooltipRendererContainer;
}
interface YTType {
  type: string;
}

/**
 * Actions
 */
declare type Action =
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
  | RemoveChatItemAction;
interface AddChatItemAction {
  type: "addChatItemAction";
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
  membership?: Membership;
  isOwner: boolean;
  isModerator: boolean;
  isVerified: boolean;
  contextMenuEndpointParams: string;
  /** @deprecated use `message` */
  rawMessage?: YTRun[];
}
interface AddSuperChatItemAction {
  type: "addSuperChatItemAction";
  id: string;
  timestamp: Date;
  timestampUsec: string;
  /** rare but can be undefined */
  authorName?: string;
  authorChannelId: string;
  authorPhoto: string;
  message: YTRun[] | null;
  amount: number;
  currency: string;
  color: SuperChatColor;
  significance: SuperChatSignificance;
  authorNameTextColor: Color;
  timestampColor: Color;
  headerBackgroundColor: Color;
  headerTextColor: Color;
  bodyBackgroundColor: Color;
  bodyTextColor: Color;
  /** @deprecated use `message` */
  rawMessage: YTRun[] | undefined;
  /** @deprecated flattened */
  superchat: SuperChat;
}
interface AddSuperStickerItemAction {
  type: "addSuperStickerItemAction";
  id: string;
  timestamp: Date;
  timestampUsec: string;
  authorName: string;
  authorChannelId: string;
  authorPhoto: string;
  stickerUrl: string;
  stickerText: string;
  amount: number;
  currency: string;
  stickerDisplayWidth: number;
  stickerDisplayHeight: number;
  moneyChipBackgroundColor: Color;
  moneyChipTextColor: Color;
  backgroundColor: Color;
  authorNameTextColor: Color;
}
interface AddMembershipItemAction {
  type: "addMembershipItemAction";
  id: string;
  timestamp: Date;
  timestampUsec: string;
  level?: string;
  /** Sometimes customThumbnail is not available */
  membership?: Membership;
  /** rare but can be undefined */
  authorName?: string;
  authorChannelId: string;
  authorPhoto: string;
}
interface AddMembershipMilestoneItemAction {
  type: "addMembershipMilestoneItemAction";
  id: string;
  timestamp: Date;
  timestampUsec: string;
  /** `level` is only shown when there's multiple levels available */
  level?: string;
  /** Sometimes customThumbnail is not available */
  membership?: Membership;
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
interface AddPlaceholderItemAction {
  type: "addPlaceholderItemAction";
  id: string;
  timestamp: Date;
  timestampUsec: string;
}
interface ReplaceChatItemAction {
  type: "replaceChatItemAction";
  targetItemId: string;
  replacementItem:
    | AddChatItemAction
    | AddPlaceholderItemAction
    | AddSuperChatItemAction;
}
interface MarkChatItemAsDeletedAction {
  type: "markChatItemAsDeletedAction";
  retracted: boolean;
  targetId: string;
  executor?: string;
  timestamp: Date;
}
interface MarkChatItemsByAuthorAsDeletedAction {
  type: "markChatItemsByAuthorAsDeletedAction";
  channelId: string;
  timestamp: Date;
}
interface AddSuperChatTickerAction {
  type: "addSuperChatTickerAction";
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
interface AddSuperStickerTickerAction {
  type: "addSuperStickerTickerAction";
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
interface AddMembershipTickerAction {
  type: "addMembershipTickerAction";
  id: string;
  authorChannelId: string;
  authorPhoto: string;
  durationSec: number;
  fullDurationSec: number;
  detailText: YTText;
  contents:
    | AddMembershipItemAction
    | AddMembershipMilestoneItemAction
    | MembershipGiftPurchaseTickerContent;
  detailTextColor: Color;
  startBackgroundColor: Color;
  endBackgroundColor: Color;
}
interface AddBannerAction {
  type: "addBannerAction";
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
  membership?: Membership;
  isOwner: boolean;
  isModerator: boolean;
  isVerified: boolean;
  viewerIsCreator: boolean;
  contextMenuEndpointParams?: string;
}
interface RemoveBannerAction {
  type: "removeBannerAction";
  targetActionId: string;
}
interface AddIncomingRaidBannerAction {
  type: "addIncomingRaidBannerAction";
  actionId: string;
  targetId: string;
  sourceName: string;
  sourcePhoto: string;
}
interface AddOutgoingRaidBannerAction {
  type: "addOutgoingRaidBannerAction";
  actionId: string;
  targetId: string;
  targetName: string;
  targetPhoto: string;
  targetVideoId: string;
}
interface AddProductBannerAction {
  type: "addProductBannerAction";
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
interface ShowTooltipAction {
  type: "showTooltipAction";
  targetId: string;
  detailsText: YTText;
  suggestedPosition: string;
  dismissStrategy: string;
  promoConfig: any;
  dwellTimeMs?: number;
}
interface AddViewerEngagementMessageAction {
  type: "addViewerEngagementMessageAction";
  id: string;
  message: YTText;
  actionUrl?: string;
  timestamp: Date;
  timestampUsec: string;
}
interface ShowPanelAction {
  type: "showPanelAction";
  panelToShow: any;
}
interface ClosePanelAction {
  type: "closePanelAction";
  targetPanelId: string;
  skipOnDismissCommand: boolean;
}
interface ShowPollPanelAction {
  type: "showPollPanelAction";
  targetId: string;
  id: string;
  pollType: YTLiveChatPollType;
  question?: string;
  choices: YTLiveChatPollChoice[];
  authorName: string;
  authorPhoto: string;
}
interface UpdatePollAction {
  type: "updatePollAction";
  id: string;
  pollType: YTLiveChatPollType;
  authorName: string;
  authorPhoto: string;
  question?: string;
  choices: YTLiveChatPollChoice[];
  elapsedText: string;
  voteCount: number;
}
interface AddPollResultAction {
  type: "addPollResultAction";
  id: string;
  question?: YTRun[];
  total: string;
  choices: PollChoice[];
}
interface PollChoice {
  text: YTRun[];
  votePercentage: string;
}
declare enum LiveChatMode {
  MembersOnly = "MEMBERS_ONLY",
  Slow = "SLOW",
  SubscribersOnly = "SUBSCRIBERS_ONLY",
  Unknown = "UNKNOWN",
}
interface ModeChangeAction {
  type: "modeChangeAction";
  mode: LiveChatMode;
  enabled: boolean;
  description: string;
}
interface MembershipGiftPurchaseAction {
  type: "membershipGiftPurchaseAction";
  id: string;
  timestamp: Date;
  timestampUsec: string;
  channelName: string;
  amount: number;
  membership: Membership;
  authorName: string;
  authorChannelId: string;
  authorPhoto: string;
  image: string;
}
declare type MembershipGiftPurchaseTickerContent = Omit<
  MembershipGiftPurchaseAction,
  "timestamp" | "timestampUsec" | "type"
>;
interface MembershipGiftRedemptionAction {
  type: "membershipGiftRedemptionAction";
  id: string;
  timestamp: Date;
  timestampUsec: string;
  senderName: string;
  authorName: string;
  authorChannelId: string;
  authorPhoto: string;
}
interface ModerationMessageAction {
  type: "moderationMessageAction";
  id: string;
  timestamp: Date;
  timestampUsec: string;
  message: YTRun[];
}
interface RemoveChatItemAction {
  type: "removeChatItemAction";
  targetId: string;
  timestamp: Date;
}
interface UnknownAction {
  type: "unknown";
  payload: unknown;
}

interface ClientInfo {
  clientName: string;
  clientVersion: string;
}
declare type ContinuationData =
  | YTReloadContinuationData
  | YTTimedContinuationData;
interface LiveChatContext {
  sendMessageParams: string | undefined;
}

declare type ActionType =
  | "report"
  | "block"
  | "unblock"
  | "pin"
  | "unpin"
  | "remove"
  | "timeout"
  | "hide"
  | "unhide"
  | "addModerator"
  | "removeModerator";
declare type ActionCatalog = {
  [key in ActionType]?: ActionInfo;
};
interface ActionInfo {
  isPost: boolean;
  url: string;
  params: string;
}

interface YTContinuationItem {
  commentThreadRenderer?: YTCommentThreadRenderer;
  continuationItemRenderer?: YTContinuationItemRenderer;
}
interface YTCommentThreadRenderer {
  comment: YTComment;
  replies?: Replies;
  trackingParams: string;
  renderingPriority: RenderingPriority;
  isModeratedElqComment: boolean;
  loggingDirectives: CommentRendererLoggingDirectives;
}
interface YTComment {
  commentRenderer: YTCommentRenderer;
}
interface YTCommentRenderer {
  authorText: YTSimpleTextContainer;
  authorThumbnail: YTThumbnailList;
  authorEndpoint: AuthorEndpoint;
  contentText: YTRunContainer;
  publishedTimeText: PublishedTimeText;
  isLiked: boolean;
  commentId: string;
  actionButtons: ActionButtons;
  authorIsChannelOwner: boolean;
  voteStatus: VoteStatus;
  trackingParams: string;
  voteCount: VoteCount;
  expandButton: Button;
  collapseButton: Button;
  replyCount?: number;
  loggingDirectives: CommentRendererLoggingDirectives;
  sponsorCommentBadge?: SponsorCommentBadge;
}
interface ActionButtons {
  commentActionButtonsRenderer: CommentActionButtonsRenderer;
}
interface CommentActionButtonsRenderer {
  likeButton: LikeButton;
  replyButton: Button;
  dislikeButton: LikeButton;
  trackingParams: string;
  protoCreationMs: string;
  style: CommentActionButtonsRendererStyle;
}
interface LikeButton {
  toggleButtonRenderer: ToggleButtonRenderer;
}
interface ToggleButtonRenderer {
  style: StyleClass;
  size: SizeClass;
  isToggled: boolean;
  isDisabled: boolean;
  defaultIcon: YTIcon;
  trackingParams: string;
  defaultTooltip: string;
  toggledTooltip: string;
  toggledStyle: StyleClass;
  defaultNavigationEndpoint: NavigationEndpoint;
  accessibilityData: YTAccessibilityData;
  toggledAccessibilityData: YTAccessibilityData;
}
interface NavigationEndpoint {
  clickTrackingParams: string;
  commandMetadata: NavigationEndpointCommandMetadata;
  signInEndpoint: SignInEndpoint;
}
interface NavigationEndpointCommandMetadata {
  webCommandMetadata: YTWebPageMetadata;
}
interface SignInEndpoint {
  nextEndpoint: NextEndpoint;
}
interface NextEndpoint {
  clickTrackingParams: string;
  commandMetadata: NavigationEndpointCommandMetadata;
  watchEndpoint: {
    videoId: string;
  };
}
interface SizeClass {
  sizeType: SizeEnum;
}
declare enum SizeEnum {
  SizeDefault = "SIZE_DEFAULT",
}
interface Button {
  buttonRenderer: CollapseButtonButtonRenderer;
}
interface CollapseButtonButtonRenderer {
  style: StyleTypeEnum;
  size: SizeEnum;
  text: YTRunContainer<YTTextRun>;
  navigationEndpoint?: NavigationEndpoint;
  trackingParams: string;
  accessibility?: YTAccessibilityData;
}
declare enum CommentActionButtonsRendererStyle {
  CommentActionButtonStyleTypeDesktopToolbar = "COMMENT_ACTION_BUTTON_STYLE_TYPE_DESKTOP_TOOLBAR",
}
interface AuthorEndpoint {
  clickTrackingParams: string;
  commandMetadata: NavigationEndpointCommandMetadata;
  browseEndpoint: BrowseEndpoint;
}
interface BrowseEndpoint {
  browseId: string;
  canonicalBaseUrl: string;
}
interface CommentRendererLoggingDirectives {
  trackingParams: string;
  visibility: {
    types: string;
  };
}
interface PublishedTimeText {
  runs: PublishedTimeTextRun[];
}
interface PublishedTimeTextRun {
  text: TextEnum;
  navigationEndpoint: YTWatchEndpointContainer;
}
declare enum TextEnum {
  The1DayAgo = "1 day ago",
  The2DaysAgo = "2 days ago",
  The3DaysAgo = "3 days ago",
  The3DaysAgoEdited = "3 days ago (edited)",
}
interface SponsorCommentBadge {
  sponsorCommentBadgeRenderer: SponsorCommentBadgeRenderer;
}
interface SponsorCommentBadgeRenderer {
  customBadge: CustomBadge;
  tooltip: string;
}
interface CustomBadge {
  thumbnails: CustomBadgeThumbnail[];
}
interface CustomBadgeThumbnail {
  url: string;
}
interface VoteCount {
  accessibility: YTAccessibilityData;
  simpleText: string;
}
declare enum VoteStatus {
  Indifferent = "INDIFFERENT",
}
declare enum RenderingPriority {
  Unknown = "RENDERING_PRIORITY_UNKNOWN",
  LinkedComment = "RENDERING_PRIORITY_LINKED_COMMENT",
}
interface Replies {
  commentRepliesRenderer: CommentRepliesRenderer;
}
interface CommentRepliesRenderer {
  contents: YTContent[];
  trackingParams: string;
  viewReplies: HideRepliesClass;
  hideReplies: HideRepliesClass;
  targetId: string;
}
interface YTContent {
  continuationItemRenderer: YTContinuationItemRenderer;
}
interface YTContinuationItemRenderer {
  trigger: string;
  continuationEndpoint: YTContinuationEndpoint;
}
interface HideRepliesClass {
  buttonRenderer: HideRepliesButtonRenderer;
}
interface HideRepliesButtonRenderer {
  text: YTRunContainer<YTTextRun>;
  icon: YTIcon;
  trackingParams: string;
  iconPosition: IconPosition;
}
declare enum IconPosition {
  ButtonIconPositionTypeLeftOfText = "BUTTON_ICON_POSITION_TYPE_LEFT_OF_TEXT",
}

interface TranscriptSegment {
  startMs: number;
  endMs: number;
  snippet: YTRun[];
  startTimeText: string;
}

interface Metadata {
  videoId: string;
  channelId: string;
  channelName?: string;
  title?: string;
  isLive?: boolean;
}
interface ChatResponse {
  actions: Action[];
  continuation: TimedContinuation | undefined;
  error: null;
}
interface Credentials {
  SAPISID: string;
  APISID: string;
  HSID: string;
  SID: string;
  SSID: string;
  /**
   * @deprecated Use DELEGATED_SESSION_ID
   */
  SESSION_ID?: string;
  /**
   * Delegated session id for brand account
   */
  DELEGATED_SESSION_ID?: string;
}

declare enum B64Type {
  B1 = "b1",
  B2 = "b2",
}
declare function b64e(payload: Uint8Array, type: B64Type): string;
declare function b64d(payload: string, type: B64Type): Uint8Array;

declare type PBValue = string | number | bigint | PBToken[];
interface PBToken {
  fid: bigint;
  type: PBType;
  v: PBValue;
}
declare enum PBType {
  V = 0,
  F64 = 1,
  LD = 2,
  StartGroup = 3,
  EndGroup = 4,
  F32 = 5,
}

declare function parsePb(input: Uint8Array, depth?: number): PBValue;

declare function pprintPbValue(value: PBValue, depth?: number): void;
declare function printBuf(buf: Uint8Array): void;
declare function toJSON(tokens: PBToken[]): string;
declare function bitou8(n: bigint | number): Uint8Array;
declare function u8tobi(buf: Uint8Array): bigint;
declare function concatu8(args: Uint8Array[]): Uint8Array;
declare function hextou8(data: string): Uint8Array;
declare function u8tohex(data: Uint8Array): string;
declare const b64tou8: (data: string) => Uint8Array;
declare const u8tob64: (data: Uint8Array) => string;

declare type CVPair = {
  channelId: string;
  videoId: string;
};
interface CscOptions {
  top?: boolean;
  highlightedCommentId?: string;
}
declare function csc(
  videoId: string,
  { top, highlightedCommentId }?: CscOptions
): string;
declare function liveReloadContinuation(
  origin: CVPair,
  {
    top,
  }?: {
    top?: boolean;
  }
): string;
declare function liveTimedContinuation(
  origin: CVPair,
  {
    top,
    since,
  }?: {
    top?: boolean;
    isOwner?: boolean;
    since?: Date;
  }
): string;
declare function replayReloadContinuation(
  origin: CVPair,
  {
    top,
    seekMs,
  }?: {
    top?: boolean;
    seekMs?: number;
  }
): string;
declare function replayTimedContinuation(
  origin: CVPair,
  {
    top,
    seekMs,
  }?: {
    top?: boolean;
    seekMs?: number;
  }
): string;
declare function sendMessageParams(to: CVPair): string;
declare function removeMessageParams(
  chatId: string,
  origin: CVPair,
  retract?: boolean
): string;
declare function timeoutParams(channelId: string, origin: CVPair): string;
declare function hideParams(
  channelId: string,
  origin: CVPair,
  undo?: boolean
): string;
declare function pinParams(chatId: string, origin: CVPair): string;
declare function unpinParams(actionId: string, origin: CVPair): string;
declare function addModeratorParams(
  tgt: string,
  origin: CVPair,
  undo?: boolean
): void;
declare function getContextMenuParams(
  chatId: string,
  authorChannelId: string,
  origin: CVPair
): string;
declare function getTranscriptParams(
  videoId: string,
  language: string,
  autoGenerated?: boolean
): string;
declare function transcriptFormatToken(
  language: string,
  autoGenerated?: boolean
): string;

declare type RetryOptions = {
  retry?: number;
  retryInterval?: number;
};
interface IterateChatOptions extends FetchChatOptions {
  /**
   * ignore first response fetched by reload token
   * set it to false which means you might get chats already processed before when recovering MasterchatAgent from error. Make sure you have unique index for chat id to prevent duplication.
   * @default false
   * */
  ignoreFirstResponse?: boolean;
  /** pass previously fetched token to resume chat fetching */
  continuation?: string;
}
interface FetchChatOptions {
  /** fetch top chat instead of all chat */
  topChat?: boolean;
}
declare type ChatListener = Promise<void>;
interface Events {
  data: (data: ChatResponse, mc: Masterchat) => void;
  actions: (actions: Action[], mc: Masterchat) => void;
  chats: (chats: AddChatItemAction[], mc: Masterchat) => void;
  chat: (chat: AddChatItemAction, mc: Masterchat) => void;
  end: (reason: EndReason) => void;
  error: (error: MasterchatError | Error) => void;
}
interface MasterchatOptions {
  /** you can grab Credentials using `extra/credential-fetcher` */
  credentials?: Credentials | string;
  /** set live chat mode
   *
   * ```
   * if undefined,
   *   live -> OK
   *   archive -> OK
   *
   * if "live":
   *   live -> OK
   *   archive -> throw DisabledChatError
   *
   * if "replay":
   *   live -> throw DisabledChatError
   *   archive -> OK
   * ```
   */
  mode?: "live" | "replay";
  axiosInstance?: AxiosInstance;
}
interface Masterchat {
  on<U extends keyof Events>(event: U, listener: Events[U]): this;
  once<U extends keyof Events>(event: U, listener: Events[U]): this;
  addListener<U extends keyof Events>(event: U, listener: Events[U]): this;
  off<U extends keyof Events>(event: U, listener: Events[U]): this;
  removeListener<U extends keyof Events>(event: U, listener: Events[U]): this;
  emit<U extends keyof Events>(
    event: U,
    ...args: Parameters<Events[U]>
  ): boolean;
}
declare class Masterchat extends EventEmitter {
  videoId: string;
  channelId: string;
  isLive?: boolean;
  channelName?: string;
  title?: string;
  private axiosInstance;
  private listener;
  private listenerAbortion;
  private credentials?;
  private postWithRetry;
  private post;
  private get;
  private log;
  private cvPair;
  /**
   * NOTE: urlParams: pbj=1|0
   */
  private getActionCatalog;
  private sendAction;
  /**
   * Useful when you don't know channelId or isLive status
   */
  static init(
    videoIdOrUrl: string,
    options?: MasterchatOptions
  ): Promise<Masterchat>;
  /**
   * Much faster than Masterchat.init
   */
  constructor(
    videoId: string,
    channelId: string,
    { mode, credentials, axiosInstance }?: MasterchatOptions
  );
  /**
   * Context API
   */
  populateMetadata(): Promise<void>;
  fetchMetadataFromWatch(id: string): Promise<{
    title: string;
    channelId: string;
    channelName: string;
    isLive: boolean;
  }>;
  fetchMetadataFromEmbed(id: string): Promise<
    | {
        title: string;
        thumbnail: any;
        channelId: any;
        channelName: string;
        channelThumbnail: any;
        duration: number;
        status: any;
        statusText: any;
      }
    | undefined
  >;
  get metadata(): {
    videoId: string;
    channelId: string;
    channelName: string | undefined;
    title: string | undefined;
    isLive: boolean | undefined;
  };
  /**
   * Set credentials. This will take effect on the subsequent requests.
   */
  setCredentials(credentials?: Credentials | string): void;
  /**
   * (EventEmitter API)
   * start listening live stream
   */
  listen(iterateOptions?: IterateChatOptions): ChatListener;
  /**
   * (EventEmitter API)
   * stop listening live stream
   */
  stop(): void;
  /**
   * (EventEmitter API)
   * returns listener status
   */
  get stopped(): boolean;
  /**
   * AsyncIterator API
   */
  iter(options?: IterateChatOptions): AsyncIterator<Action>;
  /**
   * (AsyncGenerator API)
   * Iterate until live stream ends
   */
  iterate({
    topChat,
    ignoreFirstResponse,
    continuation,
  }?: IterateChatOptions): AsyncGenerator<ChatResponse>;
  fetch(options?: FetchChatOptions): Promise<ChatResponse>;
  fetch(token: string, options?: FetchChatOptions): Promise<ChatResponse>;
  /**
   * NOTE: invalid params -> "actions":[{"liveChatAddToToastAction":{"item":{"notificationTextRenderer":{"successResponseText":{"runs":[{"text":"Error, try again."}]},"trackingParams":"CAAQyscDIhMI56_wmNj89wIV0HVgCh2Qow9y"}}}}]
   */
  /**
   * Send Message API
   */
  sendMessage(message: string): Promise<YTLiveChatTextMessageRenderer>;
  /**
   * Live Chat Action API
   */
  pin(chatId: string): Promise<YTActionResponse>;
  unpin(actionId: string): Promise<YTActionResponse>;
  /**
   * Moderate API
   */
  remove(chatId: string): Promise<MarkChatItemAsDeletedAction>;
  /**
   * Put user in timeout for 300 seconds
   */
  timeout(channelId: string): Promise<void>;
  /**
   * Hide user on the channel
   */
  hide(targetChannelId: string): Promise<void>;
  unhide(channelId: string): Promise<void>;
  block(contextMenuEndpointParams: string): Promise<YTAction[] | undefined>;
  unblock(contextMenuEndpointParams: string): Promise<YTAction[] | undefined>;
  /**
   * Manage User API
   */
  addModerator(channelId: string): Promise<YTActionResponse>;
  removeModerator(channelId: string): Promise<YTActionResponse>;
  getComment(commentId: string): Promise<YTCommentThreadRenderer | undefined>;
  getComments(continuation?: string | CscOptions): Promise<{
    comments: YTCommentThreadRenderer[];
    continuation: string | undefined;
    next: (() => Promise<any>) | undefined;
  }>;
  /**
   * Fetch transcript
   */
  getTranscript(language: string): Promise<TranscriptSegment[]>;
  getPlaylist(
    browseId:
      | string
      | {
          type: "membersOnly";
        }
  ): Promise<{
    title: any;
    description: any;
    videos: any;
  }>;
}

interface StreamPoolEvents {
  data: (data: ChatResponse, mc: Masterchat) => void;
  actions: (actions: Action[], mc: Masterchat) => void;
  chats: (chats: AddChatItemAction[], mc: Masterchat) => void;
  end: (reason: EndReason, mc: Masterchat) => void;
  error: (error: MasterchatError | Error, mc: Masterchat) => void;
}
interface StreamPool {
  on<U extends keyof StreamPoolEvents>(
    event: U,
    listener: StreamPoolEvents[U]
  ): this;
  addListener<U extends keyof StreamPoolEvents>(
    event: U,
    listener: StreamPoolEvents[U]
  ): this;
  off<U extends keyof StreamPoolEvents>(
    event: U,
    listener: StreamPoolEvents[U]
  ): this;
  removeListener<U extends keyof StreamPoolEvents>(
    event: U,
    listener: StreamPoolEvents[U]
  ): this;
  emit<U extends keyof StreamPoolEvents>(
    event: U,
    ...args: Parameters<StreamPoolEvents[U]>
  ): boolean;
}
declare class StreamPool extends EventEmitter {
  private pool;
  private options?;
  private started;
  constructor(options?: MasterchatOptions);
  get entries(): [string, Masterchat][];
  forEach(
    fn: (agent: Masterchat, videoId: string, index: number) => void
  ): Promise<PromiseSettledResult<void>[]>;
  setCredentials(credentials?: Credentials | string): void;
  get(videoId: string): Masterchat | undefined;
  /**
   * resolves after every stream closed
   */
  ensure(): Promise<void>;
  /**
   * number of active streams
   */
  streamCount(): number;
  /**
   * check if the given stream is already subscribed
   */
  has(videoId: string): boolean;
  /**
   * subscribe live chat.
   * always guarantees single instance for each stream.
   */
  subscribe(
    videoId: string,
    channelId: string,
    iterateOptions?: IterateChatOptions
  ): Masterchat;
  /**
   * stop subscribing live chat
   */
  unsubscribe(videoId: string): void;
  private _handleData;
  private _handleActions;
  private _handleChats;
  private _handleEnd;
  private _handleError;
}

declare type ColorFormat = "rgb" | "hex";
interface RunsToStringOptions {
  spaces?: boolean;
  textHandler?: (text: YTTextRun) => string;
  emojiHandler?: (emoji: YTEmojiRun) => string;
}
/**
 * Convert timestampUsec into Date
 */
declare function tsToDate(timestampUsec: string): Date;
/**
 * Convert timestampUsec into number (in seconds)
 */
declare function tsToNumber(timestampUsec: string): number;
declare function formatColor(color: Color, format?: ColorFormat): string;
declare function toVideoId(idOrUrl: string): string | undefined;
declare function endpointToUrl(
  navigationEndpoint: NonNullable<YTTextRun["navigationEndpoint"]>
): string | undefined;
/**
 * Convert any yt text container into string
 * `[...] | {runs: [...]} | {simpleText: "..."} -> string`
 */
declare function stringify(
  payload: YTText | YTRun[] | string,
  runsToStringOptions?: RunsToStringOptions
): string;
declare function stringify(
  payload: undefined,
  runsToStringOptions?: RunsToStringOptions
): undefined;
declare function runsToString(
  runs: YTRun[],
  { spaces, textHandler, emojiHandler }?: RunsToStringOptions
): string;
declare function delay(duration: number, signal?: AbortSignal): Promise<void>;
declare function guessFreeChat(title: string): boolean;
declare function groupBy<T, K extends keyof T, S extends Extract<T[K], string>>(
  lst: T[],
  key: K
): { [k in S]: (T extends { [s in K]: k } ? T : never)[] };
declare function durationToSeconds(durationText: string): number;
declare function durationToISO8601(durationText: string): string;

export {
  AbortError,
  AccessDeniedError,
  Action,
  ActionButtons,
  ActionCatalog,
  ActionInfo,
  ActionType,
  AddBannerAction,
  AddChatItemAction,
  AddIncomingRaidBannerAction,
  AddMembershipItemAction,
  AddMembershipMilestoneItemAction,
  AddMembershipTickerAction,
  AddOutgoingRaidBannerAction,
  AddPlaceholderItemAction,
  AddPollResultAction,
  AddProductBannerAction,
  AddSuperChatItemAction,
  AddSuperChatTickerAction,
  AddSuperStickerItemAction,
  AddSuperStickerTickerAction,
  AddViewerEngagementMessageAction,
  AuthorEndpoint,
  B64Type,
  BrowseEndpoint,
  Button,
  CVPair,
  ChatListener,
  ChatResponse,
  ClientInfo,
  ClosePanelAction,
  CollapseButtonButtonRenderer,
  Color,
  ColorFormat,
  CommentActionButtonsRenderer,
  CommentActionButtonsRendererStyle,
  CommentRendererLoggingDirectives,
  CommentRepliesRenderer,
  ContinuationData,
  Credentials,
  CscOptions,
  CustomBadge,
  CustomBadgeThumbnail,
  DisabledChatError,
  EndReason,
  ErrorCode,
  Events,
  FetchChatOptions,
  HideRepliesButtonRenderer,
  HideRepliesClass,
  IconPosition,
  InvalidArgumentError,
  IterateChatOptions,
  LikeButton,
  LiveChatContext,
  LiveChatMode,
  MarkChatItemAsDeletedAction,
  MarkChatItemsByAuthorAsDeletedAction,
  Masterchat,
  MasterchatError,
  MasterchatOptions,
  MembersOnlyError,
  Membership,
  MembershipGiftPurchaseAction,
  MembershipGiftPurchaseTickerContent,
  MembershipGiftRedemptionAction,
  Metadata,
  ModeChangeAction,
  ModerationMessageAction,
  NavigationEndpoint,
  NavigationEndpointCommandMetadata,
  NextEndpoint,
  NoPermissionError,
  NoStreamRecordingError,
  PollChoice,
  PublishedTimeText,
  PublishedTimeTextRun,
  ReloadContinuation,
  RemoveBannerAction,
  RemoveChatItemAction,
  RenderingPriority,
  ReplaceChatItemAction,
  Replies,
  RetryOptions,
  SUPERCHAT_COLOR_MAP,
  SUPERCHAT_SIGNIFICANCE_MAP,
  ShowPanelAction,
  ShowPollPanelAction,
  ShowTooltipAction,
  SignInEndpoint,
  SizeClass,
  SizeEnum,
  SponsorCommentBadge,
  SponsorCommentBadgeRenderer,
  StreamPool,
  SuperChat,
  SuperChatColor,
  SuperChatSignificance,
  TextEnum,
  TimedContinuation,
  ToggleButtonRenderer,
  TranscriptSegment,
  UnavailableError,
  UnknownAction,
  UpdatePollAction,
  VoteCount,
  VoteStatus,
  YTAccessibilityData,
  YTChatError,
  YTChatErrorStatus,
  YTComment,
  YTCommentRenderer,
  YTCommentThreadRenderer,
  YTContent,
  YTContinuationItem,
  YTContinuationItemRenderer,
  YTEmoji,
  YTEmojiRun,
  YTLiveChatTextMessageRenderer,
  YTMarkChatItemAsDeletedAction,
  YTReloadContinuation,
  YTRun,
  YTRunContainer,
  YTTextRun,
  YTThumbnail,
  YTThumbnailList,
  addModeratorParams,
  b64d,
  b64e,
  b64tou8,
  bitou8,
  concatu8,
  csc,
  delay,
  durationToISO8601,
  durationToSeconds,
  endpointToUrl,
  formatColor,
  getContextMenuParams,
  getTranscriptParams,
  groupBy,
  guessFreeChat,
  hextou8,
  hideParams,
  liveReloadContinuation,
  liveTimedContinuation,
  parsePb,
  pinParams,
  pprintPbValue,
  printBuf,
  removeMessageParams,
  replayReloadContinuation,
  replayTimedContinuation,
  runsToString,
  sendMessageParams,
  stringify,
  timeoutParams,
  toJSON,
  toVideoId,
  transcriptFormatToken,
  tsToDate,
  tsToNumber,
  u8tob64,
  u8tobi,
  u8tohex,
  unpinParams,
};
