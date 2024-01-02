import { exportActionTypes } from "../actions";
import { AuthorBadges, Emote } from "./common";

export interface addPollBannerAction {
	type: exportActionTypes.addPollBannerAction;
	id: string;
	timestamp: number;
	authorPhoto: string;
	color: ColorName.poll;
	question: string;
	choices: string[];
}
