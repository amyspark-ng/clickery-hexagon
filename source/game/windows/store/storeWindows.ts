import { GameState } from "../../../gamestate";
import { playSfx } from "../../../sound";
import { getPrice } from "../../utils";
import { addUpgrades } from "./upgrades";

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

let isHoveringUpgrade = false

function addStoreElement(winParent:any, opts = { key: "null", pos: vec2(0, 20) }) {
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
			isBeingHovered: false,
			isBeingClicked: false,
			down: false,
			buy(amount:number) {
				if (winParent.dragging) return
				if (this.is("clickersElement")) GameState.clickers += amount
				else if (this.is("cursorsElement")) GameState.cursors += amount

				tween(GameState.score, GameState.score - this.price, 0.32, (p) => GameState.score = p)

				hasBoughtRecently = true;
				storePitchSeconds = 0;
				if (hasBoughtRecently == true) storeTune += 25;
				storeTune = clamp(storeTune, -100, 500)
				playSfx("kaching", { tune: storeTune })
				
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

			startHover() {
				tween(this.scale, vec2(1.025), 0.15, (p) => this.scale = p, easings.easeOutQuad)
				this.isBeingHovered = true
			},

			endHover() {
				tween(this.scale, vec2(1), 0.15, (p) => this.scale = p, easings.easeOutQuad)
				this.isBeingHovered = false
			},

			update() {
				isKeyDown("shift") ? amountToBuy = 10 : amountToBuy = 1
				if (this.is("clickersElement") || this.is("cursorsElement")) this.price = getPrice(elements[opts.key].basePrice, elements[opts.key].percentageIncrease, GameState[elements[opts.key].gamestateKey], amountToBuy)
				this.area.scale = vec2(1 / this.scale.x, 1 / this.scale.y)
			},
		}
	])

	let stacksText = btn.add([
		text("Stacked upgrades: 0", {
			size: 14,
		}),
		anchor("center"),
		pos(-100, 24),
		color(BLACK),
		z(btn.z + 1),
		"stacksText",
		{
			update() {
				if (opts.key == "clickersElement") this.text = `Stacked upgrades: ${GameState.clicksUpgradesValue}`
				else if (opts.key = "cursorsElement") this.text = `Stacked upgrades: ${GameState.cursorsUpgradesValue}`
				else this.text = "what the hell"
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

	let downEvent = null;
	btn.onMousePress("left", () => {
		if (isHoveringUpgrade) return
		if (!btn.isHovering()) return;

		downEvent = btn.onMouseDown(() => {
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
	
			if (timesBoughtWhileHolding > 10 && !get("smoke", { recursive: true })[0]) {
				let smoke = winParent.add([
					sprite("smoke"),
					pos(btn.pos.x - btn.width / 2, btn.pos.y - btn.height / 2),
					opacity(),
					anchor("center"),
					z(btn.z - 1),
					"smoke",
				])
	
				smoke.fadeIn(1)
				smoke.play("smoking")
			}
		})
	})

	btn.onMouseRelease(() => {
		downEvent?.cancel()
		downEvent = null

		if (!btn.isHovering()) return
		btn.isBeingClicked = false
		
		// if (!winParent.is("active")) return
		timer = 0
		timesBoughtWhileHolding = 0
		timeUntilAnotherBuy = 2.25
		
		// if there's smoke
		let smoke = get("smoke", { recursive: true })[0]
		if (smoke) {
			smoke.unuse("smoke")
			smoke.fadeOut(1)
			tween(smoke.pos.y, smoke.pos.y - 15, 0.5, (p) => smoke.pos.y = p)
		}
	})

	btn.onHover(() => {
		btn.startHover()
	})

	btn.onHoverEnd(() => {
		if (btn.isBeingClicked) {
			btn.isBeingClicked = false
			// if (!winParent.is("active")) return
			timer = 0
			timesBoughtWhileHolding = 0
			timeUntilAnotherBuy = 2.25
		}
		btn.endHover()
	})

	return btn;
}

function addPowerupElement(winParent:any, posToAdd:any, hasUnlockedPowerups:boolean) {
	let chains;
	// add a parent background object
	const btn = winParent.add([
		sprite("powerupsElement"),
		pos(posToAdd),
		area(),
		color(),
		opacity(1),
		scale(1),
		anchor("center"),
		z(winParent.z + 1),
		"hoverObj",
		"storeElement",
		"powerupsElement",
		{
			isBeingHovered: false,
			boughtProgress: 0,
			startHover() {
				tween(this.scale, vec2(1.025), 0.15, (p) => this.scale = p, easings.easeOutQuad)
				this.isBeingHovered = true
			},
			endHover() {
				tween(this.scale, vec2(1), 0.15, (p) => this.scale = p, easings.easeOutQuad)
				this.isBeingHovered = false
			},
			dropUnlock() {
				tween(btn.boughtProgress, 0, 0.15, (p) => btn.boughtProgress = p)
				tween(this.scale, vec2(1.025), 0.15, (p) => this.scale = p, easings.easeOutQuad)
				tween(chains.opacity, 1, 0.15, (p) => chains.opacity = p, easings.easeOutQuad)
			},
			unlock() {
				GameState.hasUnlockedPowerups = true
				playSfx("kaching")
				this.destroy()
				addPowerupElement(winParent, posToAdd, true)
			},
			buy() {
				debug.log("buy powerup")
			},
			update() {
				this.area.scale = vec2(1 / this.scale.x, 1 / this.scale.y)
			}
		}
	])

	btn.onHover(() => {
		btn.startHover()
	})

	btn.onHoverEnd(() => {
		btn.endHover()
	})

	if (!hasUnlockedPowerups) {
		btn.onDraw(() => {
			drawRect({
				width: btn.width,
				height: map(btn.boughtProgress, 0, 100, btn.height, 0),
				anchor: "bot",
				color: BLACK,
				pos: vec2(0, btn.height / 2),
				radius: 5,
				opacity: 0.8,
			})
		})

		chains = btn.add([
			sprite("chains"),
			pos(),
			anchor("center"),
			opacity(1),
		])

		let downEvent = null;
		btn.onMousePress("left", () => {
			downEvent?.cancel()
			if (!btn.isHovering()) return;

			downEvent = btn.onMouseDown("left", () => {
				if (btn.boughtProgress < 100) {
					btn.boughtProgress += 1.5
					btn.scale.x = map(btn.boughtProgress, 0, 100, 1.025, 0.9)
					btn.scale.y = map(btn.boughtProgress, 0, 100, 1.025, 0.9)
					chains.opacity = map(btn.boughtProgress, 0, 100, 1, 0.25)
				}
	
				if (btn.boughtProgress >= 100 && !GameState.hasUnlockedPowerups) {
					btn.unlock()
				}
			})
		})

		btn.onMouseRelease("left", () => {
			if (!btn.isHovering()) return;

			btn.dropUnlock()
		})
	}

	else {
		btn.onMousePress("left", () => {
			if (!btn.isHovering()) return;

			btn.buy()
		})
	}

	return btn;
}

let clickersElement:any;
let cursorsElement:any;
let powerupsElement:any;

export function storeWinContent(winParent) {

	clickersElement = addStoreElement(winParent, { key: "clickersElement", pos: vec2(0, -160) })
	addUpgrades(clickersElement)
	cursorsElement = addStoreElement(winParent, { key: "cursorsElement", pos: vec2(0, (clickersElement.pos.y + clickersElement.height) + 15) })
	addUpgrades(cursorsElement)
	powerupsElement = addPowerupElement(winParent, vec2(0, (cursorsElement.pos.y + cursorsElement.height) + 15), GameState.hasUnlockedPowerups)

	storeElements = [clickersElement, cursorsElement, powerupsElement]

	winParent.onUpdate(() => {
		if (storePitchSeconds < 1) {
			storePitchSeconds += dt()

			if (storePitchSeconds > 0.25) {
				hasBoughtRecently = false
				storeTune = 0
			}
		}

		isHoveringUpgrade = get("upgrade", { recursive: true }).some((upgrade) => upgrade.isHovering())
	})

	winParent.on("close", () => {
		winParent.get("*", { recursive: true }).forEach(element => {
			if (element.endHover) element.endHover()
		});
	})
}