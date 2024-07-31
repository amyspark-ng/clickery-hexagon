import { GameState } from "../../../gamestate";
import { ROOT } from "../../../main";
import { positionSetter } from "../../../plugins/positionSetter";
import { addTooltip, mouse } from "../../additives";
import { addStoreElement, storeElementsInfo } from "./storeElements";
import { addUpgrades, isUpgradeBought, upgradeInfo } from "./upgrades";

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

export function storeWinContent(winParent) {
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
	if (GameState.stats.timesAscended < 1) {
		const clickersTutToolTip = () => {
			let tooltip = addTooltip(clickersElement, {
				text: "← You can buy these to get more\nscore per click",
				direction: "right",
				type: "tutorialClickers",
			})

			let buyClickersEvent = ROOT.on("buy", (data) => {
				if (data.type == "clickers") {
					tooltip.end()
					buyClickersEvent.cancel()
				}
			})
		}

		const cursorsTutToolTip = () => {
			let tooltip = addTooltip(cursorsElement, {
				text: "← You can buy these to\nautomatically get score!",
				direction: "right",
				type: "tutorialCursors",
			})

			let buyCursorsEvent = ROOT.on("buy", (data) => {
				if (data.type == "cursors") {
					tooltip.end()
					buyCursorsEvent.cancel()
				}
			})
		}

		const powerupsTutToolTip = () => {
			let tooltip = addTooltip(powerupsElement, {
				text: "← Power-ups give you a small help!\nFor a time limit.",
				direction: "right",
				type: "tutorialPowerups",
			})
	
			let unlockPowerupsEvent = ROOT.on("powerupunlock", () => {
				tooltip.end()
				unlockPowerupsEvent.cancel()
			})
		}

		const upgradesTutToolTip = () => {
			// adds the tooltip to the first upgrade
			let k_0Upgrade = clickersElement.get("upgrade").filter(upgrade => upgrade.id == "k_0")[0]
			let tooltip = addTooltip(k_0Upgrade, {
				// TODO: make this more readable, the tooltip looks crazy!!!
				text: "These will make your clicks and cursors →\nmore efficient!",
				direction: "left",
				type: "tutorialUpgrades",
			})

			let buyUpgradeEvent = ROOT.on("buy", (data) => {
				if (data.element == "upgrade" && data.id == "k_0") {
					tooltip.end()
					buyUpgradeEvent.cancel()
				}
			})
		}

		const getTooltip = (type:string) => {
			return get("tooltip").filter(tooltip => tooltip.is("text") == false && tooltip.type == type)
		}

		// EVENT THAT CHECKS FOR THE STUFF
		winParent.onUpdate(() => {
			if (!winParent.is("window")) return
			
			if (GameState.clickers == 1 && GameState.score >= storeElementsInfo.clickersElement.basePrice) {
				if (getTooltip("tutorialClickers").length == 0) {
					clickersTutToolTip()
				}
			}
			
			if (GameState.cursors == 0 && GameState.score >= storeElementsInfo.cursorsElement.basePrice) {
				if (getTooltip("tutorialCursors").length == 0) {
					cursorsTutToolTip()
				}
			}

			if (GameState.hasUnlockedPowerups == false && GameState.score >= storeElementsInfo.powerupsElement.unlockPrice) {
				if (getTooltip("tutorialPowerups").length == 0) {
					powerupsTutToolTip()
				}
			}

			if (!isUpgradeBought("k_0") && GameState.score >= upgradeInfo.k_0.price) {
				if (getTooltip("tutorialUpgrades").length == 0) {
					upgradesTutToolTip()
				}
			}
		})
	}

	winParent.on("close", () => {
		winParent.get("*", { recursive: true }).forEach(element => {
			if (element.endHover) element.endHover()
		});
	
		get("tooltip").filter(tooltip => tooltip.is("text") == false).forEach(tooltip => {
			tooltip.end()
		})
	})

	// lol!
	if (chance(0.01)) {
		winParent.sprite = "stroeWin"
		debug.log("stroeWin")
	}
}