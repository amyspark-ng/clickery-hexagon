import { GameState } from "../../../gamestate"
import { ROOT } from "../../../main"
import { volChangeTune } from "../../../sound"
import { bop, getVariable, setVariable } from "../utils"

export function addVolumeControl(opts = { pos: vec2(), variable: ""}, parent) {
	for (let i = 0; i < 10; i++) {
		let volbar = (parent || ROOT).add([
			rect(20, 50),
			pos(opts.pos),
			anchor("center"),
			area(),
			opacity(1),
			"volbar",
			{
				volume: 0.1 * (i + 1),
				update() {
					if (GameState.settings.volume == 0) this.opacity = 0.1
					else if (GameState.settings.volume.toFixed(1) < this.volume.toFixed(1)) this.opacity = 0.1
					else this.opacity = 1
				}
			}
		])

		volbar.pos.x = volbar.pos.x + (i * 30)

		volbar.onClick(() => {
			GameState.settings.volume = volbar.volume
			play("volumeChange", { detune: volChangeTune })
		})
	};

	let volbars = get("volbar", { recursive: true });

	// buttons
	let minus = (parent || ROOT).add([
		text("-", {
			size: 50
		}),
		pos(volbars[0].pos.x - 30, opts.pos.y),
		area(),
	]);

	minus.onClick(() => {
		if (GameState.settings.volume > 0) {
			GameState.settings.volume -= 0.1
		}

		else if (GameState.settings.volume -= 0.1 == 0) {
		}

		play("volumeChange", { detune: volChangeTune })
	});

	let plus = (parent || ROOT).add([
		text("+", {
			size: 50
		}),
		pos(volbars[volbars.length - 1].pos.x + 30, opts.pos.y),
		area(),
	]);

	plus.onClick(() => {
		if (GameState.settings.volume <= 0.9) {
			GameState.settings.volume += 0.1
			play("volumeChange", { detune: volChangeTune })
		}

		// else play("whistle")
		else play("volumeChange", { detune: volChangeTune, volume: 5 })
	});

	return volbars[0];
}

export function addCheckbox(opts = { pos: vec2(), variable: "", sprite: "" }, parent) {
	GameState.settings.fullscreen = false

	let checkBox = (parent || ROOT).add([
		rect(45, 45),
		pos(opts.pos),
		anchor("center"),
		area(),
		color(getVariable(GameState, opts.variable) ? GREEN : RED),
		{
			update() {
				if (getVariable(GameState, opts.variable) == true) this.color = GREEN
				else this.color = RED
			}
		}
	])

	checkBox.onClick(() => {
		bop(checkBox)
		setVariable(GameState, opts.variable, !getVariable(GameState, opts.variable))
		if (opts.variable == "settings.fullscreen") setFullscreen(getVariable(GameState, "settings.fullscreen"))
	})

	return checkBox
}

export function settingsWinContent(winParent) {
	let volumeControl = addVolumeControl({ pos: vec2(-winParent.width / 2 + 40, -winParent.height / 2 + 75)}, winParent)
	let dropDragsOnMouseOut = addCheckbox({ pos: vec2(-winParent.width / 2 + 40, volumeControl.pos.y + 75), variable: "settings.dropDragsOnMouseOut"}, winParent)
	let fullscreen = addCheckbox({ pos: vec2(-winParent.width / 2 + 40, dropDragsOnMouseOut.pos.y + 75), variable: "settings.fullscreen"}, winParent)
}