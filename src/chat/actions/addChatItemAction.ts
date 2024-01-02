import { unknown } from "..";
import { ItemActionTypes, AddPollResultAction, ColorName, exportActionTypes } from "../../interfaces";
import {
	AddChatItemAction,
	AddMembershipItemAction,
	AddMembershipMilestoneItemAction,
	AddSuperChatItemAction,
	AddSuperStickerItemAction,
	MembershipGiftPurchaseAction,
	MembershipGiftRedemptionAction,
	UnknownAction,
} from "../../interfaces/Superchats/actions";
import { AddPlaceholderItemAction } from "../../interfaces/Superchats/addPlaceholderItemAction";
import { AddViewerEngagementMessageAction } from "../../interfaces/Superchats/addViewerEngagementMessageAction";
import { MembershipGiftPurchaseTickerAction } from "../../interfaces/Superchats/membershipGiftPurchaseTickerAction";
import {
	YTAddChatItemAction,
	YTLiveChatMembershipItemRenderer,
	YTLiveChatModeChangeMessageRenderer,
	YTLiveChatModerationMessageRenderer,
	YTLiveChatPaidMessageRenderer,
	YTLiveChatPaidStickerRenderer,
	YTLiveChatPlaceholderItemRenderer,
	YTLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer,
	YTLiveChatSponsorshipsGiftRedemptionAnnouncementRenderer,
	YTLiveChatTextMessageRenderer,
	YTLiveChatViewerEngagementMessageRenderer,
	YTRunContainer,
	YTTextRun,
} from "../../interfaces/yt/chat";
import { debugLog, durationToSeconds, getEmojis, splitRunsByNewLines, stringify, tsTextToSeconds, tsToNumber } from "../../utils";
import { parseBadges, parseMembership } from "../badge";
import { getColor, parseSuperChat } from "../superchat";
import { BackupTimestamp, findUnexpectedProperties, parseColorCode, pickThumbUrl } from "../utils";
import {
	chatItemProperties,
	membershipGiftPurchaseHeaderProperties,
	membershipGiftPurchaseProperties,
	membershipGiftPurchaseTickerHeaderProperties,
	membershipGiftPurchaseTickerProperties,
	membershipItemProperties,
	membershipMilestoneItemProperties,
	superChatItemProperties,
	superStickerItemProperties,
} from "./properties";

export function parseAddChatItemAction(payload: YTAddChatItemAction, backupTimestamp: BackupTimestamp) {
	const { item } = payload;

	const parsedAction = (() => {
		if ("liveChatTextMessageRenderer" in item) {
			// Chat
			const renderer = item["liveChatTextMessageRenderer"];
			return parseLiveChatTextMessageRenderer(renderer, backupTimestamp);
		} else if ("liveChatPaidMessageRenderer" in item) {
			// Super Chat
			const renderer = item["liveChatPaidMessageRenderer"];
			return parseLiveChatPaidMessageRenderer(renderer, backupTimestamp);
		} else if ("liveChatPaidStickerRenderer" in item) {
			// Super Sticker
			const renderer = item["liveChatPaidStickerRenderer"];
			return parseLiveChatPaidStickerRenderer(renderer, backupTimestamp);
		} else if ("liveChatMembershipItemRenderer" in item) {
			// Membership updates
			const renderer = item["liveChatMembershipItemRenderer"];
			return parseLiveChatMembershipItemRenderer(renderer, backupTimestamp);
		} else if ("liveChatViewerEngagementMessageRenderer" in item) {
			// Engagement message
			const renderer = item["liveChatViewerEngagementMessageRenderer"];
			return parseLiveChatViewerEngagementMessageRenderer(renderer, backupTimestamp);
		} else if ("liveChatPlaceholderItemRenderer" in item) {
			// Placeholder chat
			const renderer = item["liveChatPlaceholderItemRenderer"];
			return parseLiveChatPlaceholderItemRenderer(renderer, backupTimestamp);
		} else if ("liveChatModeChangeMessageRenderer" in item) {
			// Mode change message (e.g. toggle members-only)
			const renderer = item["liveChatModeChangeMessageRenderer"];
			return parseLiveChatModeChangeMessageRenderer(renderer);
		} else if ("liveChatSponsorshipsGiftPurchaseAnnouncementRenderer" in item) {
			// Sponsorships gift purchase announcement
			const renderer = item["liveChatSponsorshipsGiftPurchaseAnnouncementRenderer"];
			return parseLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer(renderer, backupTimestamp) as MembershipGiftPurchaseAction;
		} else if ("liveChatSponsorshipsGiftRedemptionAnnouncementRenderer" in item) {
			// Sponsorships gift purchase announcement
			const renderer = item["liveChatSponsorshipsGiftRedemptionAnnouncementRenderer"];
			return parseLiveChatSponsorshipsGiftRedemptionAnnouncementRenderer(renderer, backupTimestamp);
		} else if ("liveChatModerationMessageRenderer" in item) {
			const renderer = item["liveChatModerationMessageRenderer"];
			return parseLiveChatModerationMessageRenderer(renderer, backupTimestamp);
		}
	})();

	if (!parsedAction) {
		debugLog("[action required] Unrecognized chat item renderer type:", JSON.stringify(item));
		return unknown(payload);
	}

	return parsedAction;
}

// Chat
export function parseLiveChatTextMessageRenderer(renderer: YTLiveChatTextMessageRenderer, backupTimestamp: BackupTimestamp) {
	const { id, timestampUsec, authorExternalChannelId: authorChannelId } = renderer;
	backupTimestamp.set(timestampUsec);
	const timestamp = tsToNumber(timestampUsec);
	const timestampText = tsTextToSeconds(renderer.timestampText);

	const authorName = stringify(renderer.authorName);
	const authorPhoto = pickThumbUrl(renderer.authorPhoto);

	const authorBadges = parseBadges(renderer);
	const emotes = getEmojis(renderer.message.runs);
	const creatorHeart = "creatorHeart" in renderer && renderer.creatorHeart ? pickThumbUrl(renderer.creatorHeart) : undefined;

	const unexpectedProperties = findUnexpectedProperties(chatItemProperties, renderer);
	const unexpectedKeys = [...Object.keys(unexpectedProperties)];
	if (unexpectedKeys.length > 0) {
		console.log("Unexpected keys found in [chatItemProperties]", unexpectedKeys);
	}
	// const contextMenuEndpointParams = renderer.contextMenuEndpoint!.liveChatItemContextMenuEndpoint.params;

	if (renderer.authorName && !("simpleText" in renderer.authorName)) {
		debugLog("[action required] non-simple authorName (live chat):", JSON.stringify(renderer.authorName));
	}

	// message can somehow be a blank object (in quite rare occasion though)
	const message = stringify(renderer.message) ?? null;

	const parsed: AddChatItemAction = {
		type: exportActionTypes.addChatItemAction,
		// ...renderer,
		id,
		timestamp,
		timestampText,
		// timestampUsec,
		authorName,
		authorPhoto,
		authorChannelId,
		authorBadges,
		color: ColorName.chat,
		message,
		emotes,
		creatorHeart,
		...unexpectedProperties,
		// membership,
		// isVerified,
		// isOwner,
		// isModerator,
		// contextMenuEndpointParams,
		// rawMessage: message, // deprecated
	};

	return parsed;
}

// Super Chat
export function parseLiveChatPaidMessageRenderer(renderer: YTLiveChatPaidMessageRenderer, backupTimestamp: BackupTimestamp) {
	const { timestampUsec, authorExternalChannelId: authorChannelId } = renderer;
	backupTimestamp.set(timestampUsec);
	const timestamp = tsToNumber(timestampUsec);
	const timestampText = tsTextToSeconds(renderer.timestampText);

	const authorName = stringify(renderer.authorName);
	const authorPhoto = pickThumbUrl(renderer.authorPhoto);
	const authorBadges = parseBadges(renderer);
	const color = getColor(renderer);

	if (renderer.authorName && !("simpleText" in renderer.authorName)) {
		debugLog("[action required] non-simple authorName (super chat):", JSON.stringify(renderer.authorName));
	}

	const unexpectedProperties = findUnexpectedProperties(superChatItemProperties, renderer);
	const unexpectedKeys = [...Object.keys(unexpectedProperties)];
	if (unexpectedKeys.length > 0) {
		console.log("Unexpected keys found in [superChatItemProperties]", unexpectedKeys);
	}

	const message = (renderer.message && stringify(renderer.message)) || null;
	const emotes = getEmojis(renderer.message?.runs);
	const superchat = parseSuperChat(renderer);

	const parsed: AddSuperChatItemAction = {
		type: exportActionTypes.addSuperChatItemAction,
		// ...renderer
		id: renderer.id,
		timestamp,
		timestampText,
		// timestampUsec,
		authorName,
		authorPhoto,
		authorChannelId,
		authorBadges,
		color,
		message,
		emotes,
		backgroundColor: parseColorCode(renderer.bodyBackgroundColor),
		...superchat,
		...unexpectedProperties,
		// superchat, // deprecated
		// rawMessage: renderer.message?.runs, // deprecated
	};
	return parsed;
}

// Super Sticker
export function parseLiveChatPaidStickerRenderer(
	renderer: YTLiveChatPaidStickerRenderer,
	backupTimestamp: BackupTimestamp
): AddSuperStickerItemAction {
	const { timestampUsec, authorExternalChannelId: authorChannelId } = renderer;
	backupTimestamp.set(timestampUsec);
	const timestamp = tsToNumber(timestampUsec);
	const timestampText = tsTextToSeconds(renderer.timestampText);

	const authorName = stringify(renderer.authorName);
	const authorPhoto = pickThumbUrl(renderer.authorPhoto);
	const authorBadges = parseBadges(renderer);

	if (!authorName) {
		debugLog("[action required] empty authorName (super sticker)", JSON.stringify(renderer));
	}

	const sticker = "https:" + pickThumbUrl(renderer.sticker);
	let stickerLabel;
	if ("accessibility" in renderer.sticker && renderer.sticker.accessibility) {
		stickerLabel = renderer.sticker.accessibility.accessibilityData.label;
	}

	const superchat = parseSuperChat(renderer);
	const color = getColor(renderer);

	const unexpectedProperties = findUnexpectedProperties(superStickerItemProperties, renderer);
	const unexpectedKeys = [...Object.keys(unexpectedProperties)];
	if (unexpectedKeys.length > 0) {
		console.log("Unexpected keys found in [superStickerItemProperties]", unexpectedKeys);
	}

	const parsed: AddSuperStickerItemAction = {
		type: exportActionTypes.addSuperStickerItemAction,
		// ...renderer,
		id: renderer.id,
		timestamp,
		timestampText,
		authorName,
		authorPhoto,
		authorChannelId,
		authorBadges,
		color,
		stickerLabel,
		sticker,
		backgroundColor: parseColorCode(renderer.moneyChipBackgroundColor),
		...superchat,
		...unexpectedProperties,
		// id: rdr.id,
		// timestamp,
		// timestampUsec,
		// authorName,
		// authorChannelId,
		// authorPhoto,
		// stickerUrl,
		// stickerText,
		// stickerDisplayWidth: rdr.stickerDisplayWidth,
		// stickerDisplayHeight: rdr.stickerDisplayHeight,
		// moneyChipBackgroundColor: parseColorCode(renderer.moneyChipBackgroundColor),
		// moneyChipTextColor: parseColorCode(rdr.moneyChipTextColor),
		// backgroundColor: parseColorCode(renderer.backgroundColor),
		// authorNameTextColor: parseColorCode(rdr.authorNameTextColor),
	};

	return parsed;
}

// Membership
export function parseLiveChatMembershipItemRenderer(renderer: YTLiveChatMembershipItemRenderer, backupTimestamp: BackupTimestamp) {
	const id = renderer.id;
	const timestampUsec = renderer.timestampUsec;
	backupTimestamp.set(timestampUsec);
	const timestamp = tsToNumber(timestampUsec);
	const timestampText = tsTextToSeconds(renderer.timestampText);
	const authorName = stringify(renderer.authorName);
	if (!authorName) {
		debugLog("[action required] empty authorName (membership Item)", JSON.stringify(renderer));
	}
	const authorChannelId = renderer.authorExternalChannelId;
	const authorPhoto = pickThumbUrl(renderer.authorPhoto);
	const authorBadges = parseBadges(renderer);

	// observed, MODERATOR
	// observed, undefined renderer.authorBadges
	const membership = renderer.authorBadges ? parseMembership(renderer.authorBadges[renderer.authorBadges.length - 1]) : undefined;
	if (!membership) {
		debugLog(`missing membership information while parsing new membership action: ${JSON.stringify(renderer)}`);
	}

	const isMilestoneMessage = "empty" in renderer || "message" in renderer;

	if (isMilestoneMessage) {
		const message = (renderer.message && stringify(renderer.message)) || null;
		const emotes = getEmojis(renderer.message?.runs);
		let headerPrimaryText;
		if ("headerPrimaryText" in renderer && renderer.headerPrimaryText) {
			headerPrimaryText = stringify(renderer.headerPrimaryText.runs);
		}
		// duration > membership.since
		// e.g. 12 months > 6 months

		const headerSubtext = stringify(renderer.headerSubtext);

		const unexpectedProperties = findUnexpectedProperties(membershipMilestoneItemProperties, renderer);
		const unexpectedKeys = [...Object.keys(unexpectedProperties)];
		if (unexpectedKeys.length > 0) {
			console.log("Unexpected keys found in [membershipMilestoneItemProperties]", unexpectedKeys);
		}

		const parsed: AddMembershipMilestoneItemAction = {
			type: exportActionTypes.addMembershipMilestoneItemAction,
			// ...renderer,
			id,
			timestamp,
			timestampText,
			authorName,
			authorPhoto,
			authorChannelId,
			authorBadges,
			color: ColorName.message,
			message,
			emotes,
			headerPrimaryText,
			headerSubtext,
			// membership,
			// level,
			// duration,
			// durationText,
			...unexpectedProperties,
		};
		return parsed;
	} else {
		/**
		 * no level -> ["New Member"]
		 * multiple levels -> ["Welcome", "<level>", "!"]
		 */
		const subRuns = (renderer.headerSubtext as YTRunContainer<YTTextRun>).runs;
		const headerSubtext = stringify(subRuns);
		const tier = subRuns.length > 1 ? subRuns[1].text : undefined;
		const method = subRuns[0].text.split(" ")[0];
		const color = method.toLowerCase().includes("welcome") ? ColorName.join : ColorName.upgrade;
		const unexpectedProperties = findUnexpectedProperties(membershipItemProperties, renderer);
		const unexpectedKeys = [...Object.keys(unexpectedProperties)];
		if (unexpectedKeys.length > 0) {
			console.log("Unexpected keys found in [membershipItemProperties]", unexpectedKeys);
		}

		const parsed: AddMembershipItemAction = {
			type: exportActionTypes.addMembershipItemAction,
			// ...renderer,
			id,
			timestamp,
			timestampText,
			authorName,
			authorPhoto,
			authorChannelId,
			authorBadges,
			color,
			headerSubtext,
			method,
			tier,
			// membership,
			// level,
			...unexpectedProperties,
		};
		return parsed;
	}
}

// Engagement message
export function parseLiveChatViewerEngagementMessageRenderer(
	renderer: YTLiveChatViewerEngagementMessageRenderer,
	backupTimestamp: BackupTimestamp
) {
	/**
	 * YOUTUBE_ROUND: engagement message
	 * POLL: poll result message
	 */

	const { id, timestampUsec } = renderer;
	if (timestampUsec) {
		backupTimestamp.set(timestampUsec);
	}
	if ("simpleText" in renderer.message) {
		debugLog("[action required] message is simpleText (engagement):", JSON.stringify(renderer));
	}
	// I don't know what event causes this specifically but it probably isn't important for our use case
	if ("icon" in renderer === false) {
		return;
	}

	if (renderer.icon && renderer.icon.iconType === "YOUTUBE_ROUND") {
		let timestamp;
		if (timestampUsec) {
			timestamp = tsToNumber(timestampUsec);
		} else {
			timestamp = backupTimestamp.get();
		}
		// const actionUrl = renderer.actionButton?.buttonRenderer.navigationEndpoint.urlEndpoint.url;
		const parsed: AddViewerEngagementMessageAction = {
			type: exportActionTypes.addViewerEngagementMessageAction,
			// ...renderer,
			id,
			timestamp,
			message: stringify(renderer.message),
			// actionUrl,
			// timestampUsec: timestampUsec!,
		};
		return parsed;
	} else if (renderer.icon && renderer.icon.iconType === "POLL") {
		// [{"id":"ChkKF1hTbnRZYzNTQk91R2k5WVA1cDJqd0FV","message":{"runs":[{"text":"生まれは？","bold":true},{"text":"\n"},{"text":"平成 (80%)"},{"text":"\n"},{"text":"昭和 (19%)"},{"text":"\n"},{"text":"\n"},{"text":"Poll complete: 84 votes"}]},"messageType":"poll","type":"addViewerEngagementMessageAction","originVideoId":"1SzuFU7t450","originChannelId":"UC3Z7UaEe_vMoKRz9ABQrI5g"}]
		//  <!> addViewerEngagementMessageAction [{"id":"ChkKF3VDX3RZWS1PQl95QWk5WVBrUGFENkFz","message":{"runs":[{"text":"2 (73%)"},{"text":"\n"},{"text":"4 (26%)"},{"text":"\n"},{"text":"\n"},{"text":"Poll complete: 637 votes"}]},"messageType":"poll","type":"addViewerEngagementMessageAction","originVideoId":"8sne4hKHNeo","originChannelId":"UC2hc-00y-MSR6eYA4eQ4tjQ"}]
		// Poll complete: 637 votes
		// Poll complete: 1.9K votes
		// split runs by {"text": "\n"}
		// has question: {text: "...", "bold": true}, {emoji: ...}
		//               {emoji: ...}, {text: "...", "bold": true}
		// otherwise:    {emoji: ...}, {text: " (\d%)"}

		const runs = (renderer.message as YTRunContainer<YTTextRun>).runs;
		const runsNL = splitRunsByNewLines(runs);
		const hasQuestion = runsNL[0].some((run) => "bold" in run && run.bold == true);
		const question = hasQuestion ? stringify(runsNL[0]) : undefined;
		const total = /: (.+?) vote/.exec(runs[runs.length - 1].text)![1];
		const choiceStart = hasQuestion ? 1 : 0;
		const choices = runsNL.slice(choiceStart, -2).map((choiceRuns) => {
			const last = choiceRuns[choiceRuns.length - 1] as YTTextRun;
			const [lastTextFragment, votePercentage] = /(?:^(.+?))? \((\d+%)\)$/.exec(last.text)!.slice(1);
			const text = choiceRuns;
			if (lastTextFragment) {
				(text[text.length - 1] as YTTextRun).text = lastTextFragment;
			} else {
				text.pop();
			}
			return { text: stringify(text), votePercentage };
		});

		let timestamp;
		if (timestampUsec) {
			timestamp = tsToNumber(timestampUsec);
		} else {
			timestamp = backupTimestamp.get();
		}

		const parsed: AddPollResultAction = {
			type: exportActionTypes.addPollResultAction,
			id,
			timestamp,
			// ...renderer,
			authorName: "Poll Result",
			color: ColorName.poll,
			question,
			total,
			choices,
		};
		return parsed;
	} else {
		debugLog("[action required] unknown icon type (engagement message):", JSON.stringify(renderer));
	}
}

// Placeholder chat
export function parseLiveChatPlaceholderItemRenderer(renderer: YTLiveChatPlaceholderItemRenderer, backupTimestamp: BackupTimestamp) {
	const id = renderer.id;
	const timestampUsec = renderer.timestampUsec;
	backupTimestamp.set(timestampUsec);
	const timestamp = tsToNumber(timestampUsec);

	const parsed: AddPlaceholderItemAction = {
		type: exportActionTypes.addPlaceholderItemAction,
		// ...renderer,
		// isUnknown: true,
		id,
		timestamp,
		// timestampUsec,
	};
	return parsed;
}

// Mode change message
export function parseLiveChatModeChangeMessageRenderer(renderer: YTLiveChatModeChangeMessageRenderer) {
	const text = stringify(renderer.text);
	// const description = stringify(renderer.subtext);

	// let mode = LiveChatMode.Unknown;
	if (/Slow mode/.test(text)) {
		// mode = LiveChatMode.Slow;
	} else if (/Members-only mode/.test(text)) {
		// mode = LiveChatMode.MembersOnly;
	} else if (/subscribers-only/.test(text)) {
		// mode = LiveChatMode.SubscribersOnly;
	} else {
		debugLog("[action required] Unrecognized mode (modeChangeAction):", JSON.stringify(renderer));
	}

	// const enabled = /(is|turned) on/.test(text);

	const parsed: UnknownAction = {
		type: exportActionTypes.modeChangeAction,
		...renderer,
		isUnknown: true,
		// mode,
		// enabled,
		// description,
	};
	return parsed;
}

// Sponsorships gift purchase announcement
export function parseLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer(
	renderer: YTLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer,
	backupTimestamp: BackupTimestamp
) {
	const id = renderer.id;
	/** timestampUsec can be undefined when passed from ticker action */
	const timestampUsec = renderer.timestampUsec;
	const timestamp = timestampUsec ? tsToNumber(timestampUsec) : undefined;
	const authorChannelId = renderer.authorExternalChannelId;
	const timestampText = tsTextToSeconds(renderer.timestampText);

	const header = renderer.header.liveChatSponsorshipsHeaderRenderer;
	const authorName = stringify(header.authorName);
	const authorPhoto = pickThumbUrl(header.authorPhoto);
	const authorBadges = parseBadges(header);
	const channelName = header.primaryText.runs[3].text;
	const amount = parseInt(header.primaryText.runs[1].text, 10);
	const image = header.image.thumbnails[0].url;
	const primaryText = stringify(header.primaryText);

	const unexpectedProperties = findUnexpectedProperties(membershipGiftPurchaseProperties, renderer);
	const unexpectedProperties2 = findUnexpectedProperties(
		membershipGiftPurchaseHeaderProperties,
		renderer.header.liveChatSponsorshipsHeaderRenderer
	);
	const unexpectedKeys1 = Object.keys(unexpectedProperties);
	if (unexpectedKeys1.length > 0) {
		console.log("Unexpected keys found in [membershipGiftPurchaseProperties]", unexpectedKeys1);
	}
	const unexpectedKeys2 = Object.keys(unexpectedProperties2);
	if (unexpectedKeys2.length > 0) {
		console.log("Unexpected keys found in [membershipGiftPurchaseHeaderProperties]", unexpectedKeys2);
	}

	if (!authorName) {
		debugLog("[action required] empty authorName (gift purchase)", JSON.stringify(renderer));
	}

	const membership = parseMembership(header.authorBadges?.[header.authorBadges?.length - 1]);

	if (!membership) {
		// you can send a gift membership without being a member
		// debugLog("[action required] empty membership (gift purchase)", JSON.stringify(renderer));
	}

	if (!timestampUsec || !timestamp) {
		const unexpectedProperties = findUnexpectedProperties(membershipGiftPurchaseTickerProperties, renderer);
		const unexpectedProperties2 = findUnexpectedProperties(
			membershipGiftPurchaseTickerHeaderProperties,
			renderer.header.liveChatSponsorshipsHeaderRenderer
		);
		const unexpectedKeys1 = Object.keys(unexpectedProperties);
		const unexpectedKeys2 = Object.keys(unexpectedProperties2);
		if (unexpectedKeys1.length > 0) {
			console.log("Unexpected keys found in [membershipGiftPurchaseTickerProperties]", unexpectedKeys1);
		}
		if (unexpectedKeys2.length > 0) {
			console.log("Unexpected keys found in [membershipGiftPurchaseTickerHeaderProperties]", unexpectedKeys2);
		}
		const timestamp = backupTimestamp.get();
		const tickerContent: MembershipGiftPurchaseTickerAction = {
			type: exportActionTypes.membershipGiftPurchaseTickerAction,
			id,
			timestamp,
			timestampText,
			authorName,
			authorPhoto,
			authorChannelId,
			authorBadges,
			color: ColorName.gift,
			primaryText,
			channelName,
			amount,
			// membership,
			image,
			...unexpectedProperties,
			...unexpectedProperties2,
			// ...renderer,
			// id,
			// channelName,
			// amount,
			// membership,
			// authorName,
			// authorChannelId,
			// authorPhoto,
			// image,
		};
		return tickerContent;
	}
	backupTimestamp.set(timestampUsec);
	const parsed: MembershipGiftPurchaseAction = {
		type: exportActionTypes.membershipGiftPurchaseAction,
		// ...renderer,
		id,
		timestamp,
		timestampText,
		authorName,
		authorPhoto,
		authorChannelId,
		authorBadges,
		color: ColorName.gift,
		// timestampUsec,
		primaryText,
		channelName,
		amount,
		// membership,
		image,
		...unexpectedProperties,
		...unexpectedProperties2,
	};
	return parsed;
}

// Sponsorships gift redemption announcement
export function parseLiveChatSponsorshipsGiftRedemptionAnnouncementRenderer(
	renderer: YTLiveChatSponsorshipsGiftRedemptionAnnouncementRenderer,
	backupTimestamp: BackupTimestamp
) {
	const id = renderer.id;
	const timestampUsec = renderer.timestampUsec;
	backupTimestamp.set(timestampUsec);
	const timestamp = tsToNumber(timestampUsec);
	const timestampText = tsTextToSeconds(renderer.timestampText);
	const authorChannelId = renderer.authorExternalChannelId;

	const authorName = stringify(renderer.authorName);
	const authorPhoto = pickThumbUrl(renderer.authorPhoto);
	const senderName = renderer.message.runs[1].text;
	const message = stringify(renderer.message);
	const authorBadges = parseBadges(renderer);

	if (!authorName) {
		debugLog("[action required] empty authorName (gift redemption)", JSON.stringify(renderer));
	}

	const parsed: MembershipGiftRedemptionAction = {
		type: exportActionTypes.membershipGiftRedemptionAction,
		// ...renderer,
		id,
		timestamp,
		timestampText,
		authorName,
		authorPhoto,
		authorChannelId,
		authorBadges,
		color: ColorName.join,
		senderName,
		message,
	};
	return parsed;
}

// Moderation message
export function parseLiveChatModerationMessageRenderer(renderer: YTLiveChatModerationMessageRenderer, backupTimestamp: BackupTimestamp) {
	// const id = renderer.id;
	const timestampUsec = renderer.timestampUsec;
	backupTimestamp.set(timestampUsec);
	// const timestamp = tsToNumber(timestampUsec);

	// const message = renderer.message.runs;

	const parsed: UnknownAction = {
		type: exportActionTypes.moderationMessageAction,
		...renderer,
		isUnknown: true,
		// id,
		// timestamp,
		// timestampUsec,
		// message,
	};
	return parsed;
}
