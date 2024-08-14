import { GameState } from "../../gamestate";
import { ROOT } from "../../main";
import { curDraggin, drag, setCurDraggin } from "../plugins/drag";
import { dummyShadow } from "../plugins/dummyShadow";
import { playSfx } from "../../sound";
import { bop, getPosInGrid } from "../utils";
import { mouse } from "../additives";
import { buttonSpacing, infoForWindows, manageWindow, openWindow, windowKey } from "./windows-api/windowManaging";
import { addMinibutton } from "./windows-api/minibuttons";
import { openWindowButton } from "./windows-api/openWindowButton";
import { destroyExclamation } from "../unlockables/windowUnlocks";
import { insideWindowHover } from "../hovers/insideWindowHover";
import { GameObj } from "kaplay";

export let gridContainer:GameObj;
let currentClosest:GameObj;

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
export function addGridButton(windowKey:windowKey) {
	let selection:any;
	let distanceToSlot:number
	let distanceToClosestMinibutton:number;
	let minibuttons:any[];
	let closestMinibutton = null;
	let closestDistance = Infinity;

	let winParent:GameObj = gridContainer.parent;
	let gridSlot:GameObj = get(`gridShadow`, { recursive: true }).filter(gridShadow => gridShadow.windowKey == windowKey)[0];

	let windowInfo = infoForWindows[windowKey]

	let theSprite = "icon_" + windowKey.replace("Win", "")

	let gridButton = gridContainer.add([
		sprite(theSprite, {
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
					gridButton.layer = "windows"

					// wtf???
					let thisThing = this;

					const goToShadowSlot = function() {
						// GO BACK TO SLOT
						let gridMinibuttonIdx = infoForWindows[thisThing.windowKey].idx
						destroy(thisThing)
						addGridButton(windowKey)
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
						addGridButton(closestMinibutton.windowKey)
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

	tween(gridButton.scale, vec2(1), 0.32, (p) => gridButton.scale = p, easings.easeOutElastic)
	
	gridButton.onUpdate(() => {
		if (gridButton.dragging) {
			closestMinibutton = null;
			closestDistance = Infinity;
	
			// Get all minibuttons
			minibuttons = get("minibutton").filter(minibutton => !minibutton.extraMb);
			
			// Check the distance to each minibutton
			minibuttons.forEach(minibutton => {
				const distance = gridButton.screenPos().dist(minibutton.pos);
				if (distance < closestDistance) {
					closestDistance = distance;
					closestMinibutton = minibutton;
				}
			});
	
			distanceToSlot = gridButton.screenPos().dist(gridSlot.screenPos())
			distanceToClosestMinibutton = gridButton.screenPos().dist(closestMinibutton.screenPos())
		}
	})

	gridButton.startingHover(() => {
		let idx = windowInfo.idx
		playSfx("hoverMiniButton", {detune: 100 * idx / 4})
		gridButton.play("hover")
		
		selection = gridSlot.add([
			pos(),
			rect(gridButton.width, gridButton.height, { radius: 5 }),
			opacity(0.15),
			anchor("center"),
			"gridMinibuttonSelection",
		])
	})

	gridButton.endingHover(() => {
		gridButton.play("default")
		tween(gridButton.angle, 0, 0.32, (p) => gridButton.angle = p, easings.easeOutQuint)
		selection?.destroy()
	})

	// press, hold and release hold functions
	gridButton.onPress(() => {
		let window = get(gridButton.windowKey).filter((obj) => obj.is("window"))[0] 
		// the window already exists, close it but not this one
		if (window) window.close()
		else winParent.close()

		manageWindow(gridButton.windowKey)
		bop(gridButton)
	})

	gridButton.onHold(() => {
		get("gridMinibuttonSelection", { recursive: true }).forEach(selection => {
			selection?.destroy()
		})
		
		// get out of the parent and sends him to the real world (root)
		gridButton.parent.children.splice(gridButton.parent.children.indexOf(gridButton), 1)
		gridButton.parent = ROOT
		ROOT.children.push(gridButton)

		// important
		gridButton.pos = toScreen(mousePos())
		gridButton.z = mouse.z - 1

		destroyExclamation(gridButton)
		gridButton.layer = "mouse"
		mouse.grab()
		gridButton.pick()
		playSfx("plap")
	})

	gridButton.onHoldRelease(() => {
		gridButton.releaseDrop(false)
	})

	return gridButton
}

let amountOfElementsX = 5
let amountOfElementsY = 2
export function extraWinContent(winParent) {
	// makes the grid
	gridContainer = winParent.add([pos(-164, -32)])

	function getExtraBtnPos(index:number) {
		let initialPos = vec2(18, 15)
		let pos = vec2()

		let column = 0;
		let row = 0;

		// column
		if (index < amountOfElementsX) column = index
		else column = index - amountOfElementsX

		// row
		if (index < amountOfElementsX) row = 0
		else row = 1

		pos = getPosInGrid(initialPos, row, column, vec2(buttonSpacing - 5))
		return pos
	}

	for(let i = 0; i < Object.keys(infoForWindows).length - 1; i++) {
		let windowKey = Object.keys(infoForWindows)[i]
	
		let thePos = getExtraBtnPos(i)

		// add the shadow/empty-spot one
		let shadowOne = gridContainer.add([
			sprite(`icon_${infoForWindows[windowKey].icon || windowKey.replace("Win", "")}`, {
				anim: "default"
			}),
			anchor("center"),
			opacity(0.5),
			pos(thePos),
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
				addGridButton(windowKey as windowKey)
			}
		}
	}

	winParent.onUpdate(() => {
		if (curDraggin == null || !curDraggin.is("gridMiniButton")) return
		updateClosestMinibuttonToDrag()
	})

	// # manages open closed animation
	let extraMinibutton = get("extraMinibutton")[0]
	if (extraMinibutton) {
		extraMinibutton.shut = false
		extraMinibutton.play(`open_${extraMinibutton.isHovering() ? "hover" : "default"}`)
	}

	winParent.on("close", () => {
		let extraMinibutton = get("extraMinibutton")[0]
		if (extraMinibutton) {
			extraMinibutton.shut = true
			extraMinibutton.play(`shut_${extraMinibutton.isHovering() ? "hover" : "default"}`)
		}
	})
}