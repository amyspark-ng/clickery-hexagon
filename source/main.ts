import kaplay, { KAPLAYOpt } from "kaplay";
import "kaplay/global";

import { drawSeriousLoadScreen, loadEverything } from "./loader.ts"
import { addBackground, addMouse, gameBg } from "./game/additives.ts";
import { volumeManager } from "./sound.ts";
import { newgroundsManagement } from "./newgrounds.ts";
import ng from "newgrounds.js";
import { runInTauri } from "./game/utils.ts";
import { GameState } from "./gamestate.ts";
import { windowsDefinition } from "./game/windows/windows-api/windowManaging.ts";

export let DEBUG:boolean = true
export let enableNg = false

let kaplayOpts = {
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
	stretch: false,
	letterbox: false,
}

runInTauri(() => {
	kaplayOpts.stretch = true;
	kaplayOpts.letterbox = true
})

export const k = kaplay(kaplayOpts as KAPLAYOpt);

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
	windowsDefinition()

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
		GameState.load()
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