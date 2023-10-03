import { stringify } from "../utils";
import { YTLiveChatPaidMessageRenderer, YTLiveChatPaidStickerRenderer } from "../interfaces/yt/chat";
import { parseColorCode, pickThumbUrl } from "./utils";
import { ColorName } from "../interfaces";

const AMOUNT_REGEXP = /[\d.,]+/;

const SYMBOL_TO_TLS_MAP: Record<string, string> = {
	$: "USD",
	"£": "GBP",
	"¥": "JPY",
	"￥": "JPY",
	"JP¥": "JPY",
	"₩": "KRW",
	"￦": "KRW",
	"₪": "ILS",
	"€": "EUR",
	"₱": "PHP",
	"₹": "INR",
	A$: "AUD",
	CA$: "CAD",
	HK$: "HKD",
	MX$: "MXN",
	NT$: "TWD",
	NZ$: "NZD",
	R$: "BRL",
};

export function toTLS(symbolOrTls: string): string {
	return SYMBOL_TO_TLS_MAP[symbolOrTls] ?? symbolOrTls;
}

export function parseAmountText(purchaseAmountText: string) {
	const input = stringify(purchaseAmountText);
	const result = AMOUNT_REGEXP.exec(input);
	const currency = toTLS(input.replace(AMOUNT_REGEXP, "").trim());
	if (result) {
		const amountString = result[0].replace(/,/g, "");

		const amount = parseFloat(amountString);
		return { amount, currency };
	}
	const amount = 0;
	return { amount, currency };
}

export function parseSuperChat(renderer: YTLiveChatPaidMessageRenderer | YTLiveChatPaidStickerRenderer) {
	let creatorHeart, overlayImage, overlayText;
	// color = SUPERCHAT_COLOR_MAP[renderer.headerBackgroundColor.toString() as keyof typeof SUPERCHAT_COLOR_MAP];
	// significance = SUPERCHAT_SIGNIFICANCE_MAP[color];
	const text = stringify(renderer.purchaseAmountText);
	const data = parseAmountText(renderer.purchaseAmountText.simpleText);
	const currency = data.currency;
	const amount = data.amount;
	if ("creatorHeartButton" in renderer && renderer.creatorHeartButton) {
		if ("loggingDirectives" in renderer.creatorHeartButton.creatorHeartViewModel) {
			creatorHeart = true;
		}
	}

	if ("lowerBumper" in renderer && renderer.lowerBumper) {
		if ("text" in renderer.lowerBumper.liveChatItemBumperViewModel.content.bumperUserEduContentViewModel) {
			overlayText = renderer.lowerBumper.liveChatItemBumperViewModel.content.bumperUserEduContentViewModel.text.content;
		}
	}

	if ("headerOverlayImage" in renderer && renderer.headerOverlayImage) {
		overlayImage = pickThumbUrl(renderer.headerOverlayImage);
	}

	return {
		money: { text, currency, amount },
		creatorHeart,
		overlayText,
		overlayImage,
		// color,
		// significance,
		// authorNameTextColor: parseColorCode(renderer.authorNameTextColor),
		// timestampColor: parseColorCode(renderer.timestampColor),
		// headerBackgroundColor: parseColorCode(renderer.headerBackgroundColor),
		// headerTextColor: parseColorCode(renderer.headerTextColor),
		// bodyBackgroundColor: parseColorCode(renderer.bodyBackgroundColor),
		// bodyTextColor: parseColorCode(renderer.bodyTextColor),
	};
}

export function getColor(renderer: YTLiveChatPaidMessageRenderer | YTLiveChatPaidStickerRenderer) {
	const colorTable: Record<string, ColorName> = {
		"#e62117ff": ColorName.red,
		"#e91e63ff": ColorName.pink,
		"#f57c00ff": ColorName.orange,
		"#ffca28ff": ColorName.yellow,
		"#1de9b6ff": ColorName.green,
		"#00e5ffff": ColorName.lightblue,
		"#1e88e5ff": ColorName.blue,
		"#1565c0ff": ColorName.blue,
	};

	if ("bodyBackgroundColor" in renderer && renderer.bodyBackgroundColor) {
		const color = parseColorCode(renderer.bodyBackgroundColor);
		if (color in colorTable) {
			return colorTable[color];
		} else {
			console.error(`Color not in colortable [${color}] bodyBackgroundColor`);
		}
	}
	if ("moneyChipBackgroundColor" in renderer && renderer.moneyChipBackgroundColor) {
		const color = parseColorCode(renderer.moneyChipBackgroundColor);
		if (color in colorTable) {
			return colorTable[color];
		} else {
			console.error(`Color not in colortable [${color}] moneyChipBackgroundColor`);
		}
	}
	if ("headerBackgroundColor" in renderer && renderer.headerBackgroundColor) {
		const color = parseColorCode(renderer.headerBackgroundColor);
		if (color in colorTable) {
			return colorTable[color];
		} else {
			console.error(`Color not in colortable [${color}] headerBackgroundColor`);
		}
	}
	if ("backgroundColor" in renderer && renderer.backgroundColor) {
		const color = parseColorCode(renderer.backgroundColor);
		if (color in colorTable) {
			return colorTable[color];
		} else {
			console.error(`Color not in colortable [${color}] backgroundColor`);
		}
	}
	console.error("Undiscovered superchat color",JSON.stringify(renderer));
	return ColorName.chat;
}
