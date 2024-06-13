import kaplay from "kaplay";
import "kaplay/global";

import { drawLoadScreen, customScreens } from "./scenes/game/utils.js";
import { loadAssets } from "./loader.js"
import { GameState } from "./gamestate.js"

export const k = kaplay({
	width: 1024,
	height: 576,
	font: 'lambda',
	canvas: document.getElementById("kanva"),
	logMax: 10,
	backgroundAudio: true,
	debugKey: "f1",
	debug: true,
	// stretch: true,
	// letterbox: true,
});

loadAssets()
setCursor("none")

export let kanvas = document.getElementById("kanva")
export let gl = kanvas.getContext("2d")

export let ROOT = getTreeRoot()

go("focuscene")
// if (!k.debug) go("focuscene")
// else go("gamescene")
