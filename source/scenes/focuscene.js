import { volumeManager } from "../sound.js";
import { addBackground, gameBg } from "./game/utils.js";

export function focuscene() {
	return scene("focuscene", () => {
		addBackground()
		gameBg.tintColor = BLACK
		gameBg.blendFactor = 1
		
		volumeManager()

		go("gamescene")
	})	
}