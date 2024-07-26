import { Vec2 } from "kaplay"
import { GameState } from "../../gamestate"
import { ROOT } from "../../main"
import { playSfx, volChangeTune } from "../../sound"
import { togglePanderito } from "../gamescene"
import { bop, getVariable, setVariable } from "../utils"
import { manageWindow } from "./windows-api/windowsAPI"
import { addTooltip } from "../additives"

let volumeControlBg:any;
let barscontainer:any;
let otherCheckboxesBg:any;
let otherButtonsBg:any;

type volumeControlOpt = {
	pos?: Vec2,
	variable?: string
}
export function addVolumeControl(opts:volumeControlOpt, parent:any) {
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
			scale(),
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
		scale(),
		anchor("center"),
	]);

	minus.pos.x = volbars[0].pos.x - 26

	minus.onClick(() => {
		if (GameState.settings.volume > 0) {
			GameState.settings.volume -= 0.1
		}

		else if ((GameState.settings.volume -= 0.1) == 0) {
		}

		bop(volbars[clamp(Math.floor(GameState.settings.volume * 10 - 1), 0, 10)])
		play("volumeChange", { detune: volChangeTune })
		bop(minus)
	});

	let plus = barscontainer.add([
		sprite("plusbutton"),
		pos(142, -194),
		area(),
		scale(),
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

type checkBoxOpt = {
	pos?: Vec2,
	variable?: string,
	sprite?: string,
	title?: string,
	titleSize?: number
}
export function addCheckbox(opts:checkBoxOpt, parent:any) {
	let isVolume = opts.variable == "settings.sfx.muted" || opts.variable == "settings.music.muted" ? true : false

	let checkBox = (parent || ROOT).add([
		sprite("checkbox", {
			anim: "off"
		}),
		pos(opts.pos),
		anchor("center"),
		area(),
		scale(),
		opts.variable == "settings.sfx.muted" ? "sfxCheckbox" : null,
		opts.variable == "settings.music.muted" ? "musicCheckbox" : null,
		{
			addTick(opts = { anim: true}) {
				const tick = this.add([
					sprite("tick"),
					anchor("center"),
					scale(1),
					"tick",
					{
						goAway() {
							destroy(this)
						}
					}
				])
			},

			turnOn(opts = { anim: true }) {
				this.play("on")
				this.addTick({ anim: opts.anim });
			},
			
			turnOff() {
				this.play("off")
				this.get("tick", { recursive: true })[0]?.goAway()
			},
		}
	])

	if (isVolume) {
		if (getVariable(GameState, opts.variable) == true) checkBox.turnOff()
		else checkBox.turnOn()
	}

	else {
		if (getVariable(GameState, opts.variable) == true) checkBox.turnOn()
		else checkBox.turnOff()
	}

	checkBox.onMousePress("left", (() => {
		if (!checkBox.isHovering()) return
		bop(checkBox)

		// if is not volume and the value is true
		if (!isVolume) {
			if (getVariable(GameState, opts.variable) == true) checkBox.turnOff()
			else checkBox.turnOn(true)
		}

		// is volume
		else {
			if (getVariable(GameState, opts.variable) == true) checkBox.turnOn()
			else checkBox.turnOff(true)
		}

		setVariable(GameState, opts.variable, !getVariable(GameState, opts.variable))

		playSfx("clickButton", {detune: getVariable(GameState, opts.variable) == true ? 150 : -150})
	
		if (opts.variable == "settings.fullscreen") {
			setFullscreen(GameState.settings.fullscreen)
		}
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
	let commaAndDot = addCheckbox({ pos: vec2(-144, fullscreenCheckbox.pos.y + 60), variable: "settings.commaInsteadOfDot", title: "Use commas for decimals", titleSize: 30}, otherCheckboxesBg)

	// other buttons
	// bg
	otherButtonsBg = winParent.add([
		rect(winParent.width - 25, 55, { radius: 10 }),
		pos(0, 203),
		color(BLACK),
		opacity(0.25),
		anchor("top"),
	])

	let deleteSave = otherButtonsBg.add([
		sprite("pinch"),
		pos(-140, 24),
		scale(0.8),
		color(RED),
		anchor("center"),
		area(),
		"settingsWindowButton",
		"panderitoButton", // only so it doesn't play hover bruh
		{
			action() {
				GameState.delete()
			},
		}
	])

	let endTooltip;
	deleteSave.onHover(() => {
		let tooltip = addTooltip(deleteSave, { text: "Delete game save, CAREFUL!!!", direction: "up" })
		endTooltip = tooltip.end
	})

	deleteSave.onHoverEnd(() => {
		endTooltip()
	})

	// otherButtonsBg.add([
	// 	sprite("icon_bgColor"),
	// 	pos(-60, 25),
	// 	scale(0.8),
	// 	anchor("center"),
	// 	area(),
	// 	// fill(BLACK, 0.5),
	// 	"settingsWindowButton",
	// 	{
	// 		action() {
	// 			manageWindow("bgColorWin")
	// 		},
	// 	}
	// ])

	// otherButtonsBg.add([
	// 	sprite("panderito"),
	// 	pos(22, 26),
	// 	scale(0.13),
	// 	anchor("center"),
	// 	area(),
	// 	// fill(BLACK, 0.5),
	// 	"settingsWindowButton",
	// 	"panderitoButton",
	// 	{
	// 		action() {
	// 			togglePanderito()
	// 		},
	// 	}
	// ])

	get("settingsWindowButton", { recursive: true }).forEach((setWinBut) => {
		setWinBut.onMousePress("left", () => {
			if (!setWinBut.isHovering()) return
			
			// don't call playSfx openWin here because it is already called openWindow
			if (setWinBut.is("panderitoButton")) playSfx("clickButton", {detune: rand(-100, 100)})
			// bop(setWinBut, setWinBut.is("panderitoButton") ? 2 : 1)
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

	let fullscreenEvent = ROOT.on("fullscreenchange", () => {
		// the variable already changed at the moment 
		// of this so we'll just check it backwards
		if (GameState.settings.fullscreen == false) fullscreenCheckbox.turnOff()
	})

	winParent.onDestroy(() => {
		fullscreenEvent.cancel()
	})
}