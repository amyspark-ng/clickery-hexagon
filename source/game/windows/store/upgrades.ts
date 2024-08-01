import { GameState, scoreManager } from "../../../gamestate";
import { ROOT } from "../../../main";
import { playSfx, sfxHandlers } from "../../../sound";
import { addTooltip, mouse } from "../../additives";
import { insideWindowHover } from "../../hovers/insideWindowHover";
import { blendColors, bop, formatNumber, getPositionOfSide, getRandomDirection, parseAnimation } from "../../utils";

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
			area(),
			outline(5, BLACK),
			insideWindowHover(elementParent.parent),
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
					this.trigger("dropBuy")
					downEvent?.cancel()
					downEvent = null
				},

				buy() {
					upgradeObj.tooltips?.forEach(tooltip => {
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
					
					if (isUpgradeBought(upgradeObj.id)) return
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
					return `upgradeId: ${this.id}`
				},
			}
		])

		const addPriceTooltip = () => {
			let tooltip = addTooltip(upgradeObj, {
				text: formatNumber(upgradeObj.price, { price: true, fixAmount: 1 }),
				textSize: upgradeObj.height / 2,
				direction: "down",
				lerpValue: 0.75,
				type: "price",
				layer: winParent.layer,
				z: winParent.z
			})

			tooltip.tooltipBg.z += 1
			
			tooltip.tooltipText.onUpdate(() => {
				if (GameState.score >= upgradeObj.price) tooltip.tooltipText.color = GREEN
				else tooltip.tooltipText.color = RED
			})
			
			return tooltip;
		}
		
		const addedPosition = upgradeObj.pos
		
		// sets info like id price and value/freq
		upgradeObj.id = upgradeObj.type + upgradeObj.idx
		upgradeObj.price = upgradeInfo[upgradeObj.id].price
		
		if (upgradeObj.type == "k_") upgradeObj.value = upgradeInfo[upgradeObj.id].value
		else if (upgradeObj.type == "c_") {
			if (upgradeObj.idx > -1 && upgradeObj.idx < 3) upgradeObj.freq = upgradeInfo[upgradeObj.id].freq
			else upgradeObj.value = upgradeInfo[upgradeObj.id].value
		}

		upgradeObj.outline.color = upgradeObj.color.darken(10)

		upgradeObj.startingHover(() => {
			// end the hover of the storeElement
			upgradeObj.parent.endHoverFunction()

			// animation
			tween(upgradeObj.parent.opacity, 0.9, 0.15, (p) => upgradeObj.parent.opacity = p, easings.easeOutQuad)
			tween(upgradeObj.scale, vec2(1.1), 0.15, (p) => upgradeObj.scale = p, easings.easeOutQuad)
		
			// tooltips
			let textInBlink = upgradeObj.value != null ? `+${upgradeObj.value}` : `Cursors now click every ${upgradeObj.freq} seconds`;
			if (!isUpgradeBought(upgradeObj.id) && !upgradeObj.hasTooltip) {
				upgradeObj.tooltips?.forEach(tooltip => {
					tooltip.end()
				});

				tooltip = addPriceTooltip()
				upgradeObj.manageBlinkText(textInBlink).addT()
			}

			// mouse animation
			if (isUpgradeBought(upgradeObj.id) || GameState.score < upgradeObj.price) {
				mouse.play("cursor")
			}

			// if the upgrade can be bought
			else {
				mouse.play("point")
			}
		})

		upgradeObj.endingHover(() => {
			upgradeObj.parent.startHoverFunction()
			tween(upgradeObj.parent.opacity, 1, 0.15, (p) => upgradeObj.parent.opacity = p, easings.easeOutQuad)

			if (!isUpgradeBought(upgradeObj.id) && upgradeObj.boughtProgress > 0 && GameState.score >= upgradeObj.price) upgradeObj.dropBuy()
			tween(upgradeObj.scale, vec2(1), 0.15, (p) => upgradeObj.scale = p, easings.easeOutQuad)
			upgradeObj.tooltips?.forEach(tooltip => tooltip.end())
		
			upgradeObj.manageBlinkText().end()

			// cursor animation is managed by the store element in that case
		})
		
		upgradeObj.onClick(() => {
			if (!winParent.active) return

			if (isUpgradeBought(upgradeObj.id)) {
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
				if (upgradeObj.id == "c_2" && !isUpgradeBought("c_1")) {
					// remove all tooltips that are not buy previous one
					upgradeObj.tooltips.filter(tooltip => tooltip.type != "buypreviousupgrade").forEach(tooltip => tooltip.end())
	
					if (upgradeObj.tooltips.filter(tooltip => tooltip.type == "buypreviousupgrade").length == 0) {
						let tooltip = addTooltip(upgradeObj, {
							text: "You have to buy the previous one",
							textSize: upgradeObj.height / 2,
							direction: "down",
							type: "buypreviousupgrade",
						})
					}

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
						if (isUpgradeBought(upgradeObj.id)) return
						if (upgradeObj.boughtProgress >= 5) {
							// there's a tutorial tooltip, get rid of it
							if (upgradeObj.tooltips.filter(tooltip => tooltip.type == "tutorial").length > 0) {
								upgradeObj.tooltips.forEach(tooltip => tooltip.end())
								addPriceTooltip()
							
								progressSound?.stop()
								let speed = map(upgradeObj.boughtProgress, 0, 100, 1, 1.25)
								progressSound = playSfx("progress", { detune: upgradeObj.boughtProgress })
							}
						}
						
						if (upgradeObj.boughtProgress < 100) {
							upgradeObj.boughtProgress += 2 // time to hold
							upgradeObj.scale.x = map(upgradeObj.boughtProgress, 0, 100, 1.1, 0.85)
							upgradeObj.scale.y = map(upgradeObj.boughtProgress, 0, 100, 1.1, 0.85)
							progressSound.detune = upgradeObj.boughtProgress * upgradeObj.idx / 2
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
		
			if (isUpgradeBought(upgradeObj.id)) return
			if (!upgradeObj.isHovering()) return
			upgradeObj.dropBuy()

			if (GameState.score >= upgradeObj.price) {
				// this is what happens when you click several times but you're not buying!!
				// you're confused!!!!!
				if (upgradeObj.boughtProgress < 1 && upgradeObj.tooltips.filter(tooltip => tooltip.type == "buypreviousupgrade").length == 0) {
					let tutorialtooltips = upgradeObj.tooltips.filter(tooltip => tooltip.type == "tutorial")
					if (tutorialtooltips.length == 0) {
						upgradeObj.tooltips.forEach(tooltip => tooltip.end())
						let tutorialTooltip = addTooltip(upgradeObj, {
							text: "Hold down to buy!",
							lerpValue: 0.75,
							type: "tutorial",
							direction: "down",
						})
					}
				}

				upgradeObj.trigger("dummyClick")
			}
		})

		let tooltip = null;

		upgradeObj.on("notEnoughMoney", () => {
			// opts.pos is the position it was added to
			const direction = getRandomDirection(addedPosition, false, 1.25)
			tween(direction, addedPosition, 0.25, (p) => upgradeObj.pos = p, easings.easeOutQuint)
			tween(choose([-15, 15]), 0, 0.25, (p) => tooltip.tooltipText.angle = p, easings.easeOutQuint)
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

		upgradeObj.on("buy", () => {
			mouse.play("cursor")
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