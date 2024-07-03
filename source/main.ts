import kaplay from "kaplay";
import "kaplay/global";

import { drawSeriousLoadScreen, loadEverything } from "./loader.ts"
import { GameState } from "./gamestate.ts";
import { addBackground, addMouse, gameBg } from "./game/additives.ts";
import { volumeManager } from "./sound.ts";

export const DEBUG:boolean = false
export const k = kaplay({
	width: 1024,
	height: 576,
	font: 'lambda',
	canvas: document.querySelector("#kanva"),
	logMax: 10,
	backgroundAudio: GameState.settings.keepAudioOnTabChange,
	debugKey: "f1",
	debug: true,
	loadingScreen: true,
	// stretch: true,
	// letterbox: true,
});
export let ROOT = getTreeRoot()
setBackground(BLACK)
setCursor("none")

// the one on the bottom is the one that gets rendered first
layers([
	"background",
	"hexagon",
	"ui",
	"windows",
	"powerups",
	"logs",
	"sound",
	"mouse",
], "background")

loadEverything()
onLoad(() => {
	addBackground()
	gameBg.movAngle = -5
	gameBg.color = BLACK

	volumeManager()

	if (!DEBUG) {
		let opacity = 1
		tween(opacity, 0, 1, (p) => opacity = p, easings.linear)
	
		let drawEvent = onDraw(() => {
			drawSeriousLoadScreen(1, opacity)
		})
	
		wait(1, () => {
			drawEvent.cancel()
			ROOT.trigger("rungame")
		})
	}
	
	else {
		addMouse()
		go("gamescene")
	}
	
	ROOT.on("rungame", () => {
		addMouse()
		if (!isFocused()) go("focuscene")
		else go("gamescene")
	})
})
