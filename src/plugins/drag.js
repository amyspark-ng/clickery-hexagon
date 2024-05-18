// Keep track of the current draggin item
export let curDraggin = null

export function setCurDraggin(value) {
	curDraggin = value
}

// A custom component for handling drag & drop behavior
export function drag() {

	// The displacement between object pos and mouse pos
	let offset = vec2(0)

	return {
		// Name of the component
		id: "drag",
		// This component requires the "pos" and "area" component to work
		require: [ "pos", "area" ],
		pick() {
			// Set the current global dragged to this
			curDraggin = this
			offset = mousePos().sub(this.pos)
			this.trigger("drag")
		},
		// "update" is a lifecycle method gets called every frame the obj is in scene
		update() {
			if (curDraggin === this) {
				this.pos = mousePos().sub(offset)
				// should i clamp it?
				this.trigger("dragUpdate")
			}
		},
		onDrag(action) {
			return this.on("drag", action)
		},
		onDragUpdate(action) {
			return this.on("dragUpdate", action)
		},
		onDragEnd(action) {
			return this.on("dragEnd", action)
		},
	}

}
