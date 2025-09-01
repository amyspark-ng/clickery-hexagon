import { GameState } from "../../../gamestate";
import { curDraggin } from "../.././plugins/drag";
import { playSfx } from "../../../sound";
import { ascension } from "../../ascension/ascension";
import { blendColors, bop, sortedTaskbar } from "../../utils";
import { setTimeSinceSkip, timeSinceSkip } from "../musicWindow";
import { addMinibutton, getMinibuttonPos, MinibuttonGameObj, miniButtonXarea } from "./minibuttons";
import { allObjWindows, manageWindow, windowKey } from "./windowManaging";
import { allPowerupsInfo } from "../../powerups";
import { hoverController } from "../../../hoverManaging";

export let folderObj: ReturnType<typeof addFolderObj>;
export let folded = true;
let timeSinceFold = 0;

function getMinibuttons() {
	return get("minibutton") as MinibuttonGameObj[];
}

let movingMinibuttons: boolean = false;
/**
 * Adds the folder obj which contains manager for some things like:
 * - window hovering
 * - window number key shortcut
 * - closest minibutton to drag
 */
export function addFolderObj() {
	// reset variables
	folded = true;
	timeSinceFold = 0;

	allPowerupsInfo.isHoveringAPowerup = false;

	movingMinibuttons = false;
	let foldWaiter = wait(0, () => {});

	let theFolderObj = add([
		sprite("folderObj"),
		pos(width() - 40, height() - 40),
		area({ scale: vec2(1.2) }),
		layer("ui"),
		z(0),
		scale(),
		anchor("center"),
		opacity(),
		hoverController(3),
		"folderObj",
		{
			defaultScale: vec2(1.2),
			interactable: true,
			unfold() {
				folded = false;
				this.flipX = false;
				timeSinceFold = 0;
				playSfx("fold");

				GameState.taskbar = sortedTaskbar();

				// if there's no minibutton
				if (get("minibutton").length == 0) {
					GameState.taskbar.forEach((key, taskbarIndex) => {
						addMinibutton({
							windowKey: key as windowKey,
							taskbarIndex: taskbarIndex,
							initialPosition: theFolderObj.pos,
						});
					});

					movingMinibuttons = true;
					foldWaiter?.cancel();
					foldWaiter = wait(0.32, () => movingMinibuttons = false);
				}
				// there are already minibutons, move them again to their places
				else {
					getMinibuttons().forEach((minibutton: MinibuttonGameObj) => {
						minibutton.destinedPosition = getMinibuttonPos(minibutton.taskbarIndex);
						minibutton.destinedOpacity = 1;
					});
				}

				this.trigger("unfold");
			},

			fold() {
				folded = true;
				this.flipX = true;

				// return them to folderObj pos
				movingMinibuttons = true;
				getMinibuttons().forEach((minibutton: MinibuttonGameObj) => {
					minibutton.destinedPosition = vec2(width() - 40, height() - 40);
					minibutton.destinedOpacity = 0;
				});

				// foldWaiter?.cancel()
				foldWaiter = wait(0.64, () => {
					movingMinibuttons = false;
				});

				playSfx("fold", { detune: -150 });
				this.trigger("fold");
			},

			manageFold() {
				if (folded) theFolderObj.unfold();
				else theFolderObj.fold();
			},

			addSlots() {
				get("minibutton").filter(minibutton => !minibutton.extraMb).forEach((minibutton, index) => {
					// add slots
					add([
						rect(20, 20, { radius: 4 }),
						pos(getMinibuttonPos(index)),
						color(BLACK),
						anchor("center"),
						opacity(0.5),
						"minibuttonslot",
						"slot_" + index,
						{
							taskbarIndex: index,
						},
					]);
				});
			},

			deleteSlots() {
				let minibuttonsslots = get("minibuttonslot");
				minibuttonsslots?.forEach((minibuttonslot) => {
					destroy(minibuttonslot);
				});
			},
		},
	]);

	theFolderObj.onUpdate(() => {
		if (curDraggin?.is("gridMiniButton") || curDraggin?.is("minibutton")) return;
		if (!movingMinibuttons) {
			if (theFolderObj.interactable == true && isKeyPressed("space")) {
				theFolderObj.manageFold();
				theFolderObj.deleteSlots();
				bop(theFolderObj);
			}
		}

		if (timeSinceFold < 0.25) timeSinceFold += dt();
		if (timeSinceSkip < 5) setTimeSinceSkip(timeSinceSkip + dt());
	});

	theFolderObj.onClick(() => {
		folderObj.manageFold();
		theFolderObj.deleteSlots();
		bop(folderObj);
	});

	// this can't be attached to the buttons because you won't be able to call the event if the buttons don't exist
	theFolderObj.onCharInput((key) => {
		if (ascension.ascending == true) return;
		if (isKeyDown("control")) return;
		if (curDraggin) return;

		// parse the key to number
		const numberPressed = parseInt(key);
		if (isNaN(numberPressed)) return; // If the key is not a number, return

		// adjust it to 0, 1, 2, 3
		const index = numberPressed - 1;

		// // if the window you're trying to open is the same as the minibutton that is being dragged don't open it!!
		// if (curDraggin?.is("minibutton") && curDraggin?.idxForInfo == infoForWindows[curDraggin?.windowKey].idx) return

		// silly
		if (numberPressed == 0) {
			if (folded) theFolderObj.unfold();
			manageWindow("extraWin");
		}
		else if (index >= 0 && index < GameState.taskbar.length) {
			const windowKey = GameState.taskbar[index];

			if (GameState.unlockedWindows.includes(windowKey)) {
				if (folded) theFolderObj.unfold();

				let minibutton = get(windowKey)?.filter(obj => obj.is("minibutton"))[0];
				if (minibutton) minibutton.trigger("press");
				else manageWindow(windowKey);
			}
		}
	});

	theFolderObj.on("winClose", () => {
		// gets the topmost window
		let allWindows = get("window");
		if (allWindows.length > 0) allWindows.reverse()[0].activate();

		get("outsideHover").forEach((obj) => {
			obj.trigger("cursorExitWindow");
		});
	});

	// manages behaviour related to the closeest minibutton
	onUpdate("closestMinibuttonToDrag", (minibutton: MinibuttonGameObj) => {
		if (!curDraggin?.is("gridMiniButton")) return;
		if (curDraggin?.screenPos().dist(minibutton.screenPos()) > 120) return;
		let distanceToCurDragging = curDraggin?.screenPos().dist(minibutton.screenPos());

		minibutton.nervousSpinSpeed = 14;
		let blackness = map(distanceToCurDragging, 20, 120, 1, 0.25);
		minibutton.destinedOpacity = map(distanceToCurDragging, 20, 120, 0.5, 1);
		minibutton.scale.x = map(distanceToCurDragging, 20, 120, 0.8, 1);
		minibutton.scale.y = map(distanceToCurDragging, 20, 120, 0.8, 1);
		minibutton.scale.y = map(distanceToCurDragging, 20, 120, 0.8, 1);
		minibutton.color = blendColors(WHITE, BLACK, blackness);
	});

	folderObj = theFolderObj;
	return theFolderObj;
}
