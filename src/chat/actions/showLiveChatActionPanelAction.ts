import { ColorName } from "../../interfaces";
import { exportActionTypes, ShowPanelAction, ShowPollPanelAction } from "../../interfaces/actions";
import { YTLiveChatPollRenderer, YTShowLiveChatActionPanelAction } from "../../interfaces/yt/chat";
import { debugLog } from "../../utils";
import { BackupTimestamp, pickThumbUrl } from "../utils";

export function parseShowLiveChatActionPanelAction(payload: YTShowLiveChatActionPanelAction, backupTimestamp: BackupTimestamp) {
	const panelRdr = payload.panelToShow.liveChatActionPanelRenderer;
	const rendererType = Object.keys(panelRdr.contents)[0];
	switch (rendererType) {
		case "pollRenderer": {
			const rdr = panelRdr.contents.pollRenderer as YTLiveChatPollRenderer;
			const authorName = rdr.header.pollHeaderRenderer.metadataText.runs[0].text;

			const parsed: ShowPollPanelAction = {
				type: exportActionTypes.showPollPanelAction,
				// ...rdr,
				targetId: panelRdr.targetId,
				id: panelRdr.id,
				color:ColorName.poll,
				choices: rdr.choices,
				question: rdr.header.pollHeaderRenderer.pollQuestion?.simpleText,
				authorName,
				authorPhoto: pickThumbUrl(rdr.header.pollHeaderRenderer.thumbnail),
				pollType: rdr.header.pollHeaderRenderer.liveChatPollType,
			};

			return parsed;
		}
		default: {
			debugLog("[action required] unrecognized rendererType (parseShowLiveChatActionPanelAction):", JSON.stringify(payload));
		}
	}

	const parsed: ShowPanelAction = {
		type: exportActionTypes.showPanelAction,
		panelToShow: payload.panelToShow,
	};
	return parsed;
}
