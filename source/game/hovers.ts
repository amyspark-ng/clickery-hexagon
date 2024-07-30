import { curDraggin } from "../plugins/drag"
import { mouse } from "./additives";
import { allObjWindows } from "./windows/windows-api/windowsAPI";

export function outsideWindowHover() {
	return {
		id: "outsideHover",
		require: ["area"],
		isBeingHovered: false,

		startHover: null,
		endHover: null,

		onHoverFunction: null,
		onHoverEndFunction: null,

		add() {
			this.onHoverFunction = function() {
				if (curDraggin == null && this.isBeingHovered == false) {
					this.startHover()
					
					this.trigger("outsideHoverStart")
					this.isBeingHovered = true
					mouse.play("point")
				}
			}

			this.onHoverEndFunction = function() {
				if (this.isBeingHovered == false) return
				this.endHover()
				
				this.trigger("outsideHoverEnd")
				this.isBeingHovered = false
				mouse.play("cursor")
			} 

			this.onHover(() => {
				// only check for these conditions here
				if (allObjWindows.isHoveringAWindow == false && allObjWindows.isDraggingAWindow == false) {
					this.onHoverFunction()
				}
			})

			this.onHoverEnd(() => {
				this.onHoverEndFunction()
			})

			this.on("cursorEnterWindow", () => {
				// if the hover animation is playing then stop playing it
				if (this.isBeingHovered == true) {
					this.onHoverEndFunction()
				} 
			})

			this.on("cursorExitWindow", () => {
				// if is being hovered but the animation is not playing
				// due to being inside a window
				if (this.isHovering()) {
					this.onHoverFunction()
				}
			})
		},

		startingHover(action: () => void) {
			this.startHover = action
			// return this.on("outsideHoverStart")
		},

		endingHover(action: () => void) {
			this.endHover = action
			// return this.on("outsideHoverEnd")
		}
	}
}

export function insideHoverWindow(winParent:any) {
	return {
		id: "insideHover",
		require: ["area"],
		isBeingHovered: false,
	
		startHover: null,
		endHover: null,

		onHoverFunction: null,
		onHoverEndFunction: null,
		winParent: winParent,

		add() {
			this.onHoverFunction = function() {
				if (this.winParent.active == false) return
				
				if (this.isBeingHovered == false) {
					this.startHover()
					
					this.trigger("insideHoverStart")
					this.isBeingHovered = true
					mouse.play("point")
				}
			}

			this.onHoverEndFunction = function () {
				if (this.winParent.active == false) return

				if (this.isBeingHovered == true) {
					this.endHover()

					this.trigger("insideHoverEnd")
					this.isBeingHovered = false
					mouse.play("cursor")
				}
			}
		}
	}
}