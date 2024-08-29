// =========================
// OUTSIDE HOVER COMPONENT
import { GameObj } from "kaplay"
import { mouse } from "../additives"
import { curDraggin } from "../plugins/drag"
import { allPowerupsInfo } from "../powerups"
import { allObjWindows } from "../windows/windows-api/windowManaging"

// =========================
export function outsideWindowHover() {
	return {
		id: "outsideHover",
		require: ["area"],
		isBeingHovered: false,

		startHoverAnim: null as () => void,
		endHoverAnim: null as () => void,

		startHoverFunction: null as () => void,
		endHoverFunction: null as () => void,

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
				if (this.isBeingHovered == false || this.dragging == true) return
				this.endHoverAnim()
				
				this.trigger("outsideHoverEnd")
				mouse.play("cursor")
				this.isBeingHovered = false
			} 

			this.onHover(() => {
				// only check for these conditions here
				if (allObjWindows.isHoveringAWindow == false && allPowerupsInfo.isHoveringAPowerup == false && allObjWindows.isDraggingAWindow == false) {
					this.startHoverFunction()
				}
			})

			this.onHoverEnd(() => {
				this.endHoverFunction()
			})

			this.on("cursorEnterWindow", (windowObj:GameObj) => {
				// if the hover animation is playing then stop playing it
				if (this.isBeingHovered == true) {
					this.endHoverFunction()
				}
			})

			this.on("cursorExitWindow", (windowObj:GameObj) => {
				// if is being hovered but the animation is not playing
				// due to being inside a window
				if (this.isHovering()) {
					this.startHoverFunction()
				}
			})

			// this.onMouseMove(() => {
			// 	if (allObjWindows.isHoveringAWindow == true || allPowerupsInfo.isHoveringAPowerup == true || allObjWindows.isDraggingAWindow == true) {
			// 		this.endHoverFunction()
			// 	}
			// })
		},

		/**
		 * Sets hover anim
		 */
		startingHover(action: () => void) {
			this.startHoverAnim = action
		},

		/**
		 * Sets end hover anim
		 */
		endingHover(action: () => void) {
			this.endHoverAnim = action
		}
	}
}
