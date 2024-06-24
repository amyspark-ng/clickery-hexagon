import { playSfx } from "../../sound"
import { cam } from "./gamescene"
import { COMBO_MINCLICKS, COMBO_MAX, COMBO_MAXCLICKS, clickVars, scoreVars } from "./hexagon"
import { scoreText, spsText } from "./uicounters";
import { blendColors, formatNumber, getPositionOfSide } from "./utils";

export function getClicksFromCombo(level) {
	return Math.round(map(level, 2, COMBO_MAX, COMBO_MINCLICKS, COMBO_MAXCLICKS))
}

export function getComboFromClicks(clicks) {
	return Math.round(map(clicks, COMBO_MINCLICKS, COMBO_MAXCLICKS, 2, COMBO_MAX))
}

export let comboBarContent;
export let maxBarWidth = 0

export function addComboBar() {
	let targetPos = vec2(0, scoreText.height / 2 + scoreText.height / 4 - 6)
	
	let barFrame = scoreText.add([
		rect(scoreText.width, scoreText.height / 4, { fill: false, radius: 5 }),
		pos(targetPos.x, scoreText.y),
		anchor("center"),
		opacity(1),
		outline(3.5, BLACK),
		z(scoreText.z - 1),
		"comboBar",
		{
			update() {
				this.width = lerp(this.width, scoreText.width, 1.1)
				maxBarWidth = this.width
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
		z(barFrame.z - 1),
		opacity(1),
		"comboBar",
		{
			update() {
				if (!clickVars.constantlyClicking) {
					if (this.width > 0) this.width--
					clickVars.consecutiveClicks = map(this.width, 0, maxBarWidth, 0, COMBO_MAXCLICKS)
					scoreVars.combo = getComboFromClicks(clickVars.consecutiveClicks)
					if (this.width < maxBarWidth / 2) clickVars.maxedCombo = false
				}

				else {
					if (this.width < maxBarWidth) {
						let mappedWidth = map(clickVars.consecutiveClicks, COMBO_MINCLICKS, COMBO_MAXCLICKS, 0, maxBarWidth)
						this.width = lerp(this.width, mappedWidth, 1.1)
					}
				}

				this.width = clamp(this.width, 0, maxBarWidth - 2)
				clickVars.consecutiveClicks = Math.floor(clickVars.consecutiveClicks)
				
				// # player "gave up"
				if (this.width == 0 && !clickVars.constantlyClicking && clickVars.comboDropped == false) {
					clickVars.comboDropped = true
					get("comboBar", { recursive: true }).forEach(comboBar => {
						comboBar.fadeOut(0.25).onEnd(() => {
							comboBar.destroy()
							tween(spsText.pos.y, spsText.defaultYPos, 0.5, (p) => spsText.pos.y = p, easings.easeOutQuint)
						})
					})
				}

				let blendFactor = map(scoreVars.combo, 1, 10, 0, 1)
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

	// fix spsText pos
	tween(spsText.pos.y, spsText.barYPos, 0.5, (p) => spsText.pos.y = p, easings.easeOutQuint)

	return barFrame;
}

export function addPlusScoreText(opts = {posToAdd: vec2(), amount: 1, manual: true }) {
	let size;
	if (opts.manual) size = [40, 50]
	else size = [32.5, 40]

	let textBlendFactor = 0;
	let plusScoreText = add([
		text(`${opts.manual ? "[combo]" : ""}+${formatNumber(opts.amount, true, false)}`, {
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
		pos(opts.posToAdd),
		rotate(0),
		anchor("center"),
		z(4),
		"plusScoreText",
		{
			update() {
				if (!opts.manual) return
				textBlendFactor = map(scoreVars.combo, 1, 10, 0, 1)
			}
		}
	])

	if (opts.manual) {
		if (scoreVars.combo > 1) plusScoreText.text += `x${Math.floor(scoreVars.combo)}`
		plusScoreText.text += "[/combo]"
	}

	plusScoreText.pos.x = opts.posToAdd.x + 2
	plusScoreText.pos.y = opts.posToAdd.y - 18

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

	if (plusScoreText.pos.x > opts.posToAdd.x) plusScoreText.anchor = "left"
	else plusScoreText.anchor = "right"
}

export function increaseCombo() {
	scoreVars.combo = getComboFromClicks(clickVars.consecutiveClicks)
	playSfx("combo", {tune: scoreVars.combo > 1 ? 100 * scoreVars.combo : 0 })
	tween(cam.scale, 0.95, 0.25 / 2, (p) => cam.scale = p, easings.easeOutQuint).onEnd(() => {
		tween(cam.scale, 1, 0.25, (p) => cam.scale = p, easings.easeOutQuint)
	})
}

export function startCombo() {
	increaseCombo()
	
	clickVars.comboDropped = false
	addComboBar()
	tween(-10, 0, 0.5, (p) => cam.rotation = p, easings.easeOutQuint)
}

export function dropCombo() {

}