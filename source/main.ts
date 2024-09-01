import kaplay, { KAPLAYOpt } from "kaplay";
import "kaplay/global";

import { drawSeriousLoadScreen, loadEverything } from "./loader.ts"
import { addBackground, addMouse, gameBg } from "./game/additives.ts";
import { volumeManager } from "./sound.ts";
import { connectToNewgrounds } from "./newgrounds.ts";
import ng from "newgrounds.js";
import { runInTauri } from "./game/utils.ts";
import { GameState } from "./gamestate.ts";
import { windowsDefinition } from "./game/windows/windows-api/windowManaging.ts";
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { webviewWindow } from "@tauri-apps/api";

export let appWindow: webviewWindow.WebviewWindow = null

runInTauri(() => appWindow = getCurrentWebviewWindow())

console.log(appWindow)

export let DEBUG = true
export let enableNg = true

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
	maxFPS: 120,
} as KAPLAYOpt

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
	connectToNewgrounds()
	
	windowsDefinition()

	gameBg.movAngle = -5
	gameBg.color = BLACK
	gameBg.colorA = 0.9

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
		volume(GameState.settings.volume)
		addMouse()

		if (!isFocused()) go("focuscene")
		else {
			if (enableNg == true) {
				let loadingEvent = onDraw(() => {
					drawText({
						text: "Loading newgrounds, might take a second\nLoading" + ".".repeat(wave(1, 4, time() * 8)),
						size: 26,
						align: "center",
						anchor: "center",
						pos: center(),
					});
				})
			
				if (!await ng.isLoggedIn()) go("ngScene")
				else go("gamescene")
				// gets cancelled after the await is finished
				loadingEvent.cancel()
			}

			else go("gamescene")
		}
	})
})

// @ts-ignore
if (DEBUG == true) document.body.style.backgroundColor = "rgb(1, 3, 13)";
else document.body.style.backgroundColor = "rgb(0, 0, 0)";