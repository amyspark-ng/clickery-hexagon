import kaplay from "kaplay";
import "kaplay/global";

import { drawSeriousLoadScreen, loadEverything } from "./loader.ts"
import { addBackground, addMouse, gameBg } from "./game/additives.ts";
import { volumeManager } from "./sound.ts";
import { newgroundsManagement } from "./newgrounds.ts";
import ng from "newgrounds.js";

export let DEBUG:boolean = true
export let enableNg:boolean = false
export const k = kaplay({
	width: 1024,
	height: 576,
	font: 'lambda',
	canvas: document.querySelector("#kanva"),
	logMax: 10,
	debugKey: "f1",
	debug: DEBUG,
	loadingScreen: true,
	crisp: false,
	backgroundAudio: true,
	// stretch: DEBUG == true ? false : true,
	letterbox: true // DEBUG == true ? false : true,
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
	"ascension",
	"logs",
	"sound",
	"mouse",
], "background")

loadEverything()
onLoad(() => {
	volumeManager()
	addBackground()
	newgroundsManagement()

	gameBg.movAngle = -5
	gameBg.color = BLACK

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
		// consoleManager()
		wait(0.05, () => {
			ROOT.trigger("rungame")
		})
	}
	
	ROOT.on("rungame", async () => {
		addMouse()

		if (!isFocused()) go("focuscene")
		else {
			if (enableNg == true) {
				if (!await ng.getUsername()) go("ngScene")
				else go("gamescene")
			}

			else go("gamescene")
		}
	})
})

// @ts-ignore
if (DEBUG == true) document.body.style.backgroundColor = "rgb(1, 3, 13)";
else document.body.style.backgroundColor = "rgb(0, 0, 0)";