// # Found in kaplay examples

// Keep track of the current draggin item
export let curDraggin = null

export function setCurDraggin(value = null) {
	curDraggin = value
}

/**
 * Drag objects
 * @param onlyX - only drag it on the X axis
 */
export function drag(onlyX:boolean = false) {

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
				if (onlyX == true) this.pos.x = mousePos().x - (offset.x)
				else this.pos = this.pos = mousePos().sub(offset) 
				this.trigger("dragUpdate")
			}

			else {
				this.dragging = false
			}
		},
		onDrag(action:() => void) {
			return this.on("drag", action)
		},
		onDragUpdate(action: () => void) {
			return this.on("dragUpdate", action)
		},
		onDragEnd(action: () => void) {
			return this.on("dragEnd", action)
		},
		inspect() {
			return `dragging: ${this.dragging}`
		}
	}
}
