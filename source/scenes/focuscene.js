import { volumeManager } from "../sound.js";

export function focuscene() {
	return scene("focuscene", () => {
		volumeManager()

		go("gamescene")
	})	
}