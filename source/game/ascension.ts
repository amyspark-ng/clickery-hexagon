import { Vec2 } from "kaplay";
import { GameState } from "../gamestate";
import { ROOT } from "../main"
import { waver } from "../plugins/wave";
import { hexagon } from "./hexagon"
import { bop } from "./utils";
import { playSfx } from "../sound";

export let ascending = false;

let cardsInfo = {
	"clickersCard": { info: "Clickers are +1% more efficient" },
	"cursorsCard": { info: "Cursors are +1% more efficient", basePrice: 50, percentageIncrease: 25 },
	"powerupsCard": { info: "Powerups are +1% more efficient", basePrice: 1000, percentageIncrease: 50, unlockPrice: 10000 },
	"achievementsCard": { info: "You get +1% more for every achivement you unlock", basePrice: 1000, percentageIncrease: 50, unlockPrice: 10000 },
	"hexColorCard": { info: "You can customize the hexagon's color", basePrice: 1000, percentageIncrease: 50, unlockPrice: 10000 },
	"bgColorCard": { info: "You can customize the background's color", basePrice: 1000, percentageIncrease: 50, unlockPrice: 10000 },
}

let cardYPositions = {
	hidden: 691,
	dealing: 341,
	unhovered: 544,
	hovered: 524,
}

let activeLetterWaits = []
let currentlySaying = ""

function addCard(position:Vec2) {
	let card = add([
		layer("ascension"),
		z(6),
		pos(position),
		rotate(0),
		scale(),
		anchor("center"),
		sprite("backcard"),
		area({ scale: vec2(0) }),
		"card",
		{
			indexInDeck: 0,
		}
	])

	card.on("ready", () => {
		card.onHover(() => {
			tween(card.pos.y, cardYPositions.hovered, 0.25, (p) => card.pos.y = p, easings.easeOutQuart)
			dialogue.box.trigger("talk", "card")
			talk("card", cardsInfo[Object.keys(cardsInfo)[card.indexInDeck]].info)
			tween(card.angle, choose([-1.5, 1.5]), 0.25, (p) => card.angle = p, easings.easeOutQuart)
		})

		card.onHoverEnd(() => {
			tween(card.pos.y, cardYPositions.unhovered, 0.25, (p) => card.pos.y = p, easings.easeOutQuart)
		})

		card.onClick(() => {
			tween(0.75, 1, 0.15, (p) => card.scale.y = p, easings.easeOutQuart)
		})
	})

	return card;
}

function addMage() {
	let mage_color = rgb(0, 51, 102)
	
	let mage:any;

	mage = add([
		pos(-17, 154),
		waver({ wave_speed: 1, maxAmplitude: 2.5 }),
		layer("ascension"),
		z(1),
		opacity(1),
		anchor("center"),
		{
			// skipSay() {
			// 	activeLetterWaits.forEach(waitCall => waitCall.cancel());
			// 	dialogue.textBox.text = this.currentlySaying
			// }
		}
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
				if (this.isHovering() && isMousePressed("left")) {
					this.play("blink")
					talk("mage", "stop that")
					// currentDialogueIdx = getRandomElementDifferentFrom([1, 2, 3, 4], currentDialogueIdx)
					// mage.say(dialogues[currentDialogueIdx][dialogueEye.woke ? "woke" : "dumb"], dialogues[currentDialogueIdx].speed)
				}
				
				this.timeToBlinkAgain -= dt()
				if (this.timeToBlinkAgain < 0) {
					this.timeToBlinkAgain = rand(5, 8)
					this.timeToBlinkAgain = this.timeToBlinkAgain
					if (chance(0.75)) this.play("blink")
				}
			}
		}
	])
	mage_eye.onAnimEnd((anim) => {
		// if (anim != "blink") return
		// if (chance(0.25)) mage_eye.play("blink") 
	});

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
				if (this.isHovering() && isMousePressed("left")) {
					bop(this, 0.01)
					talk("mage", "no backsies")
				}
				this.angle += 0.02
			}
		}
	])

	mage_hexagon.onHover(() => {
		let tooltiprect = add([
			rect(100, 50, { radius: 5 }),
			opacity(0.8),
			pos(mage_hexagon.x + 25, mage_hexagon.y),
			color(BLACK),
			opacity(1),
			"mage_tooltip",
		])
		
		let tooltiptext = add([
			text("You ascended with\n100.000", {
				size: 20,
				align: "left",
			}),
			color(WHITE),
			pos(tooltiprect.pos.x + 6.5, tooltiprect.pos.y + 5),
			z(10),
			opacity(1),
			"mage_tooltip",
		])

		tooltiprect.width = tooltiptext.width + 15
	})

	mage_hexagon.onHoverEnd(() => {
		// if there's no tooltip don't do anything
		if (get("mage_tooltip", { recursive: true }).length < 1) return
		get("mage_tooltip", { recursive: true }).forEach((tooltip) => {
			destroy(tooltip)
		})
	})

	// runs thorugh every object with mage_lightning object and attaches an 
	// onupdate that does the color stuff
	mage.get("mage_lightning").forEach(o => o.onUpdate(() => { 
		o.color = mage_hexagon.color
	}))

	return mage;
}

let dialogue:any;

function addDialogueBox() {
	let box = add([
		sprite("dialogue"),
		pos(623, 144),
		anchor("center"),
		scale(),
		opacity(),
		layer("ascension"),
		z(1),
		{
			defaultPos: vec2(623, 144),
		}
	])

	box.on("talk", (speaker) => {
		if (speaker == "card") {
			box.use(sprite("hoverDialogue"))
			tween(box.defaultPos.y + 10, box.defaultPos.y, 0.25, (p) => box.pos.y = p, easings.easeOutQuint)
		}
		
		else if (speaker == "mage") {
			box.use(sprite("dialogue"))
			tween(box.defaultPos.x - 10, box.defaultPos.x, 0.25, (p) => box.pos.x = p, easings.easeOutQuint)
		}

		tween(0.75, 1, 0.25, (p) => box.scale.x = p, easings.easeOutQuint)
	})

	tween(0.5, 1, 0.25, (p) => box.scale.x = p, easings.easeOutQuint)
	tween(0, 1, 0.25, (p) => box.opacity = p, easings.easeOutQuint)

	return box
}

function addDialogueText() {
	let textBox = add([
		text("", {
			styles: {
				"wavy": (idx) => ({
					pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5)),
				}),
			},
			width: 606, // width without tail
			align: "center",
			size: 25,
		}),
		pos(670, 127),
		anchor("center"),
		color(BLACK),
		layer("ascension"),
		z(dialogue.box.z + 1),
	])

	return textBox
}

function talk(speaker = "mage" || "card", thingToSay = "dialogue here", speed?) {
	dialogue.box.trigger("talk", speaker)
	
	speed = speed || 0.05

	// if speed is null find the dialogue in dialogues and use that speed, else just use the default one
	// exists to override and because i felt bad
	
	currentlySaying = thingToSay

	activeLetterWaits.forEach(waitCall => waitCall.cancel());
	activeLetterWaits = [];
	dialogue.textBox.text = ""

	let currentDelay = 0
	Array.from(thingToSay).forEach((letter, index) => {
		let delay = speed;
		if (letter === ',' || letter === "_") {
			delay = speed * 5; // Adjust the multiplier as needed for commas and spaces
		}

		// Increment currentDelay by the calculated delay
		currentDelay += delay;

		const waitCall = wait(currentDelay, () => {
			if (letter !== "_") dialogue.textBox.text += letter;
			// playSfx("mage_e", { detune: rand(-150, 150) });
		});

		activeLetterWaits.push(waitCall);
	});
}

export function triggerAscension() {

	ascending = true

	ROOT.trigger("ascension")

	hexagon.area.scale = vec2(0)

	get("window").forEach((window) => {
		window.close()
	})

	// get("*", { recursive: true }).forEach((obj) => {
	// 	obj.paused = true
	// })

	tween(hexagon.scaleIncrease, 0, 0.35, (p) => hexagon.scaleIncrease = p, easings.easeOutCubic)
	tween(hexagon.stretchScaleIncrease, 0, 0.35, (p) => hexagon.stretchScaleIncrease = p, easings.easeOutCubic)
	tween(hexagon.maxScaleIncrease, 0, 0.35, (p) => hexagon.maxScaleIncrease = p, easings.easeOutCubic)

	let blackBg = add([
		rect(width(), height()),
		color(BLACK),
		fixed(),
		opacity(0.5),
		anchor("center"),
		pos(center()),
		z(0),
		layer("ascension"),
	])

	blackBg.fadeIn(0.35).onEnd(() => {
		// ADD THE MAGEEEEE!!!!!!!! so excited
		let mage = addMage()
		tween(-489, -17, 0.5, (p) => mage.pos.x = p, easings.easeOutQuart)
		tween(145, 154, 0.5, (p) => mage.pos.y = p, easings.easeOutQuart)
		tween(0.5, 1, 0.5, (p) => mage.opacity = p, easings.easeOutQuart).onEnd(() => {
			dialogue = add([])
			dialogue.box = addDialogueBox()
			dialogue.textBox = addDialogueText()
			
			talk("mage", "welcome to fortnite")
		})
	})

	//#region CARD STUFF

	let dealingXPosition = 947

	// add the initials card
	for (let i = 0; i < 4; i++) {
		let card = addCard(vec2(dealingXPosition, cardYPositions.hidden))
		card.angle = rand(-4, 4)
		card.pos.x = dealingXPosition + rand(-5, 5)
		card.indexInDeck = i + 1

		// put it in the dealing position
		let randOffset = rand(-5, 5)
		// let randOffset = 0
		tween(card.pos.y, cardYPositions.dealing + randOffset, 0.75, (p) => card.pos.y = p, easings.easeOutQuint)
	}

	wait(0.75, () => {
		let cardSpacing = 150
		get("card").forEach((card) => {
			wait(0.25 * card.indexInDeck, () => {
				function getCardXPos(index:number) {
					return dealingXPosition - cardSpacing * (index) - cardSpacing;
				}
		
				tween(card.angle, rand(-1.5, 1.5), 0.25, (p) => card.angle = p, easings.easeOutQuart)
				
				// pos
				tween(card.pos.x, getCardXPos(card.indexInDeck - 2), 0.25, (p) => card.pos.x = p, easings.easeOutQuart)
				tween(card.pos.y, cardYPositions.unhovered, 0.25, (p) => card.pos.y = p, easings.easeOutQuart)
				
				// turn it over
				tween(card.scale.x, 0, 0.25, (p) => card.scale.x = p, easings.easeOutQuart).onEnd(() => {
					card.use(sprite("card"))
					tween(card.scale.x, 1, 0.25, (p) => card.scale.x = p, easings.easeOutQuart).onEnd(() => {
						card.area.scale = vec2(1)
						card.trigger("ready")
					})
				})
			})
		})
	})

	// #endregion

	wait(0.1, () => {
		let manaText = add([
			text("", { align: "left", font: "lambdao", size: 38 }),
			pos(4, 19),
			anchor("left"),
			layer("ascension"),
			opacity(1),
			{
				hiddenXPos: -72,
				update() {
					this.text = `✦${GameState.mana}`
				}
			}
		])
	
		manaText.fadeIn(0.35)
		tween(manaText.hiddenXPos, 4, 0.5, (p) => manaText.pos.x = p, easings.easeOutQuart)
	})
}