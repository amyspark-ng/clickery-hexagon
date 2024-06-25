import { GameState } from "../../../gamestate";
import { curDraggin, drag, setCurDraggin } from "../../../plugins/drag";
import { playSfx } from "../../../sound";
import { hexagon } from "../hexagon";
import { blendColors, bop, getPositionOfSide } from "../utils";
import { gameBg, mouse } from "../additives";

let lastSoundPos;
let draggingTune;
export let isDraggingASlider = false;

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

function GetbuttonPosBasedOnValue(value, type = "r", theOneBehind) {
	let xPos;
	
	if (type != "a") xPos = map(value, 0, 255, getPositionOfSide(theOneBehind).left, getPositionOfSide(theOneBehind).right)
	else xPos = map(value, 0, 1, getPositionOfSide(theOneBehind).left, getPositionOfSide(theOneBehind).right);

	return xPos;
}

function getDraggingTune(pos, theOneBehind) {
	draggingTune = map(pos, getPositionOfSide(theOneBehind).left, getPositionOfSide(theOneBehind).right, -100, 100)
	draggingTune = clamp(draggingTune, -100, 100)
	return draggingTune
}

type sliderObject = {
	button: any;
	currentBar: string;
	bg: any;
	textValue: any;
	type: any;
	value: number;
}

function addRgbSlider(winParent, posToAdd = vec2(0), coloredObj, type = "r") {
	let sliderButton;
	let theOneBehind;
	let currentBar;
	let textValueObj;

	let sliderInfo: sliderObject = {
		button: sliderButton,
		currentBar: currentBar,
		bg: theOneBehind,
		textValue: coloredObj.color[type].toString(), // what the hell is text value
		type: type,
		value: coloredObj.color[type]
	};

	theOneBehind = winParent.add([
		rect(300, 25, { radius: 5  }),
		pos(posToAdd),
		color(WHITE),
		area(),
		anchor("center"),
		z(winParent.z + 1),
		"slider",
		type + "slider",
	])

	theOneBehind.onClick(() => {
		if (sliderButton.isHovering()) return

		let xPos = sliderButton.parent.fromScreen(mousePos()).x // thank you MF
		tween(sliderButton.pos.x, xPos, 0.2, p => sliderButton.pos.x = p, easings.easeOutQuint)
		playSfx("hoverMiniButton", {tune: sliderButton.draggingTune})
	})

	sliderButton = winParent.add([
		rect(10, 35, { radius: 2.5  }),
		pos(GetbuttonPosBasedOnValue(coloredObj.color[type], type, theOneBehind), theOneBehind.pos.y),
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
			draggingTune: 0,
			releaseDrop() {
				if (curDraggin) {
					curDraggin.trigger("dragEnd")
					setCurDraggin(null)
					this.dragging = false
					mouse.releaseAndPlay(get("sliderButton").some(obj => obj.isHovering()) || hexagon.isHovering() ? "point" : "cursor")
				}
			},
			update() {
				if (type != "a") { // color
					sliderInfo.value = map(this.pos.x, getPositionOfSide(theOneBehind).left, getPositionOfSide(theOneBehind).right, 0, 255)
					sliderInfo.value = clamp(sliderInfo.value, 0, 255)
				}
				else { // blendfactor
					sliderInfo.value = map(this.pos.x, getPositionOfSide(theOneBehind).left, getPositionOfSide(theOneBehind).right, 0, 1)
					sliderInfo.value = clamp(sliderInfo.value, 0, 1)
				}
				this.pos.x = clamp(this.pos.x, getPositionOfSide(theOneBehind).left, getPositionOfSide(theOneBehind).right)
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
							this.dragging = true
							break
						}
					}

					if (!winParent.isMouseInGeneralRange()) deactivateAllSliders()
				}

				else if (isMouseReleased("left")) this.releaseDrop()
			},
		}
	])

	sliderButton.onHover(() => {
		if (isDraggingASlider) return
		mouse.play("point")
	})

	sliderButton.onHoverEnd(() => {
		if (isDraggingASlider) return
		mouse.play("cursor")
	})

	// also works as onClick
	sliderButton.onDrag(() => {
		deactivateAllSliders()
		sliderButton.use(outline(5, type != "a" ? sliderButton.color.darken(100) : sliderButton.color.lighten(100)))

		readd(sliderButton)
		sliderButton.dragging = true
		playSfx("clickButton", {tune: rand(-50, 50)})
		lastSoundPos = mousePos().x

		// golly
		// if (!winParent.is("active")) {
		// 	deactivateAllWindows()
		// 	winParent.activate()
		// }
	})

	sliderButton.onMouseMove(() => {
		if (sliderButton.dragging) {
			if (mousePos().x > lastSoundPos + 50 || mousePos().x < lastSoundPos - 50) {
				if (mousePos().x > getPositionOfSide(winParent).left && mousePos().x < getPositionOfSide(winParent).right) {
					sliderButton.draggingTune = getDraggingTune(sliderButton.pos.x, theOneBehind)
					lastSoundPos = mousePos().x
					playSfx("hoverMiniButton", {tune: sliderButton.draggingTune})
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
		pos(getPositionOfSide(theOneBehind).left, theOneBehind.pos.y),
		anchor("left"),
		color(sliderButton.color),
		z(sliderButton.z - 1),
		"slider",
		type + "slider",
		{
			update() {
				this.width = map(sliderButton.pos.x, getPositionOfSide(theOneBehind).left, getPositionOfSide(theOneBehind).right, 0, theOneBehind.width)
			}
		}
	])

	theOneBehind.z = sliderButton.z - 2
	currentBar.z = sliderButton.z - 1

	textValueObj = winParent.add([
		text("", {
			size: 25,
			font: "lambdao"
		}),
		area(),
		color(WHITE),
		type + "slider",
		pos(getPositionOfSide(theOneBehind).right + 5, theOneBehind.pos.y),
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
	sliderInfo.textValue = textValueObj;
	sliderInfo.type = type;
	return sliderInfo;
}

export function colorWinContent(winParent, winType = "hexColorWin") {
	let objToColor = winType == "hexColorWin" ? get("hexagon", { recursive: true })[0] : gameBg

	let rSlider = addRgbSlider(winParent, vec2(-25, -80), objToColor, "r")
	let gSlider = addRgbSlider(winParent, vec2(-25, rSlider.bg.pos.y + 50), objToColor, "g")
	let bSlider = addRgbSlider(winParent, vec2(-25, gSlider.bg.pos.y + 50), objToColor, "b")
	let aSlider:any;
	if (winType == "bgColorWin") aSlider = addRgbSlider(winParent, vec2(-25, bSlider.bg.pos.y + 50), gameBg, "a")
	
	let sliders:any;
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

	objToColor.onUpdate(() => {
		objToColor.color.r = rSlider.value
		objToColor.color.g = gSlider.value
		objToColor.color.b = bSlider.value
		if (winType == "bgColorWin") objToColor.color.a = aSlider.value
		
		if (winType == "hexColorWin" && objToColor === hexagon) {
			GameState.settings.hexColor = [rSlider.value, gSlider.value, bSlider.value]
			winParent.color = hexagon.color.lighten(150)
		}

		else if (winType == "bgColorWin" && objToColor === gameBg) {
			GameState.settings.bgColor = [rSlider.value, gSlider.value, bSlider.value, aSlider.value]
			winParent.color = blendColors(gameBg.color.lighten(200), gameBg.color, gameBg.color.a)
		}
	})

	defaultButton.onClick(() => {
		bop(defaultButton)
		if (winType == "hexColorWin") {
			sliders.forEach(slider => {
				tween(slider.button.pos.x, getPositionOfSide(slider.bg).right, 0.2, (p) => slider.button.pos.x = p, easings.easeOutQuint)
			})
		}

		else {
			let excludedSliders = [rSlider, gSlider, bSlider]
			excludedSliders.forEach(slider => {
				tween(slider.button.pos.x, getPositionOfSide(slider.bg).left, 0.2, (p) => slider.button.pos.x = p, easings.easeOutQuint)
			})
			tween(aSlider.button.pos.x, GetbuttonPosBasedOnValue(0.88, "a", aSlider.bg), 0.2, (p) => aSlider.button.pos.x = p, easings.easeOutQuint)
		}
	})

	winParent.onUpdate(() => {
		isDraggingASlider = get("sliderButton", { recursive: true }).some(sliderObj => {if(sliderObj.is("drag")) return sliderObj.dragging})
	})

	randomButton.onClick(() => {
		bop(randomButton)
		sliders.forEach(slider => {
			tween(slider.button.pos.x, rand(getPositionOfSide(slider.bg).left, getPositionOfSide(slider.bg).right), 0.2, (p) => slider.button.pos.x = p, easings.easeOutQuint)
		})
	})

	winParent.onClick(() => {
		if (!get("slider", { recursive: true }).some(sliderObj => {if(sliderObj.is("area")) return sliderObj.isHovering()})) {
			deactivateAllSliders()
		}
	})
}
