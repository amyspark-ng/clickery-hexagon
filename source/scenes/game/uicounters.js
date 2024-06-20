import { GameState } from "../../gamestate.js";
import { waver } from "../../plugins/wave.js";
import { formatNumber } from "./utils.js";

export let scoreText;
export let spsText;

export let buildingsText;

export function uiCounters() {
	scoreText = add([
		text(GameState.score, {
			size: 75,
			font: "lambdao",
		}),
		anchor("center"),
		rotate(0),
		scale(1),
		z(4),
		pos(center().x, 60),
		waver({ maxAmplitude: 5, wave_speed: 0.5 }),
		{
			defaultScale: 1,
			scaleIncrease: 1,
			update() {
				this.text = `${formatNumber(Math.round(GameState.score), false, false)}` 
				this.angle = wave(-2.8, 2.8, time() * 1.25)
				this.scale.x = wave(0.95 * this.scaleIncrease, 1.08 * this.scaleIncrease, time() * 1.15)
				this.scale.y = wave(0.95 * this.scaleIncrease, 1.08 * this.scaleIncrease, time() * 1.15)
				this.defaultScale = vec2(this.scale.x, this.scale.y)
			}
		}
	])

	scoreText.startWave()

	// 46 width of char

	spsText = scoreText.add([
		text("0.0/s", {
			size: 30,
			font: "lambdao"
		}),
		anchor("center"),
		area(),
		pos(0, scoreText.pos.y - 14),
		// can't put text change here bc it would update to 0 each second
		{
			defaultYPos: scoreText.pos.y - 14,
			barYPos: (scoreText.pos.y - 14) + (scoreText.height / 4) + 5,
			value: 0,
			update() {
				if (isMousePressed("left") && this.isHovering()) {
					// 1 second, 2 minute, 3 hour
					GameState.settings.spsTextMode++
					if (GameState.settings.spsTextMode > 3) GameState.settings.spsTextMode = 1
				}

				let textThing = "/s"
				switch (GameState.settings.spsTextMode) {
					case 1:
						textThing = "/s"
					break;
					case 2:
						textThing = "/m"
					break;
					case 3:
						textThing = "/h"
					break;
					default: 
						textThing = "/s"
					break;
				}

				this.text = this.value + textThing
			}
		}
	])

	buildingsText = add([
		text(`${GameState.cursors}<\n${GameState.clickers + 1}x`, {
			size: 40,
			lineSpacing: 1.5,
			font: "lambdao"
		}),
		anchor("left"),
		pos(10, height() - 55),
		waver({ maxAmplitude: 8, wave_speed: 0.8 }),
		{
			update() {
				this.text = `${GameState.cursors}<\n${GameState.clickers + 1}x`
			}
		}
	])

	buildingsText.startWave()
}
