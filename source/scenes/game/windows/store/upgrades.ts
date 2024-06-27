import { GameState } from "../../../../gamestate";
import { playSfx } from "../../../../sound";
import { bop } from "../../utils";

export let isHoveringUpgrade = false;

let prices = {
	"k_0": 5,
	"k_1": 10,
	"k_2": 20,
	"k_3": 50,
	"k_4": 100,
	"k_5": 500,
	"c_0": 5,
	"c_1": 10,
	"c_2": 20,
	"c_3": 50,
	"c_4": 100,
	"c_5": 500,
}

function isUpgradeBought(id:string):boolean {
	return (GameState.upgradesBought.includes(id))
}

export function addUpgrades(elementParent) {
	let winParent = elementParent.parent;
	
	let initialPos = vec2(-27.5)
	let desiredPos = vec2(initialPos.x, initialPos.y)
	let spacing = vec2(55)

	for (let i = 0; i < 6; i++) {
		// crazy grid placement
		if (i == 3) {desiredPos.y += spacing.y; desiredPos.x = initialPos.x}
		desiredPos.x += spacing.x
		
		let upgrade = elementParent.add([
			pos(desiredPos),
			rect(45, 45, { radius: 10 }),
			color(RED.lighten(rand(100, 150))),
			anchor("center"),
			scale(1),
			z(winParent.z + 1),
			area(),
			"upgrade",
			{
				type: elementParent.is("clickersElement") ? "k_" : "c_",
				idx: i,
				// is setted below
				value: null, 
				freq: null, 
				id: "",
				price: 0,
				
				boughtProgress: 0,
				hasTooltip: false,
				
				update() {
					this.area.scale = vec2(1 / this.scale.x, 1 / this.scale.y)
				},

				addTooltip(price:any, blink:any, alignmentForTooltip:any = "center") {
					this.hasTooltip = true
					let thisUpgrade = this;
					let bg = add([
						rect(0, 0, { radius: 5 }),
						z(this.z + 1),
						color(BLACK),
						scale(),
						pos(upgrade.screenPos().x, upgrade.screenPos().y + upgrade.height / 2 + 5),
						anchor(alignmentForTooltip),
						"tooltip",
						{
							update() {
								this.scale.x = thisUpgrade.scale.x
								this.scale.y = thisUpgrade.scale.y
							}
						}
					])
					tween(vec2(0.85), vec2(1), 0.15, (p) => bg.scale = p, easings.easeOutBack)

					let displayText = price;
					if (GameState.upgradesBought.length == 0) displayText = displayText + " (Hold to buy)" 

					let priceText = bg.add([
						text(displayText, { align: alignmentForTooltip, size: upgrade.height / 2}),
						color(WHITE),
						z(this.z + 1),
						pos(),
						anchor(alignmentForTooltip),
						"tooltip",
					])

					bg.width = formatText({ text: displayText, align: displayText.align, size: priceText.textSize, }).width + 5
					bg.height = priceText.height + 2
				
					let stacksText = this.parent.get("stacksText")[0]
					
					// blinking
					let alignment = thisUpgrade.value != null ? "left" : "right" as any;
					let blinkingText = add([
						text("+0", { align: alignment, size: stacksText.textSize + 4 }),
						pos(),
						color(BLACK),
						anchor(alignment),
						z(priceText.z + 1),
						opacity(),
						"tooltip",
						{
							update() {
								this.text = blink
								this.opacity = wave(0.25, 1, time() * 8)
							}
						}
					])

					if (thisUpgrade.value != null) {
						blinkingText.pos = vec2(stacksText.screenPos().x + stacksText.width / 2 + 2, stacksText.screenPos().y - 2)
					}
					
					else if (thisUpgrade.freq != null) {
						blinkingText.pos = vec2(thisUpgrade.screenPos().x, thisUpgrade.screenPos().y)
					}
				},

				endTooltip() {
					this.hasTooltip = false
					get("tooltip").forEach(element => {
						element?.destroy()
					});
				},

				dropBuy() {
					tween(this.scale, this.isHovering() ? vec2(1.1) : vec2(1), 0.15, (p) => this.scale = p, easings.easeOutQuad)
					tween(this.boughtProgress, 0, 0.15, (p) => this.boughtProgress = p, easings.easeOutQuad)
				},

				startHover() {
					this.parent.endHover()
					tween(this.parent.opacity, 0.9, 0.15, (p) => this.parent.opacity = p, easings.easeOutQuad)
					
					tween(this.scale, vec2(1.1), 0.15, (p) => this.scale = p, easings.easeOutQuad)
					let value = this.value != null ? this.value : this.freq;
					let blink = this.value != null ? `+${this.value}` : `Cursors now click every ${this.freq} seconds`;
					if (!isUpgradeBought(this.id) && !this.hasTooltip) this.addTooltip(value, blink)
				},

				endHover() {
					this.parent.startHover()
					tween(this.parent.opacity, 1, 0.15, (p) => this.parent.opacity = p, easings.easeOutQuad)

					if (!isUpgradeBought(upgrade.id)) this.dropBuy()
					tween(this.scale, vec2(1), 0.15, (p) => this.scale = p, easings.easeOutQuad)
					if (!isUpgradeBought(this.id) && this.hasTooltip) this.endTooltip()
				},

				buy() {
					this.endTooltip()	
					GameState.upgradesBought.push(this.id)
					playSfx("kaching", { tune: 25 * this.idx })
					tween(this.scale, vec2(1.1), 0.15, (p) => this.scale = p, easings.easeOutQuad)
				
					if (this.type == "k_") GameState.clicksUpgradesValue += this.value
					else if (this.type == "c_") {
						if (this.value != null) GameState.cursorsUpgradesValue += this.value
						else if (this.freq != null) GameState.timeUntilAutoLoopEnds = this.freq
					}
				},

				draw() {
					if (isUpgradeBought(upgrade.id)) return
					drawRect({
						width: this.width,
						height: map(this.boughtProgress, 0, 100, this.height, 0),
						anchor: "bot",
						radius: this.radius,
						color: BLACK,
						pos: vec2(0, this.height / 2),
						opacity: 0.5,
					})
				},
			}
		])
		upgrade.id = upgrade.type + upgrade.idx
		upgrade.price = prices[upgrade.id]
		
		if (upgrade.type == "k_") {
			upgrade.value = 2 ** (upgrade.idx + 1)
		}

		else if (upgrade.type == "c_") {
			if (upgrade.idx > 0 && upgrade.idx < 3) {
				switch (upgrade.idx) {
					case 0:
						upgrade.freq = 10
					break;
					case 1:
						upgrade.freq = 5
					break;
					case 2:
						upgrade.freq = 1
					break;
				}
			}

			// is multiplier upgrades
			else {
				switch (upgrade.idx) {
					case 3:
						upgrade.value = 8;
					break;
					case 4:
						upgrade.value = 16;
					break;
					case 5:
						upgrade.value = 36;
					break;
				}
			}
		}

		let downEvent = null;
		upgrade.onMousePress("left", () => {
			if (!upgrade.isHovering()) return;

			if (upgrade.id == "c_2" && !isUpgradeBought("c_1")) {
				upgrade.endTooltip()
				upgrade.addTooltip("You have to buy the previous one", `Cursors now click every ${upgrade.freq} seconds`, "right")
				return
			}

			downEvent = upgrade.onMouseDown(() => {
				if (isUpgradeBought(upgrade.id)) return
				if (!upgrade.isHovering()) return
	
				if (upgrade.boughtProgress < 100) {
					upgrade.boughtProgress += 1.5
					upgrade.scale.x = map(upgrade.boughtProgress, 0, 100, 1.1, 0.85)
					upgrade.scale.y = map(upgrade.boughtProgress, 0, 100, 1.1, 0.85)
				}
	
				if (upgrade.boughtProgress >= 100) {
					upgrade.buy()
				}
			})
		})

		upgrade.onMouseRelease(() => {
			if (isUpgradeBought(upgrade.id)) return
			upgrade.dropBuy()
			downEvent?.cancel()
			downEvent = null
		})

		upgrade.onClick(() => {
			if (isUpgradeBought(upgrade.id)) bop(upgrade)
		})

		upgrade.onHover(() => {
			upgrade.startHover()
		})

		upgrade.onHoverEnd(() => {
			upgrade.endHover()
		})
	}
}