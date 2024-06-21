import { volumeManager } from "../sound.js";
import { addBackground, addMouse, gameBg } from "./game/additives.js";

export function focuscene() {
	return scene("focuscene", () => {
		addBackground()
		addMouse()
		gameBg.movAngle = -5
		gameBg.color = BLACK
		gameBg.color.a = Number(1)
		
		volumeManager()

		go("gamescene")
	})	
}