import { exportActionTypes } from "../actions";
import { ColorName } from "../misc";

export interface UpdatePollAction {
	type: exportActionTypes.updatePollAction;
	choices:        Choice[];
    id: string;
    // header:         Header;
    timestamp: number;
	question?:      string;
    color:ColorName.poll;
	authorName: string;
	authorPhoto: string;
	elapsedText: string;
	voteCount: number;
    // thumbnail:         ThumbnailContainer;
    // metadataText:      RunContainer;
    pollType:  string;
    // contextMenuButton: ContextMenuButton;
}

export interface Choice {
    text:                  string;
    // selected:              boolean;
    voteRatio?:             number;
    votePercentage?:        string;
    // selectServiceEndpoint: SelectServiceEndpoint;
}