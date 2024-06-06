import kaboom from "kaboom";
import "kaboom/global";

import { drawLoadScreen, customScreens } from "./scenes/game/utils.js";
import { loadAssets } from "./loader.js"
import { GameState } from "./gamestate.js"

export const k = kaboom({
	width: 1024,
	height: 576,
	font: 'lambda',
	canvas: document.getElementById("kanva"),
	logMax: 10,
	backgroundAudio: true,
	// stretch: true,
	// letterbox: true,
});

loadAssets()

setCursor("none")

export let kanvas = document.getElementById("kanva")
export let gl = kanvas.getContext("2d")

let dummy = add([

])

export let ROOT = dummy.parent

go("focuscene")
