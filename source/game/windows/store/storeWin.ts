import { GameObj } from "kaplay";
import { GameState } from "../../../gamestate";
import { ROOT } from "../../../main";
import { addTooltip } from "../../additives";
import { addStoreElement, storeElementsInfo } from "./storeElements";
import { addUpgrades, isUpgradeBought } from "./upgrades";

export let storeElements:any = [];

// used to determine the cool game juice
export let storePitchJuice = {
	hasBoughtRecently: false,
	timeSinceBought: 0,
	storeTune: 0,
}

export let isHoveringUpgrade:boolean;
let clickersElement:any;
let cursorsElement:any;
let powerupsElement:any;

export function storeWinContent(winParent:GameObj) {
	// clickers
	clickersElement = addStoreElement(winParent, { type: "clickersElement", pos: vec2(0, -128) })
	addUpgrades(clickersElement)
	
	// cursors
	cursorsElement = addStoreElement(winParent, { type: "cursorsElement", pos: vec2(0, (clickersElement.pos.y + clickersElement.height) + 15) })
	addUpgrades(cursorsElement)
	
	// powerups
	powerupsElement = addStoreElement(winParent, { type: "powerupsElement", pos: vec2(0, (cursorsElement.pos.y + cursorsElement.height) + 15) })

	// save them
	storeElements = [clickersElement, cursorsElement, powerupsElement]

	let firstUpgrade = clickersElement.get("upgrade").filter(upgrade => upgrade.upgradeId == "k_0")[0]

	// determines store pitch
	winParent.onUpdate(() => {
		if (!winParent.is("window")) return
		
		if (storePitchJuice.timeSinceBought < 1) {
			storePitchJuice.timeSinceBought += dt()

			if (storePitchJuice.timeSinceBought > 0.25) {
				storePitchJuice.hasBoughtRecently = false
				storePitchJuice.storeTune = 0
			}
		}

		isHoveringUpgrade = get("upgrade", { recursive: true }).some((upgrade) => upgrade.isHovering())
	
		// tutorial stuff
		if (GameState.stats.timesAscended < 1) {
			const clickersTutorialTooltip = () => {
				let tooltip = addTooltip(clickersElement, {
					text: "← You can buy these to get more\nscore per click",
					direction: "right",
					type: "tutorialClickers",
					layer: winParent.layer,
					z: winParent.z
				})
	
				let buyClickersEvent = ROOT.on("buy", (data) => {
					if (data.type == "clickers") {
						tooltip.end()
						buyClickersEvent.cancel()
					}
				})
			}
	
			const cursorsTutorialTooltip = () => {
				let tooltip = addTooltip(cursorsElement, {
					text: "← You can buy these to\nautomatically get score!",
					direction: "right",
					type: "tutorialCursors",
					layer: winParent.layer,
					z: winParent.z
				})
	
				let buyCursorsEvent = ROOT.on("buy", (data) => {
					if (data.type == "cursors") {
						tooltip.end()
						buyCursorsEvent.cancel()
					}
				})
			}
	
			const powerupsTutorialTooltip = () => {
				let tooltip = addTooltip(powerupsElement, {
					text: "← Power-ups give you a small help!\nFor a time limit.",
					direction: "right",
					type: "tutorialPowerups",
					layer: winParent.layer,
					z: winParent.z
				})
		
				let unlockPowerupsEvent = ROOT.on("powerupunlock", () => {
					tooltip.end()
					unlockPowerupsEvent.cancel()
				})
			}

			const upgradesTutorialTooltip = () => {
				let tooltip = addTooltip(firstUpgrade, {
					text: "← Upgrades help make your clicks worth!",
					direction: "right",
					type: "tutorialUpgrades",
					layer: winParent.layer,
					z: winParent.z
				})
		
				let buyFirstUpgradeCheck = ROOT.on("buy", (data) => {
					if (data.element == "upgrade" && data.id == "k_0") {
						tooltip.end()
						buyFirstUpgradeCheck.cancel()
					}
				})
			}
	
			const getTooltip = (type:string) => {
				return get("tooltip", { recursive: true }).filter(tooltip => tooltip.is("text") == false && tooltip.type == type)
			}
	
			// EVENT THAT CHECKS FOR THE STUFF
			if (GameState.clickers == 1 && GameState.score >= storeElementsInfo.clickersElement.basePrice) {
				if (getTooltip("tutorialClickers").length == 0) {
					clickersTutorialTooltip()
				}
			}
			
			if (GameState.cursors == 0 && GameState.score >= storeElementsInfo.cursorsElement.basePrice) {
				if (getTooltip("tutorialCursors").length == 0) {
					cursorsTutorialTooltip()
				}
			}
	
			if (GameState.hasUnlockedPowerups == false && GameState.score >= storeElementsInfo.powerupsElement.unlockPrice) {
				if (getTooltip("tutorialPowerups").length == 0) {
					powerupsTutorialTooltip()
				}
			}

			if (!isUpgradeBought("k_0") && GameState.score >= firstUpgrade.price) {
				if (getTooltip("tutorialUpgrades").length == 0) {
					upgradesTutorialTooltip()
				}
			}
		}
	})

	winParent.on("close", () => {
		winParent.get("*", { recursive: true }).forEach(element => {
			if (element.endHover) element.endHover()
		});
		
		// i am going insane
		let tooltips = get("tooltip").filter(tooltip => tooltip.type != undefined)
		tooltips = tooltips.filter(obj => obj.type.includes("tutorial") || obj.type.includes("price") || obj.type.includes("store"))
		tooltips.forEach((tooltip) => {
			tooltip.end()
		})
	})

	// lol!
	if (chance(0.01)) {
		winParent.sprite = "stroeWin"
	}
}