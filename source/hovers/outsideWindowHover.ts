import { curDraggin } from "../plugins/drag"
import { allObjWindows } from "../game/windows/windows-api/windowManaging";
import { mouse } from "../game/additives";

// =========================
// OUTSIDE HOVER COMPONENT
// =========================
export function outsideWindowHover() {
	return {
		id: "outsideHover",
		require: ["area"],
		isBeingHovered: false,

		startHoverAnim: null,
		endHoverAnim: null,

		startHoverFunction: null,
		endHoverFunction: null,

		add() {
			this.startHoverFunction = function() {
				if (curDraggin == null && this.isBeingHovered == false) {
					this.startHoverAnim()
					
					this.trigger("outsideHoverStart")
					mouse.play("point")
					this.isBeingHovered = true
				}
			}

			this.endHoverFunction = function() {
				if (this.isBeingHovered == false) return
				this.endHoverAnim()
				
				this.trigger("outsideHoverEnd")
				mouse.play("cursor")
				this.isBeingHovered = false
			} 

			this.onHover(() => {
				// only check for these conditions here
				if (allObjWindows.isHoveringAWindow == false && allObjWindows.isDraggingAWindow == false) {
					this.startHoverFunction()
				}
			})

			this.onHoverEnd(() => {
				this.endHoverFunction()
			})

			this.on("cursorEnterWindow", (windowObj) => {
				// if the hover animation is playing then stop playing it
				if (this.isBeingHovered == true) {
					this.endHoverFunction()
				}
			})

			this.on("cursorExitWindow", (windowObj) => {
				// if is being hovered but the animation is not playing
				// due to being inside a window
				if (this.isHovering()) {
					this.startHoverFunction()
				}
			})
		},

		startingHover(action: () => void) {
			this.startHoverAnim = action
			// return this.on("outsideHoverStart")
		},

		endingHover(action: () => void) {
			this.endHoverAnim = action
			// return this.on("outsideHoverEnd")
		}
	}
}
