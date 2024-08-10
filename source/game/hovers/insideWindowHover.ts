// =========================
// INSIDE HOVER WINDOW COMPONENT

import { AreaComp, GameObj } from "kaplay"
import { curDraggin } from "../plugins/drag"

// =========================
export function insideWindowHover(winParent:GameObj) {
	
	// doesn't take in account mouse animations, do it by yourself in the hover function!!
	return {
		id: "insideHover",
		require: ["area"],
		isBeingHovered: false,
	
		startHoverAnim: null,
		endHoverAnim: null,

		startHoverFunction: null,
		endHoverFunction: null,
		winParent: winParent,

		add() {
			this.startHoverFunction = function() {
				if (this.isBeingHovered == false) {
					this.startHoverAnim()
					
					this.trigger("insideHoverStart")
					this.isBeingHovered = true
				}
			}

			this.endHoverFunction = function () {
				if (this.isBeingHovered == true) {
					this.endHoverAnim()

					this.trigger("insideHoverEnd")
					this.isBeingHovered = false
				}
			}

			this.onHover(() => {
				if (curDraggin) return
				if (this.winParent.active == false) return
				// only check for these conditions here
				// if (allObjWindows.isHoveringAWindow == false && allObjWindows.isDraggingAWindow == false) {
					this.startHoverFunction()
				// }
			})

			this.onHoverEnd(() => {
				if (this.dragging == true) return
				if (this.winParent.active == false) return
				this.endHoverFunction()
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