import { GameState } from "../../../gamestate";
import { ROOT } from "../../../main";
import { addTooltip } from "../../additives";
import { hexagon } from "../../hexagon";
import { addStoreElement, storeElementsInfo } from "./storeElements";
import { addUpgrades, isUpgradeBought, upgradeInfo } from "./upgrades";

export let storeElements:any = [];

// used to determine the cool game juice
export let storePitchJuice = {
	hasBoughtRecently: false,
	timeSinceBought: 0,
	storeTune: 0,
}

let isHoveringUpgrade:boolean;
let clickersElement:any;
let cursorsElement:any;
let powerupsElement:any;

export function storeWinContent(winParent) {
	// clickers
	clickersElement = addStoreElement(winParent, { type: "clickersElement", pos: vec2(0, -160) })
	addUpgrades(clickersElement)
	
	// cursors
	cursorsElement = addStoreElement(winParent, { type: "cursorsElement", pos: vec2(0, (clickersElement.pos.y + clickersElement.height) + 15) })
	addUpgrades(cursorsElement)
	
	// powerups
	powerupsElement = addStoreElement(winParent, { type: "powerupsElement", pos: vec2(0, (cursorsElement.pos.y + cursorsElement.height) + 15) })

	// save them
	storeElements = [clickersElement, cursorsElement, powerupsElement]

	// determines store pitch
	winParent.onUpdate(() => {
		if (storePitchJuice.timeSinceBought < 1) {
			storePitchJuice.timeSinceBought += dt()

			if (storePitchJuice.timeSinceBought > 0.25) {
				storePitchJuice.hasBoughtRecently = false
				storePitchJuice.storeTune = 0
			}
		}

		isHoveringUpgrade = get("upgrade", { recursive: true }).some((upgrade) => upgrade.isHovering())
	})

	// tutorial stuff
	// TODO: This could be rewritten it kinda sucks very hard
	function addCursorsElTutTool() {
		let tooltip = addTooltip(cursorsElement, {
			text: "← You can buy these to get automatically get score!",
			direction: "right",
			tag: "tutorial",
		})

		let buyCursorsEvent = ROOT.on("buy", (data) => {
			if (data.type == "cursors") {
				tooltip.end()
				buyCursorsEvent.cancel()
			}
		})
	}

	function addFirstUpgradeTutTool() {
		// adds the tooltip to the first upgrade
		let tooltip = addTooltip(clickersElement.get("upgrade").filter(upgrade => upgrade.id == "k_0")[0], {
			text: "With these you can make clicks or cursors more efficient! →",
			direction: "left",
			tag: "tutorial",
		})

		let buyUpgradeEvent = ROOT.on("buy", (data) => {
			if (data.element == "upgrade" && data.id == "k_0") {
				tooltip.end()
				buyUpgradeEvent.cancel()
			}
		})
	}

	function addPowerupsTutTool() {
		// adds the tooltip to the first upgrade
		let tooltip = addTooltip(powerupsElement, {
			text: "← Power-ups give you a small help!\nFor a time limit.",
			direction: "right",
			tag: "tutorial",
		})

		let powerupUnlockCheck = ROOT.on("powerupunlock", () => {
			powerupUnlockCheck.cancel()
			tooltip.end()
		})
	}

	let checkForStuff = null;
	if (GameState.ascendLevel < 2) {
		if (GameState.clickers == 0) {
			let tooltip = addTooltip(clickersElement, {
				text: "← You can buy these to get more\nscore per click",
				direction: "right",
				tag: "tutorial",
			})

			let buyClickersEvent = ROOT.on("buy", (data) => {
				if (data.type == "clickers") {
					tooltip.end()
					buyClickersEvent.cancel()
				}
			})
		}
	
		if (GameState.cursors == 0 && GameState.score >= cursorsElement.price) {
			addCursorsElTutTool()
		}

		if (GameState.score >= upgradeInfo.k_0.price && !isUpgradeBought("k_0")) {
			addFirstUpgradeTutTool()
		}

		if (GameState.score >= storeElementsInfo.powerupsElement.unlockPrice && GameState.stats.powerupsClicked < 1) {
			addPowerupsTutTool()
		}

		let cursorsChecked = false
		let upgradeChecked = false
		let powerupChecked = false
		checkForStuff = hexagon.on("clickrelease", () => {
			if (cursorsChecked == false && GameState.cursors == 0 && GameState.score >= cursorsElement.price) {
				cursorsChecked = true
				addCursorsElTutTool()
			}
	
			if (upgradeChecked == false && GameState.score >= upgradeInfo.k_0.price && !isUpgradeBought("k_0")) {
				upgradeChecked = true
				addFirstUpgradeTutTool()
			}

			if (powerupChecked == false && GameState.score >= storeElementsInfo.powerupsElement.unlockPrice && GameState.stats.powerupsClicked < 1) {
				powerupChecked = true
				addPowerupsTutTool()
			}
		})
	}

	winParent.on("close", () => {
		winParent.get("*", { recursive: true }).forEach(element => {
			if (element.endHover) element.endHover()
			});
		
		get("tooltip").filter(obj => obj.is("text")).forEach((tooltipObj) => {
			// is part of the tutorial
			// TODO: i added the tag to use them here but turns out it i can't even get it here, maybe add the opts
			// to the bg and text
			if (tooltipObj.text.includes("←") || tooltipObj.text.includes("→")) tooltipObj.end()
		})
		
		checkForStuff?.cancel()
	})
}