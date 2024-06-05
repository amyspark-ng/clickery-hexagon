import { blendColors } from "../scenes/game/utils";

var sprIter = 0;
export function trail(objSprite = "", amount = 10, spreadBetweenClones = 1, colorNew = BLUE, startAlpha = 1, endAlpha = 0.5, startScale = 0.9, endScale = 0.5) {
	// use closed local variable for internal data
	return {
		trail: {
			data: [],
			spread: 0,
			trailSprite: undefined,
			trailAmount: amount,
		},
		id: "trail",
		// if this comp requires other comps to work
		require: [ "pos", "area", "z" ],
		add() {
			var beanSpr = this;
			this.trail.trailSprite = add([
				z(this.z - 1),
				pos(0, 0),
				"trailSprite" + sprIter,
				{
					iterId: sprIter
				}
			]);
			onDraw("trailSprite" + this.trail.trailSprite.iterId, (o) => {
				for (let i in this.trail.data) {
					if (this.trail.data[i] == undefined) break;
					drawSprite({
						sprite: objSprite,
						color: blendColors(this.color, colorNew, map(i, 0, this.trail.trailAmount, endAlpha, startAlpha) * 3),
						pos: vec2(beanSpr.trail.data[i][0] + beanSpr.width / 2, beanSpr.trail.data[i][1] + beanSpr.height / 2),
						frame: this.frame,
						scale: lerp(startScale, endScale, i / this.trail.trailAmount),
						anchor: vec2(1.1, 1.1),
						opacity: map(i, 0, this.trail.trailAmount, startAlpha, endAlpha)
					})
				}
			})
		},
		update() {
			if (this.trail.spread % spreadBetweenClones == 0) {
			this.trail.data.unshift([this.pos.x, this.pos.y]);
				this.trail.data.length = amount;
			}
			this.trail.spread++;
		},
		// runs when obj is destroyed
		destroy() {
			this.trail.data.length = 0;
			this.trail.data = undefined;
			this.trailSprite = undefined;
		}
	}
}