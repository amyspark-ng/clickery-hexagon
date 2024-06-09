import { playSfx } from "../../sound"
import { cam } from "./gamescene"
import { clickVars, scoreVars } from "./hexagon"
import { blendColors, formatNumber } from "./utils";

// export function getClicksForComboLevel(level) {
//     return Math.floor(INITIAL_COMBO + rand(3, 5) * (level - 1));
// }

export function addPlusScoreText(posToAdd, amount, size = [40, 50]) {
	let textBlendFactor = 0;
	let plusScoreText = add([
		text(`[combo]+${formatNumber(amount, true, false)}`, {
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
		pos(posToAdd),
		rotate(0),
		anchor("center"),
		z(4),
		"plusScoreText",
		{
			// TODO: i like this, look at it !!!
			// dir: vec2(rand(-200, 200), 200),
			// update() {
			// 	this.angle += this.dir.x / 100
			// 	this.dir.y += 10
			// 	this.move(this.dir)
			// },
			update() {
				textBlendFactor = map(scoreVars.combo, 1, 10, 0, 1)
			}
		}
	])

	if (scoreVars.combo > 1) plusScoreText.text += `x${scoreVars.combo}`
	plusScoreText.text += "[/combo]"
	// debug.log(plusScoreText.text)

	plusScoreText.pos.x = posToAdd.x + 2
	plusScoreText.pos.y = posToAdd.y - 18

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

	if (plusScoreText.pos.x > posToAdd.x) plusScoreText.anchor = "left"
	else plusScoreText.anchor = "right"
}

export function startCombo() {
	if (scoreVars.combo == 2) {
		// do bar stuff
	}

	tween(-15, 0, 0.5, (p) => cam.rotation = p, easings.easeOutQuint)
	tween(0.5, 1.025, 0.5, (p) => cam.scale = p, easings.easeOutQuint)
	playSfx("combo", scoreVars.combo > 1 ? 100 * scoreVars.combo : 0)
}

export function dropCombo() {
	clickVars.consecutiveClicks = 0
	scoreVars.combo = 1
	tween(cam.scale, 1, 0.5, (p) => cam.scale = p, easings.easeOutQuint)
}