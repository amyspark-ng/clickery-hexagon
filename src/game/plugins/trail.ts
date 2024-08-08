import { Color } from "kaplay";
import { blendColors } from "../utils";

var sprIter = 0;
type trailOpt =  {
	sprite:string,
	amount?:number,
	spreadBetweenClones?:number,
	
	startPointForColor?:"tail" | "origin", // tail, origin
	color?: Color,
	
	startOpacity?:number,
	endOpacity?:number,

	startScale?:number,
	endScale?:number,
}

export function trail(opts:trailOpt) {
	// use closed local variable for internal data
	return {
		trail: {
			data: [],
			spread: 0,

			trailSpriteObj: undefined,
			amount: opts.amount ?? 10,
			spreadBetweenClones: opts.spreadBetweenClones ?? 1,
			
			startPointForColor: opts.startPointForColor ?? "origin",
			color: opts.color ?? BLUE,
			
			startOpacity: opts.startOpacity ?? 0.5,
			endOpacity: opts.endOpacity ?? 0.25,

			startScale: opts.startScale ?? 1,
			endScale: opts.startScale ?? 0.5,
		},
		id: "trail",
		// if this comp requires other comps to work
		require: [ "pos", "z", "sprite", ],
		add() {
			var beanSpr = this;
			this.trail.trailSpriteObj = add([
				z(this.z - 1),
				pos(0, 0),
				"trailSprite" + sprIter,
				{
					iterId: sprIter
				}
			]);
			onDraw("trailSprite" + this.trail.trailSpriteObj.iterId, (o) => {
				for (let i in this.trail.data) {
					if (this.trail.data[i] == undefined) break;
					drawSprite({
						sprite: opts.sprite,
						color: blendColors(
							this.trail.startPointForColor == "tail" ? (this.color ?? WHITE) : this.trail.color,
							this.trail.startPointForColor == "tail" ? this.trail.color : (this.color ?? WHITE),
							map(Number(i), 0, this.trail.data.length, 0, 1)
						),
						pos: vec2(beanSpr.trail.data[i][0] + beanSpr.width / 2, beanSpr.trail.data[i][1] + beanSpr.height / 2),
						frame: this.frame,
						scale: lerp(this.trail.startScale, this.trail.endScale, Number(i) / this.trail.amount),
						anchor: "botright",
						opacity: map(Number(i), 0, this.trail.amount, this.trail.startOpacity, this.trail.endOpacity)
					})
				}
			})
		},
		update() {
			if (this.trail.spread % this.trail.spreadBetweenClones == 0) {
			this.trail.data.unshift([this.pos.x, this.pos.y]);
				this.trail.data.length = this.trail.amount;
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