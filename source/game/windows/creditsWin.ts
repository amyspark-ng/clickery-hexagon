import { AreaComp, GameObj, ScaleComp } from "kaplay"
import { ngEnabled, ngUser } from "../../newgrounds"
import { positionSetter } from "../plugins/positionSetter";
import { insideWindowHover } from "../hovers/insideWindowHover";
import { playSfx } from "../../sound";

const defFontSize = 36

const allCredits = {
	"code": "https://amyspark-ng.newgrounds.com",
	"art": "https://devkyRD.newgrounds.com",
	"design": "https://lajbel.newgrounds.com",
	"shader": null,
	"playtest": "https://Khriz28.newgrounds.com",
	"desktop": "https://EliCardoso.newgrounds.com",
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function openURL(url:string) {
	window.open(url, '_blank').focus();
}

function dummyHoverAnims(theObj:GameObj) {
	theObj.startingHover(() => {
		tween(theObj.scale, vec2(1.05), 0.15, (p) => theObj.scale = p, easings.easeOutQuad)
	})

	theObj.endingHover(() => {
		tween(theObj.scale, vec2(1), 0.15, (p) => theObj.scale = p, easings.easeOutQuad)
	})
}

export function makeCredit(theCredit:keyof typeof allCredits, parent:GameObj) {
	
	let creditObj = make([
		sprite(`credits${capitalizeFirstLetter(theCredit)}`),
		pos(),
		area(),
		insideWindowHover(parent),
		scale(),
		anchor("center"),
	])

	if (allCredits[theCredit] != null) {
		creditObj.onPressClick( () => {
			openURL(allCredits[theCredit])
			playSfx("clickButton", { detune: rand(0, 50) })
		})

		dummyHoverAnims(creditObj)
	}

	return creditObj;
}

export async function creditsWinContent(winParent:GameObj) {
	winParent.add([
		pos(0, -160),
		text("Clickery Hexagon was made\nby these awesome people", { align: "center", size: defFontSize }),
		anchor("center"),
	])
	
	// #region first column
	const firstColumnX = -85
	let codeCredit = winParent.add(makeCredit("code", winParent))
	codeCredit.pos = vec2(firstColumnX, -70)

	let designCredit = winParent.add(makeCredit("design", winParent))
	designCredit.pos = vec2(firstColumnX, 14)

	let playtestCredit = winParent.add(makeCredit("playtest", winParent))
	playtestCredit.pos = vec2(firstColumnX, 88)
	// #endregion

	// #region second column
	const secondColumnX = 85
	let artCredit = winParent.add(makeCredit("art", winParent))
	artCredit.pos = vec2(secondColumnX, -70)

	let shaderCredit = winParent.add(makeCredit("shader", winParent))
	shaderCredit.pos = vec2(secondColumnX, 14)

	let desktopCredit = winParent.add(makeCredit("desktop", winParent))
	desktopCredit.pos = vec2(secondColumnX, 88)
	// #endregion

	let specialCredits = winParent.add([
		text("Enysmo, Candy&Carmel, OliverIsHere\nGGBot, WebadaZzz", { align: "center", size: 30 }),
		pos(0, 170),
		anchor("center"),
		area(),
		scale(),
		insideWindowHover(winParent),
	])

	dummyHoverAnims(specialCredits)
	specialCredits.onPressClick(() => {
		openURL("https://github.com/amyspark-ng/clickery-hexagon-dev?tab=readme-ov-file#extra--special-thanks")
		playSfx("clickButton", { detune: rand(0, 50) })
	})

	let playerCredit = winParent.add([
		text("And you", { align: "center", size: 38 }),
		pos(-20, 228),
		scale(),
		anchor("center"),
		area(),
		insideWindowHover(winParent),
	])

	let creditsHeart = winParent.add([
		sprite("creditsHeart"),
		pos(62, playerCredit.pos.y),
		scale(),
		anchor("center"),
	])

	if (ngUser != null) {
		playerCredit.onPressClick(() => {
			openURL(`https://${ngUser.name}.newgrounds.com`)
			playSfx("clickButton", { detune: rand(30, 70) })
		})

		playerCredit.startingHover(() => {
			tween(playerCredit.scale, vec2(1.05), 0.15, (p) => playerCredit.scale = p, easings.easeOutQuad)
			tween(creditsHeart.scale, vec2(1.05), 0.15, (p) => creditsHeart.scale = p, easings.easeOutQuad)
		})
	
		playerCredit.endingHover(() => {
			tween(playerCredit.scale, vec2(1), 0.15, (p) => playerCredit.scale = p, easings.easeOutQuad)
			tween(creditsHeart.scale, vec2(1), 0.15, (p) => creditsHeart.scale = p, easings.easeOutQuad)
		})
	}
}