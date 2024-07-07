import { GameState } from "../../../gamestate";
import { playSfx } from "../../../sound";
import { blendColors, bop, formatNumber, randomPos } from "../../utils";

export let isHoveringUpgrade = false;

export let upgradeInfo = {
	"k_0": { value: 2, price: 5 },
	"k_1": { value: 4, price: 10 },
	"k_2": { value: 8, price: 20 },
	"k_3": { value: 16, price: 50,},
	"k_4": { value: 32, price: 100,},
	"k_5": { value: 64, price: 500,},
	"c_0": { freq: 10, price: 5,},
	"c_1": { freq: 5, price: 10,},
	"c_2": { freq: 1, price: 50,},
	"c_3": { value: 8, price: 100,},
	"c_4": { value: 16, price: 150,},
	"c_5": { value: 36, price: 500,},
}

function isUpgradeBought(id:string):boolean {
	return (GameState.upgradesBought.includes(id))
}

export function addUpgrades(elementParent) {
	let winParent = elementParent.parent;
	
	let initialPos = vec2(-27.5, -31.5)
	let desiredPos = vec2(initialPos.x, initialPos.y)
	let spacing = vec2(55)

	for (let i = 0; i < 6; i++) {
		// crazy grid placement
		if (i == 3) {desiredPos.y += spacing.y; desiredPos.x = initialPos.x}
		desiredPos.x += spacing.x
		
		let elementColor = elementParent.is("clickersElement") ? rgb(49, 156, 222) : rgb(49, 222, 58)
		let newColor = blendColors(WHITE, elementColor, map(i, 0, 6, 0.5, 1))
		let upgradeObj = elementParent.add([
			pos(desiredPos),
			rect(45, 45, { radius: 10 }),
			color(newColor),
			anchor("center"),
			scale(1),
			z(winParent.z + 1),
			area(),
			"upgrade",
			"hoverObj",
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
						layer("windows"),
						scale(),
						pos(upgradeObj.screenPos().x, upgradeObj.screenPos().y + upgradeObj.height / 2 + 5),
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
						text(displayText, { align: alignmentForTooltip, size: upgradeObj.height / 2}),
						color(WHITE),
						z(this.z + 1),
						pos(),
						anchor(alignmentForTooltip),
						"tooltip",
						{
							update() {
								if (typeof price == "number") {
									if (GameState.score >= price) this.color = GREEN
									else this.color = RED
								}
							}
						}
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
						layer("windows"),
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
					// let value = this.value != null ? this.value : this.freq;
					let blink = this.value != null ? `+${this.value}` : `Cursors now click every ${this.freq} seconds`;
					if (!isUpgradeBought(this.id) && !this.hasTooltip) this.addTooltip(formatNumber(this.price, { price: true, fixAmount: 1 }), blink)
				},

				endHover() {
					this.parent.startHover()
					tween(this.parent.opacity, 1, 0.15, (p) => this.parent.opacity = p, easings.easeOutQuad)

					if (!isUpgradeBought(upgradeObj.id)) this.dropBuy()
					tween(this.scale, vec2(1), 0.15, (p) => this.scale = p, easings.easeOutQuad)
					if (!isUpgradeBought(this.id) && this.hasTooltip) this.endTooltip()
				},

				buy() {
					this.endTooltip()	
					GameState.upgradesBought.push(this.id)
					playSfx("kaching", { detune: 25 * this.idx })
					tween(this.scale, vec2(1.1), 0.15, (p) => this.scale = p, easings.easeOutQuad)
				
					if (this.type == "k_") GameState.clicksUpgradesValue += this.value
					else if (this.type == "c_") {
						if (this.value != null) GameState.cursorsUpgradesValue += this.value
						else if (this.freq != null) GameState.timeUntilAutoLoopEnds = this.freq
					}
				},

				draw() {
					drawText({
						text: this.freq != null ? `${this.freq}s` : `x${this.value}`,
						anchor: "center",
						size: this.height / 2,
						align: "center",
					})
					
					if (isUpgradeBought(upgradeObj.id)) return
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
		
		// sets info like id price and value/freq
		upgradeObj.id = upgradeObj.type + upgradeObj.idx
		upgradeObj.price = upgradeInfo[upgradeObj.id].price
		
		if (upgradeObj.type == "k_") upgradeObj.value = upgradeInfo[upgradeObj.id].value
		else if (upgradeObj.type == "c_") {
			if (upgradeObj.idx > -1 && upgradeObj.idx < 3) upgradeObj.freq = upgradeInfo[upgradeObj.id].freq
			else upgradeObj.value = upgradeInfo[upgradeObj.id].value
		}

		let downEvent = null;
		upgradeObj.onMousePress("left", () => {
			if (!winParent.active) return
		
			if (!upgradeObj.isHovering()) return;
			if (isUpgradeBought(upgradeObj.id) || GameState.score < upgradeObj.price) {bop(upgradeObj); return}

			if (upgradeObj.id == "c_2" && !isUpgradeBought("c_1")) {
				upgradeObj.endTooltip()
				upgradeObj.addTooltip("You have to buy the previous one", `Cursors now click every ${upgradeObj.freq} seconds`, "right")
				return
			}

			downEvent = upgradeObj.onMouseDown(() => {
				if (isUpgradeBought(upgradeObj.id)) return
				if (!upgradeObj.isHovering()) return
	
				if (upgradeObj.boughtProgress < 100) {
					upgradeObj.boughtProgress += 1.5
					upgradeObj.scale.x = map(upgradeObj.boughtProgress, 0, 100, 1.1, 0.85)
					upgradeObj.scale.y = map(upgradeObj.boughtProgress, 0, 100, 1.1, 0.85)
				}
	
				if (upgradeObj.boughtProgress >= 100) {
					upgradeObj.buy()
				}
			})
		})

		upgradeObj.onMouseRelease(() => {
			if (!winParent.active) return
		
			if (isUpgradeBought(upgradeObj.id)) return
			upgradeObj.dropBuy()
			downEvent?.cancel()
			downEvent = null
		})

		upgradeObj.onHover(() => {
			if (!winParent.active) return
		
			upgradeObj.startHover()
		})

		upgradeObj.onHoverEnd(() => {
			if (!winParent.active) return
		
			upgradeObj.endHover()
		})

		let drawShadow = elementParent.onDraw(() => {
			// drawRect({
			// 	width: upgradeObj.width,
			// 	height: upgradeObj.height,
			// 	color: BLACK,
			// 	pos: vec2(upgradeObj.pos.x, upgradeObj.pos.y + 4),
			// 	radius: upgradeObj.radius,
			// 	opacity: 0.75,
			// 	anchor: "center",
			// })
		})

		upgradeObj.onDestroy(() => {
			drawShadow.cancel()
		})
	}
}