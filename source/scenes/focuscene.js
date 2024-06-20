import { volumeManager } from "../sound.js";
import { addBackground, addMouse, gameBg } from "./game/additives.js";

export function focuscene() {
	return scene("focuscene", () => {
		addBackground()
		addMouse()
		gameBg.tintColor = BLACK
		gameBg.blendFactor = 1
		
		volumeManager()

		go("gamescene")
	})	
}