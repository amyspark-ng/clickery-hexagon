import { AreaComp, Comp, GameObj, Vec2 } from "kaplay";
import { DragComp } from "./game/plugins/drag";

export interface HoverControllerComp extends Comp {
	/** Determines wheter the object has higher priority for hover */
	clickIndex: number;
	/** A custom hover scale passed, will be 1 most of the times */
	customHoverScale: Vec2;
}

/** Component that gives the clickIndex property */
export function hoverController(clickIndex: number = 0, customScale: Vec2 = vec2(1)): HoverControllerComp {
	let oldestParentWithHover = null;

	return {
		id: "hover",
		clickIndex: clickIndex,
		customHoverScale: customScale,
		add() {
			oldestParentWithHover = this.parent;
		},

		update() {
			// condition for no parent not nothing
			if (this.parent == getTreeRoot()) {
				this.clickIndex = clickIndex;
				return;
			}

			// goes back in the hierarchy until it finds a clickIndex
			while (!oldestParentWithHover || !oldestParentWithHover.is("hover")) {
				oldestParentWithHover = oldestParentWithHover.parent;
			}

			if (oldestParentWithHover.is("hover")) this.clickIndex = oldestParentWithHover.clickIndex;
			else this.clickIndex = 0;
		},
	};
}

type typicalHoverObj = GameObj<AreaComp | HoverControllerComp | DragComp>;

/** Function that manages the hovering and area of all hover-eable objects */
export function hoverManaging() {
	let hoverObjects = get("hover", { recursive: true }) as typicalHoverObj[];

	onUpdate(() => {
		hoverObjects = get("hover", { recursive: true }) as typicalHoverObj[];

		// for dragged objects
		const draggedObject = hoverObjects.find((obj) => obj.dragging == true);
		if (draggedObject) {
			draggedObject.area.scale = draggedObject.customHoverScale;
			const allOtherObjects = hoverObjects.filter((filtObj) => filtObj != draggedObject);
			allOtherObjects.forEach((obj) => obj.area.scale = vec2(0));
			return;
		}

		// no obj is being hovered
		if (!hoverObjects.some((obj) => obj.isHovering())) {
			hoverObjects.forEach((obj) => obj.area.scale = obj.customHoverScale);
			return;
		}

		// the rest of the cases
		// every object checks if an object with a higher index is hovered, if so, the object should
		// have its area turned off
		hoverObjects.sort((a, b) => b.clickIndex - a.clickIndex).forEach((curObj, index) => {
			const higherHoveredObject = hoverObjects.find((obj) => obj.clickIndex > curObj.clickIndex && obj.isHovering());
			if (!higherHoveredObject) {
				curObj.area.scale = curObj.customHoverScale;
				return;
			}

			curObj.area.scale = vec2(0);
		});
	});
}
