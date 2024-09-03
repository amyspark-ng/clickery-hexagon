import { GameObj, Vec2 } from "kaplay"
import { ROOT } from "../../../main"
import { blendColors, bop, getRandomDirection } from "../../utils"
import { manageMute, playSfx, volChangeTune } from "../../../sound"
import { GameState, scoreManager } from "../../../gamestate"
import { addTooltip, mouse, tooltipInfo } from "../../additives"
import { spsText } from "../../uicounters"
import { positionSetter } from "../../plugins/positionSetter"
import { insideWindowHover } from "../../hovers/insideWindowHover"
import { addPlusScoreText } from "../../combo-utils"

const defaultTextSize = 36

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
	const winParent = parent.parent;
	
	let checkBox = (parent || ROOT).add([
		sprite("checkbox", {
			anim: "off"
		}),
		pos(opts.pos),
		anchor("center"),
		area(),
		scale(),
		insideWindowHover(winParent),
		opts.name,
		{
			tick: null,

			turnOn() {
				this.play("on")
				this.tick.hidden = false
			},
			
			turnOff() {
				this.play("off")
				this.tick.hidden = true
			},
		}
	])

	let tick = checkBox.add([
		sprite("tick"),
		anchor("center"),
		pos(),
		scale(1),
		"tick",
	])

	checkBox.tick = tick

	if (opts.checked == true) {
		checkBox.turnOn()
	}

	else {
		checkBox.turnOff()
	}

	checkBox.onPressClick(() => {
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
		opts.titleSize = opts.titleSize | defaultTextSize
		
		let title = (parent || ROOT).add([
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

export function addVolumeControl(position:Vec2, parent:GameObj) {
	let barsContainer = parent.add([anchor("center"), pos(-128, -30)])
	let checkboxesContainer = parent.add([anchor("center"), pos(0, -70)])

	const winParent = parent.parent

	for (let i = 0; i < 10; i++) {
		let volbar = barsContainer.add([
			sprite("volbarbutton"),
			pos(0, 0),
			anchor("center"),
			scale(),
			area(),
			opacity(1),
			insideWindowHover(winParent),
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

		// progresionally turn the bars to the right off so it has a cool animation
		volbar.onPressClick(() => {
			tween(GameState.settings.volume, volbar.volume, 0.1, (p) => {
				const lastVolume = GameState.settings.volume
				GameState.settings.volume = parseFloat(p.toFixed(1))
				if (lastVolume != GameState.settings.volume) play("volumeChange", { detune: volChangeTune })
			})
			bop(volbar)
		})
	};

	let volbars = get("volbar", { recursive: true });

	// buttons
	let minus = barsContainer.add([
		sprite("minusbutton"),
		pos(-180, 0),
		area(),
		scale(),
		anchor("center"),
		insideWindowHover(winParent),
	]);

	minus.pos.x = volbars[0].pos.x - 26

	minus.onPressClick(() => {
		if (GameState.settings.volume > 0) {
			GameState.settings.volume -= 0.1
		}

		bop(volbars[clamp(Math.floor(GameState.settings.volume * 10 - 1), 0, 10)])
		play("volumeChange", { detune: volChangeTune })
		bop(minus)
	});

	let plus = barsContainer.add([
		sprite("plusbutton"),
		pos(142, 0),
		area(),
		scale(),
		anchor("center"),
		insideWindowHover(winParent),
	]);

	plus.pos.x = volbars[volbars.length - 1].pos.x + 26

	plus.onPressClick(() => {
		if (GameState.settings.volume <= 0.9) {
			GameState.settings.volume += 0.1
		}
		
		bop(volbars[clamp(Math.floor(GameState.settings.volume * 10 - 1), 0, 10)])
		play("volumeChange", { detune: volChangeTune })
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
	}, checkboxesContainer)

	let music = addCheckbox({
		pos: vec2(42, 104),
		title: "MUSIC",
		checked: !GameState.settings.music.muted,
		onCheck: () => {
			manageMute("music", !GameState.settings.music.muted)
			return !GameState.settings.music.muted
		},
		name: "musicCheckbox"
	}, checkboxesContainer)

	return {
		barsContainer,
		checkboxesContainer,
	};
}

export function addScorePerTimeCounter(position:Vec2, parent:GameObj) {
	parent = parent || ROOT
	
	const winParent = parent.parent

	let values = ["", "Seconds", "Minutes", "Hours"]

	let title = parent.add([
		text("Score per time", { size: 45 }),
		pos(0, 22),
		anchor("center"),
	])
	
	let counter = parent.add([
		text("", { size: 28 }),
		pos(0, title.pos.y + 45),
		anchor("center"),
		{
			update() {
				this.text = values[clamp(Math.floor(GameState.settings.spsTextMode), 1, 3)]
			}
		}
	])

	let leftArrow = parent.add([
		sprite("settingsArrow"),
		pos(0, 80),
		anchor("center"),
		area({ scale: 1.5 }),
		insideWindowHover(winParent),
		{
			update() {
				this.pos.x = lerp(this.pos.x, counter.pos.x - (counter.width / 2) - 20, 0.5)
				this.pos.y = counter.pos.y
			}
		}
	])
	leftArrow.flipX = true

	leftArrow.onPressClick(() => {
		if (GameState.settings.spsTextMode - 1 < 1) GameState.settings.spsTextMode = 3
		else GameState.settings.spsTextMode -= 1
		spsText.updateValue()
		bop(spsText, 0.05)
	})

	let rightArrow = parent.add([
		sprite("settingsArrow"),
		pos(0, 80),
		anchor("center"),
		area({ scale: 1.5 }),
		insideWindowHover(winParent),
		{
			update() {
				this.pos.x = lerp(this.pos.x, counter.pos.x + (counter.width / 2) + 20, 0.5)
				this.pos.y = counter.pos.y
			}
		}
	])

	rightArrow.onPressClick(() => {
		if (GameState.settings.spsTextMode + 1 > 3) GameState.settings.spsTextMode = 1
		else GameState.settings.spsTextMode += 1
		spsText.updateValue()
		bop(spsText, 0.05)
	})

	return {
		title: title,
	};
}

export function addSaveButton(otherButtonsBg:GameObj) {
	const winParent = otherButtonsBg.parent;
	
	let saveButton = otherButtonsBg.add([
		sprite("settingsFloppy"),
		pos(-124, 36),
		anchor("center"),
		area(),
		scale(),
		insideWindowHover(winParent),
		{
			count: 3
		}
	])

	saveButton.onPressClick(() => {
		bop(saveButton)
		if (get("toast").filter(toast => toast.type == "gamesaved").length < 1) {
			playSfx("clickButton", { detune: rand(0, 25) })
			GameState.save()
		}
	})

	let texty = otherButtonsBg.add([
		text("Save", { size: 40 }),
		anchor("center"),
		pos(),
		{
			update() {
				this.pos.x = saveButton.pos.x + saveButton.width + 30
				this.pos.y = saveButton.pos.y
			}
		}
	])
}

export function addDeleteSaveButton(otherButtonsBg:GameObj) {
	const winParent = otherButtonsBg.parent
	
	let deleteSaveButton = otherButtonsBg.add([
		sprite("settingsTrashcan"),
		pos(20, 36),
		anchor("center"),
		area(),
		insideWindowHover(winParent),
		{
			count: 3
		}
	])

	let texty = otherButtonsBg.add([
		text("Delete", { size: 40 }),
		anchor("center"),
		pos(),
		{
			update() {
				this.pos.x = deleteSaveButton.pos.x + deleteSaveButton.width + 40
				this.pos.y = deleteSaveButton.pos.y
			}
		}
	])
	
	let deleteSaveButtonTooltip:tooltipInfo = null;
	deleteSaveButton.startingHover(() => {
		deleteSaveButtonTooltip = addTooltip(deleteSaveButton, {
			direction: "up",
			text: "WILL DELETE YOUR SAVE"
		})
	})

	deleteSaveButton.endingHover(() => {
		deleteSaveButton.count = 3
		deleteSaveButtonTooltip.end()
	})

	let initialTrashPosition = deleteSaveButton.pos

	deleteSaveButton.onPressClick(() => {
		if (!winParent.active) return
	
		deleteSaveButton.count--
		playSfx("clickButton", { detune: 25 * deleteSaveButton.count })

		deleteSaveButtonTooltip.end()
		deleteSaveButtonTooltip = addTooltip(deleteSaveButton, {
			direction: "up",
			text: `WILL DELETE YOUR SAVE IN ${deleteSaveButton.count}`
		})

		if (deleteSaveButton.count == 0) {
			deleteSaveButtonTooltip.tooltipText.text = "GOODBYE SAVE :)"
			GameState.delete()
		}

		let fromZeroToThree = map(deleteSaveButton.count, 0, 3, 3, 0) 
		deleteSaveButtonTooltip.tooltipText.color = blendColors(WHITE, RED, map(fromZeroToThree, 0, 3, 0, 1))

		let randPos = getRandomDirection(initialTrashPosition, false, 1.5 * fromZeroToThree)
		tween(randPos, deleteSaveButton.pos, 0.5, (p) => deleteSaveButton.pos = p, easings.easeOutQuint)
	})

	return deleteSaveButton
}

export function addMinigame(otherButtonsBg:GameObj) {
	const winParent = otherButtonsBg.parent;
	
	let miniHex = otherButtonsBg.add([
		sprite("settingsDottedHex"),
		pos(190, 34),
		area(),
		anchor("center"),
		scale(),
		insideWindowHover(winParent),
	])

	let miniGameActive = scoreManager.autoScorePerSecond() >= 10

	if (miniGameActive) {
		miniHex.sprite = "settingsHex"

		miniHex.onPressClick(() => {
			scoreManager.addScore(1)
			bop(miniHex, 0.05)
			let thing = addPlusScoreText({
				pos: mouse.pos,
				value: 1,
				cursorRelated: false
			})
			thing.scale = vec2(0.4)
			thing.layer = otherButtonsBg.parent.layer
			GameState.stats.timesClicked += 1
		})
	}
}