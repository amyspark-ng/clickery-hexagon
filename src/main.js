import kaboom from "kaboom";
import "kaboom/global";

import { loadAssets } from "./loader.js"
import { GameState } from "./GameState.js"

export const k = kaboom({
	width: 1024,
	height: 576,
	font: 'lambda',
	crisp: true,
	canvas: document.getElementById("kanva"),
	logMax: 10,
	// backgroundAudio: true,
	// scale: 0.99,
	// stretch: true,
	// letterbox: true,
});

GameState.load()

setCursor("none")

export let kanvas = document.getElementById("kanva")
export let gl = kanvas.getContext("2d")

loadAssets()

go("focuscene")
