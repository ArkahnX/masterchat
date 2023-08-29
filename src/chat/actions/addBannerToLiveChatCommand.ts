import { unknown } from "..";
import { ColorName } from "../../interfaces";
import { AddBannerAction, AddIncomingRaidBannerAction, AddOutgoingRaidBannerAction } from "../../interfaces/Superchats/actions";
import { ItemActionTypes, AddProductBannerAction, exportActionTypes } from "../../interfaces/actions";
import { YTAddBannerToLiveChatCommand } from "../../interfaces/yt/chat";
import { debugLog, endpointToUrl, getEmojis, stringify, tsTextToSeconds, tsToNumber } from "../../utils";
import { parseBadges } from "../badge";
import { BackupTimestamp, pickThumbUrl } from "../utils";

export function parseAddBannerToLiveChatCommand(payload: YTAddBannerToLiveChatCommand, backupTimestamp: BackupTimestamp) {
	// add pinned item
	const bannerRdr = payload["bannerRenderer"]["liveChatBannerRenderer"];
	if (bannerRdr.header && bannerRdr.header.liveChatBannerHeaderRenderer.icon.iconType !== "KEEP") {
		debugLog("[action required] Unknown icon type (addBannerToLiveChatCommand)", JSON.stringify(bannerRdr.header));
	}
	
	// banner
	const actionId = bannerRdr.actionId;
	const targetId = bannerRdr.targetId;
	const viewerIsCreator = bannerRdr.viewerIsCreator;
	const isStackable = bannerRdr.isStackable;
	
	// contents
	const contents = bannerRdr.contents;
	
	if ("liveChatTextMessageRenderer" in contents) {
		const renderer = contents.liveChatTextMessageRenderer;
		const id = renderer.id;
		const message = stringify(renderer.message.runs);
		const emotes = getEmojis(renderer.message.runs);
		const timestampUsec = renderer.timestampUsec;
		backupTimestamp.set(timestampUsec);
		const timestamp = tsToNumber(timestampUsec);
		const authorName = stringify(renderer.authorName);
		const authorPhoto = pickThumbUrl(renderer.authorPhoto);
		const authorChannelId = renderer.authorExternalChannelId;
		const authorBadges = parseBadges(renderer);
		const timestampText = tsTextToSeconds(renderer.timestampText);

		// header
		const header = bannerRdr.header?.liveChatBannerHeaderRenderer;
		const title = (header && stringify(header.text.runs)) || undefined;

		if (!authorName) {
			debugLog("[action required] Empty authorName found at addBannerToLiveChatCommand", JSON.stringify(renderer));
		}

		const parsed: AddBannerAction = {
			type: exportActionTypes.addBannerAction,
			id,
			timestamp,
			timestampText,
			authorName,
			authorPhoto,
			authorChannelId,
			authorBadges,
			title,
			message,
			emotes,
			// ...bannerRdr
			// actionId,
			// targetId,
			// id,
			// title,
			// message,
			// timestampUsec,
			// timestamp,
			// authorName,
			// authorPhoto,
			// authorChannelId,
			// isVerified,
			// isOwner,
			// isModerator,
			// membership,
			// viewerIsCreator,
			// contextMenuEndpointParams: rdr.contextMenuEndpoint?.liveChatItemContextMenuEndpoint.params,
		};
		return parsed;
	} else if ("liveChatBannerRedirectRenderer" in contents) {
		const renderer = contents.liveChatBannerRedirectRenderer;
		const videoId =
			"watchEndpoint" in renderer.inlineActionButton.buttonRenderer.command
				? renderer.inlineActionButton.buttonRenderer.command.watchEndpoint.videoId
				: undefined;

		const authorPhoto = pickThumbUrl(renderer.authorPhoto);

		if (videoId) {
			// Outgoing
			const timestamp = backupTimestamp.get();
			const authorName = renderer.bannerMessage.runs[1].text;
			const payload: AddOutgoingRaidBannerAction = {
				type: exportActionTypes.addOutgoingRaidBannerAction,
				id: bannerRdr.actionId,
				timestamp,
				authorName,
				authorPhoto,
				color:ColorName.raid,
				videoId,
				// ...bannerRdr
				// actionId,
				// targetId,
			};
			return payload;
		} else {
			// Incoming
			const timestamp = backupTimestamp.get();
			const authorName = renderer.bannerMessage.runs[0].text;
			const payload: AddIncomingRaidBannerAction = {
				type: exportActionTypes.addIncomingRaidBannerAction,
				id: bannerRdr.actionId,
				timestamp,
				authorName,
				authorPhoto,
				color:ColorName.raid,
				// ...bannerRdr
				// actionId,
				// targetId,
			};
			return payload;
		}
	} else if ("liveChatProductItemRenderer" in contents) {
		const timestamp = backupTimestamp.get();
		const renderer = contents.liveChatProductItemRenderer;
		const title = renderer.title;
		const description = renderer.accessibilityTitle;
		const thumbnail = renderer.thumbnail.thumbnails[0].url;
		const price = renderer.price;
		const vendorName = renderer.vendorName;
		const creatorMessage = renderer.creatorMessage;
		const creatorName = renderer.creatorName;
		const authorPhoto = pickThumbUrl(renderer.authorPhoto);
		const url = endpointToUrl(renderer.onClickCommand);
		if (!url) {
			debugLog(`Empty url at liveChatProductItemRenderer: ${JSON.stringify(renderer)}`);
		}
		const dialogMessage = renderer.informationDialog.liveChatDialogRenderer.dialogMessages;
		const isVerified = renderer.isVerified;
		const payload: AddProductBannerAction = {
			type: exportActionTypes.addProductBannerAction,
			id: actionId,
			targetId,
			timestamp,
			creatorName,
			authorPhoto,
			creatorMessage,
			title,
			description,
			dialogMessage,
			vendorName,
			// ...bannerRdr
			thumbnail,
			price,
			url,
			isStackable,
			viewerIsCreator,
			isVerified,
		};
		return payload;
	} else if ("liveChatCallForQuestionsRenderer" in contents) {
		debugLog("[TODO, action required] implement liveChatCallForQuestionsRenderer in parseAddBannerToLiveChatCommand");
		/*
     [action required] Unrecognized content type found in parseAddBannerToLiveChatCommand: {"bannerRenderer":{"liveChatBannerRenderer":{"contents":{"liveChatCallForQuestionsRenderer":{"creatorAvatar":{"thumbnails":[{"url":"https://yt4.ggpht.com/hI-shJC2UnZcXRsZjKAPHXfEabW3KpiyeTtHTu1lkDvuwyJHYX4daHJ1g7nMW75Y-D36ba7EB3o=s32-c-k-c0x00ffffff-no-rj","width":32,"height":32},{"url":"https://yt4.ggpht.com/hI-shJC2UnZcXRsZjKAPHXfEabW3KpiyeTtHTu1lkDvuwyJHYX4daHJ1g7nMW75Y-D36ba7EB3o=s64-c-k-c0x00ffffff-no-rj","width":64,"height":64}]},"featureLabel":{"simpleText":"Q&A"},"contentSeparator":{"simpleText":"·"},"overflowMenuButton":{"buttonRenderer":{"icon":{"iconType":"MORE_VERT"},"accessibility":{"label":"Chat actions"},"trackingParams":"CAcQ8FsiEwiqrZ3ytIn8AhXBDX0KHZ3kALE=","accessibilityData":{"accessibilityData":{"label":"Chat actions"}},"command":{"clickTrackingParams":"CAcQ8FsiEwiqrZ3ytIn8AhXBDX0KHZ3kALE=","commandMetadata":{"webCommandMetadata":{"ignoreNavigation":true}},"liveChatItemContextMenuEndpoint":{"params":"Q2g0S0hBb2FRMGt0YlRGUE5qQnBabmREUmxkWlNISlJXV1EwT0ZGSVRXY2FLU29uQ2hoVlEyYzNjMWN0YURGUVZXOTNaR2xTTlVzMFNHeENaWGNTQzNsRmVVbGxMVXBPWkVkM0lBRW9BVElhQ2hoVlEyYzNjMWN0YURGUVZXOTNaR2xTTlVzMFNHeENaWGM0QVVnQVVCNCUzRA=="}}}},"creatorAuthorName":{"simpleText":"Lia Ch. 鈴香アシェリア 【Phase Connect】"},"questionMessage":{"runs":[{"text":"ASK"}]}}},"actionId":"ChwKGkNJLW0xTzYwaWZ3Q0ZXWUhyUVlkNDhRSE1n","viewerIsCreator":false,"targetId":"live-chat-banner","onCollapseCommand":{"clickTrackingParams":"CAEQl98BIhMIqq2d8rSJ_AIVwQ19Ch2d5ACx","elementsCommand":{"setEntityCommand":{"identifier":"EihDaHdLR2tOSkxXMHhUell3YVdaM1EwWlhXVWh5VVZsa05EaFJTRTFuIIsBKAE%3D","entity":"CkJFaWhEYUhkTFIydE9Ta3hYTUhoVWVsbDNZVmRhTTFFd1dsaFhWV2g1VlZac2EwNUVhRkpUUlRGdUlJc0JLQUUlM0QQAQ=="}}},"onExpandCommand":{"clickTrackingParams":"CAEQl98BIhMIqq2d8rSJ_AIVwQ19Ch2d5ACx","elementsCommand":{"setEntityCommand":{"identifier":"EihDaHdLR2tOSkxXMHhUell3YVdaM1EwWlhXVWh5VVZsa05EaFJTRTFuIIsBKAE%3D","entity":"CkJFaWhEYUhkTFIydE9Ta3hYTUhoVWVsbDNZVmRhTTFFd1dsaFhWV2g1VlZac2EwNUVhRkpUUlRGdUlJc0JLQUUlM0QQAA=="}}},"isStackable":true}}}
    */
		return unknown(payload);
	} else {
		debugLog(`[action required] Unrecognized content type found in parseAddBannerToLiveChatCommand: ${JSON.stringify(payload)}`);
		return unknown(payload);
	}
}
