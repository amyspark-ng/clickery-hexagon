import { GameState } from "../../gamestate";
import { waver } from "../plugins/wave";
import { bop } from "../utils";
import { getRandomDialogue, mageDialogues, talk } from "./dialogues";

export function addMage() {
	let mageClothColor = rgb(0, 51, 102)
	
	let mage:any;

	mage = add([
		pos(-17, 154),
		waver({ wave_speed: 1, maxAmplitude: 2.5 }),
		layer("ascension"),
		z(1),
		opacity(1),
		anchor("center"),
		"mage",
	]);
	mage.startWave()

	let mage_body = mage.add([
		pos(),
		sprite("mage_body"),
		z(2),
		"mage_body",
	])

	let mage_body_lightning = mage.add([
		pos(),
		sprite("mage_body_lightning"),
		z(3),
		opacity(0.25),
		"mage_lightning",
	])

	let mage_cursors = mage.add([
		pos(0, -7),
		sprite("mage_cursors"),
		z(0),
		waver({ wave_speed: 1, maxAmplitude: 5 }),
		opacity(1),
		color(WHITE.darken(50)),
	])
	mage_cursors.startWave()

	let mage_eye = mage.add([
		pos(117, 120),
		sprite("mage_eye"),
		area({ scale: 0.8 }),
		z(2),
		{
			timeToBlinkAgain: 8,
			timeUntilBlink: 8,
			update() {
				this.timeToBlinkAgain -= dt()
				if (this.timeToBlinkAgain < 0) {
					this.timeToBlinkAgain = rand(5, 8)
					this.timeToBlinkAgain = this.timeToBlinkAgain
					if (chance(0.75)) this.play("blink")
				}
			}
		}
	])

	mage_eye.onClick(() => {
		if (GameState.stats.timesAscended < 1) return
		let randomDialogue = getRandomDialogue("eye") 
		talk("mage", randomDialogue.text, randomDialogue.speed)
		
		mage_eye.play("blink")
	})

	let mage_toparm = mage.add([
		pos(0, 0),
		sprite("mage_toparm"),
		z(1),
		{
			update() {
				this.angle = wave(-0.5, 0.5, time())
			}
		}			
	])

	let mage_toparm_lightning = mage.add([
		pos(0, 0),
		sprite("mage_toparm_lightning"),
		z(4),
		opacity(0.25),
		"mage_lightning",
		{
			update() {
				this.angle = wave(-0.5, 0.5, time())
			}
		}			
	])

	let mage_botarm = mage.add([
		pos(5, 240),
		sprite("mage_botarm"),
		z(7),
		anchor("left"),
		{
			update() {
				this.angle = wave(-1, 1, time())
			}
		}			
	])

	let mage_botarm_lightning = mage.add([
		pos(5, 240),
		sprite("mage_botarm_lightning"),
		z(8),
		anchor("left"),
		opacity(0.25),
		"mage_lightning",
		{
			update() {
				this.angle = wave(-1, 1, time())
			}
		}			
	])

	let mage_hexagon = mage.add([
		pos(GameState.settings.panderitoMode ? vec2(231, 250): vec2(231, 244)),
		sprite(GameState.settings.panderitoMode ? "panderito" : "hexagon"),
		scale(0.35),
		waver({ wave_speed: 1, maxAmplitude: 10 }),
		rotate(0),
		anchor("center"),
		color(WHITE),
		z(5),
		area({ scale: 0.8 }),
		"hexagon",
		{
			update() {
				this.angle += 0.02
			}
		}
	])

	mage_hexagon.onClick(() => {
		if (GameState.stats.timesAscended < 1) return
		let randomDialogue = getRandomDialogue("hex") 
		talk("mage", randomDialogue.text, randomDialogue.speed)
		
		bop(mage_hexagon, 0.01)
	})

	// runs thorugh every object with mage_lightning object and attaches an 
	// onupdate that does the color stuff
	mage.get("mage_lightning").forEach(o => o.onUpdate(() => { 
		o.color = mage_hexagon.color
	}))

	return mage;
}
