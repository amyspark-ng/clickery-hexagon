import { GameObj } from "kaplay";
import { GameState } from "../../../gamestate"
import { ROOT, appWindow } from "../../../main";
import { runInTauri, toggleTheFullscreen } from "../../utils";
import { addCheckbox, addDeleteSaveButton, addMinigame, addSaveButton, addScorePerTimeCounter, addVolumeControl } from "./settingsWinElements"

let volumeControlBG:GameObj;
let generalOptionsBG:GameObj;
let buttonsBG:GameObj;

export function settingsWinContent(winParent:GameObj) {
	// ======= VOLUME CONTROl =======
	volumeControlBG = winParent.add([
		rect(winParent.width - 25, 150, { radius: 10 }),
		pos(0, -132),
		color(BLACK),
		opacity(0.25),
		anchor("center"),
	])
	
	let volumeControl = addVolumeControl(vec2(-winParent.width / 2 + 40, -winParent.height / 2 + 75), volumeControlBG)

	// ======= OTHER CHECKBOXES =======
	generalOptionsBG = winParent.add([
		rect(winParent.width - 25, 218, { radius: 10 }),
		pos(0, -44),
		color(BLACK),
		opacity(0.25),
		anchor("top"),
	])

	let fullscreenCheckbox = addCheckbox({
		pos: vec2(-144, 110),
		name: "fullscreenCheckbox",
		checked: GameState.settings.fullscreen,
		onCheck: function (): boolean {
			toggleTheFullscreen()
			return GameState.settings.fullscreen;
		},
		title: "Fullscreen"
	}, generalOptionsBG)

	let checkForFullscreen = ROOT.on("checkFullscreen", () => {
		if (isFullscreen()) fullscreenCheckbox.turnOn()
		else fullscreenCheckbox.turnOff()
		GameState.settings.fullscreen = isFullscreen()
	})

	let commaCheckbox = addCheckbox({
		pos: vec2(-144, fullscreenCheckbox.pos.y + 65),
		name: "commaCheckbox",
		checked: GameState.settings.commaInsteadOfDot,
		onCheck: function (): boolean {
			GameState.settings.commaInsteadOfDot = !GameState.settings.commaInsteadOfDot
			return GameState.settings.commaInsteadOfDot;
		},
		title: "Use commas",
	}, generalOptionsBG)

	let counter = addScorePerTimeCounter(vec2(0, 0), generalOptionsBG)

	// ======= BUTTONS TRAY =======
	buttonsBG = winParent.add([
		rect(winParent.width - 80, 70, { radius: 10 }),
		pos(-27, 182),
		color(BLACK),
		opacity(0.25),
		anchor("top"),
	])

	addSaveButton(buttonsBG)
	addDeleteSaveButton(buttonsBG)
	addMinigame(buttonsBG)

	winParent.on("close", () => {
		checkForFullscreen.cancel()
	})

	ROOT.trigger("checkFullscreen")
}