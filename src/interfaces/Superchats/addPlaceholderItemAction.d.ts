import { exportActionTypes } from "../actions";

export interface AddPlaceholderItemAction {
	type: exportActionTypes.addPlaceholderItemAction;
	id:             string;
    timestamp:  number;
    // icon:           string;
    // message:        Message;
    // actionButton:   ActionButton;
    // trackingParams: string;
}
