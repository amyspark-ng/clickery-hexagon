import { GameState } from "../../../../GameState";
import { playSfx } from "../../../../sound";
import { bop, getPrice, getSides } from "../../utils";
import { addMiscUpgrades, addRegularUpgrades } from "./upgrades";

let elements = {
	"clickersElement": { gamestateKey: "clickers", basePrice: 25, percentageIncrease: 15 },
	"cursorsElement": { gamestateKey: "cursors", basePrice: 50, percentageIncrease: 25 },
	"powerupsElement": { gamestateKey: "powerupsBought", basePrice: 1000, percentageIncrease: 50 },
}

let storeElements = [];

// used to determine the cool game juice
let hasBoughtRecently = false;
let storePitchSeconds = 0;
let storeTune = 0;

let amountToBuy = 1

function addStoreElement(winParent, opts = { key: "null", pos: vec2(0, 20) }) {
	// add a parent background object
	const btn = winParent.add([
		sprite(opts.key),
		pos(opts.pos),
		area(),
		color(),
		opacity(1),
		scale(1),
		anchor("center"),
		"hoverObj",
		"storeElement",
		`${opts.key}`,
		{
			price: 0,
			buy(amount) {
				if (winParent.dragging) return
				if (this.is("clickersElement")) GameState.clickers += amount
				else if (this.is("cursorsElement")) GameState.cursors += amount
				else if (this.is("powerupsElement")) GameState.powerupsBought++

				tween(GameState.score, GameState.score - this.price, 0.32, (p) => GameState.score = p)

				hasBoughtRecently = true;
				storePitchSeconds = 0;
				if (hasBoughtRecently == true) storeTune += 25;
				storeTune = clamp(storeTune, -100, 500)
				playSfx("kaching", storeTune)
				bop(this)
			},

			update() {
				isKeyDown("shift") ? amountToBuy = 10 : amountToBuy = 1
				if (this.is("clickersElement") || this.is("cursorsElement")) this.price = getPrice(elements[opts.key].basePrice, elements[opts.key].percentageIncrease, GameState[elements[opts.key].gamestateKey], amountToBuy)
			}
		}
	])

	if (opts.key == "powerupsElement") { !GameState.hasUnlockedPowerups ? btn.play("locked") : btn.play("unlocked") }

	let stacksText = btn.add([
		text("Stacked upgrades: 0", {
			size: 14,
		}),
		anchor("center"),
		pos(-100, 30),
		color(BLACK),
		{
			update() {
				this.text = "Stacked upgrades: 0"
			}
		}
	])

	let priceText = btn.add([
		text("$50", {
			size: 18,
		}),
		anchor("center"),
		pos(stacksText.pos.x - 5, stacksText.pos.y + 15),
		color(BLACK),
		{
			update() {
				this.text = `$${btn.price}`
				if (GameState.score >= btn.price) this.color = GREEN
				else this.color = RED
			}
		}
	])

	let timer = 0;
	let timeUntilAnotherBuy = 1
	let timesBoughtWhileHolding = 0

	btn.onMouseDown(() => {
		if (!btn.isHovering()) return

		if (GameState.score >= btn.price) {
			if (timesBoughtWhileHolding == 0) {
				timeUntilAnotherBuy = 1
			}

			timer += dt()

			timeUntilAnotherBuy = 1 / (timesBoughtWhileHolding)
			timeUntilAnotherBuy = clamp(timeUntilAnotherBuy, 0.05, 1)

			if (timesBoughtWhileHolding == 0) {
				timesBoughtWhileHolding = 1
				btn.buy(amountToBuy)
			}

			if (timer > timeUntilAnotherBuy) {
				timer = 0
				timesBoughtWhileHolding++	
				btn.buy(amountToBuy)
			}
		}
	})

	btn.onMouseRelease(() => {
		timer = 0
		timesBoughtWhileHolding = 0
		timeUntilAnotherBuy = 2.25
	})

	return btn;
}

let clickersElement;
let cursorsElement;
let powerupsElement;

export function storeWinContent(winParent) {

	clickersElement = addStoreElement(winParent, { key: "clickersElement", pos: vec2(0, -150) })
	addRegularUpgrades(clickersElement)
	cursorsElement = addStoreElement(winParent, { key: "cursorsElement", pos: vec2(0, (clickersElement.pos.y + clickersElement.height) + 15) })
	addRegularUpgrades(cursorsElement)
	powerupsElement = addStoreElement(winParent, { key: "powerupsElement", pos: vec2(0, (cursorsElement.pos.y + cursorsElement.height) + 15) })
	addMiscUpgrades(winParent)

	storeElements = [clickersElement, cursorsElement, powerupsElement]

	winParent.onUpdate(() => {
		if (storePitchSeconds < 1) {
			storePitchSeconds += dt()

			if (storePitchSeconds > 0.25) {
				hasBoughtRecently = false
				storeTune = 0
			}
		}
	})
}