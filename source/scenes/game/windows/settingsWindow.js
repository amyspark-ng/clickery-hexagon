import { GameState } from "../../../gamestate"
import { ROOT } from "../../../main"
import { fill } from "../../../plugins/fill"
import { positionSetter } from "../../../plugins/positionSetter"
import { playSfx, volChangeTune } from "../../../sound"
import { togglePanderito } from "../gamescene"
import { bop, getVariable, setVariable } from "../utils"
import { manageWindow } from "./windowsAPI"

let volumeControlBg;
let barscontainer;
let otherCheckboxesBg;
let otherButtonsBg;

export function addVolumeControl(opts = { pos: vec2(), variable: ""}, parent) {
	volumeControlBg = (parent || ROOT).add([
		rect(parent.width - 25, 150, { radius: 10 }),
		pos(0, -218),
		color(BLACK),
		opacity(0.25),
		anchor("top"),
	])
	
	barscontainer = volumeControlBg.add([pos(27, 236)])

	for (let i = 0; i < 10; i++) {
		let volbar = barscontainer.add([
			sprite("volbarbutton"),
			pos(opts.pos),
			anchor("center"),
			area(),
			opacity(1),
			"volbar",
			{
				volume: 0.1 * (i + 1),
				update() {
					// 0 is on and 1 is off for frames
					if (GameState.settings.volume.toFixed(1) < this.volume.toFixed(1)) this.frame = 1
					else this.frame = 0
				}
			}
		])

		volbar.pos.x = volbar.pos.x + (i * 28)

		volbar.onClick(() => {
			tween(GameState.settings.volume, volbar.volume, 0.1, (p) => {
				const lastVolume = GameState.settings.volume
				GameState.settings.volume = parseFloat(p.toFixed(1))
				if (lastVolume != GameState.settings.volume) play("volumeChange", { detune: volChangeTune })
			})
			bop(volbar)
			// progresionally turn the bars to the right off so it has a cool animation
		})
	};

	let volbars = get("volbar", { recursive: true });

	// buttons
	let minus = barscontainer.add([
		sprite("minusbutton"),
		pos(-180, -194),
		area(),
		anchor("center"),
	]);

	minus.pos.x = volbars[0].pos.x - 26

	minus.onClick(() => {
		if (GameState.settings.volume > 0) {
			GameState.settings.volume -= 0.1
		}

		else if (GameState.settings.volume -= 0.1 == 0) {
		}

		bop(volbars[clamp(Math.floor(GameState.settings.volume * 10 - 1), 0, 10)])
		play("volumeChange", { detune: volChangeTune })
		bop(minus)
	});

	let plus = barscontainer.add([
		sprite("plusbutton"),
		pos(142, -194),
		area(),
		anchor("center"),
	]);

	plus.pos.x = volbars[volbars.length - 1].pos.x + 26

	plus.onClick(() => {
		if (GameState.settings.volume <= 0.9) {
			GameState.settings.volume += 0.1
			play("volumeChange", { detune: volChangeTune })
		}

		else play("volumeChange", { detune: volChangeTune, volume: 5 })
		bop(volbars[clamp(Math.floor(GameState.settings.volume * 10 - 1), 0, 10)])
		bop(plus)
	});

	// ADD THE CHECKBOXES
	let sfx = addCheckbox({ pos: vec2(-140, 104), title: "SFX", variable: "settings.sfx.muted"}, volumeControlBg)
	let music = addCheckbox({ pos: vec2(42, 104), title: "MUSIC", variable: "settings.music.muted"}, volumeControlBg)
}

export function addCheckbox(opts = { pos: vec2(), variable: "", sprite: "", title: "", titleSize: 10 }, parent) {
	let checkBox = (parent || ROOT).add([
		rect(45, 45),
		pos(opts.pos),
		anchor("center"),
		area(),
		color(),
		{
			update() {
				if (opts.variable == "settings.sfx.muted" || opts.variable == "settings.music.muted") {
					if (getVariable(GameState, opts.variable) == true) this.color = rgb(40, 41, 40) 
					else this.color = rgb(190, 194, 190)
				}

				else {
					if (getVariable(GameState, opts.variable) == true) this.color = rgb(190, 194, 190)
					else this.color = rgb(40, 41, 40)
				}
			}
		}
	])

	checkBox.onMousePress("left", (() => {
		if (!checkBox.isHovering()) return
		bop(checkBox)
		setVariable(GameState, opts.variable, !getVariable(GameState, opts.variable))
		if (opts.variable == "settings.fullscreen") setFullscreen(getVariable(GameState, "settings.fullscreen"))
	}))

	if (opts.title) {
		(parent || ROOT).add([
			text(opts.title, {
				size: opts.titleSize
			}),
			pos(checkBox.pos.x, 0),
			anchor("left"),
			{
				update() {
					this.pos.x = checkBox.pos.x + checkBox.width / 2 + 10
					this.pos.y = checkBox.pos.y
				}
			}
		])
	}
	
	return checkBox
}

export function settingsWinContent(winParent) {
	let volumeControl = addVolumeControl({ pos: vec2(-winParent.width / 2 + 40, -winParent.height / 2 + 75)}, winParent)

	// checkboxes
	otherCheckboxesBg = winParent.add([
		rect(winParent.width - 25, 255, { radius: 10 }),
		pos(0, -60),
		color(BLACK),
		opacity(0.25),
		anchor("top"),
	])

	let fullscreenCheckbox = addCheckbox({ pos: vec2(-144, 38), variable: "settings.fullscreen", title: "Fullscreen", titleSize: 35}, otherCheckboxesBg)
	let shortNumbers = addCheckbox({ pos: vec2(-144, fullscreenCheckbox.pos.y + 60), variable: "settings.shortNumbers", title: "Shorten numbers", titleSize: 30}, otherCheckboxesBg)
	let dropDragsOnMouseOut = addCheckbox({ pos: vec2(-144, shortNumbers.pos.y + 60), variable: "settings.dropDragsOnMouseOut", title: "Drop objects on mouse exit", titleSize: 25}, otherCheckboxesBg)
	let keepBackgroundAudio = addCheckbox({ pos: vec2(-144, dropDragsOnMouseOut.pos.y + 60), variable: "settings.keepAudioOnTabChange", title: "Keep audio on tab change", titleSize: 25}, otherCheckboxesBg)

	// other buttons
	// bg
	otherButtonsBg = winParent.add([
		rect(winParent.width - 25, 55, { radius: 10 }),
		pos(0, 203),
		color(BLACK),
		opacity(0.25),
		anchor("top"),
	])

	otherButtonsBg.add([
		sprite("icon_hexColor"),
		pos(-140, 24),
		scale(0.8),
		anchor("center"),
		area(),
		// fill(BLACK, 0.5),
		"settingsWindowButton",
		{
			action() {
				manageWindow("hexColorWin")
			},
		}
	])

	otherButtonsBg.add([
		sprite("icon_bgColor"),
		pos(-60, 25),
		scale(0.8),
		anchor("center"),
		area(),
		// fill(BLACK, 0.5),
		"settingsWindowButton",
		{
			action() {
				manageWindow("bgColorWin")
			},
		}
	])

	otherButtonsBg.add([
		sprite("panderito"),
		pos(22, 26),
		scale(0.13),
		anchor("center"),
		area(),
		// fill(BLACK, 0.5),
		"settingsWindowButton",
		"panderitoButton",
		{
			action() {
				togglePanderito()
			},
		}
	])

	get("settingsWindowButton", { recursive: true }).forEach((setWinBut) => {
		setWinBut.onMousePress("left", () => {
			if (!setWinBut.isHovering()) return
			
			playSfx("openWin", rand(0.8, 1.2))
			debug.log("times called")
			bop(setWinBut)
			setWinBut.action()
		})

		setWinBut.onHover(() => {
			if (!setWinBut.is("panderitoButton")) {
				setWinBut.play("hover")
			}
		})

		setWinBut.onHoverEnd(() => {
			if (!setWinBut.is("panderitoButton")) {
				setWinBut.play("default")
			}
		})
	})
}