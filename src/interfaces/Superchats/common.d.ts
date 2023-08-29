export interface AuthorBadges {
	verified?: boolean;
	owner?: boolean;
	moderator?: boolean;
	thumbnail?: string;
	duration?: string;
	hololive?: boolean;
}

export interface Emote {
    id: string,
    image: string;
}

export interface Money {
	text: string;
	amount: number;
	currency: string;
}