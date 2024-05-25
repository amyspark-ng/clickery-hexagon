import kaboom from "kaboom";
import "kaboom/global";

import { loadAssets } from "./loader.js"

export const k = kaboom({
	width: 1024,
	height: 576,
	font: 'apl386',
});

export let GameState = {
	volumeIndex: 9,
}

loadAssets()

go("gamescene")
