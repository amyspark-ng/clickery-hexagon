// # Found in kaplay examples

// Keep track of the current draggin item
export let curDraggin = null

export function setCurDraggin(value = null) {
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
		dragging: false,
		pick() {
			// Set the current global dragged to this
			curDraggin = this
			offset = mousePos().sub(this.pos)
			this.trigger("drag")
			this.dragging = true
		},
		// "update" is a lifecycle method gets called every frame the obj is in scene
		update() {
			if (curDraggin === this) {
				if (this.is("sliderButton")) this.pos.x = mousePos().x - (offset.x)
				else this.pos = mousePos().sub(offset) 
				this.trigger("dragUpdate")
			}

			else {
				this.dragging = false
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
		inspect() {
			return `dragging: ${this.dragging}`
		}
	}
}
