import { Vec2 } from "kaplay";
import { curDraggin } from "../../plugins/drag"

const timeForHold = 0.18

export function openWindowButton() {
	let lastPosClicked:Vec2;

	return {
		id: "windowButton",
		require: ["rotate", "drag", "dummyShadow"],

		add() {
			let waitingHold = wait(0, () => {})
			this.onMousePress("left", () => {
				lastPosClicked = mousePos()
				if (!this.isBeingHovered) return
			
				waitingHold.cancel()
				waitingHold = wait(timeForHold, () => {
					if (!this.isBeingHovered) return
					if (curDraggin) {
						return
					}
		
					// hold function
					this.trigger("hold")
				})
			})

			this.onMouseRelease("left", () => {
				if (this.dragging) {
					this.trigger("holdRelease")
				}

				// was not being dragged
				else {
					waitingHold.cancel()
					// if last posclicked is inside gridminibutton
					if (!this.isBeingHovered) return
					if (!this.hasPoint(lastPosClicked)) return
					if (curDraggin) return
	
					// click function
					this.trigger("press")
				}
			})
		},

		update() {
			if (this.dragging) {
				// tilting towards direction
				if (isMouseMoved()) this.angle = lerp(this.angle, mouseDeltaPos().x, 0.25)
				else this.angle = lerp(this.angle, 0, 0.25)
			}
		},

		onPress(action: () => void) {
			return this.on("press", action)
		},

		onHold(action: () => void) {
			return this.on("hold", action)
		},

		onHoldRelease(action: () => void) {
			return this.on("holdRelease", action)
		},
	}
}