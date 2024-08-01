import { GameState } from "../gamestate.ts";
import { DEBUG } from "../main";
import { volumeManager } from "../sound";
import { addBackground, addMouse, gameBg } from "../game/additives.ts";

function scaryIntro() {
	// gameBg.color.a = 1
	// play lights out sound
}

export function focuscene() {
	return scene("focuscene", () => {
		tween(1, 0.95, 0.25, (p) => gameBg.color.a = p, easings.linear)

		// // if debug ignore the focus scene and just go to the game
		// if (DEBUG) {go("gamescene")}

		// draw some stuff
		let y_posToDrawText = center().y + 5
		let opacityToDrawText = 0
		tween(y_posToDrawText, center().y, 0.25, (p) => y_posToDrawText = p, easings.easeOutCirc)
		tween(opacityToDrawText, 1, 0.25, (p) => opacityToDrawText = p, easings.easeOutCirc)
		
		onDraw(() => {
			drawText({
				text: "Thanks for playing!\nClick to focus the game",
				size: 60,
				pos: vec2(center().x, y_posToDrawText),
				opacity: opacityToDrawText,
				color: WHITE,
				font: "lambda",
				align: "center",
				angle: wave(-8, 8, time() * 0.9),
				anchor: "center",
			})
		})

		onClick(() => {
			gameBg.color.a = 1
			go("gamescene")
		})
	})	
}