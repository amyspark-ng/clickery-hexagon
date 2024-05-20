import { GameState } from "../../../GameState";
import { curDraggin, drag, setCurDraggin } from "../../../plugins/drag";
import { waver } from "../../../plugins/wave";
import { playSfx } from "../../../sound";
import { hexagon } from "../addHexagon";
import { bop, gameBg, getSides, mouse } from "../utils";

let theOneBehind;
let lastSoundPos;
let draggingTune;

function deactivateAllSliders() {
	// get("slider", { recursive: true }).forEach(otherSliders => {
	// 	if (otherSliders.is("wave")) {
	// 		otherSliders.stopWave()
	// 	}
	// });
	get("sliderButton", { recursive: true }).forEach(sliderbuttons => {
		sliderbuttons.unuse("outline")
	})
}

function typeToColor(type) {
	if (type == "r") return rgb(255, 0, 0)
	else if (type == "g") return rgb(0, 255, 0)
	else if (type == "b") return rgb(0, 0, 255)
	else return rgb(22, 22, 22)
}

function GetbuttonPosBasedOnValue(coloredObj, type = "r", theOneBehind) {
	let xPos;
	
	if (coloredObj.is("hexagon")) {
		if (type == "r") xPos = map(coloredObj.color.r, 0, 255, getSides(theOneBehind).left, getSides(theOneBehind).right);
		else if (type == "g") xPos = map(coloredObj.color.g, 0, 255, getSides(theOneBehind).left, getSides(theOneBehind).right);
		else if (type == "b") xPos = map(coloredObj.color.b, 0, 255, getSides(theOneBehind).left, getSides(theOneBehind).right);
	}

	else {
		if (type == "r") xPos = map(coloredObj.tintColor.r, 0, 255, getSides(theOneBehind).left, getSides(theOneBehind).right)
		else if (type == "g") xPos = map(coloredObj.tintColor.g, 0, 255, getSides(theOneBehind).left, getSides(theOneBehind).right);
		else if (type == "b") xPos = map(coloredObj.tintColor.b, 0, 255, getSides(theOneBehind).left, getSides(theOneBehind).right);
		else if (type == "b") xPos = map(coloredObj.tintColor.b, 0, 255, getSides(theOneBehind).left, getSides(theOneBehind).right);
		else if (type == "a") xPos = map(coloredObj.blendFactor, 0, 1, getSides(theOneBehind).left, getSides(theOneBehind).right);
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
		rect(300, 25),
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
			// calculation pnstuff
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
		rect(10, 35),
		pos(GetbuttonPosBasedOnValue(coloredObj, type, theOneBehind), theOneBehind.pos.y),
		color(BLACK),
		anchor("center"),
		area({ scale: vec2(3.5, 1) }),
		drag(),
		color(typeToColor(type)),
		"hoverObj",
		"sliderButton",
		"slider",
		type + "slider",
		{
			dragging: false,
			draggingTune: 0,
			active: false,
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

	sliderButton.onClick(() => {
		deactivateAllSliders()
		sliderButton.use(outline(5, type != "a" ? typeToColor(type).darken(100) : typeToColor(type).lighten(100)))
		sliderButton.active = true
	})

	sliderButton.onDrag(() => {
		readd(sliderButton)
		sliderButton.dragging = true
		playSfx("clickPress")
		lastSoundPos = mousePos().x
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
		rect(0, 25),
		pos(getSides(theOneBehind).left, theOneBehind.pos.y),
		anchor("left"),
		color(typeToColor(type)),
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

export function hexColorWinContent(winParent) {
	let rSlider = addRgbSlider(winParent, vec2(-25, -80), hexagon, "r")
	let gSlider = addRgbSlider(winParent, vec2(-25, rSlider.bg.pos.y + 50), hexagon, "g")
	let bSlider = addRgbSlider(winParent, vec2(-25, gSlider.bg.pos.y + 50), hexagon, "b")

	let sliders = [rSlider, gSlider, bSlider]

	let defaultBut = winParent.add([
		rect(40, 40),
		color(WHITE),
		outline(5, BLACK),
		pos(-60, 80),
		area(),
		anchor("center"),
		scale(1),
		{
			defScale: vec2(1),
		}
	])

	let randomButton = winParent.add([
		rect(40, 40),
		color(WHITE),
		outline(5, BLACK),
		pos(0, 80),
		area(),
		anchor("center"),
		scale(1),
		{
			defScale: vec2(1),
		}
	])

	hexagon.onUpdate(() => {
		hexagon.color.r = rSlider.value
		hexagon.color.g = gSlider.value
		hexagon.color.b = bSlider.value
		GameState.hexColor = [rSlider.value, gSlider.value, bSlider.value]
	})

	defaultBut.onClick(() => {
		bop(defaultBut)
		sliders.forEach(slider => {
			tween(slider.button.pos.x, getSides(slider.bg).right, 0.2, (p) => slider.button.pos.x = p, easings.easeOutQuint)
		})
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

export function bgColorWinContent(winParent) {
	let rSlider = addRgbSlider(winParent, vec2(-15, -80), gameBg, "r")
	let gSlider = addRgbSlider(winParent, vec2(-15, rSlider.bg.pos.y + 50), gameBg, "g")
	let bSlider = addRgbSlider(winParent, vec2(-15, gSlider.bg.pos.y + 50), gameBg, "b")
	let aSlider = addRgbSlider(winParent, vec2(-15, bSlider.bg.pos.y + 50), gameBg, "a")

	let sliders = [rSlider, gSlider, bSlider, aSlider]

	let defaultButton = winParent.add([
		rect(40, 40),
		color(WHITE),
		outline(5, BLACK),
		pos(-60, 100),
		area(),
		scale(1),
		{
			defScale: vec2(1),
		}
	])

	let randomButton = winParent.add([
		rect(40, 40),
		color(WHITE),
		outline(5, BLACK),
		pos(0, 100),
		area(),
		scale(1),
		{
			defScale: vec2(1),
		}
	])

	gameBg.onUpdate(() => {
		gameBg.tintColor.r = rSlider.value
		gameBg.tintColor.g = gSlider.value
		gameBg.tintColor.b = bSlider.value
		gameBg.blendFactor = aSlider.value
		GameState.bgColor = [rSlider.value, gSlider.value, bSlider.value, aSlider.value]
	})

	randomButton.onClick(() => {
		bop(randomButton)
		sliders.forEach(slider => {
			tween(slider.button.pos.x, rand(getSides(slider.bg).left, getSides(slider.bg).right), 0.2, (p) => slider.button.pos.x = p, easings.easeOutQuint)
		})
	})

	defaultButton.onClick(() => {
		bop(defaultButton)
		sliders.slice(0, -1).forEach(slider => {
			tween(slider.button.pos.x, getSides(slider.bg).left, 0.2, (p) => slider.button.pos.x = p, easings.easeOutQuint)
		})
		tween(aSlider.button.pos.x, aSlider.bg.pos.x + 16, 0.2, (p) => aSlider.button.pos.x = p, easings.easeOutQuint)
	})

	winParent.onClick(() => {
		if (!get("slider", { recursive: true }).some(sliderObj => {if(sliderObj.is("area")) return sliderObj.isHovering()})) {
			deactivateAllSliders()
		}
	})
}