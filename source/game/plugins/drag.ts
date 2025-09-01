// # Found in kaplay examples

import { AreaComp, Comp, GameObj, KEvent, KEventController, PosComp } from "kaplay";

// Keep track of the current draggin item
export let curDraggin: GameObj<any> = null;

export function setCurDraggin(value = null) {
	curDraggin = value;
}

export interface DragComp extends Comp {
	dragging: boolean;
	pick(): void;
	drop(): void;
	onDrag(action: () => void): KEventController;
	onDragUpdate(action: () => void): KEventController;
	onDragEnd(action: () => void): KEventController;
}

/**
 * Drag objects
 * @param onlyX - only drag it on the X axis
 * @param onlyY - only drag it on the Y axis
 */
export function drag(onlyX: boolean = false, onlyY: boolean = false): DragComp {
	// The displacement between object pos and mouse pos
	let offset = vec2(0);

	return {
		// Name of the component
		id: "drag",
		// This component requires the "pos" and "area" component to work
		require: ["pos", "area"],
		dragging: false,
		pick() {
			// Set the current global dragged to this
			curDraggin = this;
			offset = mousePos().sub(this.pos);
			this.trigger("drag");
			this.dragging = true;
		},
		// "update" is a lifecycle method gets called every frame the obj is in scene
		update() {
			if (curDraggin === this) {
				if (this.dragging == false) this.dragging = true;
				if (onlyX == true) this.pos.x = mousePos().x - (offset.x);
				else if (onlyY == true) this.pos.y = mousePos().y - (offset.y);
				else this.pos = this.pos = mousePos().sub(offset);
				this.trigger("dragUpdate");
			}
			else {
				this.dragging = false;
			}
		},
		drop() {
			this.trigger("dragEnd");
			this.dragging = false;
			curDraggin = null;
		},
		onDrag(action: () => void): KEventController {
			return this.on("drag", action) as KEventController;
		},
		onDragUpdate(action: () => void) {
			return this.on("dragUpdate", action);
		},
		onDragEnd(action: () => void) {
			return this.on("dragEnd", action);
		},
		inspect() {
			return `dragging: ${this.dragging}`;
		},
	};
}
