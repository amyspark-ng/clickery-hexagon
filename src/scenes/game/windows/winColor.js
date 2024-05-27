import { GameState } from "../../../GameState";
import { curDraggin, drag, setCurDraggin } from "../../../plugins/drag";
import { waver } from "../../../plugins/wave";
import { playSfx } from "../../../sound";
import { hexagon } from "../addHexagon";
import { bop, gameBg, getSides, mouse } from "../utils";
import { deactivateAllWindows } from "./WindowsMenu";

let lastSoundPos;
let draggingTune;

function deactivateAllSliders() {
	get("sliderButton", { recursive: true }).forEach(sliderbuttons => {
		sliderbuttons.unuse("outline")
	})
}

function typeToColor(type) {
	if (type == "r") return RED
	else if (type == "g") return GREEN
	else if (type == "b") return BLUE
	else return rgb(22, 22, 22)
}

function GetbuttonPosBasedOnValue(coloredObj, type = "r", theOneBehind) {
	let xPos;
	
	if (coloredObj.is("hexagon")) {
		xPos = map(coloredObj.color[type], 0, 255, getSides(theOneBehind).left, getSides(theOneBehind).right);
	}

	else {
		if (type != "a") xPos = map(coloredObj.tintColor[type], 0, 255, getSides(theOneBehind).left, getSides(theOneBehind).right)
		else xPos = map(coloredObj.blendFactor, 0, 1, getSides(theOneBehind).left, getSides(theOneBehind).right);
	}
	return xPos;
}

function getDraggingTune(pos, theOneBehind) {
	draggingTune = map(pos, getSides(theOneBehind).left, getSides(theOneBehind).right, -100, 100)
	draggingTune = clamp(draggingTune, -100, 100)
	return draggingTune
}

function addRgbSlider(winParent, posToAdd = vec2(0), coloredObj, type = "r") {
	let sliderButton;
	let theOneBehind;
	let currentBar;
	let textValue;

	let sliderInfo = {value: 0};
	
	theOneBehind = winParent.add([
		rect(300, 25, { radius: 5  }),
		pos(posToAdd),
		color(WHITE),
		area(),
		anchor("center"),
		z(),
		"slider",
		type + "slider",
	])

	theOneBehind.onClick(() => {
		if (!sliderButton.isHovering()) {
			// calculation stuff
			let objectRect = theOneBehind.screenArea().bbox();
			let distanceFromCenter = mousePos().x - objectRect.pos.x - objectRect.width / 2;
			let relativePosition = distanceFromCenter / (objectRect.width / 2);
			relativePosition = (relativePosition + 0.9) / 1.8;
			relativePosition = clamp(relativePosition, 0, 1)
			const mappedPosition = (relativePosition * 300) - 150;
			tween(sliderButton.pos.x, mappedPosition, 0.2, p => sliderButton.pos.x = p, easings.easeOutQuint)
			playSfx("hoverMiniButton", sliderButton.draggingTune)
		}
	})

	sliderButton = winParent.add([
		rect(10, 35, { radius: 2.5  }),
		pos(GetbuttonPosBasedOnValue(coloredObj, type, theOneBehind), theOneBehind.pos.y),
		color(BLACK),
		anchor("center"),
		area({ scale: vec2(3.5, 1) }),
		drag(),
		color(typeToColor(type)),
		"hoverObj",
		"sliderButton",
		"windowButton",
		"slider",
		type + "slider",
		{
			dragging: false,
			draggingTune: 0,
			update() {
				if (type != "a") { // color
					sliderInfo.value = map(this.pos.x, getSides(theOneBehind).left, getSides(theOneBehind).right, 0, 255)
					sliderInfo.value = clamp(sliderInfo.value, 0, 255)
				}
				else { // blendfactor
					sliderInfo.value = map(this.pos.x, getSides(theOneBehind).left, getSides(theOneBehind).right, 0, 1)
					sliderInfo.value = clamp(sliderInfo.value, 0, 1)
				}
				this.pos.x = clamp(this.pos.x, getSides(theOneBehind).left, getSides(theOneBehind).right)
				if (isMousePressed("left")) {
					if (curDraggin) {
						return
					}
	
					// Loop all "bean"s in reverse, so we pick the topmost one
					for (const obj of get("sliderButton", { recursive: true }).reverse()) {
						if (obj.isHovering()) {
							// grab it!
							mouse.grab()
							obj.pick()
							break
						}
					}

					if (!winParent.isMouseInPreciseRange()) deactivateAllSliders()
				}

				else if (isMouseReleased("left")) {
					if (curDraggin) {
						curDraggin.trigger("dragEnd")
						setCurDraggin(null)
						mouse.release()
					}
				}
			},
		}
	])

	// also works as onClick
	sliderButton.onDrag(() => {
		deactivateAllSliders()
		sliderButton.use(outline(5, type != "a" ? sliderButton.color.darken(100) : sliderButton.color.lighten(100)))

		readd(sliderButton)
		sliderButton.dragging = true
		playSfx("clickButton", rand(-50, 50))
		lastSoundPos = mousePos().x

		// golly
		if (!winParent.is("active")) {
			deactivateAllWindows()
			winParent.activate()
		}
	})

	sliderButton.onMouseMove(() => {
		if (sliderButton.dragging) {
			if (mousePos().x > lastSoundPos + 50 || mousePos().x < lastSoundPos - 50) {
				if (mousePos().x > getSides(winParent).left && mousePos().x < getSides(winParent).right) {
					sliderButton.draggingTune = getDraggingTune(sliderButton.pos.x, theOneBehind)
					lastSoundPos = mousePos().x
					playSfx("hoverMiniButton", sliderButton.draggingTune)
				}
			}
		}
	})

	sliderButton.onDragEnd(() => {
		mouse.play("cursor")
		sliderButton.dragging = false
	})

	currentBar = winParent.add([
		rect(0, 25, { radius: 5  }),
		pos(getSides(theOneBehind).left, theOneBehind.pos.y),
		anchor("left"),
		color(sliderButton.color),
		z(sliderButton.z - 1),
		"slider",
		type + "slider",
		{
			update() {
				this.width = map(sliderButton.pos.x, getSides(theOneBehind).left, getSides(theOneBehind).right, 0, theOneBehind.width)
			}
		}
	])

	theOneBehind.z = sliderButton.z - 2
	currentBar.z = sliderButton.z - 1

	textValue = winParent.add([
		text(sliderInfo.value, {
			size: 25,
			font: "lambdao"
		}),
		area(),
		"slider",
		type + "slider",
		pos(getSides(theOneBehind).right + 5, theOneBehind.pos.y),
		anchor("left"),
		{	
			update() {
				if (sliderInfo.type == "a") this.text = sliderInfo.value.toFixed(2)
				else this.text = Math.round(sliderInfo.value)
			}
		}
	])

	// textValue.onClick(() => {
		// let charInputEvent = onCharInput((ch) => {
			// add([
			// 	rect(textValue.width, textValue.height),
			// 	pos(textValue.pos),
			// 	anchor("center"),
			// ])
			// add a square behind to make you know that is a textbox
			// deactivate everything else, make this the only one active
			// if number make convert textvalue to the number that is being written
			// if !textvalue.active text will be sliderInfo.value, else it will be what i want to be written
			// onFocusLose of textvalue sliderButton.pos will be converted to the position corresponding to that value
			// or enter, also this will be canceled
		// })
	// })

	sliderInfo.button = sliderButton;
	sliderInfo.currentBar = currentBar;
	sliderInfo.bg = theOneBehind;
	sliderInfo.textValue = textValue;
	sliderInfo.type = type;
	return sliderInfo;
}

export function colorWinContent(winParent, winType = "hexColorWin") {
	let rSlider = addRgbSlider(winParent, vec2(-25, -80), winType == "hexColorWin" ? hexagon : gameBg, "r")
	let gSlider = addRgbSlider(winParent, vec2(-25, rSlider.bg.pos.y + 50), winType == "hexColorWin" ? hexagon : gameBg, "g")
	let bSlider = addRgbSlider(winParent, vec2(-25, gSlider.bg.pos.y + 50), winType == "hexColorWin" ? hexagon : gameBg, "b")
	let aSlider;
	if (winType == "bgColorWin") aSlider = addRgbSlider(winParent, vec2(-25, bSlider.bg.pos.y + 50), gameBg, "a")
	
	let sliders;
	if (winType == "hexColorWin") sliders = [rSlider, gSlider, bSlider]
	else sliders = [rSlider, gSlider, bSlider, aSlider]

	let defaultButton = winParent.add([
		rect(40, 40),
		color(WHITE),
		outline(5, BLACK),
		pos(-60, sliders[sliders.length - 1].bg.pos.y + 60),
		area(),
		anchor("center"),
		scale(1),
		"windowButton",
	])

	let randomButton = winParent.add([
		rect(40, 40),
		color(WHITE),
		outline(5, BLACK),
		pos(0, defaultButton.pos.y),
		area(),
		anchor("center"),
		scale(1),
		"windowButton",
	])

	if (winType == "hexColorWin") {
		hexagon.onUpdate(() => {
			hexagon.color.r = rSlider.value
			hexagon.color.g = gSlider.value
			hexagon.color.b = bSlider.value
			GameState.settings.hexColor = [rSlider.value, gSlider.value, bSlider.value]
		})
	}

	else {
		gameBg.onUpdate(() => {
			gameBg.tintColor.r = rSlider.value
			gameBg.tintColor.g = gSlider.value
			gameBg.tintColor.b = bSlider.value
			gameBg.blendFactor = aSlider.value
			GameState.settings.bgColor = [rSlider.value, gSlider.value, bSlider.value, aSlider.value]
		})
	}

	defaultButton.onClick(() => {
		bop(defaultButton)
		if (winType == "hexColorWin") {
			sliders.forEach(slider => {
				tween(slider.button.pos.x, getSides(slider.bg).right, 0.2, (p) => slider.button.pos.x = p, easings.easeOutQuint)
			})
		}

		else {
			let excludedSliders = [rSlider, gSlider, bSlider]
			excludedSliders.forEach(slider => {
				tween(slider.button.pos.x, getSides(slider.bg).left, 0.2, (p) => slider.button.pos.x = p, easings.easeOutQuint)
			})
			tween(aSlider.button.pos.x, aSlider.bg.pos.x + 16, 0.2, (p) => aSlider.button.pos.x = p, easings.easeOutQuint)
		}
	})

	randomButton.onClick(() => {
		bop(randomButton)
		sliders.forEach(slider => {
			tween(slider.button.pos.x, rand(getSides(slider.bg).left, getSides(slider.bg).right), 0.2, (p) => slider.button.pos.x = p, easings.easeOutQuint)
		})
	})

	winParent.onClick(() => {
		if (!get("slider", { recursive: true }).some(sliderObj => {if(sliderObj.is("area")) return sliderObj.isHovering()})) {
			deactivateAllSliders()
		}
	})
}
