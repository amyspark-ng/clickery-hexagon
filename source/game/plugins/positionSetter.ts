// # by amyspark-ng

type properties = "pos" | "angle" | "width"

export function positionSetter(property?:properties) {
	property = property ?? "pos"
	
	let distance = 1
	
	let requirement = ""
	if (property == "angle") requirement = "rotate"
	else if (property == "width") requirement = "rect"
	else if (property == "pos") requirement = "pos"

	return {
		id: "positionSetter",
		require: [requirement],
		update() {
			if (this.parent.is("positionSetter")) return
			
			if (isKeyDown("shift") && isKeyDown("control")) distance = 50
			else if (isKeyDown("shift")) distance = 5
			else if (isKeyDown("control")) distance = 10 
			else distance = 1

			if (isKeyPressedRepeat("up")) {
				if (property == "pos") {
					this.pos.y -= distance
					debug.log(this.pos)
				}
			}
			
			if (isKeyPressedRepeat("down")) {
				if (property == "pos") {
					this.pos.y += distance
					debug.log(this.pos)
				}
			}

			if (isKeyPressedRepeat("left")) {
				if (property == "pos") {
					this.pos.x -= distance
					debug.log(this.pos)
				}

				else if (property == "angle") {
					this.angle -= distance
					debug.log(this.angle)
				}

				else if (property == "width") {
					this.width -= distance
					this.height -= distance
					debug.log(this.width)
				}
			}
			
			if (isKeyPressedRepeat("right")) {
				if (property == "pos") {
					this.pos.x += distance
					debug.log(this.pos)
				}

				else if (property == "angle") {
					this.angle += distance
					debug.log(this.angle)
				}
				
				else if (property == "width") {
					this.width += distance
					this.height += distance
					debug.log(this.width)
				}
			}
		},
	}
}