import { GameState } from "../../../GameState";
import { hexagon } from "../addHexagon";
import { addFlyingText, addPlusPercentageScore, addToolTip, changeValueBasedOnAnother, endToolTip, formatNumber, gameBg, getPrice, mouse } from "../utils";
import { playSfx } from "../../../sound";
import { isDraggingWindow } from "./WindowsMenu";

let cursorsElement;
let multipliersElement;
let powerupsElement;

let storeElements = []
let amountBeingBought = 1
// used to determine the cool game juice
let hasBoughtRecently = false
let storePitchSeconds = 0
let storeTune = 0

let storeTimer = 0 // optimization

export let isHoveringUpgrade = false

let upgradeBasePrices = [
	100,
	200,
	300,
	400,
	500,
	600,
	0,
	600,
	600,
	600,
	600,
	600,
	1000,
	1000,
	1000,
	1000,
]

let upgradeTexts = [
	"Clicks are twice as efficient (2x)",
	"Clicks are twice as efficient (4x)",
	"Clicks are twice as efficient (8x)",
	"Clicks are twice as efficient (16x)",
	"Clicks are twice as efficient (32x)",
	"Clicks are twice as efficient (64x)",
	"Cursors regular clicking speed (10s)",
	"Cursors now click more often (5s)",
	"Cursors now click every second (1s)",
	"Cursors are twice as efficient (8x)",
	"Cursors are twice as efficient (16x)",
	"Cursors are twice as efficient (32x)",
	"Clicks are 1% more efficient",
	"Score gets boosted +1% per achievement",
	"Cursors are 1% more efficient (+Skin)",
	"Power-Ups are 1% more powerful",
]

let scoreTweening = null;

function checkPrice(price) {
	return GameState.score >= price
}

// deberia tomar
function addStoreElement(parent, settings = {
	name: 'Cursor',
	basePrice: 25,
	percentageIncrease: 15,
	position: center(),
	variable: GameState.cursors
}, winParent) 
{	
	// add a parent background object
	const btn = parent.add([
		// rect(370, 80, { radius: 4 }),
		sprite(settings.name == "PowerUp" ? "powerupElements" : "storeElements"),
		pos(settings.position),
		area(),
		color(),
		opacity(1),
		scale(1),
		anchor("center"),
		outline(4),
		"hoverObj",
		settings.name + "Element",
		"storeElement",
		"store",
		{
			verPosition: settings.position.y,
			up: false,
			price: settings.basePrice,
			basePrice: settings.basePrice,
			percentageIncrease: settings.percentageIncrease,
			variable: settings.variable,
			winParent: winParent,
			hoverStart() {
				wait(0.01, () => {
					if (isHoveringUpgrade == false) {
						if (this.up == false) {
							this.up = true
							tween(this.pos.y, this.verPosition - 5, 0.1, (p) => this.pos.y = p)
							playSfx("hoverElement", (100 * (storeElements.indexOf(this)) * 1.5))
						}
					}
				})
			},
			hoverEnd() {
				if (this.up == true) {
					this.up = false
					tween(this.pos.y, this.verPosition, 0.1, (p) => this.pos.y = p)
				}
			// this.unuse(outlineshaderfknlnfl)
			},
			buy(amount) {
				if (winParent.dragging) return
				if (this.is("ClicksElement")) GameState.clickers += amount
				else if (this.is("CursorsElement")) GameState.cursors += amount

				tween(GameState.score, GameState.score - this.price, 0.32, (p) => GameState.score = p)

				hasBoughtRecently = true;
				storePitchSeconds = 0;
				if (hasBoughtRecently == true) storeTune += 25;
				storeTune = clamp(storeTune, -100, 500)
				playSfx("kaching", storeTune)
			}
		}
	])

	// play anim
	// not powerup
	if (!btn.is("PowerUpElement")) {
		btn.play(settings.name)
	}

	else {
		if (GameState.hasUnlockedPowerups) btn.play("unlocked")
		else btn.play("locked")
	}

	btn.add([
		text("the price and\namount", {
			size: 20
		}),
		color(),
		pos(-60, 0),
		{
			update() {
				if (winParent.is("active") && !isDraggingWindow) {
					if (isKeyDown("shift")) amountBeingBought = 10
					else if (isKeyDown("control")) amountBeingBought = 100
					else amountBeingBought = 1
				}

				if (winParent.is("active") && !isDraggingWindow) {
					if (btn.is("ClicksElement")) {
						btn.price = getPrice(btn.basePrice, btn.percentageIncrease, GameState.clickers - 1, amountBeingBought)
						this.text = `${btn.price}\n${GameState.clickers}`
					}
	
					else if (btn.is("CursorsElement")) {
						btn.price = getPrice(btn.basePrice, btn.percentageIncrease, GameState.cursors, amountBeingBought)
						this.text = `${btn.price}\n${GameState.cursors}`
					}
	
					else if (btn.is("PowerUpElement")) {
						btn.price = getPrice(btn.basePrice, btn.percentageIncrease, GameState.powerupsBought)
						this.text = `${btn.price}\n${GameState.powerupsBought}`
					}
	
					if (GameState.score >= btn.price) {
						// GREEN
						this.color = rgb(44, 209, 47)
					}
	
					else {
						// RED
						this.color = rgb(209, 61, 44)
					}
				}
			}
		}
		// pos(0, btn.pos.y)
	])

	// STORE ELEMENT OPACITY
	btn.onUpdate(() => {
		if (checkPrice(btn.price)) btn.color = WHITE
		else btn.color = rgb(90, 90, 90)
	})

	onKeyPress("l", () => {
		let FUCK = getPrice(25, 15, 1, 10)
		debug.log(FUCK)
	})
	
	let timer = 0;
	let timeUntilAnotherBuy = 1
	let timesBoughtWhileHolding = 0

	btn.onMouseDown(() => {
		if (winParent.is("active") && !isDraggingWindow) {
			if (btn.isHovering()) {
				if (isHoveringUpgrade == false) {
					if (checkPrice(btn.price)) {
						if (timesBoughtWhileHolding == 0) {
							timeUntilAnotherBuy = 1
						}
			
						timer += dt()
			
						timeUntilAnotherBuy = 1 / (timesBoughtWhileHolding)
						timeUntilAnotherBuy = clamp(timeUntilAnotherBuy, 0.05, 1)
			
						if (timesBoughtWhileHolding == 0) {
							timesBoughtWhileHolding = 1
							btn.buy(amountBeingBought)
							debug.log(btn.price)
						}
		
						if (timer > timeUntilAnotherBuy) {
							timer = 0
							timesBoughtWhileHolding++	
							btn.buy(amountBeingBought)
							debug.log(btn.price)
						}
					}
				}
			}
		}
	})

	btn.onMouseRelease(() => {
		if (winParent.is("active") && !isDraggingWindow) {
			timer = 0
			timesBoughtWhileHolding = 0
			timeUntilAnotherBuy = 2.25
		}
	}) 

	btn.onHover(() => {
		if (winParent.is("active") && !isDraggingWindow) {
			btn.hoverStart()
		}
	})

	btn.onHoverEnd(() => {
		if (winParent.is("active") && !isDraggingWindow) {
			btn.hoverEnd()
		}
	})

	return btn
}

function getFrame(upgrade) {
	// Determine which spritesheet the upgrade belongs to based on its index
	if (upgrade.type == "u_") {
		// For the second spritesheet
		if (upgrade.bought) {
			return (upgrade.idx - 12) * 3;  // First frame of each animation
		} else if (checkPrice(GameState.score, upgrade.price)) {
			return (upgrade.idx - 12) * 3 + 2;  // Third frame of each animation
		} else {
			return (upgrade.idx - 12) * 3 + 1;  // Second frame of each animation
		}
	} else {
		// For the original spritesheet
		if (upgrade.bought) {
			return upgrade.idx * 3;  // First frame of each animation
		} else if (checkPrice(GameState.score, upgrade.price)) {
			return upgrade.idx * 3 + 2;  // Third frame of each animation
		} else {
			return upgrade.idx * 3 + 1;  // Second frame of each animation
		}
	}
}

function buyUpgrade(upgrade) {
	if (checkPrice(GameState.score, upgrade.price)) {
		// regular upgrades
		if (upgrade.type != "u_") {
			if (upgrade.idx == 8 && GameState.upgradesBought[7] == false) {
				debug.log("you haven't unlocked the one before")
			}

			// not exception
			else {
				if (upgrade.bought == false) {
					upgrade.bought = true
					GameState.upgradesBought[upgrade.idx] = true

					if (upgrade.type == "k_") {
						GameState.cursorUpgrades += upgrade.value
					}

					else if (upgrade.type == "c_") {
						if (upgrade.idx > 5 && upgrade.idx < 9) {
							GameState.timeUntilAutoLoopEnds = upgrade.freq
						}
			
						else if (upgrade.idx > 8 && upgrade.idx < 12) {
							GameState.cursorUpgrades += upgrade.value
						}
					}
				
					hasBoughtRecently = true;
					storePitchSeconds = 0;
					if (hasBoughtRecently == true) storeTune += 25;
					playSfx("kaching", storeTune)
					tween(GameState.score, GameState.score - upgrade.price, 0.32, (p) => GameState.score = p, )
				}
			}
		}

		// FREAKY upgrades
		else {
			if (upgrade.bought == false) {GameState.upgradesBought[upgrade.idx] = true; upgrade.bought = true }
			if (upgrade.idx == 12) {
				let newPrice = getPrice(upgrade.basePrice, 15, GameState.clickPercentage)
				let newTextPrice = formatNumber(newPrice, true, true)
				upgrade.text = upgrade.text.replace(upgrade.textPrice, newTextPrice)
				upgrade.text = upgrade.text.replace(`/ ${GameState.clickPercentage}`, `/ ${GameState.clickPercentage + 1}`)
				get("tooltiptext")[0].text = upgrade.text
				GameState.clickPercentage++
				upgrade.price = newPrice
				upgrade.textPrice = newTextPrice
			
				// mouse.trail.trailAmount = 0
			}

			else if (upgrade.idx == 13) {
				let newPrice = getPrice(upgrade.basePrice, 15, GameState.achievementMultiplierPercentage)
				let newTextPrice = formatNumber(newPrice, true, true)
				upgrade.text = upgrade.text.replace(upgrade.textPrice, newTextPrice)
				upgrade.text = upgrade.text.replace(`/ ${GameState.achievementMultiplierPercentage}`, `/ ${GameState.achievementMultiplierPercentage + 1}`)
				get("tooltiptext")[0].text = upgrade.text
				GameState.achievementMultiplierPercentage++
				upgrade.price = newPrice
				upgrade.textPrice = newTextPrice
			}

			else if (upgrade.idx == 14) {
				let newPrice = getPrice(upgrade.basePrice, 15, GameState.cursorsPercentage)
				let newTextPrice = formatNumber(newPrice, true, true)
				upgrade.text = upgrade.text.replace(upgrade.textPrice, newTextPrice)
				upgrade.text = upgrade.text.replace(`/ ${GameState.cursorsPercentage}`, `/ ${GameState.cursorsPercentage + 1}`)
				get("tooltiptext")[0].text = upgrade.text
				GameState.cursorsPercentage++
				upgrade.price = newPrice
				upgrade.textPrice = newTextPrice
			}
			
			else if (upgrade.idx == 15) {
				let newPrice = getPrice(upgrade.basePrice, 15, GameState.powerupsPower)
				let newTextPrice = formatNumber(newPrice, true, true)
				upgrade.text = upgrade.text.replace(upgrade.textPrice, newTextPrice)
				upgrade.text = upgrade.text.replace(`/ ${GameState.powerupsPower}`, `/ ${GameState.powerupsPower + 1}`)
				get("tooltiptext")[0].text = upgrade.text
				GameState.powerupsPower++
				upgrade.price = newPrice
				upgrade.textPrice = newTextPrice
			}

			addPlusPercentageScore(upgrade.worldPos(), 1)

			hasBoughtRecently = true;
			storePitchSeconds = 0;
			if (hasBoughtRecently == true) storeTune += 25;
			playSfx("kaching", storeTune)
			tween(GameState.score, GameState.score - upgrade.price, 0.32, (p) => GameState.score = p, )
		
			debug.log(`${GameState.score} - ${upgrade.price}`)
			debug.log(GameState.score - upgrade.price)
		}
	}

	else {
		playSfx("hoverElement")
	}
} 

function addUpgrades(element, winParent) {
	let posX = 0;
	let posY = -45;
	let type = ""
	let uSprite = "upgrades"
	let amount = 0;
	if (element.is("ClicksElement")) {
		type = "k_"
		uSprite = "upgrades"
		amount = 6
	}
	
	else if (element.is("CursorsElement")) {
		type = "c_"
		uSprite = "upgrades"
		amount = 6
	}
	
	else if (element.is("storeBg")) {
		type = "u_"
		uSprite = "mupgrades"
		amount = 4
		posX = -90
	}

	for(let i = 0; i < amount; i++) {
		if (amount == 6) {
			if (i == 3) {posY += 52; posX = 0}
			if (i != 0 && i != 3) posX += 52
		}
		else {
			posX += 92
			posY = 425
		}
		
		let upgrade = element.add([
			pos(posX + 45, posY + 20),
			sprite(uSprite),
			anchor("center"),
			opacity(1),
			scale(1),
			color(WHITE),
			area( { scale: vec2(0.8, 1) }),
			"upgrade",
			"store",
			"hoverObj",
			z(parent.z + 1),
			{
				basePrice: 0,
				price: 0,
				textPrice: "",
				text: "",
				idx: 0,
				value: 0,
				freq: 0,
				bought: false,
				type: type, // "k_" ex
				winParent: winParent,
			}
		])

		if (type == "k_") {
			upgrade.idx = i;
			upgrade.value = 2 ** (upgrade.idx + 1)
		}

		else if (type == "c_") {
			upgrade.idx = 6 + i
			// is frequency upgrades
			if (upgrade.idx > 5 && upgrade.idx < 9) {
				switch (upgrade.idx) {
					case 6:
						upgrade.freq = 10
					break;
					case 7:
						upgrade.freq = 5
					break
					case 8:
						upgrade.freq = 1
					break;
				}
			}

			// is multiplier upgrades
			else {
				switch (upgrade.idx) {
					case 9:
						upgrade.value = 8;
					break;
					case 10:
						upgrade.value = 16;
					break;
					case 11:
						upgrade.value = 36;
					break;
				}
			}

			// if (upgrade.idx == 6) {
			// 	upgrade.unlocked = true
			// 	GameState.upgradesBought[6] = true
			// }
		}

		else if (type == "u_") {
			upgrade.idx = 12 + i
		}

		upgrade.basePrice = upgradeBasePrices[upgrade.idx]
		upgrade.price = upgradeBasePrices[upgrade.idx]
		
		if (upgrade.idx == 12) upgrade.price = getPrice(1000, 15, GameState.clickPercentage)
		if (upgrade.idx == 13) upgrade.price = getPrice(1000, 15, GameState.achievementMultiplierPercentage)
		if (upgrade.idx == 14) upgrade.price = getPrice(1000, 15, GameState.cursorsPercentage)
		if (upgrade.idx == 15) upgrade.price = getPrice(1000, 15, GameState.powerupsPower)
	
		upgrade.textPrice = formatNumber(upgrade.price, true, true)
		upgrade.bought = GameState.upgradesBought[upgrade.idx]
		
		// if regular upgrade
		if (upgrade.type != "u_") {
			if (upgrade.bought == false) upgrade.text = upgradeTexts[upgrade.idx] + `\n${upgrade.textPrice}`
			else upgrade.text = upgradeTexts[upgrade.idx] + `\nUNLOCKED`
		}

		else {
			if (upgrade.idx == 12) upgrade.text = upgradeTexts[upgrade.idx] + `\n${upgrade.textPrice} / ${GameState.clickPercentage}%`
			else if (upgrade.idx == 13) upgrade.text = upgradeTexts[upgrade.idx] + `\n${upgrade.textPrice} / ${GameState.achievementMultiplierPercentage}%`
			else if (upgrade.idx == 14) upgrade.text = upgradeTexts[upgrade.idx] + `\n${upgrade.textPrice} / ${GameState.cursorsPercentage}%`
			else if (upgrade.idx == 15) upgrade.text = upgradeTexts[upgrade.idx] + `\n${upgrade.textPrice} / ${GameState.powerupsPower}%`
		}

		upgrade.onUpdate(() => {
			upgrade.frame = getFrame(upgrade)
		
			if (upgrade.type == "u_") {
				if (upgrade.bought) {
					if (checkPrice(GameState.score, upgrade.price)) upgrade.color = WHITE
					else upgrade.color = rgb(90, 90, 90)
				}
			}
		})
	
		upgrade.onHover(() => {
			if (winParent.is("active") && !isDraggingWindow) {
				// debug.log(upgrade.type + upgrade.idx + ` + ${upgrade.frame}`)
				if (element.up == true) {
					element.hoverEnd()
				}
	
				if (upgrade.idx == 0 || upgrade.idx == 1) {
							   // obj,    obj.text,  tS !left, down, xD,  yD, sP xS,yS
					addToolTip(upgrade, upgrade.text, 19, false, true, 0, 20, 1, 2, 1)
				}
				
				else if (upgrade.idx == 3 || upgrade.idx == 4 || upgrade.idx == 5) {
					addToolTip(upgrade, upgrade.text, 20, false, true, 0, 20, 1, 2.1, 1)
				}
				
				else if (upgrade.idx == 6 || upgrade.idx == 8) {
					addToolTip(upgrade, upgrade.text, 20, false, true, 0, 20, 1, 2.15, 1)
				}
				
				else if (upgrade.idx == 9 || upgrade.idx == 10 || upgrade.idx == 11) {
					addToolTip(upgrade, upgrade.text, 20, false, true, 0, 20, 1, 2.18, 1)
				}
				
				else if (upgrade.idx > 11) {
					addToolTip(upgrade, upgrade.text, 20, false, false, 0, 20, 1, 2.18, 1)
				}
	
				else {
					addToolTip(upgrade, upgrade.text, 20, false, true, 0, 20, 1, 2, 1)
				}
				
				upgrade.add([
					rect(upgrade.width, upgrade.height),
					color(WHITE),
					anchor("center"),
					pos(),
					opacity(0.5),
					"select",
				])
	
				playSfx("hoverElement", 100 * upgrade.idx / 4)
			}
		})

		upgrade.onHoverEnd(() => {
			if (winParent.is("active") && !isDraggingWindow) {
				if (element.up == false) {
					element.hoverStart()
				}
				destroy(get("select", { recursive: true })[0])
	
				endToolTip()
			}
		})

		upgrade.onClick(() => {
			if (winParent.is("active")) {
				buyUpgrade(upgrade)
			}
		})
	}
}

export let storeOpen = false

export function storeWinContent(winParent) {
	multipliersElement = addStoreElement(winParent, {
		name: 'Clicks',
		basePrice: 25,
		percentageIncrease: 15,
		position: vec2(0, -180),
	}, winParent)

	cursorsElement = addStoreElement(winParent, {
		name: 'Cursors',
		basePrice: 100,
		percentageIncrease: 25,
		position: vec2(0, (-180 + 108) + 10),
	}, winParent)

	powerupsElement = addStoreElement(winParent, {
		name: 'PowerUp',
		basePrice: 100,
		percentageIncrease: 25,
		position: vec2(0, -18 + 108 + 10),
	}, winParent)

	storeElements = [multipliersElement, cursorsElement, powerupsElement]

	// upgrades stuff
	addUpgrades(multipliersElement, winParent)
	addUpgrades(cursorsElement, winParent)
	addUpgrades(winParent, winParent)

	let allStoreElements = get("store", { recursive: true })
	
	onUpdate(() => {
		if (get("tooltip", { recursive: true })[0]) isHoveringUpgrade = true
		else { isHoveringUpgrade = false }

		if (storePitchSeconds < 1) {
			storePitchSeconds += dt()

			if (storePitchSeconds > 0.25) {
				hasBoughtRecently = false
				storeTune = 0
			}
		}
	})

	// IT WORKS LOL!!!!!!!!!
	// winParent.onCharInput((ch) => {
	// 	if (storeOpen) {
	// 		let n = parseInt(ch)
	// 		// is a number
	// 		if (!isNaN(n)) {
	// 			// that number is above 0 and below 3
	// 			if (n > 0 && n < 4) {
	// 				let gotElement = storeElements[n - 1]
	// 				gotElement.buy(amountBeingBought)
	// 			}
	// 		}
	// 	}
	// })
}