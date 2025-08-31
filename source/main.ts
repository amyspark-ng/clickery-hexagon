import kaplay, { KAPLAYOpt } from "kaplay";
import "kaplay/global";

export let DEBUG = false
export let enableNg = true

import { drawSeriousLoadScreen, loadEverything } from "./loader.ts"
import { addBackground, addMouse, gameBg } from "./game/additives.ts";
import { volumeManager } from "./sound.ts";
import { connectToNewgrounds, onLogIn } from "./newgrounds.ts";
import ng from "newgrounds.js";
import { windowsDefinition } from "./game/windows/windows-api/windowManaging.ts";
import { GAME_VERSION, GameState } from "./gamestate.ts";

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
	tagsAsComponents: true,
} as KAPLAYOpt

export const k = kaplay(kaplayOpts as KAPLAYOpt);
console.log("Game's version: " + GAME_VERSION)

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
			getTreeRoot().trigger("rungame")
		})
	}
	
	else {
		// consoleManager()
		wait(0.05, () => {
			getTreeRoot().trigger("rungame")
		})
	}
	
	getTreeRoot().on("rungame", async () => {
		GameState.loadFromStorage()
		volume(GameState.settings.volume)
		addMouse()

		if (isFocused()) go("focuscene")
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
				
				// is logged, jarvis set ngUser and enableNg, YOU'RE SO STUPID! 
				else {
					const session = await ng.getSession()
					onLogIn(session)
					go("gamescene")
				}
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