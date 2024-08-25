import { Color, KEventController } from "kaplay"

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
export function drawDumbOutline(width:number, coliring:Color) : { changeDumbOutlineWidth(width:number), get dumbOutlineWidth():number, add():void, destroy():void } {
	let drawEvent:KEventController;
	
	return {
		changeDumbOutlineWidth(newWidth:number) {
			width = newWidth
		},

		get dumbOutlineWidth() {
			return width;
		},
		
		add() {
			drawEvent = this.parent.onDraw(() => {
				drawRect({
					pos: this.pos,
					width: this.width + width,
					height: this.height + width,
					radius: this.radius,
					anchor: this.anchor,
					color: coliring,
				})
			})
		},

		destroy() {
			drawEvent.cancel();
			drawEvent = null;
		}
	}
}