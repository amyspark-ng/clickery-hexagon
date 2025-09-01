import { Comp, KEventController } from "kaplay";
import { curDraggin } from "../../plugins/drag";
import { folderObj } from "./folderObj";

const timeForHold = 0.18;

export interface OpenWindowButtonComp extends Comp {
	/** Runs when the button is pressed */
	onPress: (action: () => void) => KEventController;
	/** Runs when the button is held for {@link timeForHold `timeForHold`} */
	onHold: (action: () => void) => KEventController;
	/** Runs when the button is released after being held */
	onHoldRelease: (action: () => void) => KEventController;
}

export function openWindowButton(): OpenWindowButtonComp {
	let timeCounter = 0;
	let isHeld = false;
	let timeSinceAdd = 0;

	return {
		id: "windowButton",
		require: ["rotate", "drag", "area"],

		add() {
			folderObj.on("fold", () => {
				isHeld = false;
			});
		},

		update() {
			if (timeSinceAdd < 0.1) timeSinceAdd += dt();

			if (isHeld) {
				// tilting towards direction
				if (isMouseMoved()) this.angle = lerp(this.angle, mouseDeltaPos().x, 0.25);
				else this.angle = lerp(this.angle, 0, 0.25);
			}

			// if is hovering
			if (this.isHovering()) {
				// if is holding down mouse
				if (isMouseDown("left")) {
					// if (!wasHoveringWhenClick) return;
					if (!isHeld) {
						// if the button is not held, it starts counting time
						timeCounter += dt();
						// when it reaches the time it will be held and triggered the held event
						if (timeCounter >= timeForHold) {
							isHeld = true;
							this.trigger("hold");
						}
					}
				}
				else if (isMouseReleased("left")) {
					timeCounter = 0;

					// for the life of me i could not figure out a way to fix this fucking shit
					// was making me genuinely very mad
					if (timeSinceAdd < 0.1) return;

					if (isHeld == true) {
						isHeld = false;
						this.trigger("holdRelease");
					}
					else if (isHeld == false) {
						this.trigger("press");
					}
				}
			}
		},

		onPress(action: () => void) {
			return this.on("press", action);
		},

		onHold(action: () => void) {
			return this.on("hold", action);
		},

		onHoldRelease(action: () => void) {
			return this.on("holdRelease", action);
		},
	};
}
