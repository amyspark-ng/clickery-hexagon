// # by amyspark-ng

// A custom component for adding a dummy shadow that follows the object
export function dummyShadow() {

	return {
		// Name of the component
		id: "dummyShadow",
		require: [ "pos", "area", "drag", "z" ],
		shadow: null,
		add() {
			this.shadow = add([
				pos(this.pos),
				sprite(this.sprite),
				z(this.z - 1),
				rotate(),
				color(BLACK),
				opacity(0.8),
				anchor("center"),
			])

			this.shadow.onUpdate(() => {
				let xPos = map(this.pos.x, 0, width(), this.pos.x + 8, this.pos.x - 8)
				this.shadow.pos.x = lerp(this.pos.x, xPos, 1.1)
				this.shadow.pos.y = lerp(this.shadow.pos.y, this.pos.y + 8, 1.1)
				this.shadow.angle = this.angle
			})
		
			this.on("dragEnd", () => {
				this.shadow?.destroy()
			})
		},
		destroy() {
			this.shadow?.destroy()
		},
	}
}
