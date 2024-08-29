import { Color, GameObj, KEventController } from "kaplay"
import { ROOT } from "../../main";

/**
 * Draws a damn shadow 
 */
export function drawDamnShadow(xSpacing: number, ySpacing: number, theOpacity: number) {
	let drawEvent:KEventController;

	return {
		id: "damnShadow",
		require: ["anchor"],
		disableShadow: false,
		
		add() {
			let drawingShadow = () => {
				if (this.disableShadow == true) return
				if (this.is("sprite")) {
					drawSprite({
						sprite: this.sprite,

						pos: vec2(this.pos.x + xSpacing, this.pos.y + ySpacing),
						opacity: theOpacity,
						color: BLACK,
						anchor: this.anchor,
						scale: this.scale,
						angle: this.angle,
					})
				}

				else if (this.is("text")) {
					drawText({
						text: this.text,
						font: this.font,
						align: this.align,
						size: this.textSize,

						pos: vec2(this.pos.x + xSpacing, this.pos.y + ySpacing),
						opacity: theOpacity,
						color: BLACK,
						anchor: this.anchor,
						scale: this.scale,
						angle: this.angle,
					})
				}

				else if (this.is("rect")) {
					drawRect({
						width: this.width,
						height: this.height,
						radius: this.radius,

						pos: vec2(this.pos.x + xSpacing, this.pos.y + ySpacing),
						opacity: theOpacity,
						color: BLACK,
						anchor: this.anchor,
						scale: this.scale,
						angle: this.angle,
					})
				}
			}

			drawEvent = this.parent.onDraw(drawingShadow)
		},

		destroy() {
			drawEvent.cancel()
			drawEvent = null
		}
	}
}

/**
 * Draws a dumb outline 
 */
export function drawDumbOutline(theWidth:number, coloring:Color, theParent?:GameObj) : { changeDumbOutlineWidth(width:number):void, get dumbOutlineWidth():number, add():void, destroy():void } {
	let drawEvent:KEventController;
	
	return {
		changeDumbOutlineWidth(newWidth:number) {
			theWidth = newWidth
		},
		
		get dumbOutlineWidth() {
			return theWidth;
		},
		
		add() {
			theParent = theParent ?? this.parent
			drawEvent = theParent.onDraw(() => {
				drawRect({
					pos: this.screenPos(),
					width: this.width,
					height: this.height,
					color: BLACK,
					fill: false,
					anchor: this.anchor || "topleft",
					outline: {
						width: theWidth,
						color: coloring
					},
					fixed: this.fixed
				})
			})
		},

		destroy() {
			drawEvent.cancel();
			drawEvent = null;
		}
	}
}