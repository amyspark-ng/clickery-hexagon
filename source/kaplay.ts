import kaplay, { KAPLAYOpt } from "kaplay";
import "kaplay/global";

import { DEBUG, enableNg } from "./globals";

export const k = kaplay({
    width: 1024,
    height: 576,
    font: 'lambda',
    canvas: document.querySelector("#kanva"),
    logMax: 10,
    debugKey: "f1",
    debug: DEBUG,
	global: true,
    loadingScreen: true,
    crisp: false,
    backgroundAudio: true,
    stretch: false,
    letterbox: false,
    maxFPS: 120,
    tagsAsComponents: true,
} as KAPLAYOpt);

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