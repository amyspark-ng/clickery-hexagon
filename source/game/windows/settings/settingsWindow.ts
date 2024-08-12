import { GameState } from "../../../gamestate"
import { ROOT } from "../../../main";
import { runOnTauri } from "../../../tauriUtils";
import { addCheckbox, addDeleteSaveButton, addVolumeControl } from "./settingsWinElements"
import { appWindow } from '@tauri-apps/api/window';

let otherCheckboxesBg:any;
let otherButtonsBg:any;

export function settingsWinContent(winParent) {
	// volume control
	let volumeControl = addVolumeControl({ pos: vec2(-winParent.width / 2 + 40, -winParent.height / 2 + 75)}, winParent)

	// ======= OTHER CHECKBOXES =======
	otherCheckboxesBg = winParent.add([
		rect(winParent.width - 25, 255, { radius: 10 }),
		pos(0, -60),
		color(BLACK),
		opacity(0.25),
		anchor("top"),
	])

	let fullscreenCheckbox = addCheckbox({
		pos: vec2(-144, 38),
		name: "fullscreenCheckbox",
		checked: GameState.settings.fullscreen,
		onCheck: function (): boolean {
			GameState.settings.fullscreen = !GameState.settings.fullscreen
			setFullscreen(GameState.settings.fullscreen)
			runOnTauri(() => appWindow.setFullscreen(GameState.settings.fullscreen))
			return GameState.settings.fullscreen;
		},
		title: "Fullscreen"
	}, otherCheckboxesBg)

	let checkForFullscreen = ROOT.on("checkFullscreen", () => {
		if (isFullscreen()) fullscreenCheckbox.turnOn()
		else fullscreenCheckbox.turnOff()
		GameState.settings.fullscreen = isFullscreen()
	})

	let commaCheckbox = addCheckbox({
		pos: vec2(-144, fullscreenCheckbox.pos.y + 60),
		name: "commaCheckbox",
		checked: GameState.settings.commaInsteadOfDot,
		onCheck: function (): boolean {
			GameState.settings.commaInsteadOfDot = !GameState.settings.commaInsteadOfDot
			return GameState.settings.commaInsteadOfDot;
		},
		title: "Use commas for\ndecimals",
		titleSize: 40,
	}, otherCheckboxesBg)

	// ======= BUTTONS TRAY =======
	otherButtonsBg = winParent.add([
		rect(winParent.width - 25, 55, { radius: 10 }),
		pos(0, 203),
		color(BLACK),
		opacity(0.25),
		anchor("top"),
	])

	addDeleteSaveButton(otherButtonsBg, winParent)

	winParent.on("close", () => {
		checkForFullscreen.cancel()
	})

	ROOT.trigger("checkFullscreen")
}