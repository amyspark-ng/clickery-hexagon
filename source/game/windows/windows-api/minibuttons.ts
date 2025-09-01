import { curDraggin, drag, setCurDraggin } from "../.././plugins/drag";
import { dummyShadow } from "../.././plugins/dummyShadow";
import { playSfx } from "../../../sound";
import { bop, getPosInGrid, swap } from "../../utils";
import { mouse } from "../../additives";
import { allObjWindows, buttonSpacing, infoForWindows, manageWindow, openWindow, windowKey } from "./windowManaging";
import { GameState } from "../../../gamestate";
import { GameObj, PosComp, Quad, SpriteComp, SpriteData, Vec2 } from "kaplay";
import { openWindowButton } from "./openWindowButton";
import { folded, folderObj } from "./folderObj";
import { destroyExclamation } from "../../unlockables/windowUnlocks";
import { hoverController } from "../../../hoverManaging";

type minibuttonOpt = {
	windowKey: windowKey;
	taskbarIndex: number;
	initialPosition: Vec2;
	destPosition?: Vec2;
};

/** Gets minibutton pos based on taskbar index
 *
 * Accounts for extra win (will always have a taskbarindex of 4)
 * @param taskbarIndex The task bar index
 */
export function getMinibuttonPos(taskbarIndex: number) {
	if (taskbarIndex == 4) return vec2(width() - 40, height() - 40 - buttonSpacing);
	return getPosInGrid(folderObj.pos, 0, -taskbarIndex - 1, vec2(75, 0));
}

export const miniButtonXarea = 0.8;
export const miniButtonYarea = 1.3;
export type MinibuttonGameObj = ReturnType<typeof addMinibutton>;

export function addMinibutton(opts: minibuttonOpt) {
	let quad: Quad; // don't touch this

	getSprite("bean")?.then(quady => {
		quad = quady.frames[0];
	});

	let idxForInfo = infoForWindows[opts.windowKey].idx as number;

	let destinedPosition: Vec2;
	if (opts.destPosition) destinedPosition = opts.destPosition;
	else {
		destinedPosition = getMinibuttonPos(opts.taskbarIndex);
	}

	/** The string for the sprite of the minibutton */
	const theSprite = `icon_${infoForWindows[opts.windowKey].icon ?? opts.windowKey.replace("Win", "")}`;

	const currentMinibutton = add([
		sprite(theSprite),
		pos(opts.initialPosition),
		anchor("center"),
		area(),
		scale(1),
		opacity(1),
		rotate(0),
		drag(),
		color(),
		layer("ui"),
		z(folderObj.z - 1),
		dummyShadow(),
		openWindowButton(),
		hoverController(2),
		`${opts.windowKey}`,
		"minibutton",
		infoForWindows[opts.windowKey].icon == "extra" ? "extraMinibutton" : "",
		{
			idxForInfo: idxForInfo,
			taskbarIndex: opts.taskbarIndex,
			window: get(`${opts.windowKey}`, { recursive: true })[0] ?? null,
			windowInfo: null,
			windowKey: opts.windowKey,
			nervousSpinSpeed: 10,
			saturation: 0,
			saturationColor: WHITE,
			defaultScale: vec2(1),
			dragHasSurpassed: false,
			destinedPosition: destinedPosition,
			destinedOpacity: 0,
			extraMb: infoForWindows[opts.windowKey].icon == "extra" ? true : null,
			shut: get("extraWin")[0] ? false : true,
			update() {
				if (this.dragging == false) {
					if (curDraggin?.is("minibutton") && !this.extraMb) {
						// spinning
						// if it's waiting to be swapped
						this.angle = wave(-8, 8, time() * 3);
						this.saturation = wave(0.005, 0.05, time() * 3);

						// swapping behaviour
						// if the distance is less than 15
						if (Math.abs(curDraggin?.pos.sub(this.pos).x) < 15) {
							// i have to move it to the right, therefore left will be false
							if (curDraggin.pos.x < this.pos.x && !this.dragHasSurpassed) {
								this.trigger("dragHasSurpassed", true);
							}

							if (curDraggin.pos.x > this.pos.x && !this.dragHasSurpassed) {
								this.trigger("dragHasSurpassed", false);
							}
						}
						else {
							this.dragHasSurpassed = false;
						}
					}
					// curDragging is gridMinibutton, this is waiting to be replaced, nervous, panic!!
					else if (curDraggin?.is("gridMiniButton") && !this.extraMb) {
						this.angle = wave(-4, 4, time() * this.nervousSpinSpeed);
						this.saturation = wave(0.01, 0.1, time() * 3);
					}
					// no curdragging
					else if (curDraggin == null) {
						if (this.isBeingHovered) {
							this.angle = wave(-8, 8, time() * 3);
						}
						else {
							this.angle = lerp(this.angle, 0, 0.25);
						}

						// saturation
						if (this.window != null) {
							this.saturation = wave(0.01, 0.1, time() * 3);
						}
						else {
							this.saturation = 0;
						}
					}
				}
			},

			drawInspect() {
				if (this.extraMb) return;
				drawText({
					text: this.taskbarIndex,
					pos: vec2(0, -this.height),
					anchor: "center",
					size: 25,
					color: WHITE,
				});
			},

			pickFromTaskbar() {
				this.pick();

				this.layer = "mouse";
				this.z = mouse.z - 1;
				folderObj.addSlots();
				playSfx("plap", { detune: 100 * this.windowInfo.idx / 4 });
				bop(this, 0.1);

				if (this.window) this.window.close();
			},

			releaseDrop() {
				curDraggin.drop();
				this.layer = "ui";
				this.z = folderObj.z - 1;

				let closestSlot = null;
				let closestDistance = Infinity;

				// Get all minibutton slots
				const minibuttonSlots = get("minibuttonslot");

				// Check the distance to each minibutton
				minibuttonSlots.forEach(slot => {
					const distance = currentMinibutton.screenPos().dist(slot.screenPos());
					if (distance < closestDistance) {
						closestDistance = distance;
						closestSlot = slot;
					}
				});

				let movingTween = null;

				// if the taskbarindexes don't coincide
				// goes back to the slot corresponding to its taskbar index
				if (this.taskbarIndex != closestSlot.taskbarIndex) {
					movingTween = tween(this.pos, get(`slot_${this.taskbarIndex}`)[0].pos, 0.32, (p) => this.pos = p, easings.easeOutQuint);
				}
				// if the taskbar indexes do coincide
				// goes to the slot that coincides with its taskbar index
				if (this.taskbarIndex == closestSlot.taskbarIndex) movingTween = tween(this.pos, closestSlot.pos, 0.32, (p) => this.pos = p, easings.easeOutQuint);

				playSfx("plop", { detune: 100 * this.windowInfo.idx / 4 });
				this.z = folderObj.z - 1;

				// destroys all slots except the current one
				get("minibuttonslot").filter(minibuttonslot => minibuttonslot.taskbarIndex != this.taskbarIndex).forEach((minibuttonslot) => {
					destroy(minibuttonslot);
				});

				// when it ends it destroys its slot
				movingTween.onEnd(() => {
					let currentSlot = get(`slot_${this.taskbarIndex}`)[0];
					currentSlot?.fadeOut(0.32).onEnd(() => currentSlot?.destroy());
				});
			},
		},
	]);

	// having this be of type any caused the typing of the object to not work, that's weird right?
	currentMinibutton.windowInfo = infoForWindows[opts.windowKey];

	let isHovering = false;

	if (currentMinibutton.extraMb) {
		currentMinibutton.destinedPosition = vec2(folderObj.pos.x, folderObj.pos.y - buttonSpacing);
	}
	else {
		currentMinibutton.destinedPosition.x = getMinibuttonPos(currentMinibutton.taskbarIndex).x;
		currentMinibutton.destinedPosition.y = folderObj.pos.y;
	}

	currentMinibutton.onUpdate(() => {
		isHovering = currentMinibutton.isHovering() || currentMinibutton.dragging;

		if (currentMinibutton.isHovering() && !currentMinibutton.dragging) {
			currentMinibutton.angle = lerp(currentMinibutton.angle, wave(-8, 8, time() * 3), 0.6);
		}

		if (isHovering) {
			if (currentMinibutton.getCurAnim().name != "hover") {
				if (currentMinibutton.extraMb) {
					currentMinibutton.play(`${currentMinibutton.shut ? "shut" : "open"}_hover`);
				}
				else currentMinibutton.play("hover");
			}
		}
		else {
			if (currentMinibutton.getCurAnim().name != "default") {
				if (currentMinibutton.extraMb) {
					currentMinibutton.play(`${currentMinibutton.shut ? "shut" : "open"}_default`);
				}
				else currentMinibutton.play("default");
			}
		}

		currentMinibutton.area.offset = vec2(10);
	});

	if (currentMinibutton.extraMb) {
		if (currentMinibutton.shut) currentMinibutton.play("shut_default");
		else currentMinibutton.play("open_default");
	}
	else currentMinibutton.play("default");

	// animate them
	currentMinibutton.destinedOpacity = 1;

	const duration = 0.32;
	let elapsedTime = 0;
	let lastPos = currentMinibutton.pos;

	currentMinibutton.onUpdate(() => {
		currentMinibutton.opacity = lerp(currentMinibutton.opacity, currentMinibutton.destinedOpacity, 0.32);
		if (folded) currentMinibutton.customHoverScale = vec2(0);
		else currentMinibutton.customHoverScale = vec2(1);

		if (currentMinibutton.dragging) return;
		if (elapsedTime < duration) {
			elapsedTime += dt();
			const t = Math.min(elapsedTime / duration, 1);
			currentMinibutton.pos = lerp(lastPos, currentMinibutton.destinedPosition, easings.easeOutBack(t));
		}
		else {
			currentMinibutton.pos = lerp(currentMinibutton.pos, currentMinibutton.destinedPosition, 0.32);
		}
	});

	// currentMinibutton is the one being swapped to met the curDragging wish
	currentMinibutton.on("dragHasSurpassed", (left) => {
		currentMinibutton.dragHasSurpassed = true;

		// the bigger the index the more to the ACTUAL left it will be
		// -- to the right / ++ to the left

		const oldMinibuttonIndex = currentMinibutton.taskbarIndex;
		const oldDragginIndex = curDraggin.taskbarIndex;

		// change it before they're swapped
		GameState.taskbar[oldDragginIndex] = currentMinibutton.windowKey;
		GameState.taskbar[oldMinibuttonIndex] = curDraggin.windowKey;

		currentMinibutton.taskbarIndex = oldDragginIndex;
		curDraggin.taskbarIndex = oldMinibuttonIndex;

		// sets position based on the new taskbarindex
		let newXPos = getMinibuttonPos(currentMinibutton.taskbarIndex).x;
		currentMinibutton.destinedPosition.x = newXPos;
	});

	currentMinibutton.use(shader("saturate", () => ({
		"saturation": currentMinibutton.saturation,
		"saturationColor": currentMinibutton.saturationColor,
		"u_pos": vec2(quad.x, quad.y),
		"u_size": vec2(quad.w, quad.h),
	})));

	currentMinibutton.onHover(() => {
		if (folded || curDraggin || currentMinibutton.dragging) return;
		playSfx("hoverMiniButton", { detune: 100 * currentMinibutton.windowInfo.idx / 4 });
		currentMinibutton.destinedPosition.y -= 5;

		tween(currentMinibutton.scale, vec2(1.05), 0.32, (p) => currentMinibutton.scale = p, easings.easeOutQuint);
	});

	currentMinibutton.onHoverEnd(() => {
		if (folded || currentMinibutton.dragging) return;
		currentMinibutton.destinedPosition.y += 5;
		tween(currentMinibutton.scale, vec2(1), 0.32, (p) => currentMinibutton.scale = p, easings.easeOutQuint);
		currentMinibutton.defaultScale = vec2(1.05);
	});

	currentMinibutton.onPress(() => {
		// click function
		manageWindow(currentMinibutton.windowKey);
		bop(currentMinibutton);

		// unlocking stuff
		destroyExclamation(currentMinibutton);
	});

	if (currentMinibutton.windowKey != "extraWin") {
		currentMinibutton.onHold(() => {
			if (curDraggin) return;

			currentMinibutton.pickFromTaskbar();

			// unlocking stuff
			destroyExclamation(currentMinibutton);
		});

		currentMinibutton.onHoldRelease(() => {
			if (curDraggin == currentMinibutton) {
				currentMinibutton.destinedPosition.x = getMinibuttonPos(currentMinibutton.taskbarIndex).x;
				currentMinibutton.releaseDrop();
			}
		});
	}

	return currentMinibutton;
}
