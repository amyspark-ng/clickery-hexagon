import { Anchor } from "kaplay"

/**
 * Draws a damn shadow 
 */
export function drawDamnShadow(xSpacing:number, ySpacing:number, theOpacity:number) {
	let drawEvent = null
	
	return {
		id: "damnShadow",
		require: ["anchor"],
		add() {
			let drawingShadow = () => {
				if (this.is("sprite")) {
					drawSprite({
						sprite: this.sprite,
						pos: this.screenPos(),
						opacity: theOpacity | 1,
						anchor: this.anchor,
						scale: this.scale | 1,
						angle: this.angle | 0,
						color: BLACK,
					})
				}

				else if (this.is("text")) {
					drawText({
						text: this.text,
						pos: this.screenPos(),
						opacity: theOpacity | 1,
						anchor: this.anchor,
						scale: this.scale | 1,
						angle: this.angle | 0,
						color: BLACK,
						align: this.align,
					})
				}
			}

			drawEvent = onDraw(drawingShadow)
		},

		destroy() {
			drawEvent.cancel()
			drawEvent = null
		}
	}
}