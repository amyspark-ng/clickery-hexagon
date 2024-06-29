// # Initial code by MeowcaTheoRange / modified by amyspark-ng

import { Color, Vec2 } from "kaplay";
import { blendColors } from "../game/utils";

type trailOpt = {
	spriteName: string,
	amount: number,
	spreadBetweenClones: number,
	colorNew: Color,
	startAlpha: number,
	endAlpha: number,
	startScale: Vec2,
	endScale: Vec2,
}

var sprIter = 0;
export function trail(opts:trailOpt) {
	// use closed local variable for internal data
	return {
		trail: {
			data: [],
			spread: 0,
			trailSprite: opts.spriteName,
			trailAmount: opts.amount,
		},
		id: "trail",
		// if this comp requires other comps to work
		require: [ "pos", "z" ],
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
						sprite: opts.spriteName,
						color: blendColors(this.color, opts.colorNew, map(Number(i), 0, this.trail.trailAmount, opts.endAlpha, opts.startAlpha) * 3),
						pos: vec2(beanSpr.trail.data[i][0] + beanSpr.width / 2, beanSpr.trail.data[i][1] + beanSpr.height / 2),
						frame: this.frame,
						scale: lerp(opts.startScale, opts.endScale, Number(i) / this.trail.trailAmount),
						anchor: vec2(1.1, 1.1),
						opacity: map(Number(i), 0, this.trail.trailAmount, opts.startAlpha, opts.endAlpha)
					})
				}
			})
		},
		update() {
			if (this.trail.spread % opts.spreadBetweenClones == 0) {
			this.trail.data.unshift([this.pos.x, this.pos.y]);
				this.trail.data.length = opts.amount;
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