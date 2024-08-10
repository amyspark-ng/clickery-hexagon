import { GameState } from "../../gamestate";
import { ROOT } from "../../main";
import { curDraggin, drag, setCurDraggin } from ".././plugins/drag";
import { dummyShadow } from ".././plugins/dummyShadow";
import { playSfx } from "../../sound";
import { bop } from "../utils";
import { mouse } from "../additives";
import { buttonSpacing, infoForWindows, openWindow, windowKey } from "./windows-api/windowManaging";
import { addMinibutton } from "./windows-api/minibuttons";
import { openWindowButton } from "./windows-api/openWindowButton";
import { destroyExclamation } from "../unlockables/unlockablewindows";
import { insideWindowHover } from "../hovers/insideWindowHover";

export let gridContainer;

let currentClosest;

// Function to update the closest minibutton
function updateClosestMinibuttonToDrag() {
    // Get all minibuttons
    const minibuttons = get("minibutton").filter(minibutton => !minibutton.extraMb);

    // Initialize variables to track the closest minibutton
    let closestDistance = Infinity;
    let closestMinibutton = null;

    // Check the distance to each minibutton
    minibuttons.forEach(minibutton => {
		const dist = curDraggin?.screenPos().dist(minibutton.screenPos());
        if (dist < closestDistance) {
            closestDistance = dist;
            closestMinibutton = minibutton;
        }
    });

	// dettach
    // If the closest minibutton has changed
    if (closestMinibutton !== currentClosest) {
        // Detach the onUpdate event from the previous closest minibutton
        if (currentClosest) {
			if (currentClosest.is("closestMinibuttonToDrag")) {
				currentClosest.unuse("closestMinibuttonToDrag")
				currentClosest.opacity = 1
				currentClosest.scale = vec2(1)
				currentClosest.color = WHITE
				currentClosest.nervousSpinSpeed = 10
			}
		}
		
		// Update the current closest minibutton
        currentClosest = closestMinibutton;
		
        // Attach the onUpdate event to the new closest minibutton
        if (currentClosest) {
			if (!currentClosest.is("closestMinibuttonToDrag")) currentClosest.use("closestMinibuttonToDrag")
        }
    }
}

/**
 * Makes a gridMiniButton to add
 * @param idx 
 * @param gridSlot 
 * @param winParent 
 * @returns the grid minibutton
 */
export function makeGridMinibutton(windowKey:windowKey, gridSlot:any, winParent:any) {
	let selection:any;
	let distanceToSlot:number
	let distanceToClosestMinibutton:number;
	let minibuttons:any[];
	let closestMinibutton = null;
	let closestDistance = Infinity;

	let idx = infoForWindows[windowKey].idx

	let gridMiniButton = make([
		sprite(`icon_${infoForWindows[Object.keys(infoForWindows)[idx]].icon || Object.keys(infoForWindows)[idx].replace("Win", "")}`, {
			anim: "default"
		}),
		anchor("center"),
		opacity(1),
		pos(gridSlot.pos),
		color(WHITE),
		scale(0),
		drag(),
		layer("windows"),
		z(winParent.z + 1),
		area(),
		rotate(0),
		dummyShadow(),
		insideWindowHover(winParent),
		openWindowButton(),
		"gridMiniButton",
		{
			windowKey: windowKey,
			beingHeld: false,

			releaseDrop(defaultShadow = true) {
				if (curDraggin == this) {
					curDraggin.trigger("dragEnd")
					setCurDraggin(null)
					mouse.releaseAndPlay("cursor")
					gridMiniButton.layer = "windows"

					// wtf???
					let thisThing = this;

					const goToShadowSlot = function() {
						// GO BACK TO SLOT
						let gridMinibuttonIdx = infoForWindows[thisThing.windowKey].idx
						destroy(thisThing)
						gridContainer.add(makeGridMinibutton(windowKey, get(`gridShadow_${gridMinibuttonIdx}`, { recursive: true })[0], winParent))
						playSfx("plop")
						
						// reset their properties
						get("minibutton").forEach(element => {
							tween(element.angle, 0, 0.32, (p) => element.angle = p, easings.easeOutQuint)
							element.color = WHITE
							element.opacity = 1
							element.scale = vec2(1)
						});

						get("gridMiniButton", { recursive: true }).forEach(element => {
							if (element.isHovering()) element.startHoverFunction()
						})
					}

					const goToTaskbar = function() {
						// add the new minibutton to the minibutton list
						
						let newMinibutton = addMinibutton({
							windowKey: thisThing.windowKey,
							taskbarIndex: closestMinibutton.taskbarIndex,
							initialPosition: thisThing.pos,
							destPosition: closestMinibutton.pos,
						})

						GameState.taskbar[closestMinibutton.taskbarIndex] = thisThing.windowKey
						
						// destroy closestminibutton and grid minibutton
						tween(closestMinibutton.opacity, 0, 0.32, (p) => closestMinibutton.opacity = p, easings.easeOutQuint)
						tween(closestMinibutton.scale, vec2(0), 0.32, (p) => closestMinibutton.scale = p, easings.easeOutQuint).onEnd(() => {
							destroy(closestMinibutton)
						})
						destroy(thisThing)
						
						// cmb => closest minibutton
						let cmbShadow = get(`gridShadow`, { recursive: true }).filter(cmb => cmb.windowKey == closestMinibutton.windowKey)[0]
		
						// make the new gridminibutton to the one that was just unpinned
						gridContainer.add(makeGridMinibutton(closestMinibutton.windowKey, cmbShadow, winParent))
						playSfx("plop")
	
						get("minibutton").forEach(minibutton => {
							tween(minibutton.angle, 0, 0.15, (p) => minibutton.angle = p, easings.easeOutQuint)
						})
					}

					if ((distanceToSlot < distanceToClosestMinibutton) || defaultShadow == true) goToShadowSlot()
					else goToTaskbar()
				}
			}
		},
	])

	tween(gridMiniButton.scale, vec2(1), 0.32, (p) => gridMiniButton.scale = p, easings.easeOutElastic)
	
	gridMiniButton.onUpdate(() => {
		if (gridMiniButton.dragging) {
			closestMinibutton = null;
			closestDistance = Infinity;
	
			// Get all minibuttons
			minibuttons = get("minibutton").filter(minibutton => !minibutton.extraMb);
			
			// Check the distance to each minibutton
			minibuttons.forEach(minibutton => {
				const distance = gridMiniButton.screenPos().dist(minibutton.pos);
				if (distance < closestDistance) {
					closestDistance = distance;
					closestMinibutton = minibutton;
				}
			});
	
			distanceToSlot = gridMiniButton.screenPos().dist(gridSlot.screenPos())
			distanceToClosestMinibutton = gridMiniButton.screenPos().dist(closestMinibutton.screenPos())
		}
	})

	gridMiniButton.startingHover(() => {
		playSfx("hoverMiniButton", {detune: 100 * idx / 4})
		gridMiniButton.play("hover")
		
		selection = gridSlot.add([
			pos(),
			rect(gridMiniButton.width, gridMiniButton.height, { radius: 5 }),
			opacity(0.15),
			anchor("center"),
			"gridMinibuttonSelection",
		])
	})

	gridMiniButton.endingHover(() => {
		gridMiniButton.play("default")
		tween(gridMiniButton.angle, 0, 0.32, (p) => gridMiniButton.angle = p, easings.easeOutQuint)
		selection?.destroy()
	})

	// press, hold and release hold functions
	gridMiniButton.onPress(() => {
		if (get(gridMiniButton.windowKey)[0]) winParent.close()
		
		else {
			openWindow(gridMiniButton.windowKey as windowKey); 
			winParent.close()
		}
		
		bop(gridMiniButton)
	})

	gridMiniButton.onHold(() => {
		get("gridMinibuttonSelection", { recursive: true }).forEach(selection => {
			selection?.destroy()
		})
		
		// get out of the parent and sends him to the real world (root)
		gridMiniButton.parent.children.splice(gridMiniButton.parent.children.indexOf(gridMiniButton), 1)
		gridMiniButton.parent = ROOT
		ROOT.children.push(gridMiniButton)

		// important
		gridMiniButton.pos = toScreen(mousePos())
		gridMiniButton.z = mouse.z - 1

		destroyExclamation(gridMiniButton)
		gridMiniButton.layer = "mouse"
		mouse.grab()
		gridMiniButton.pick()
		playSfx("plap")
	})

	gridMiniButton.onHoldRelease(() => {
		gridMiniButton.releaseDrop(false)
	})

	return gridMiniButton
}

let amountOfElementsX = 5
let amountOfElementsY = 2
export function extraWinContent(winParent) {
	// makes the grid
	gridContainer = winParent.add([pos(-154, -192)])

	for(let i = 0; i < Object.keys(infoForWindows).length - 1; i++) {
		let windowKey = Object.keys(infoForWindows)[i]
		let buttonPositionX = 0
		let buttonPositionY = 0
		
		// 75 buttonSpacing
		if (i < amountOfElementsX) buttonPositionX = 1 + i * 75;
		else buttonPositionX = (1 + (i - amountOfElementsX) * 75) + 75 / amountOfElementsX

		if (i < amountOfElementsX) buttonPositionY = 0;
		else buttonPositionY = buttonSpacing + 10

		// add the shadow/empty-spot one
		let shadowOne = gridContainer.add([
			sprite(`icon_${infoForWindows[windowKey].icon || windowKey.replace("Win", "")}`, {
				anim: "default"
			}),
			anchor("center"),
			opacity(0.5),
			pos(buttonPositionX, buttonPositionY),
			color(BLACK),
			area(),
			`gridShadow_${i}`,
			"gridShadow",
			{
				idx: i,
				windowKey: windowKey
			}
		])

		// if the button is not on the taskbar
		if (!GameState.taskbar.includes(windowKey)) {
			// if the button is unlocked
			if (GameState.unlockedWindows.includes(windowKey)) {
				gridContainer.add(makeGridMinibutton(windowKey as windowKey, shadowOne, winParent))
			}
		}
	}

	winParent.onUpdate(() => {
		if (curDraggin == null || !curDraggin.is("gridMiniButton")) return
		updateClosestMinibuttonToDrag()
	})

	// # manages open closed animation
	// winParent.on("open")
	let extraMinibutton = get("extraMinibutton")[0]
	if (extraMinibutton) {
		extraMinibutton.shut = false
		extraMinibutton.play(`open_${extraMinibutton.isHovering() ? "hover" : "default"}`)
	}

	// if a window is unlocked and this is opened
	let winUnlockEvent = ROOT.on("winUnlock", (window) => {
		// let newMinibutton = gridContainer.add(makeGridMinibutton(infoForWindows[window].idx, get(`gridShadow_${infoForWindows[window].idx}`, { recursive: true })[0], winParent))
	})
	
	winParent.on("close", () => {
		let extraMinibutton = get("extraMinibutton")[0]
		if (extraMinibutton) {
			extraMinibutton.shut = true
			extraMinibutton.play(`shut_${extraMinibutton.isHovering() ? "hover" : "default"}`)
		}
		winUnlockEvent.cancel()
	})
}