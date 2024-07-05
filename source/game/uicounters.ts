import { GameState } from "../gamestate.ts";
import { waver } from "../plugins/wave.js";
import { formatNumber } from "./utils.ts";

export let scoreText:any;
export let spsText:any;

export let buildingsText:any;

export function uiCounters() {
	scoreText = add([
		text(GameState.score.toString(), {
			// 46 width of char
			size: 75,
			font: "lambdao",
		}),
		anchor("center"),
		rotate(0),
		scale(1),
		layer("ui"),
		opacity(1),
		pos(center().x, 60),
		"scoreCounter",
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

	scoreText.on("startAnimEnd", () => {
		scoreText.use(waver({ maxAmplitude: 5, wave_speed: 0.5 }))		
		scoreText.startWave()
	})

	spsText = scoreText.add([
		text("0.0/s", {
			size: 30,
			font: "lambdao"
		}),
		anchor("center"),
		area(),
		layer("ui"),
		opacity(1),
		pos(0, scoreText.pos.y - 14),
		"scoreCounter",
		// can't put text change here bc it would update to 0 each second
		{
			defaultYPos: scoreText.pos.y - 14,
			barYPos: (scoreText.pos.y - 14) + (scoreText.height / 4) + 5,
			value: 0,

			formatSpsText(value:any, spsTextMode:any) {
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

				return value.toFixed(spsTextMode) + textThing
			},
			update() {
				if (isMousePressed("left") && this.isHovering()) {
					// 1 second, 2 minute, 3 hour
					GameState.settings.spsTextMode++
					if (GameState.settings.spsTextMode > 3) GameState.settings.spsTextMode = 1
				}

				this.text = this.formatSpsText(this.value, GameState.settings.spsTextMode)
			}
		}
	])

	buildingsText = add([
		text(`${GameState.cursors}<\n${GameState.clickers + 1}x`, {
			size: 40,
			lineSpacing: 1.5,
			font: "lambdao"
		}),
		opacity(1),
		anchor("left"),
		layer("ui"),
		pos(10, height() - 55),
		waver({ maxAmplitude: 8, wave_speed: 0.8 }),
		{
			update() {
				this.text = `${GameState.cursors}<\n${GameState.clickers + 1}x`
			},
		}
	])

	buildingsText.startWave()
}
