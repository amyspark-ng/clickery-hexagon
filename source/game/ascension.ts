import { Vec2 } from "kaplay";
import { GameState, scoreManager } from "../gamestate";
import { ROOT } from "../main"
import { waver } from "../plugins/wave";
import { hexagon } from "./hexagon"
import { bop } from "./utils";
import { playSfx } from "../sound";
import { folderObj } from "./windows/windows-api/windowsAPI";
import { hexagonIntro } from "./gamescene";
import { isWindowUnlocked } from "./unlockables";

export let ascending = false;
export function set_ascending(value) {
	ascending = value
}

let cardsInfo = {
	"clickersCard": { 
		info: "Clickers are +[number]% more efficient",
		basePrice: 1,
		percentageIncrease: 200,
		idx: 0,
	},
	"cursorsCard": { 
		info: "Cursors are +[number]% more efficient",
		basePrice: 50,
		percentageIncrease: 200,
		idx: 1,
	},
	"powerupsCard": { 
		info: "Powerups are +[number]% more efficient",
		basePrice: 1000,
		percentageIncrease: 50,
		idx: 2,
	},
	"extraCard": {
		info: "No info",
		basePrice: 1,
		percentageIncrease: 50,
		idx: 3,
	},
	"hexColorCard": { 
		info: "You can customize the hexagon's color",
		unlockPrice: 10000,
		idx: 4,
	},
	"bgColorCard": { 
		info: "You can customize the background's color",
		unlockPrice: 10000,
		idx: 5,
	},
}

// TODO: do this with powerups
type cardType = keyof typeof cardsInfo

let cardYPositions = {
	hidden: 691,
	dealing: 341,
	unhovered: 544,
	hovered: 524,
}

let activeLetterWaits = []
let currentlySaying = ""

// clickersCard -> card_clickers
const typeToSprite = (type:cardType | string) => `card_${type.replace("Card", "")}`    

function addCard(cardType:cardType, position:Vec2) {
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
			infoIdx: cardsInfo[cardType].idx,
			price: 0,
			type: cardType,
			chosenPercentage: 0,
			update() {
				// this.price = getPrice({
				// 	basePrice: cardsInfo[cardType].basePrice,
				// 	percentageIncrease: cardsInfo[cardType].percentageIncrease,
				// })
			},
			
			buy() {
				if (GameState.ascension.mana >= this.price) {
					tween(0.75, 1, 0.15, (p) => this.scale.y = p, easings.easeOutQuart)

					if (this.infoIdx == 4 || this.infoIdx == 5) {
						this.infoIdx -= 2
						this.type = Object.keys(cardsInfo)[this.infoIdx]

						tween(this.scale.x, 0, 0.075, (p) => this.scale.x = p).onEnd(() => {
							this.use(sprite(typeToSprite(this.type)))
							tween(this.scale.x, 1, 0.075, (p) => this.scale.x = p)
						})
					}
	
					playSfx("kaching", { detune: rand(-50, 50) })
				}
				
				else {
					tween(0.75, 1, 0.15, (p) => this.scale.x = p, easings.easeOutQuart)
				}
			},

			drawInspect() {
				drawText({
					text: `deck: ${this.indexInDeck}\ninfo: ${this.infoIdx}`,
					pos: vec2(0, -this.height),
					anchor: "center",
					size: 25,
					color: WHITE
				})
			}
		}
	])

	if (cardType == "clickersCard" || cardType == "cursorsCard") {
		card.chosenPercentage = randi(8, 12)
	}

	else if (cardType == "powerupsCard") {
		card.chosenPercentage = randi(2, 4)
	}

	card.on("ready", () => {
		card.onHover(() => {
			tween(card.pos.y, cardYPositions.hovered, 0.25, (p) => card.pos.y = p, easings.easeOutQuart)
			tween(card.angle, choose([-1.5, 1.5]), 0.25, (p) => card.angle = p, easings.easeOutQuart)
			
			dialogue.box.trigger("talk", "card")
			talk("card", cardsInfo[Object.keys(cardsInfo)[card.infoIdx]].info)
		})

		card.onHoverEnd(() => {
			tween(card.pos.y, cardYPositions.unhovered, 0.25, (p) => card.pos.y = p, easings.easeOutQuart)
		})

		card.onClick(() => {
			// if gamestate.score.mana >= card.price
			card.buy()
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
		area({ scale: 0.8 }),
		opacity(),
		layer("ascension"),
		z(1),
		"textbox",
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

	box.onClick(() => {
		if (dialogue.textBox.text == currentlySaying) return
		skipTalk()
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
		opacity(),
		z(dialogue.box.z + 1),
		"textbox",
		"boxText",
	])

	return textBox
}

function talk(speaker:"mage" | "card", thingToSay:string, speed?:number) {
	dialogue.box.trigger("talk", speaker)

	speaker = speaker || "card"
	thingToSay = thingToSay || "No dialogue, missing a dialogue here"
	speed = speed || 0.05

	// TODO: if speed is null find the dialogue in dialogues and use that speed, else just use the default one
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

function skipTalk() {
	activeLetterWaits.forEach(waitCall => waitCall.cancel());
	dialogue.textBox.text = currentlySaying
	tween(dialogue.box.defaultPos.y + 10, dialogue.box.defaultPos.y, 0.25, (p) => dialogue.box.pos.y = p, easings.easeOutQuint)
	tween(dialogue.box.defaultPos.x + 10, dialogue.box.defaultPos.x, 0.25, (p) => dialogue.box.pos.x = p, easings.easeOutQuint)
}

export function triggerAscension() {
	// stuff
	ascending = true

	// the multiplier cool!!!
	GameState.ascension.magicLevel++

	ROOT.trigger("ascension", { score: GameState.score, scoreThisRun: GameState.scoreThisRun })
	
	hexagon.interactable = false
	folderObj.area.scale = vec2(0)

	get("window").forEach((window) => {
		window.close()
	})

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
		"ascensionBg"
	])

	let mage:any;
	blackBg.fadeIn(0.35).onEnd(() => {
		// ADD THE MAGEEEEE!!!!!!!! so excited
		mage = addMage()
		tween(-489, -17, 0.5, (p) => mage.pos.x = p, easings.easeOutQuart)
		tween(145, 154, 0.5, (p) => mage.pos.y = p, easings.easeOutQuart)
		tween(0.5, 1, 0.5, (p) => mage.opacity = p, easings.easeOutQuart).onEnd(() => {
			dialogue = add([])
			dialogue.box = addDialogueBox()
			dialogue.textBox = addDialogueText()
			
			talk("mage", "welcome to fortnite")
		})

		mage?.onKeyPress("escape", () => {
			endAscension()
		})
	})

	//#region CARD STUFF

	let dealingXPosition = 947

	// add the initials card
	for (let i = 0; i < 4; i++) {
		let type:cardType;
		if (i == 0) type = "clickersCard"
		if (i == 1) type = "cursorsCard"
		if (i == 2) {
			if (!isWindowUnlocked("hexColorWin")) type = "hexColorCard"
			else type = "powerupsCard"
		}
		if (i == 3) {
			if (isWindowUnlocked("bgColorWin")) type = "bgColorCard"
			else type = "extraCard"
		}


		let card = addCard(type, vec2(dealingXPosition, cardYPositions.hidden))
		card.angle = rand(-4, 4)
		card.pos.x = dealingXPosition + rand(-5, 5)
		card.indexInDeck = i + 1

		// put it in the dealing position
		let randOffset = rand(-5, 5)
		// let randOffset = 0
		tween(card.pos.y, cardYPositions.dealing + randOffset, 0.75, (p) => card.pos.y = p, easings.easeOutQuint)
	}

	// assign them the infostuff
	get("card").forEach((card) => {
		let actualIndexInDeck = map(card.indexInDeck, 1, 4, 4, 1)
		
		if (actualIndexInDeck == 3) {
			if (!isWindowUnlocked("hexColorWin")) card.infoIdx = 4
			else card.infoIdx = 2
		}

		else if (actualIndexInDeck == 4) {
			if (!isWindowUnlocked("bgColorWin")) card.infoIdx = 5
			else card.infoIdx = 3
		}

		else {
			card.infoIdx = actualIndexInDeck - 1
		}
	})

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
					card.use(sprite(typeToSprite(card.type)))
					
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
			"manaText",
			{
				hiddenXPos: -72,
				update() {
					this.text = `✦${GameState.ascension.mana}`
				}
			}
		])
	
		manaText.fadeIn(0.35)
		tween(manaText.hiddenXPos, 4, 0.5, (p) => manaText.pos.x = p, easings.easeOutQuart)
	})
}

export function endAscension() {
	folderObj.area.scale = vec2(1.2)
	
	ROOT.trigger("endAscension")

	get("*", { recursive: true }).filter(obj => obj.layer == "ascension").forEach((obj) => {
		if (obj.is("area")) obj.area.scale = vec2(0)
		
		if (obj.is("mage") || obj.is("manaText")) {
			tween(obj.pos.x, obj.pos.x - obj.width, 0.5, (p) => obj.pos.x = p, easings.easeOutQuart).onEnd(() => destroy(obj))
		}

		else if (obj.is("card")) {
			tween(obj.pos.y, obj.pos.y + obj.height, 0.5, (p) => obj.pos.y = p, easings.easeOutQuart).onEnd(() => destroy(obj))
		}

		else if (obj.is("textbox")) {
			tween(obj.pos.y, -obj.height, 0.5, (p) => obj.pos.y = p, easings.easeOutQuart).onEnd(() => destroy(obj))
		}

		else if (obj.is("ascensionBg")) {
			obj.fadeOut(0.5).onEnd(() => destroy(obj))
		}
	})

	// turn everything back to 0
	scoreManager.resetRun()

	wait(0.25, () => {
		tween(hexagon.scaleIncrease, 1, 0.25, (p) => hexagon.scaleIncrease = p, easings.easeOutQuint)
		tween(hexagon.maxScaleIncrease, 1, 0.25, (p) => hexagon.maxScaleIncrease = p, easings.easeOutQuint)
		tween(hexagon.stretchScaleIncrease, 1, 0.25, (p) => hexagon.stretchScaleIncrease = p, easings.easeOutQuint).onEnd(() => {
			hexagon.interactable = true
		})
		hexagonIntro()
	})

	wait(0.5, () => {
		ascending = false
	})
}