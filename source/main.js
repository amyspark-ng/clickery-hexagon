import kaplay from "kaplay";
import "kaplay/global";

import { drawSeriousLoadScreen, loadEverything } from "./loader.js"

export const k = kaplay({
	width: 1024,
	height: 576,
	font: 'lambda',
	canvas: document.getElementById("kanva"),
	logMax: 10,
	backgroundAudio: true,
	debugKey: "f1",
	debug: true,
	loadingScreen: true,
	// stretch: true,
	// letterbox: true,
});

loadEverything()

setCursor("none")

export let kanvas = document.getElementById("kanva")
export let gl = kanvas.getContext("2d")

export let ROOT = getTreeRoot()

onLoad(() => {
	if (!k.debug) {
		let opacity = 1
		tween(opacity, 0, 1, (p) => opacity = p, easings.linear)
	
		let drawEvent = onDraw(() => {
			drawSeriousLoadScreen(1, opacity)
		})
	
		wait(1, () => {
			drawEvent.cancel()
			go("focuscene")
		})
	}
	else go("focuscene")
})
