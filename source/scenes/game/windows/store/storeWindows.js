import { GameState } from "../../../../gamestate";
import { playSfx } from "../../../../sound";
import { bop, getPrice, getSides, mouse } from "../../utils";
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
		z(winParent.z + 1),
		"hoverObj",
		"storeElement",
		`${opts.key}`,
		{
			price: 0,
			isBeingHoveredOn: false,
			isBeingClicked: false,
			down: false,
			buy: function(amount) {
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
				
				if (this.isBeingClicked) {
					this.play("down")
					this.get("*").forEach(element => {
						element.pos.y += 2
					});
					wait(0.15, () => {
						this.play("up")
						this.get("*").forEach(element => {
							element.pos.y -= 2
						});
					})
				}
			},

			update() {
				isKeyDown("shift") ? amountToBuy = 10 : amountToBuy = 1
				if (this.is("clickersElement") || this.is("cursorsElement")) this.price = getPrice(elements[opts.key].basePrice, elements[opts.key].percentageIncrease, GameState[elements[opts.key].gamestateKey], amountToBuy)
			},

			draw() {
				if (!this.isBeingClicked) return
				if (timesBoughtWhileHolding < 2) return
				if (GameState.score < this.price) return
				if (timesBoughtWhileHolding < 12) {
					drawCircle({
						anchor: "center",
						pos: vec2((this.pos.x - this.width / 2) + 5, this.pos.y - this.height / 2 - this.height + 10),
						radius: 10,
						color: WHITE,
						z: this.z + 1,
						fill: false,
						outline: 5,
						end: map(timer, 0, timeUntilAnotherBuy, 1, 360),
					})
				}

				else {
					drawText({
						text: "$",
						pos: vec2((this.pos.x - this.width / 2) + 5, this.pos.y - this.height / 2 - this.height + 10),
						size: 20,
						anchor: "center",
						z: this.z + 1,
					})
				}
			}
		}
	])

	if (opts.key == "powerupsElement" && !GameState.hasUnlockedPowerups) {
		let chains = add([
			// sprite("chains"),
		])
	}
	
	let stacksText = btn.add([
		text("Stacked upgrades: 0", {
			size: 14,
		}),
		anchor("center"),
		pos(-100, 24),
		color(BLACK),
		z(btn.z + 1),
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
		z(btn.z + 1),
		{
			update() {
				this.text = `$${btn.price}`
				if (GameState.score >= btn.price) this.color = GREEN
				else this.color = RED
			}
		}
	])

	let timer = 0;
	let minTime = 0.08
	let timeUntilAnotherBuy = 1.2
	let maxTime = 1.2
	let timesBoughtWhileHolding = 0

	btn.onMouseDown(() => {
		// if (!winParent.is("active")) return
		if (!btn.isHovering()) return
		btn.isBeingClicked = true
		if (!GameState.score >= btn.price) return

		if (timesBoughtWhileHolding == 0) {
			timeUntilAnotherBuy = maxTime
		}

		timer += dt()

		timeUntilAnotherBuy = maxTime / (timesBoughtWhileHolding)
		timeUntilAnotherBuy = clamp(timeUntilAnotherBuy, minTime, maxTime)

		if (timesBoughtWhileHolding == 0) {
			timesBoughtWhileHolding = 1
			btn.buy(amountToBuy)
		}

		if (timer > timeUntilAnotherBuy) {
			timer = 0
			timesBoughtWhileHolding++	
			btn.buy(amountToBuy)
		}

		if (timesBoughtWhileHolding > 10 && !get("smoke")[0]) {
			let smoke = add([
				sprite("smoke"),
				pos(btn.worldPos().x - btn.width / 2, btn.worldPos().y - btn.height / 2),
				opacity(),
				anchor("center"),
				z(btn.z - 1),
				"smoke",
			])

			smoke.fadeIn(1)
			smoke.play("smoking")
		}
	})

	btn.onMouseRelease(() => {
		if (!btn.isHovering()) return
		btn.isBeingClicked = false
		
		// if (!winParent.is("active")) return
		timer = 0
		timesBoughtWhileHolding = 0
		timeUntilAnotherBuy = 2.25
		
		// if there's smoke
		get("smoke", { recursive: true })[0]?.fadeOut(0.25)
		get("smoke", { recursive: true })[0]?.unuse("smoke")
	})

	btn.onHoverEnd(() => {
		if (btn.isBeingClicked) {
			btn.isBeingClicked = false
			// if (!winParent.is("active")) return
			timer = 0
			timesBoughtWhileHolding = 0
			timeUntilAnotherBuy = 2.25
		}
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