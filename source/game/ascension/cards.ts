import { GameObj, Vec2 } from "kaplay"
import { getPrice, getVariable, setVariable } from "../utils"
import { GameState } from "../../gamestate"
import { ascension, talk } from "./ascension"
import { ROOT } from "../../main"
import { isWindowUnlocked, unlockWindow } from "../unlockables"
import { playSfx } from "../../sound"
import { windowKey } from "../windows/windows-api/windowsAPI"

let cardsInfo = {
	"clickersCard": { 
		info: "Clickers are +[number]% more efficient",
		basePrice: 1,
		percentageIncrease: 140,
		idx: 0,
	},
	"cursorsCard": { 
		info: "Cursors are +[number]% more efficient",
		basePrice: 2,
		percentageIncrease: 150,
		idx: 1,
	},
	"powerupsCard": { 
		info: "Powerups are +[number]% more efficient",
		basePrice: 3,
		percentageIncrease: 120,
		idx: 2,
	},
	"critsCard": {
		info: "Criticals are +[number]% more powerful",
		basePrice: 3,
		percentageIncrease: 120,
		idx: 3,
	},
	"hexColorCard": { 
		info: "You can customize the hexagon's color",
		unlockPrice: 5,
		idx: 4,
	},
	"bgColorCard": { 
		info: "You can customize the background's color",
		unlockPrice: 6,
		idx: 5,
	},
}

function cardTypes() {
	return Object.keys(cardsInfo).sort((a, b) => cardsInfo[a].idx - cardsInfo[b].idx)
}

// TODO: do this with powerups
type card = keyof typeof cardsInfo

let cardYPositions = {
	hidden: 691,
	/**
	 * The position they are when they're stacked
	 */
	dealing: 341,
	unhovered: 544,
	hovered: 524,
}

/**
 * Gets a random additive value based on the card type
 * @returns the additive  
 */
function getAdditive(type:card) {
	let additive:number

	if (!(type == "hexColorCard" || type == "bgColorCard") && type != "powerupsCard") {
		additive = randi(8, 12)
	}

	else if (type == "powerupsCard") {
		additive = randi(1, 5)
	}

	else if (type == "hexColorCard" || type == "bgColorCard") {
		additive = 0
	}

	return additive;
}

// clickersCard -> card_clickers
const typeToSprite = (type:card | string) => `card_${type.replace("Card", "")}`    

function flipCard(card:GameObj, newType:card | string) {
	let flipOneSideTime = 0.075
	
	// turn it to middle
	card.area.scale = vec2(0)
	tween(1, 0, flipOneSideTime, (p) => card.scale.x = p).onEnd(() => {
		card.type = newType as card
		card.typeIdx = cardsInfo[card.type as string].idx
		card.additive = getAdditive(card.type as card)
		card.sprite = typeToSprite(card.type)
		
		tween(0, 1, flipOneSideTime, (p) => card.scale.x = p).onEnd(() => {
			card.area.scale = vec2(1)
			card.trigger("flip")
		})
	})
}

function addCard(cardType:string | card, position: Vec2) {
	
	let card = add([
		// starts at backcard
		sprite("backcard"),
		pos(position),
		rotate(0),
		layer("ascension"),
		z(6),
		scale(),
		anchor("center"),
		area({ scale: vec2(0) }),
		"card",
		"ascensionHover",
		{
			indexInDeck: 0, // 1 - 4 / 1 being leftmost
			price: 1,
			type: cardType,
			typeIdx: cardsInfo[cardType].idx,
			gamestateInfo: { key: "", objectAmount: "" }, // used to know what to increase and what to check
			additive: getAdditive(cardType as card),
			update() {
				// sets gamestate key
				switch (this.type as card) {
					case "clickersCard":
						this.gamestateInfo.key = "clickPercentage"
						this.gamestateInfo.objectAmount = "ascension.clickPercentagesBought"
					break;
				
					case "cursorsCard":
						this.gamestateInfo.key = "cursorsPercentage"
						this.gamestateInfo.objectAmount = "ascension.cursorsPercentagesBought"
					break;

					case "powerupsCard":
						this.gamestateInfo.key = "powerupPower"
						this.gamestateInfo.objectAmount = "ascension.powerupPowersBought"
					break;

					case "critsCard":
						this.gamestateInfo.key = "critPower"
						this.gamestateInfo.objectAmount = "ascension.critPercentagesBought"
					break;

					case "hexColorCard": 
						this.gamestateInfo.key = "hexColor"
						this.gamestateInfo.objectAmount = "0"
					break;

					case "bgColorCard": 
						this.gamestateInfo.key = "bgColor"
						this.gamestateInfo.objectAmount = "0"
					break;

					default: throw new Error("Unknown card type in ascension.ts: " + cardType)
				}

				// sets price
				if (!(this.type == "hexColorCard" || this.type == "bgColorCard")) {
					let objectAmount = getVariable(GameState, this.gamestateInfo.objectAmount)

					this.price = getPrice({
						basePrice: cardsInfo[this.type].basePrice,
						percentageIncrease: cardsInfo[this.type].percentageIncrease,
						objectAmount: objectAmount
					})
				}

				else {
					this.price = cardsInfo[this.type].unlockPrice
				}
			},

			startHover() {
				tween(this.pos.y, cardYPositions.hovered, 0.25, (p) => this.pos.y = p, easings.easeOutQuart)
				tween(this.angle, choose([-1.5, 1.5]), 0.25, (p) => this.angle = p, easings.easeOutQuart)
	
				// it adds the % on the info message
				let message = cardsInfo[this.type].info.replace("[number]", this.additive)
				if (this.type != "hexColorCard" || this.type != "bgColorCard") {
					let percentages = getVariable(GameState, this.gamestateInfo.key)
					message += ` (You have: ${percentages}%)`
				}
				talk("card", message)
			},

			buy() {
				tween(0.75, 1, 0.15, (p) => this.scale.y = p, easings.easeOutQuart)
			
				// unlock color window
				if (this.type == "hexColorCard" || this.type == "bgColorCard") {
					let oldType = this.type // get it before it changes
					flipCard(card, cardTypes()[this.typeIdx - 2])

					let endascensioncheck = ROOT.on("endAscension", () => {
						wait(1, () => {
							unlockWindow(oldType.replace("Card", "Win") as windowKey)
						})
						endascensioncheck.cancel()
					})
				}

				// add percentages
				else {
					// actually add the stuff LOL!
					let currentPercentage = getVariable(GameState, this.gamestateInfo.key)
					let percentagesBought = getVariable(GameState, this.gamestateInfo.objectAmount)

					// add the actual percentage
					setVariable(GameState, this.gamestateInfo.key, currentPercentage + this.additive)
					// set the percentagesBought
					setVariable(GameState, this.gamestateInfo.objectAmount, percentagesBought + 1)

					// get new additive
					this.additive = getAdditive(this.type as card)
					this.startHover() // talk
				}

				function subMana(amount:number) {
					tween(GameState.ascension.mana, GameState.ascension.mana - amount, 0.32, (p) => GameState.ascension.mana = Math.round(p), easings.easeOutExpo)
				}

				subMana(this.price)
				playSfx("kaching", { detune: rand(-50, 50) })
				if (ascension.canLeave == false) {ascension.canLeave = true; ROOT.trigger("canLeaveAscension")}
			},

			drawInspect() {
				drawText({
					text: `deck: ${this.indexInDeck}\ntype: ${this.typeIdx} - ${this.type}`,
					pos: vec2(0, -this.height),
					anchor: "center",
					size: 25,
					color: WHITE
				})
			}
		}
	])

	card.on("dealingOver", () => {
		card.onHover(() => {
			card.startHover()
		})

		card.onHoverEnd(() => {
			tween(card.pos.y, cardYPositions.unhovered, 0.25, (p) => card.pos.y = p, easings.easeOutQuart)
		})

		card.onClick(() => {
			if (GameState.ascension.mana >= card.price) card.buy()
			else {
				tween(0.75, 1, 0.15, (p) => card.scale.x = p, easings.easeOutQuart)
			}
		})

		const greenPrice = GREEN.lighten(30)
		const redPrice = RED.lighten(30) 
		card.onDraw(() => {
			drawText({
				text: `${card.price}✦`,
				align: "center",
				anchor: "center",
				pos: vec2(0, 35),
				size: 26,
				scale: card.scale,
				color: GameState.ascension.mana >= card.price ? greenPrice : redPrice
			})

			if (!(card.type == "hexColorCard" || card.type == "bgColorCard")) {
				drawText({
					text: `+${card.additive}%`,
					size: 15,
					color: BLACK,
					align: "left",
					pos: vec2(-59, -82)
				})
			}
		})
	})

	return card;
}

// is the part where they're dealt and send to their corresponding positions
// in deck
export function spawnCards() {
	const cardSpacing = 150;
	
	// from left to right
	let cardsToAdd = [
		"clickersCard",
		"cursorsCard",
		!isWindowUnlocked("hexColorWin") ? "hexColorCard" : "powerupsCard",
		!isWindowUnlocked("bgColorWin") ? "bgColorCard" : "critsCard"
	]

	// now add the cards
	let dealingXPosition = 947;
	cardsToAdd.forEach((cardToAdd, index) => {
		let card = addCard(cardToAdd, vec2(dealingXPosition, cardYPositions.hidden))
		card.angle = rand(-4, 4)
		card.pos.x = dealingXPosition + rand(-5, 5)
		card.pos.y = cardYPositions.hidden
		card.indexInDeck = index

		// put it in the dealing position
		let randOffset = rand(-5, 5)
		tween(card.pos.y, cardYPositions.dealing + randOffset, 0.75, (p) => card.pos.y = p, easings.easeOutQuint)

		function dealTheCards() {
			// now, deal them to them places
			wait(0.25 * card.indexInDeck, () => {
				function getCardXPos(index:number) {
					let startPoint = 492
					return (startPoint + cardSpacing) + cardSpacing * (index - 1);
				}

				tween(card.angle, rand(-1.5, 1.5), 0.25, (p) => card.angle = p, easings.easeOutQuart)
			
				// pos
				tween(card.pos.x, getCardXPos(card.indexInDeck), 0.25, (p) => card.pos.x = p, easings.easeOutQuart)
				tween(card.pos.y, cardYPositions.unhovered, 0.25, (p) => card.pos.y = p, easings.easeOutQuart)
				
				// turn it over
				tween(card.scale.x, 0, 0.25, (p) => card.scale.x = p, easings.easeOutQuart).onEnd(() => {
					card.sprite = typeToSprite(card.type)
					
					tween(card.scale.x, 1, 0.25, (p) => card.scale.x = p, easings.easeOutQuart).onEnd(() => {
						card.area.scale = vec2(1)
						card.trigger("dealingOver")
					})
				})
			})
		}

		// wait
		wait(0.75, () => {
			dealTheCards()
		})
	})
}
