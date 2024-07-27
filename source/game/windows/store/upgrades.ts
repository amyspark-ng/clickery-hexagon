import { GameState, scoreManager } from "../../../gamestate";
import { ROOT } from "../../../main";
import { playSfx } from "../../../sound";
import { addTooltip } from "../../additives";
import { blendColors, bop, formatNumber } from "../../utils";

export let upgradeInfo = {
	"k_0": { value: 2, price: 500 },
	"k_1": { value: 4, price: 2500 }, // TODO: look into this, between first and second there's a 5x gap, i think that's good
	"k_2": { value: 8, price: 6750 },
	// ending
	"k_3": { value: 16, price: 20200,},
	"k_4": { value: 32, price: 22500,},
	"k_5": { value: 64, price: 30500,},
	// freq
	"c_0": { freq: 10 }, // 10 seconds
	"c_1": { freq: 5, price: 15500 }, // 5 seconds
	"c_2": { freq: 1, price: 45500 }, // 1 second
	// cursor values
	"c_3": { value: 16, price: 8500 }, 
	"c_4": { value: 32, price: 10500 },
	"c_5": { value: 48, price: 12400 },
}

export function isUpgradeBought(id:string):boolean {
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
				
				update() {
					this.area.scale = vec2(1 / this.scale.x, 1 / this.scale.y)
				},

				manageBlinkText(texty:string = "missing a text there buddy") {
					let thisUpgrade = this
					
					function addT() {
						let stacksText = thisUpgrade.parent.get("stacksText")[0]
					
						// blinking
						let alignment = thisUpgrade.value != null ? "left" : "right" as any;
						let blinkingText = add([
							text("+0", { align: alignment, size: stacksText.textSize + 4 }),
							pos(),
							color(BLACK),
							anchor(alignment),
							layer("windows"),
							opacity(),
							"blinkText",
							{
								upgradeId: thisUpgrade.id,
								update() {
									this.text = texty
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
					}

					function end() {
						get("blinkText").filter((t) => t.upgradeId == thisUpgrade.id).forEach((t) => t.destroy())
					}

					return { addT, end }
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
				},

				endHover() {
					this.parent.startHover()
					tween(this.parent.opacity, 1, 0.15, (p) => this.parent.opacity = p, easings.easeOutQuad)

					if (!isUpgradeBought(upgradeObj.id)) this.dropBuy()
					tween(this.scale, vec2(1), 0.15, (p) => this.scale = p, easings.easeOutQuad)
					if (!isUpgradeBought(this.id)) {
						upgradeObj.tooltips?.filter(tooltip => tooltip.type == "price").forEach(tooltip => {
							tooltip.end()
						});
					}
				},

				buy() {
					upgradeObj.tooltips?.filter(tooltip => tooltip.type == "price").forEach(tooltip => {
						tooltip.end()
					});
					GameState.upgradesBought.push(this.id)
					playSfx("kaching", { detune: 25 * this.idx })
					tween(this.scale, vec2(1.1), 0.15, (p) => this.scale = p, easings.easeOutQuad)
				
					if (this.type == "k_") {
						if (GameState.clicksUpgradesValue == 1) GameState.clicksUpgradesValue += this.value - 1
						else GameState.clicksUpgradesValue += this.value 
					}

					else if (this.type == "c_") {
						if (this.value != null) {
							if (GameState.cursorsUpgradesValue == 1) GameState.cursorsUpgradesValue += this.value - 1
							else GameState.cursorsUpgradesValue += this.value 
						}

						else if (this.freq != null) GameState.timeUntilAutoLoopEnds = this.freq
					}
					
					scoreManager.subTweenScore(this.price)
					ROOT.trigger("buy", { element: "upgrade", id: this.id, price: this.price })
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

				inspect() {
					return `upgradeId: ${this.id}`
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
			if (isUpgradeBought(upgradeObj.id) || GameState.score < upgradeObj.price) {
				return
			}

			if (upgradeObj.id == "c_2" && !isUpgradeBought("c_1")) {
				upgradeObj.tooltips?.filter(tooltip => tooltip.type == "price").forEach(tooltip => {
					tooltip.end()
				});

				let tooltip = addTooltip(upgradeObj, {
					text: "You have to buy the previous one",
					textSize: upgradeObj.height / 2,
					direction: "down",
					type: "price",
				})

				return // end the event
			}

			downEvent = upgradeObj.onMouseDown(() => {
				if (isUpgradeBought(upgradeObj.id)) return
				if (!upgradeObj.isHovering()) return
	
				if (upgradeObj.boughtProgress < 100) {
					upgradeObj.boughtProgress += 2 // time to hold
					upgradeObj.scale.x = map(upgradeObj.boughtProgress, 0, 100, 1.1, 0.85)
					upgradeObj.scale.y = map(upgradeObj.boughtProgress, 0, 100, 1.1, 0.85)
				}
	
				if (upgradeObj.boughtProgress >= 100) {
					upgradeObj.buy()
					upgradeObj.manageBlinkText().end()
				}
			})

			bop(upgradeObj);
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
		
			let textInBlink = upgradeObj.value != null ? `+${upgradeObj.value}` : `Cursors now click every ${upgradeObj.freq} seconds`;
			if (!isUpgradeBought(upgradeObj.id) && !upgradeObj.hasTooltip) {
				upgradeObj.tooltips?.filter(tooltip => tooltip.type == "price").forEach(tooltip => {
					tooltip.end()
				});

				let tooltip = addTooltip(upgradeObj, {
					text: formatNumber(upgradeObj.price, { price: true, fixAmount: 1 }),
					textSize: upgradeObj.height / 2,
					direction: "down",
					lerpValue: 0.75,
					type: "price",
				})

				tooltip.tooltipText.onUpdate(() => {
					if (GameState.score >= upgradeObj.price) tooltip.tooltipText.color = GREEN
					else tooltip.tooltipText.color = RED
				})

				upgradeObj.manageBlinkText(textInBlink).addT()
			}
		})

		upgradeObj.onHoverEnd(() => {
			if (!winParent.active) return
			upgradeObj.endHover()
		
			upgradeObj.tooltips?.filter(tooltip => tooltip.type == "price").forEach(tooltip => {
				tooltip.end()
			});
			upgradeObj.manageBlinkText().end()
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