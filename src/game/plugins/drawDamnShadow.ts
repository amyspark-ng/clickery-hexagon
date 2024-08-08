/**
 * Draws a damn shadow 
 */
export function drawDamnShadow(xSpacing: number, ySpacing: number, theOpacity: number) {
	let drawEvent = null

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