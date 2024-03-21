import { addConfetti } from "../plugins/confetti.js";
import { volumeManager } from "../plugins/volumebar.js";

export function gamescene() {
	return scene("gamescene", () => {
		// put in the first scene that the game starts in
		volumeManager()
		
		addConfetti({ pos: center() })

		add([
			sprite("osaka"),
			pos(center()),
			anchor("center")
		])

		debug.log("it runs!!!! kewl")
	})	
}