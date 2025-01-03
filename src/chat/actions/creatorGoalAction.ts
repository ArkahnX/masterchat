import { ColorName, exportActionTypes } from "../../interfaces";
import { CreatorGoalAction } from "../../interfaces/Superchats/creatorGoalAction";
import { CreatorGoalEntity } from "../../interfaces/yt/context";
import { stringify } from "../../utils";
import { pickThumbUrl } from "../utils";

export function parseCreatorGoalAction(payload: CreatorGoalEntity|undefined) {
	if(!payload) return undefined;
	const action: CreatorGoalAction = {
		type: exportActionTypes.creatorGoalAction,
		currentGoalCount: parseInt(payload.currentGoalCount),
		totalGoalCount: parseInt(payload.totalGoalCount),
		endTimestampMs: parseInt(payload.endTimestampMs),
		timestamp: parseInt(payload.serverTimestampMs),
		authorPhoto: pickThumbUrl(payload.authorPhoto),
		color: ColorName.goal,
		superChatTierImage: pickThumbUrl(payload.superChatTierImage),
		goalDescription: stringify(payload.goalDescription),
		goalTargetText: stringify(payload.goalTargetText),
		goalHeadlineText: stringify(payload.goalHeadlineText),
	};
	if("goalHeaderBackgroundImage" in payload && payload.goalHeaderBackgroundImage) {
		action.goalHeaderBackgroundImage = pickThumbUrl(payload.goalHeaderBackgroundImage);
	}
	if("goalSubheaderText" in payload && payload.goalSubheaderText) {
		action.goalSubheaderText = stringify(payload.goalSubheaderText);
	}
	return action;
}
