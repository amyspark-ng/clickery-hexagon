import kaplay from "kaplay";
import "kaplay/global";

import { loadEverything } from "./loader.js"

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
	let drawEvent = onDraw(() => {
		drawRect({
			width: width(),
			height: height(),
			color: BLACK,
		})
	})

	go("focuscene")
	// wait(1, () => {
	// 	drawEvent.cancel()
	// })
})
// if (!k.debug) go("focuscene")
// else go("gamescene")
