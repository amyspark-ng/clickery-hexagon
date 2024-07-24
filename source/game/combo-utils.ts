import { Vec2 } from "kaplay";
import { playSfx } from "../sound"
import { cam } from "./gamescene"
import { COMBO_MINCLICKS, COMBO_MAX, COMBO_MAXCLICKS, clickVars, scoreVars } from "./hexagon"
import { scoreText, spsText } from "./uicounters";
import { blendColors, formatNumber, randomPos } from "./utils";
import { spawnPowerup } from "./powerups";
import { GameState } from "../gamestate";

export function getClicksFromCombo(level:number) {
	return Math.round(map(level, 2, COMBO_MAX, COMBO_MINCLICKS, COMBO_MAXCLICKS))
}

export function getComboFromClicks(clicks:number) {
	return Math.round(map(clicks, COMBO_MINCLICKS, COMBO_MAXCLICKS, 2, COMBO_MAX))
}

export let comboBarContent;
export let maxContentWidth = 0

export function addComboBar() {
	let targetPos = vec2(0, scoreText.height / 2 + scoreText.height / 4 - 6)
	
	let barFrame = scoreText.add([
		rect(scoreText.width, scoreText.height / 4, { fill: false, radius: 5 }),
		pos(targetPos.x, scoreText.y),
		anchor("center"),
		opacity(1),
		outline(3.5, BLACK),
		z(scoreText.z - 1),
		layer("ui"),
		z(0),
		"comboBar",
		{
			update() {
				this.width = lerp(this.width, scoreText.width, 0.25)
				maxContentWidth = this.width
			}
		}
	])

	barFrame.fadeIn(0.5)
	tween(barFrame.pos.y, targetPos.y, 0.5, (p) => barFrame.pos.y = p, easings.easeOutQuint)

	comboBarContent = scoreText.add([
		rect(0, barFrame.height, { radius: 5 }),
		pos(-barFrame.width / 2, barFrame.pos.y),
		anchor("left"),
		color(WHITE),
		opacity(1),
		layer("ui"),
		z(barFrame.z - 1),
		"comboBar",
		{
			update() {
				if (!clickVars.constantlyClicking) {
					if (clickVars.consecutiveClicks > 0) clickVars.consecutiveClicks -= 0.75
					scoreVars.combo = getComboFromClicks(clickVars.consecutiveClicks)
					if (this.width < maxContentWidth / 2) clickVars.maxedCombo = false
				}

				else {
					clickVars.consecutiveClicks = Math.round(clickVars.consecutiveClicks)
				}

				let mappedWidth = map(clickVars.consecutiveClicks, COMBO_MINCLICKS, COMBO_MAXCLICKS, 0, maxContentWidth)
				this.width = lerp(this.width, mappedWidth, 0.25)
				this.width = clamp(this.width, 0, maxContentWidth - 2)
				
				// # player "gave up"
				if (this.width == 0 && !clickVars.constantlyClicking && clickVars.comboDropped == false) {
					clickVars.comboDropped = true
					clickVars.consecutiveClicks = 0
					get("comboBar", { recursive: true }).forEach(comboBar => {
						comboBar.fadeOut(0.25).onEnd(() => {
							comboBar.destroy()
							tween(spsText.pos.y, spsText.defaultYPos, 0.5, (p) => spsText.pos.y = p, easings.easeOutQuint)
						})
					})
				}

				let blendFactor = map(scoreVars.combo, 1, COMBO_MAX, 0, 1)
				this.color = blendColors(
					WHITE,
					hsl2rgb((time() * 0.2 * 0.1) % 1, 1.5, 0.8),
					blendFactor
				)

				this.pos.x = barFrame.pos.x - barFrame.width / 2
				this.pos.y = barFrame.pos.y
			}
		}
	])
	comboBarContent.fadeIn(0.25)

	// when combo starts the spsText y pos should change to accomodate it
	tween(spsText.pos.y, spsText.barYPos, 0.5, (p) => spsText.pos.y = p, easings.easeOutQuint)

	return barFrame;
}

type plusScoreOpts = {
	pos: Vec2,
	value:number,
	cursorRelated:boolean,
}
export function addPlusScoreText(opts:plusScoreOpts) {
	let size:number[];
	if (!opts.cursorRelated) size = [40, 50]
	else size = [32.5, 40]
	let textBlendFactor = 0;

	let plusScoreText = add([
		text("", {
			size: rand(size[0], size[1]),
			font: "lambdao",
			styles: {
				"small": {
					scale: vec2(0.8),
					pos: vec2(0, 4)
				},
				"combo": (idx, ch) => ({
					color: blendColors(
						WHITE,
						hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
						textBlendFactor
					),
					pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5)),
				})
			}
		}),
		opacity(1),
		pos(opts.pos),
		rotate(0),
		anchor("center"),
		layer("ui"),
		"plusScoreText",
		{
			update() {
				if (opts.cursorRelated) return
				textBlendFactor = map(scoreVars.combo, 1, COMBO_MAX, 0, 1)
			}
		}
	])

	plusScoreText.text = `+${formatNumber(opts.value)}`
	if (scoreVars.combo > 1 && !opts.cursorRelated) {
		plusScoreText.text = plusScoreText.text.replace (/^/,'[combo]');
		// if (scoreVars.combo > 1) plusScoreText.text += `x${Math.floor(scoreVars.combo)}`
		plusScoreText.text += `[/combo]`;
	}
	
	plusScoreText.pos.x = opts.pos.x + 2
	plusScoreText.pos.y = opts.pos.y - 18

	// animate plusscoretext
	tween(
		plusScoreText.pos.y,
		plusScoreText.pos.y - 20,
		0.25,
		(p) => plusScoreText.pos.y = p,
	);
	tween(
		1,
		0,
		0.25,
		(p) => plusScoreText.opacity = p,
	);

	wait(0.25, () => {
		tween(
			plusScoreText.opacity,
			0,
			0.25,
			(p) => plusScoreText.opacity = p,
		);
	});
	
	wait(0.25, () => {
		destroy(plusScoreText);
	});

	if (plusScoreText.pos.x > opts.pos.x) plusScoreText.anchor = "left"
	else plusScoreText.anchor = "right"

	if (scoreVars.combo > 1 && !opts.cursorRelated) {
		// let totalScore = plusScoreText.add([
		// 	text("", {
		// 		font: "lambdao",
		// 		size: plusScoreText.textSize * 0.8
		// 	}),
		// 	pos(plusScoreText.width / 2, plusScoreText.height - 2),
		// 	anchor(plusScoreText.anchor),
		// 	opacity(),
		// 	{
		// 		update() {
		// 			this.opacity = plusScoreText.opacity
		// 		}
		// 	}
		// ])

		// totalScore.text = `(${formatNumber(opts.value * scoreVars.combo, true, false)})`
	}
}

export function increaseComboText() {
	let blendFactor = 0
	let incComboText = add([
		text(`[combo]x${scoreVars.combo}[/combo]`, {
			font: "lambdao",
			size: 48,
			align: "center",
			styles: {
				"combo": (idx) => ({
					pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5)),
					color: blendColors(
						WHITE,
						hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
						blendFactor
					),
				})
			}
		}),
		pos(mousePos().x, mousePos().y - 80),
		scale(),
		opacity(),
		layer("ui"),
		color(),
		{
			update() {
				this.pos.y -= 0.5
				blendFactor = map(scoreVars.combo, 0, COMBO_MAX, 0, 1)
			}
		}
	])

	let timeToDie = 2
	tween(0.5, 1, 0.1, (p) => incComboText.opacity = p, easings.easeOutQuint).onEnd(() => {
		tween(incComboText.opacity, 0, timeToDie, (p) => incComboText.opacity = p, easings.easeOutQuint)
		wait(timeToDie, () => {
			destroy(incComboText)
		})
	})
}

export function maxComboAnim() {
	let blendFactor = 0
	let words = ["MAX COMBO", "MAX COMBO!!", "YOO-HOO!!!", "YEEEOUCH!!", "FINISH IT"]
	let maxComboText = add([
		text(`[combo]${choose(words)}[/combo]`, {
			font: "lambdao",
			size: 55,
			align: "center",
			styles: {
				"combo": (idx) => ({
					pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5)),
					color: blendColors(
						WHITE,
						hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
						blendFactor
					),
				})
			}
		}),
		pos(vec2(mousePos().x, mousePos().y - 65)),
		layer("ui"),
		color(),
		scale(),
		opacity(),
		anchor("center"),		
		timer(),
		{
			update() {
				this.pos.y -= 1

				blendFactor = 1
				// if (time() % 0.25 > (0.1 / 2)) blendFactor = 1
				// else blendFactor = 0
			}
		}
	])

	let timeToDie = 2
	maxComboText.tween(vec2(0.5), vec2(1), 0.1, (p) => maxComboText.scale = p, easings.easeOutQuad)
	maxComboText.tween(0.5, 1, 0.1, (p) => maxComboText.opacity = p, easings.easeOutQuint).onEnd(() => {
		maxComboText.tween(maxComboText.opacity, 0, timeToDie, (p) => maxComboText.opacity = p, easings.easeOutQuint)
		maxComboText.wait(timeToDie, () => {
			destroy(maxComboText)
		})
	})

	if (GameState.hasUnlockedPowerups == true && chance(0.2)) {
		spawnPowerup({
			type: "awesome",
			pos: randomPos(),
		})
	}
}

export function increaseCombo() {
	scoreVars.combo = getComboFromClicks(clickVars.consecutiveClicks)
	playSfx("combo", {detune: scoreVars.combo > 1 ? 100 * scoreVars.combo : 0 })
	tween(cam.scale, 0.95, 0.25 / 2, (p) => cam.scale = p, easings.easeOutQuint).onEnd(() => {
		tween(cam.scale, 1, 0.25, (p) => cam.scale = p, easings.easeOutQuint)
	})
	if (scoreVars.combo != COMBO_MAX) increaseComboText()
}

export function startCombo() {
	increaseCombo()
	
	clickVars.comboDropped = false
	addComboBar()
	tween(-10, 0, 0.5, (p) => cam.rotation = p, easings.easeOutQuint)
}

export function dropCombo() {

}