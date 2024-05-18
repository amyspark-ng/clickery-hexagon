import { GameState } from "../../GameState.js";
import { actualScorePerSecond } from "./addHexagon.js";

import { formatNumber } from "./utils.js";
import { isHoveringWindow } from "./windows/WindowsMenu.js";
import { storeOpen } from "./windows/winStore.js";

export let scoreText;
export let spsText;
export let totalText;

export let buildingsText;

let floatTextLoop;

export function uiCounters() {
	scoreText = add([
		text(GameState.score, {
			size: 75,
		}),
		anchor("center"),
		area(),
		rotate(),
		scale(),
		pos(center().x, 60),
		"glass",
		{
			update() {
				this.text = formatNumber(Math.round(GameState.score), false, false)
				// this.text = GameState.score
			}
		}
	])

	scoreText.onHover(() => {
		if (!isHoveringWindow) tween(totalText.opacity, 1, 0.15, (p) => totalText.opacity = p)
	})
	
	scoreText.onHoverEnd(() => {
		tween(totalText.opacity, 0, 0.15, (p) => totalText.opacity = p)
	})

	floatTextLoop = loop(4, () => {
		tween(scoreText.pos.y, scoreText.pos.y + 8, 2, (p) => scoreText.pos.y = p, )
		wait(2, () => {
			tween(scoreText.pos.y, scoreText.pos.y - 8, 2, (p) => scoreText.pos.y = p, )
		})
	})

	spsText = scoreText.add([
		text("0.0/s", {
			size: 30
		}),
		anchor("center"),
		pos(0, scoreText.pos.y - 14),
		{
			update() {
				// can't put it here bc it would update to 0 each second
			}
		}
	])

	totalText = scoreText.add([
		text("0", {
			size: 28
		}),
		anchor("center"),
		opacity(0),
		pos(0, scoreText.pos.y - 105),
		{
			update() {
				this.text = formatNumber(GameState.totalScore, false)
			}
		}
	])

	// multiplierText = add([
	// 	text(GameState.clickers, {
	// 		size: 40
	// 	}),
	// 	anchor("left"),
	// 	pos(10, height() - 40),
	// 	{
	// 		update() {
	// 			this.text = GameState.clickers + "x"
	// 		}
	// 	}
	// ])

	buildingsText = add([
		text(`${GameState.cursors}<\n${GameState.clickers}x`, {
			size: 40,
			lineSpacing: 1.5,
		}),
		anchor("left"),
		pos(10, height() - 55),
		{
			update() {
				this.pos.y = wave((height() - 55) - 8, (height() - 55) + 8, time() / 2)
				this.text = `${GameState.cursors}<\n${GameState.clickers}x`
			}
		}
	])

	// cursorsText = add([
	// 	text(GameState.cursors, {
	// 		size: 40
	// 	}),
	// 	anchor("left"),
	// 	pos(10, height() - 85),
	// 	{
	// 		update() {
	// 			this.text = GameState.cursors + "<"
	// 		}
	// 	}
	// ])

	// loop(4, () => {
	// 	// tween(multiplierText.pos.y, multiplierText.pos.y + 8, 2, (p) => multiplierText.pos.y = p, )
	// 	// tween(cursorsText.pos.y, cursorsText.pos.y + 8, 2, (p) => cursorsText.pos.y = p, )
	// 	tween(buildingsText.pos.y, buildingsText.pos.y + 8, 2, (p) => buildingsText.pos.y = p, )
	// 	wait(2, () => {
	// 		tween(buildingsText.pos.y, buildingsText.pos.y - 8, 2, (p) => buildingsText.pos.y = p, )
	// 		// tween(multiplierText.pos.y, multiplierText.pos.y - 8, 2, (p) => multiplierText.pos.y = p, )
	// 		// tween(cursorsText.pos.y, cursorsText.pos.y - 8, 2, (p) => cursorsText.pos.y = p, )
	// 	})
	// })
}