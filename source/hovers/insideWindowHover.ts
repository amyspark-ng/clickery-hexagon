// =========================
// INSIDE HOVER WINDOW COMPONENT
// =========================
export function insideWindowHover(winParent:any) {
	
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
				if (this.winParent.active == false) return
				
				if (this.isBeingHovered == false) {
					this.startHoverAnim()
					
					this.trigger("insideHoverStart")
					this.isBeingHovered = true
				}
			}

			this.endHoverFunction = function () {
				if (this.winParent.active == false) return

				if (this.isBeingHovered == true) {
					this.endHoverAnim()

					this.trigger("insideHoverEnd")
					this.isBeingHovered = false
				}
			}

			this.onHover(() => {
				// only check for these conditions here
				// if (allObjWindows.isHoveringAWindow == false && allObjWindows.isDraggingAWindow == false) {
					this.startHoverFunction()
				// }
			})

			this.onHoverEnd(() => {
				this.endHoverFunction()
			})

			// this.on("insideHoverStart", () => {
			// 	if (this.isBeingHovered == true) {
			// 		this.endHoverFunction()
			// 	}

			// 	else {
			// 		this.startHoverFunction()
			// 	}
			// })
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