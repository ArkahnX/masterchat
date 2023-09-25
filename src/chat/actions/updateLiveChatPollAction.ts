import { exportActionTypes, ColorName } from "../../interfaces";
import { UpdatePollAction } from "../../interfaces/Superchats/actions";
import { Choice } from "../../interfaces/Superchats/updatePollAction";
import { YTUpdateLiveChatPollAction } from "../../interfaces/yt/chat";
import { stringify, tsToNumber } from "../../utils";
import { BackupTimestamp, findUnexpectedProperties, pickThumbUrl } from "../utils";
import { updatePollHeaderProperties, updatePollProperties } from "./properties";

export function parseUpdateLiveChatPollAction(payload: YTUpdateLiveChatPollAction, backupTimestamp: BackupTimestamp) {
	const renderer = payload.pollToUpdate.pollRenderer;
	const header = renderer.header.pollHeaderRenderer;

	// "runs": [
	//   { "text": "朝陽にいな / Nina Ch." },
	//   { "text": " • " },
	//   { "text": "just now" },
	//   { "text": " • " },
	//   { "text": "23 votes" }
	// ]
	const meta = header.metadataText.runs;
	const authorName = meta[0].text;
	const elapsedText = meta[2].text;
	const voteCount = parseInt(meta[4].text, 10);
	const choices: Choice[] = [];
	const timestamp = backupTimestamp.get();
	for (const choice of renderer.choices) {
		choices.push({
			text: stringify(choice.text),
			voteRatio: choice.voteRatio,
			votePercentage: choice.votePercentage?.simpleText,
		});
	}

	const unexpectedProperties = findUnexpectedProperties(updatePollProperties, renderer);
	const unexpectedProperties2 = findUnexpectedProperties(updatePollHeaderProperties, header);
	const unexpectedKeys1 = Object.keys(unexpectedProperties);
	const unexpectedKeys2 = Object.keys(unexpectedProperties2);
	if(unexpectedKeys1.length > 0) {
		console.log("Unexpected keys found in [updatePollProperties]",unexpectedKeys1);
	}
	if(unexpectedKeys2.length > 0) {
		console.log("Unexpected keys found in [updatePollHeaderProperties]",unexpectedKeys2);
	}

	const parsed: UpdatePollAction = {
		type: exportActionTypes.updatePollAction,
		// ...renderer,
		id: renderer.liveChatPollId,
		timestamp,
		authorName,
		authorPhoto: pickThumbUrl(header.thumbnail),
		color:ColorName.poll,
		question: header.pollQuestion?.simpleText,
		choices: choices,
		elapsedText,
		voteCount,
		pollType: header.liveChatPollType,
		...unexpectedProperties,
		...unexpectedProperties2,
	};

	return parsed;
}
