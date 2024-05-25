import { GameState } from "../main.js";
import { volumeManager } from "../plugins/volumebar.js";
import { upgradePriceData } from "./upgradescene.js";
import { addBackground, bop, getPrice, save } from "./utils.js";

class storeElementClass {
	constructor() {
		this.amountToBuy = 1;
		this.clickers = {
			objectAmount: 1,
			basePrice: 22,
			percentageIncrease: 15,
		};
		this.cursors = {
			objectAmount: 1,
			basePrice: 40,
			percentageIncrease: 15,
		};
		this.powerups = {
			objectAmount: 1,
			basePrice: 60,
			percentageIncrease: 15,
		};
	}
}

let storeElements = new storeElementClass()

export function addElement(name = "clickers") {
	let mainElement = add([
		rect(width() / 2, 100),
		color(rgb(150, 204, 255)),
		pos(300, get("element").length == 0 ? 100 : get("element")[get("element").length - 1].pos.y + 125),
		anchor("center"),
		area(),
		outline(5, WHITE),
		"element"
	])

	if (name == "clickers") mainElement.color = rgb(150, 204, 255)
	else if (name == "cursors") mainElement.color = rgb(150, 255, 157)
	else if (name == "powerups") mainElement.color = rgb(255, 215, 150)
	
	mainElement.onHover(() => {setCursor("pointer")})
	mainElement.onHoverEnd(() => {setCursor("default")})

	mainElement.onMousePress("left", (() => {
		if (mainElement.isHovering()) {
			storeElements[name].objectAmount += storeElements.amountToBuy
			bop(mainElement, 0.05)
			play("kaching", { detune: 2 * storeElements[name].objectAmount })
		}
	}))
	
	mainElement.onMousePress("right", (() => {
		if (mainElement.isHovering()) {
			storeElements[name].objectAmount -= storeElements.amountToBuy
			bop(mainElement, 0.05)
			play("kaching", { detune: 2 * storeElements[name].objectAmount })
		}
	}))

	mainElement.add([
		text(`${name}: ${storeElements[name].objectAmount}`),
		color(BLACK),
		anchor("center"),
		{
			update() {
				this.text = `${name}: ${storeElements[name].objectAmount}`
			}
		}
	])

	mainElement.add([
		text("", { size: 20 }),
		color(BLACK),
		anchor("center"),
		pos(0, 20),
		{
			update() {
				this.text = `The price for the next is: $${getPrice(storeElements[name].basePrice, storeElements[name].percentageIncrease, storeElements[name].objectAmount, storeElements.amountToBuy)}`
			}
		}
	])

	let basePriceBox = add([
		pos(mainElement.pos.x + mainElement.width / 2 + 100, mainElement.pos.y),
		rect(50, 50),
		color(mainElement.color),
		outline(4.5, mainElement.outline.color),
		anchor("center"),
		area(),
	])

	basePriceBox.onHover(() => {setCursor("pointer")})
	basePriceBox.onHoverEnd(() => {setCursor("default")})

	basePriceBox.onMousePress("left", (() => {
		if (basePriceBox.isHovering()) {
			storeElements[name].basePrice++ 
			bop(basePriceBox, 0.05)
			play("generalClick", { detune: 30 * storeElements[name].basePrice})
		}
	}))
	
	basePriceBox.onMousePress("right", (() => {
		if (basePriceBox.isHovering()) {
			storeElements[name].basePrice-- 
			bop(basePriceBox, 0.05)
			play("generalClick", { detune: 30 * storeElements[name].basePrice})
		}
	}))

	basePriceBox.add([
		text(storeElements[name].basePrice, {
			size: 20,
		}),
		anchor("center"),
		color(BLACK),
		{
			update() {
				this.text = "$" + storeElements[name].basePrice
			}
		}
	])

	add([
		pos(basePriceBox.pos.x, basePriceBox.pos.y + 50),
		text("Base price", {
			size: 20,
		}),
		anchor("center"),
		color(WHITE),
	])
	
	let percentageIncreaseBox = add([
		pos(basePriceBox.pos.x + 200, mainElement.pos.y),
		rect(50, 50),
		color(mainElement.color),
		outline(4.5, mainElement.outline.color),
		anchor("center"),
		area(),
	])

	percentageIncreaseBox.onHover(() => {setCursor("pointer")})
	percentageIncreaseBox.onHoverEnd(() => {setCursor("default")})

	percentageIncreaseBox.onMousePress("left", (() => {
		if (percentageIncreaseBox.isHovering()) {
			storeElements[name].percentageIncrease++ 
			bop(percentageIncreaseBox, 0.05)
			play("generalClick", { detune: 30 * storeElements[name].basePrice})
		}
	}))
	
	percentageIncreaseBox.onMousePress("right", (() => {
		if (percentageIncreaseBox.isHovering()) {
			storeElements[name].percentageIncrease--
			bop(percentageIncreaseBox, 0.05)
			play("generalClick", { detune: 30 * storeElements[name].basePrice})
		}
	}))

	percentageIncreaseBox.add([
		text(storeElements[name].percentageIncrease, {
			size: 20,
		}),
		anchor("center"),
		color(BLACK),
		{
			update() {
				this.text = storeElements[name].percentageIncrease + "%"
			}
		}
	])

	add([
		pos(percentageIncreaseBox.pos.x, percentageIncreaseBox.pos.y + 50),
		text("Percentage Increase", {
			size: 20,
		}),
		anchor("center"),
		color(WHITE),
	])
}

export function gamescene() {
	return scene("gamescene", () => {
		// put in the first scene that the game starts in
		volumeManager()
		
		setCursor("default")
		if (get("bg").length == 0) addBackground()
		if (get("arrow").length == 0) {
			let arrow = add([
				text("->", {
					size: 40,
				}),
				pos(width() - 50, 35),
				color(WHITE),
				anchor("center"),
				stay(),
				area(),
				"arrow",
				{
					scene: "gamescene",
					update() {
						if (!get("element").length == 0) {this.scene = "gamescene"; this.text = "->"} 
						else {this.scene = "upgradescene"; this.text = "<-"}
					
						if (this.isHovering() && isMousePressed("left")) {
							if (this.scene == "gamescene") {
								save("storeElements", storeElements)
								go("upgradescene")
							}
			
							else {
								save("upgradePriceData", upgradePriceData)
								go("gamescene")
							}

							play("generalClick")
							bop(this)
						}
					}
				}
			])
		}

		add([
			text("Left Click -> Buy+\nRight Click -> Decrease-", {
				size: 20
			}),
			pos(0, height() - 40),
			color(WHITE),
		])

		storeElements = getData("storeElements", storeElements)

		addElement("clickers")
		addElement("cursors")
		addElement("powerups")
	
		onKeyPress("c", () => {
			save("storeElements", storeElements)
		})

		onKeyPress("v", () => {
			storeElements = new storeElementClass()
			GameState.storeElements = storeElements
			setData("storeElements", GameState.storeElements)
			
			let savedText = add([
				text("Buy-data deleted"),
				pos(width(), height() + 50),
				color(rgb(255, 150, 150)),
				anchor("right"),
				opacity(1),
			])

			tween(savedText.pos.y, height() - 25, 0.5, (p) => savedText.pos.y = p, easings.easeOutQuint)
			wait(2, () => {
				tween(savedText.opacity, 0, 0.25, (p) => savedText.opacity = p, easings.easeOutQuint).onEnd(() => {
					destroy(savedText)
				})
			})
		})

		onKeyPress("b", () => {
			storeElements.clickers.objectAmount = 1000000
			storeElements.cursors.objectAmount = 50000
			storeElements.powerups.objectAmount = 100

			let savedText = add([
				text("Buy-data cheated"),
				pos(width(), height() + 50),
				color(rgb(150, 190, 255)),
				anchor("right"),
				opacity(1),
			])

			tween(savedText.pos.y, height() - 25, 0.5, (p) => savedText.pos.y = p, easings.easeOutQuint)
			wait(2, () => {
				tween(savedText.opacity, 0, 0.25, (p) => savedText.opacity = p, easings.easeOutQuint).onEnd(() => {
					destroy(savedText)
				})
			})
		})

		onKeyPress("right", () => {
			save("storeElements", storeElements)
			go("upgradescene")
		})
	})
}