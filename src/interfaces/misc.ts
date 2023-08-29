export const SUPERCHAT_SIGNIFICANCE_MAP = {
	blue: 1,
	lightblue: 2,
	green: 3,
	yellow: 4,
	orange: 5,
	magenta: 6,
	red: 7,
} as const;
/**
 * Map from headerBackgroundColor to color name
 */

export enum ColorName {
	red = "red",
	pink = "pink",
	orange = "orange",
	yellow = "yellow",
	green = "green",
	lightblue = "lightblue",
	blue = "blue",
	message = "message",
	gift = "gift",
	join = "join",
	upgrade = "upgrade",
	chat = "chat",
	poll = "poll",
	raid = "raid",
}

export const SUPERCHAT_COLOR_MAP = {
	"4279592384": "blue",
	"4278237396": "lightblue",
	"4278239141": "green",
	"4294947584": "yellow",
	"4293284096": "orange",
	"4290910299": "magenta",
	"4291821568": "red",
} as const;
/**
 * Components
 */

export type SuperChatSignificance = (typeof SUPERCHAT_SIGNIFICANCE_MAP)[keyof typeof SUPERCHAT_SIGNIFICANCE_MAP];

export type SuperChatColor = (typeof SUPERCHAT_COLOR_MAP)[keyof typeof SUPERCHAT_COLOR_MAP];

export interface SuperChat {
	text: string;
	amount: number;
	currency: string;
	color: SuperChatColor;
	significance: SuperChatSignificance;
	authorNameTextColor: string;
	timestampColor: string;
	headerBackgroundColor: string;
	headerTextColor: string;
	bodyBackgroundColor: string;
	bodyTextColor: string;
}

export interface Membership {
	status: string;
	since?: string;
	thumbnail: string;
}
/**
 * 0 - 255
 */

export interface Color {
	r: number;
	g: number;
	b: number;
	opacity: number;
}

/**
 * Continuation
 */

export interface ReloadContinuation {
	token: string;
}

export interface TimedContinuation extends ReloadContinuation {
	timeoutMs: number;
}
