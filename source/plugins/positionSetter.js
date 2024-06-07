export function positionSetter() {
	return {
		id: "setterAnimation",
		require: [ "pos" ],
		distance: 1,
		update() {
			if (this.parent.is("setterAnimation")) return
			
			if (isKeyDown("shift") && isKeyDown("control")) this.distance = 50
			else if (isKeyDown("shift")) this.distance = 5
			else if (isKeyDown("control")) this.distance = 10 
			else this.distance = 1

			if (isKeyPressedRepeat("up")) {
				this.pos.y -= this.distance
				debug.log(this.pos)
			}
			
			if (isKeyPressedRepeat("down")) {
				this.pos.y += this.distance
				debug.log(this.pos)
			}

			if (isKeyPressedRepeat("left")) {
				this.pos.x -= this.distance
				debug.log(this.pos)
			}
				
			if (isKeyPressedRepeat("right")) {
				this.pos.x += this.distance
				debug.log(this.pos)
			}
		},

		add() {
			// this.use(area())
			// this.use(drag())
		}
	}
}