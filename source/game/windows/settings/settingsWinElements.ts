import { Vec2 } from "kaplay"
import { ROOT } from "../../../main"
import { blendColors, bop } from "../../utils"
import { manageMute, playSfx, volChangeTune } from "../../../sound"
import { GameState } from "../../../gamestate"
import { addTooltip } from "../../additives"
import { insideWindowHover } from "../../hovers/insideWindowHover"

type checkBoxOpt = {
	pos: Vec2,
	/**
	 * Tag that the checkbox will hav
	 */
	name: string,
	/**
	 * Whether the checkbox starts as checked or not
	 */
	checked: boolean, 
	/**
	 * Function to run when the checkbox is clicked, usually a manageX() function that manages a boolean
	 * It must return a boolean
	 */
	onCheck: () => boolean,
	/**
	 * Name that will appear in the right side
	 */
	title: string,
	/**
	 * Size of title
	 */
	titleSize?: number
}
export function addCheckbox(opts:checkBoxOpt, parent?:any) {
	let checkBox = (parent || ROOT).add([
		sprite("checkbox", {
			anim: "off"
		}),
		pos(opts.pos),
		anchor("center"),
		area(),
		scale(),
		opts.name,
		{
			tick: null,

			turnOn() {
				this.play("on")
				this.tick.appear();
			},
			
			turnOff() {
				this.play("off")
				this.tick.dissapear();
			},
		}
	])

	let tick = checkBox.add([
		sprite("tick"),
		anchor("center"),
		pos(),
		scale(1),
		"tick",
		{
			appear() {
				this.hidden = false
			},

			dissapear() {
				this.hidden = true
			}
		}
	])

	checkBox.tick = tick

	if (opts.checked == true) {
		checkBox.turnOn()
	}

	else {
		checkBox.turnOff()
	}

	checkBox.onClick(() => {
		bop(checkBox)

		// gets the result of the click
		let resultOfClick = opts.onCheck()

		if (resultOfClick == true) {
			checkBox.turnOn()
		}

		else {
			checkBox.turnOff()
		}
	
		playSfx("clickButton", {detune: resultOfClick == true ? 150 : -150})
	})

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

type volumeControlOpt = {
	pos?: Vec2,
	variable?: string
}
export function addVolumeControl(opts:volumeControlOpt, parent:any) {
	let volumeControlBg = (parent || ROOT).add([
		rect(parent.width - 25, 150, { radius: 10 }),
		pos(0, -218),
		color(BLACK),
		opacity(0.25),
		anchor("top"),
	])
	
	let barscontainer = volumeControlBg.add([pos(27, 236)])

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
	let sfx = addCheckbox({
		pos: vec2(-140, 104),
		title: "SFX",
		checked: !GameState.settings.sfx.muted,
		onCheck: () => {
			manageMute("sfx", !GameState.settings.sfx.muted)
			return !GameState.settings.sfx.muted;
		},
		name: "sfxCheckbox",
	}, volumeControlBg)

	let music = addCheckbox({
		pos: vec2(42, 104),
		title: "MUSIC",
		checked: !GameState.settings.music.muted,
		onCheck: () => {
			manageMute("music", !GameState.settings.music.muted)
			return !GameState.settings.music.muted
		},
		name: "musicCheckbox"
	}, volumeControlBg)

	return volumeControlBg;
}

export function addDeleteSaveButton(otherButtonsBg, winParent) {
	let deleteSaveButton = otherButtonsBg.add([
		text("X", { size: 50 }),
		pos(-140, 24),
		anchor("center"),
		color(blendColors(WHITE, RED, 0.5)),
		area(),
		insideWindowHover(winParent),
		{
			count: 3
		}
	])
	
	let deleteSaveButtonTooltip = null;
	deleteSaveButton.startingHover(() => {
		if (deleteSaveButton.tooltip == null) {
			deleteSaveButtonTooltip = addTooltip(deleteSaveButton, {
				direction: "up",
				text: "WILL DELETE YOUR SAVE"
			})
		}
	})

	deleteSaveButton.endingHover(() => {
		deleteSaveButton.count = 3
		deleteSaveButtonTooltip.end()
		deleteSaveButton.color = blendColors(WHITE, RED, 0.5)
	})

	deleteSaveButton.onClick(() => {
		if (!winParent.active) return
	
		deleteSaveButton.count--
		playSfx("clickButton", { detune: 25 * deleteSaveButton.count })
		deleteSaveButton.color = blendColors(WHITE, RED, map(deleteSaveButton.count, 3, 0, 0.5, 1))

		deleteSaveButtonTooltip.end()
		deleteSaveButtonTooltip = addTooltip(deleteSaveButton, {
			direction: "up",
			text: `WILL DELETE YOUR SAVE IN ${deleteSaveButton.count}`
		})

		if (deleteSaveButton.count == 0) {
			deleteSaveButtonTooltip.tooltipText.text = "GOODBYE SAVE :)"
			GameState.delete()
		}
	})

	return deleteSaveButton
}