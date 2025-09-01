import { AreaComp, GameObj, ScaleComp } from "kaplay";
import { ngEnabled, ngUser } from "../../newgrounds";
import { positionSetter } from "../plugins/positionSetter";
import { playSfx } from "../../sound";
import { hoverController } from "../../hoverManaging";
import { WindowGameObj } from "./windows-api/windowManaging";
import { capitalizeFirstLetter, getPosInGrid } from "../utils";

const defFontSize = 36;

const allCredits = {
	"code": "https://amyspark-ng.newgrounds.com",
	"art": "https://devkyRD.newgrounds.com",
	"playtest": "https://Khriz28.newgrounds.com",
	"design": "https://lajbel.newgrounds.com",
	"desktop": "https://EliCardoso.newgrounds.com",
	"shader": null,
};

function openURL(url: string) {
	window.open(url, "_blank").focus();
}

function dummyHoverAnims(theObj: GameObj<AreaComp | ScaleComp>) {
	theObj.onHover(() => {
		tween(theObj.scale, vec2(1.05), 0.15, (p) => theObj.scale = p, easings.easeOutQuad);
	});

	theObj.onHoverEnd(() => {
		tween(theObj.scale, vec2(1), 0.15, (p) => theObj.scale = p, easings.easeOutQuad);
	});
}

export function makeCredit(theCredit: keyof typeof allCredits) {
	let creditObj = make([
		sprite(`credits${capitalizeFirstLetter(theCredit)}`),
		pos(),
		area(),
		hoverController(),
		scale(),
		anchor("center"),
		"ignoregrab",
	]);

	if (allCredits[theCredit] == null) {
		creditObj.unuse("hover");
	}
	else {
		creditObj.onClick(() => {
			openURL(allCredits[theCredit]);
			playSfx("clickButton", { detune: rand(0, 50) });
		});

		dummyHoverAnims(creditObj);
	}

	return creditObj;
}

export async function creditsWinContent(winParent: WindowGameObj) {
	winParent.add([
		pos(0, -160),
		text("Clickery Hexagon was made\nby these awesome people", { align: "center", size: defFontSize }),
		anchor("center"),
	]);

	Object.keys(allCredits).forEach((key, index) => {
		const madeCredit = makeCredit(key as keyof typeof allCredits);
		const creditobj = winParent.add(madeCredit);
		let row = Math.floor(index / 3);
		let column = index % 3;

		const thePos = getPosInGrid(vec2(-100, -55), row, column, vec2(100, 125));
		creditobj.pos = thePos;
	});

	let specialCredits = winParent.add([
		text("Enysmo, Candy&Carmel, OliverIsHere\nGGBot, WebadaZzz", { align: "center", size: 30 }),
		pos(0, 170),
		anchor("center"),
		area(),
		scale(),
		hoverController(),
	]);

	dummyHoverAnims(specialCredits);
	specialCredits.onClick(() => {
		openURL("https://github.com/amyspark-ng/clickery-hexagon-dev?tab=readme-ov-file#extra--special-thanks");
		playSfx("clickButton", { detune: rand(0, 50) });
	});

	let playerCredit = winParent.add([
		text("And you", { align: "center", size: 38 }),
		pos(-20, 228),
		scale(),
		anchor("center"),
		area(),
	]);

	let creditsHeart = winParent.add([
		sprite("creditsHeart"),
		pos(62, playerCredit.pos.y),
		scale(),
		anchor("center"),
	]);

	// ngUser exists, is logged in
	if (ngUser != null) {
		playerCredit.use(hoverController());
		playerCredit.onClick(() => {
			openURL(`https://${ngUser.name}.newgrounds.com`);
			playSfx("clickButton", { detune: rand(30, 70) });
		});

		playerCredit.onHover(() => {
			tween(playerCredit.scale, vec2(1.05), 0.15, (p) => playerCredit.scale = p, easings.easeOutQuad);
			tween(creditsHeart.scale, vec2(1.05), 0.15, (p) => creditsHeart.scale = p, easings.easeOutQuad);
		});

		playerCredit.onHoverEnd(() => {
			tween(playerCredit.scale, vec2(1), 0.15, (p) => playerCredit.scale = p, easings.easeOutQuad);
			tween(creditsHeart.scale, vec2(1), 0.15, (p) => creditsHeart.scale = p, easings.easeOutQuad);
		});
	}
}
