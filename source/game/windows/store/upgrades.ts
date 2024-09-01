import { GameState, scoreManager } from "../../../gamestate";
import { ROOT } from "../../../main";
import { playSfx, sfxHandlers } from "../../../sound";
import { addTooltip } from "../../additives";
import { insideWindowHover } from "../../hovers/insideWindowHover";
import { positionSetter } from "../../plugins/positionSetter";
import { blendColors, bop, formatNumber, getPositionOfSide, getRandomDirection, insertAtStart, parseAnimation } from "../../utils";

const tooltipLerp = 0.65

export let upgradeInfo = {
	"k_0": { value: 2, price: 500 },
	"k_1": { value: 4, price: 5_000 },
	"k_2": { value: 8, price: 10_000 },
	// ending
	"k_3": { value: 16, price: 150_000,},
	"k_4": { value: 32, price: 600_000,},
	"k_5": { value: 64, price: 750_000,},
	// freq
	"c_0": { freq: 10 }, // 10 seconds
	"c_1": { freq: 5, price: 250_000 }, // 5 seconds
	"c_2": { freq: 1, price: 500_000 }, // 1 second
	// cursor values
	"c_3": { value: 16, price: 50_000 }, 
	"c_4": { value: 32, price: 100_000 },
	"c_5": { value: 64, price: 500_000 },
}

const upgradePriceIncrease = 0.030

export function isUpgradeBought(upgradeId:string):boolean {
	return (GameState.upgradesBought.includes(upgradeId))
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
		
		let progressSound = null
		
		let downEvent = null
		
		let elementColor = elementParent.is("clickersElement") ? rgb(49, 156, 222) : rgb(49, 222, 58)
		let newColor = blendColors(elementColor.lighten(310), elementColor, map(i, 0, 6, 0.5, 1))
		
		let upgradeObj = elementParent.add([
			sprite("upgrade"),
			pos(desiredPos),
			color(newColor),
			anchor("center"),
			scale(1),
			z(winParent.z + 1),
			area({ scale: vec2(1.15, 1.15) }),
			outline(5, BLACK),
			insideWindowHover(elementParent.parent),
			"upgrade",
			{
				type: elementParent.is("clickersElement") ? "k_" : "c_",
				idx: i,
				// is setted below
				value: null, 
				freq: null, 
				upgradeId: "",
				price: 0,
				
				boughtProgress: 0,
				
				manageBlinkText(texty:string = "missing a text there buddy") {
					let thisUpgrade = this
					
					function addT() {
						let stacksText = thisUpgrade.parent.get("stacksText")[0]
					
						// blinking
						let blinkingText = elementParent.add([
							text("+0", { align: "left", size: stacksText.textSize + 4 }),
							pos(),
							color(BLACK),
							anchor("left"),
							layer("windows"),
							opacity(),
							positionSetter(),
							"blinkText",
							{
								upgradeId: thisUpgrade.upgradeId,
								update() {
									this.text = texty
									this.opacity = wave(0.25, 1, time() * 8)
								}
							}
						])
	
						// is a regular upgraade
						if (thisUpgrade.freq == null) {
							blinkingText.pos.x = -56
							blinkingText.pos.y = stacksText.pos.y - 15
						}

						// frequency
						else {
							blinkingText.pos.x = -56
							blinkingText.pos.y = 56
						}
					}

					function end() {
						elementParent.get("blinkText", { recursive: true }).filter((t) => t.upgradeId == thisUpgrade.upgradeId).forEach((t) => t.destroy())
					}

					return { addT, end }
				},

				dropBuy() {
					tween(this.scale, this.isHovering() ? vec2(1.1) : vec2(1), 0.15, (p) => this.scale = p, easings.easeOutQuad)
					tween(this.boughtProgress, 0, 0.15, (p) => this.boughtProgress = p, easings.easeOutQuad)
					this.trigger("dropBuy")
					downEvent?.cancel()
					downEvent = null
				},

				buy() {
					this.tooltip?.end()
					
					GameState.upgradesBought.push(this.upgradeId)
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
					ROOT.trigger("buy", { element: "upgrade", upgradeId: this.upgradeId, price: this.price })
					this.trigger("buy")
				},

				draw() {
					drawText({
						text: this.freq != null ? `${this.freq}s` : `x${this.value}`,
						anchor: "center",
						font: "lambda",
						size: this.height / 2,
						align: "center",
					})
					
					if (isUpgradeBought(upgradeObj.upgradeId)) return
					// draw the bought progress bar
					drawRect({
						width: this.width,
						height: map(this.boughtProgress, 0, 100, this.height, 0),
						anchor: "bot",
						radius: 10,
						color: BLACK,
						opacity: map(this.boughtProgress, 0, 100, 0.5, 0.05),
						pos: vec2(0, this.height / 2),
					})

					// draw lock
					drawSprite({
						sprite: "upgradelock",
						pos: vec2((upgradeObj.width / 2), (-upgradeObj.height / 2) + 5),
						anchor: "center",
						scale: vec2(0.7),
						color: GameState.score >= this.price ? GREEN.lighten(100) : RED.lighten(100),
						opacity: map(this.boughtProgress, 0, 100, 1, 0.10),
					})
				},

				inspect() {
					return `upgradeId: ${this.upgradeId}`
				},
			}
		])

		const addedPosition = upgradeObj.pos
		
		// sets info like upgradeId price and value/freq
		upgradeObj.upgradeId = upgradeObj.type + upgradeObj.idx
		const upgradePrice = upgradeInfo[upgradeObj.upgradeId].price
		upgradeObj.price = upgradePrice + upgradePrice * upgradePriceIncrease * GameState.stats.timesAscended
		
		if (upgradeObj.type == "k_") upgradeObj.value = upgradeInfo[upgradeObj.upgradeId].value
		else if (upgradeObj.type == "c_") {
			if (upgradeObj.idx > -1 && upgradeObj.idx < 3) upgradeObj.freq = upgradeInfo[upgradeObj.upgradeId].freq
			else upgradeObj.value = upgradeInfo[upgradeObj.upgradeId].value
		}

		upgradeObj.outline.color = upgradeObj.color.darken(10)

		let upgradeTooltip = null

		const addPriceTooltip = () => {
			let tooltip = addTooltip(upgradeObj, {
				text: `${formatNumber(upgradeObj.price, { price: true, fixAmount: 0 })}`,
				textSize: upgradeObj.height / 2,
				direction: "down",
				lerpValue: tooltipLerp,
				type: "price",
				layer: winParent.layer,
				z: winParent.z
			})

			tooltip.tooltipText.onUpdate(() => {
				GameState.score >= upgradeObj.price ? tooltip.tooltipText.color = GREEN : tooltip.tooltipText.color = RED
			})

			tooltip.tooltipBg.z += 1
			
			return tooltip;
		}
		
		upgradeObj.startingHover(() => {
			upgradeObj.parent.endHoverFunction()
			
			// animation
			tween(upgradeObj.parent.opacity, 0.9, 0.15, (p) => upgradeObj.parent.opacity = p, easings.easeOutQuad)
			tween(upgradeObj.scale, vec2(1.1), 0.15, (p) => upgradeObj.scale = p, easings.easeOutQuad)
		
			// tooltips
			let textInBlink = upgradeObj.value != null ? `+${upgradeObj.value}` : `Clicks every ${upgradeObj.freq} ${upgradeObj.freq > 1 ? "seconds" : "second"}`;
			
			if (!isUpgradeBought(upgradeObj.upgradeId)) {
				if (upgradeObj.tooltip == null) {
					upgradeTooltip = addPriceTooltip()
					upgradeObj.manageBlinkText(textInBlink).addT()
				}
			}
		})

		upgradeObj.endingHover(() => {
			upgradeObj.parent.startHoverFunction()
			
			tween(upgradeObj.parent.opacity, 1, 0.15, (p) => upgradeObj.parent.opacity = p, easings.easeOutQuad)

			if (!isUpgradeBought(upgradeObj.upgradeId) && upgradeObj.boughtProgress > 0 && GameState.score >= upgradeObj.price) upgradeObj.dropBuy()
			tween(upgradeObj.scale, vec2(1), 0.15, (p) => upgradeObj.scale = p, easings.easeOutQuad)
			
			if (upgradeObj.tooltip != null) {
				upgradeObj.tooltip?.end()
				upgradeObj.manageBlinkText().end()
			}

			// cursor animation is managed by the store element in that case
		})
		
		upgradeObj.onClick(() => {
			if (!winParent.active) return

			if (isUpgradeBought(upgradeObj.upgradeId)) {
				bop(upgradeObj)
				upgradeObj.trigger("dummyClick")

				// add a little particle silly
				let sillyParticle = elementParent.add([
					sprite("cursors"),
					opacity(),
					pos(upgradeObj.pos.x, upgradeObj.pos.y - upgradeObj.height / 2 + 5),
					anchor("center"),
					z(upgradeObj.z - 1),
					scale(rand(0.25, 0.5)),
					{
						update() {
							this.pos.y -= 1.5
							this.pos.x = wave(upgradeObj.pos.x - 5, upgradeObj.pos.x + 5, time() * 5)
						
							if (this.pos.y < getPositionOfSide(upgradeObj).top) this.z = upgradeObj.z + 1
							else this.z = upgradeObj.z - 1
						}
					}
				])

				sillyParticle.fadeIn(0.1).onEnd(() => sillyParticle.fadeOut(0.25).onEnd(() => sillyParticle.destroy()))
				
				if (upgradeObj.type == "k_") parseAnimation(sillyParticle, "cursors.cursor")
				else if (upgradeObj.type == "c_") parseAnimation(sillyParticle, "cursors.point")

				return
			}

			// hasn't bought it
			else {
				if (upgradeObj.upgradeId == "c_2" && !isUpgradeBought("c_1")) {
					// remove all tooltips that are not buy previous one
					upgradeObj.tooltip.end()

					addTooltip(upgradeObj, {
						text: "You have to buy the previous one",
						textSize: upgradeObj.height / 2,
						direction: "down",
						lerpValue: tooltipLerp,
						type: "store",
						layer: winParent.layer,
						z: winParent.z
					})

					upgradeObj.trigger("dummyClick")
					
					return // end the event
				}
			
				else if (GameState.score < upgradeObj.price) {
					upgradeObj.trigger("notEnoughMoney")
					return
				}

				else if (GameState.score >= upgradeObj.price) {
					progressSound?.stop()
					progressSound = playSfx("progress")		

					// down event
					downEvent = upgradeObj.onMouseDown(() => {
						if (isUpgradeBought(upgradeObj.upgradeId)) return
						if (upgradeObj.boughtProgress >= 5) {
							
							if (upgradeObj.tooltip.type == "storeholddowntobuy") {
								upgradeObj.tooltip.end()
								addPriceTooltip()
								// there's a tutorial tooltip, get rid of it
	
								progressSound?.stop()
								progressSound = playSfx("progress", { detune: upgradeObj.boughtProgress })
							}
						}

						if (upgradeObj.boughtProgress < 100) {
							upgradeObj.boughtProgress += 2 // time to hold
							upgradeObj.scale.x = map(upgradeObj.boughtProgress, 0, 100, 1.1, 0.85)
							upgradeObj.scale.y = map(upgradeObj.boughtProgress, 0, 100, 1.1, 0.85)
							progressSound.detune = (upgradeObj.boughtProgress * upgradeObj.idx / 2) + 1
						}
			
						if (upgradeObj.boughtProgress >= 100) {
							upgradeObj.buy()
							upgradeObj.manageBlinkText().end()
						}
					})
				}
			}
		})

		upgradeObj.onMouseRelease(() => {
			if (!winParent.active) return
		
			if (isUpgradeBought(upgradeObj.upgradeId)) return
			if (!upgradeObj.isHovering()) return
			upgradeObj.dropBuy()

			if (GameState.score >= upgradeObj.price) {
				// this is what happens when you click several times but you're not buying!!
				// you're confused!!!!!

				if (upgradeObj.boughtProgress < 1) {
					upgradeObj.tooltip?.end()

					let tutorialTooltip = addTooltip(upgradeObj, {
						text: "Hold down to buy!",
						lerpValue: tooltipLerp,
						type: "storeholddowntobuy",
						direction: "down",
					})
				}

				upgradeObj.trigger("dummyClick")
			}
		})

		upgradeObj.on("notEnoughMoney", () => {
			// opts.pos is the position it was added to
			const direction = getRandomDirection(addedPosition, false, 1.25)
			tween(direction, addedPosition, 0.25, (p) => upgradeObj.pos = p, easings.easeOutQuint)
			tween(choose([-15, 15]), 0, 0.25, (p) => upgradeTooltip.tooltipText.angle = p, easings.easeOutQuint)
			playSfx("wrong", { detune: rand(25, 75) })
		})

		upgradeObj.on("dropBuy", () => {
			if (progressSound != null || progressSound != undefined) {
				tween(progressSound.volume, 0, 0.35, (p) => progressSound.volume = p).onEnd(() => {
					progressSound.stop()
				})
				sfxHandlers.delete(progressSound)
			}
		})

		upgradeObj.on("dummyClick", () => {
			tween(choose([-15, 15]), 0, 0.15, (p) => upgradeObj.angle = p, easings.easeOutQuint)
			playSfx("clickButton", { detune: rand(-25, 25) })
		})

		// draw dumb shadow
		let drawShadow = elementParent.onDraw(() => {
			drawSprite({
				sprite: upgradeObj.sprite,
				opacity: 0.25,
				pos: vec2(upgradeObj.pos.x, upgradeObj.pos.y + 2),
				anchor: upgradeObj.anchor,
				color: BLACK,
			})
		})
	}
}