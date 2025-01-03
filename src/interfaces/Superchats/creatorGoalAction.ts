import { exportActionTypes } from "../actions";
import { ColorName } from "../misc";

export interface CreatorGoalAction {
	type: exportActionTypes.creatorGoalAction;
	currentGoalCount: number;
	totalGoalCount: number;
	endTimestampMs: number;
	timestamp: number;
	authorPhoto: string;
	color:ColorName;
	superChatTierImage: string;
	goalDescription: string;
	goalTargetText: string;
	goalHeadlineText: string;
	goalSubheaderText?: string;
	goalHeaderBackgroundImage?: string;
}