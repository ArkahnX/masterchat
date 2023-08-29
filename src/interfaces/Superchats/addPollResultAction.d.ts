import { ItemActionTypes } from "../actions";
import { AuthorBadges } from "./common";

export interface AddPollResultAction {
	type: ItemActionTypes.addPollResultAction;
	id: string;
	question: string;
	total: string;
	choices: Choice[];
}

export interface Choice {
	text: string;
	votePercentage: string;
}
