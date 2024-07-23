import { GameState } from "../gamestate.ts";
import { positionSetter } from "../plugins/positionSetter.ts";
import { waver } from "../plugins/wave.js";
import { scoreVars } from "./hexagon.ts";
import { bop, formatNumber, getPositionOfSide, simpleNumberFormatting } from "./utils.ts";

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
			scoreShown: 0,
			update() {
				this.text = `${formatNumber(Math.round(this.scoreShown))}` 
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
		scoreText.onUpdate(() => scoreText.scoreShown = GameState.score)
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
			defaultYPos: 49,
			barYPos: 75,
			value: 0,

			// value is the raw (number) score per second (with time accounted for)
			formatSpsText(value:any) {
				let textThing = "/s"
				switch (GameState.settings.spsTextMode) {
					case 1:
						textThing = "/sec"
					break;
					case 2:
						textThing = "/min"
					break;
					case 3:
						textThing = "/hour"
					break;
					default: 
						textThing = "/sec"
					break;
				}

				let valueToReturn = formatNumber(Number(value.toFixed(2)), { fixAmount: 2,letterSuffixes: false })
				return valueToReturn + textThing
			},
			updateValue() {
				// shoutout to Candy&Carmel
				let multiplyValue = GameState.settings.spsTextMode ? Math.pow(60, GameState.settings.spsTextMode-1) : 1;
				this.value = scoreVars.scorePerSecond * multiplyValue
			},
			update() {
				if (isMousePressed("left") && this.isHovering()) {
					// 1 second, 2 minute, 3 hour
					GameState.settings.spsTextMode++
					if (GameState.settings.spsTextMode > 3) GameState.settings.spsTextMode = 1
					this.updateValue()
					bop(this, 0.05)
				}

				this.text = this.formatSpsText(this.value, GameState.settings.spsTextMode)
			}
		}
	])

	let buildingTextTextOpts = { size: 40, lineSpacing: 1.5, font: "lambdao" }
	buildingsText = add([
		text(`${simpleNumberFormatting(GameState.cursors)}<\n${simpleNumberFormatting(GameState.clickers + 1)}`, buildingTextTextOpts),
		opacity(1),
		anchor("left"),
		layer("ui"),
		pos(10, height() - 55),
		waver({ maxAmplitude: 8, wave_speed: 0.8 }),
		{
			update() {
				this.text = `${simpleNumberFormatting(GameState.cursors)}\n${simpleNumberFormatting(GameState.clickers + 1)}`
			},

			draw() {
				let clickersWidth = formatText({ text: `${simpleNumberFormatting(GameState.clickers + 1)}`, ...buildingTextTextOpts }).width	
				let cursorsWidth = formatText({ text: `${simpleNumberFormatting(GameState.cursors)}`, ...buildingTextTextOpts }).width	
				
				// clickers
				drawSprite({
					sprite: "cursors",
					frame: 0,
					pos: vec2(this.pos.x + clickersWidth + 5, 28),
					anchor: "center",
					scale: 0.75,
					opacity: this.opacity * 0.9
				})

				// cursors
				drawSprite({
					sprite: "cursors",
					frame: 1,
					pos: vec2(this.pos.x + cursorsWidth + 5, -17),
					anchor: "center",
					scale: 0.75,
					opacity: this.opacity * 0.9
				})
			}
		}
	])

	buildingsText.startWave()
}
