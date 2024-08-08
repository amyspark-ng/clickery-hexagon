import { clickVars } from "./game/hexagon"
import { powerupTypes } from "./game/powerups"
import { percentage, saveAnim } from "./game/utils"
import { ROOT } from "./main"
import { musicHandler, stopAllSounds } from "./sound"

export class saveColor {
    r: number = 255;
    g: number = 255;
    b: number = 255;
	a: number;

    constructor(r: number, g: number, b: number, a?: number) {
        this.r = r;
        this.g = g;
        this.b = b;
		this.a = a;
    }
}

class _GameState {	
	score = 0
	scoreThisRun = 0
	scoreAllTime = 0
	
	clickers = 1
	clicksUpgradesValue = 1 // multiplier for clicks
	clickPercentage = 0 // percentage added

	cursors = 0
	cursorsUpgradesValue = 1 // multiplier for cursors
	cursorsPercentage = 0 // percentage added
	timeUntilAutoLoopEnds = 10 // cursor frequency

	upgradesBought = ["c_0"]

	// powerups 
	hasUnlockedPowerups = false
	
	powerupPower = 1
	critPower = 0

	ascension = {
		mana: 0,
		manaAllTime: 0,
		magicLevel: 1, // times ascended + 1
		
		// stuff bought for price calculation
		clickPercentagesBought: 0,
		cursorsPercentagesBought: 0,
		powerupPowersBought: 0,
		critPowersBought: 0,
	}

	unlockedAchievements = []

	unlockedWindows = ["bgColorWin", "hexColorWin"]
	taskbar = []

	stats = {
		timesClicked: 0,
		powerupsClicked: 0,
		timesAscended: 0,
		powerupsBought: 0,
		totalTimePlayed: 0,
		timesGnomed: 0,
	}

	settings = {
		sfx: { volume: 1, muted: false },
		music: { volume: 1, muted: false, favoriteIdx: 0 },
		volume: 1,
		hexColor: new saveColor(255, 255, 255),
		bgColor: new saveColor(0, 0, 0, 0.84),
		commaInsteadOfDot: false,
		fullscreen: false,
		spsTextMode: 1,

		panderitoMode: false,
	}

	save(anim = true) {
		if (this.score < 25) return
		setData("hexagon-save", this)
		if (anim) saveAnim()
	}

	load() {
		let gottenData = getData("hexagon-save") 
		if (gottenData) {
			Object.assign(this, gottenData)
		}
		else {
			gottenData = new _GameState();
		}
		return gottenData;
	}

	delete() {
		let oldvolume = this.settings.volume
		
		// remove data
		localStorage.removeItem("hexagon-save")
		Object.assign(this, new _GameState())

		musicHandler?.stop()
		stopAllSounds()
		
		this.settings.volume = oldvolume
		
		go("gamescene")
	}

	cheat() {
		this.clickers = 100
		this.cursors = 100
		this.score = scoreManager.ascensionConstant
		this.scoreThisRun = scoreManager.ascensionConstant
		this.scoreAllTime = scoreManager.ascensionConstant
	}
}

export let GameState = new _GameState()

class _scoreManager {
	scientificENOT = 1000000000000000000000

	combo = 1
	
	// score per click (no combo or powerups or percentage)
	scorePerClick_Vanilla = () => {
		return Math.round(GameState.clickers * GameState.clicksUpgradesValue)
	}

	// score per click
	scorePerClick = () => {
		let vanillaValue = this.scorePerClick_Vanilla()
		let noPercentage = (vanillaValue * (powerupTypes.clicks.multiplier * powerupTypes.awesome.multiplier) * this.combo)
		let returnValue = noPercentage + percentage(GameState.clickPercentage, noPercentage)
		return Math.round(returnValue)
	}

	getScoreWithCrit = () => {
		return Math.round(this.scorePerClick() * (GameState.critPower * 0.5))
	}

	// score per cursor click (not including powerups or percentages)
	scorePerAutoClick_Vanilla = () => {
		return Math.round(GameState.cursors * GameState.cursorsUpgradesValue)
	}

	// score per cursor click
	scorePerAutoClick = () => {
		let noPercentage = GameState.cursors * GameState.cursorsUpgradesValue * (powerupTypes.cursors.multiplier * powerupTypes.awesome.multiplier)
		let returnValue = noPercentage + percentage(GameState.cursorsPercentage, noPercentage)
		return Math.round(returnValue)
	}

	// the score per second you're getting by cursors
	// no rounding because can be decimal (0.1)
	autoScorePerSecond = () => {
		let returnValue = this.scorePerAutoClick() / GameState.timeUntilAutoLoopEnds
		return returnValue
	}

	// the general score per second clicks and all
	// no rounding because can be decimal (0.1)
	scorePerSecond = () => {
		return (clickVars.clicksPerSecond * (this.scorePerClick())) + this.autoScorePerSecond()
	}

	addScore(amount:number) {
		GameState.score += amount
		GameState.scoreThisRun += amount
		GameState.scoreAllTime += amount
		ROOT.trigger("scoreGained", amount)
	}

	// used usually when buying
	subTweenScore(amount:number) {
		// GameState.score -= amount
		tween(GameState.score, GameState.score - amount, 0.32, (p) => GameState.score = p, easings.easeOutExpo)
		ROOT.trigger("scoreDecreased", amount)
	}

	addTweenScore(amount:number) {
		tween(GameState.score, GameState.score + amount, 0.32, (p) => GameState.score = p, easings.easeOutExpo)
		GameState.scoreThisRun += amount
		GameState.scoreAllTime += amount
		ROOT.trigger("scoreGained", amount)
	}

	// =====================
	//   ASCENSION STUFF
	// =====================
	// Mana is a spendable currency
	// When score is greater than scoreTilNextMana, mana is added by one
	// Magic level is as multiplier

	/**
	 * This is the number you start getting mana at
	 */
	ascensionConstant = 5_000_000

	// Is the actual formula that determines the amounts you get mana at
	getScoreForManaAT = (manaAllTime:number) => {
		return (manaAllTime ** 2) * this.ascensionConstant
	}

	// The score you get the next mana at
	scoreYouGetNextManaAt = () => {
		let nextManaAt = this.getScoreForManaAT(GameState.ascension.manaAllTime + 1);
		return nextManaAt;
	}
	
	resetRun() {
		tween(GameState.score, 0, 0.32, (p) => GameState.score = p, easings.easeOutCirc)
		tween(GameState.scoreThisRun, 0, 0.32, (p) => GameState.scoreThisRun = p, easings.easeOutCirc)
	
		tween(GameState.clickers, 1, 0.5, (p) => GameState.clickers = Math.round(p), easings.easeOutQuad)
		tween(GameState.cursors, 0, 0.5, (p) => GameState.cursors = Math.round(p), easings.easeOutQuad)

		tween(GameState.clicksUpgradesValue, 1, 0.5, (p) => GameState.clicksUpgradesValue = Math.round(p), easings.easeOutQuad)
		tween(GameState.cursorsUpgradesValue, 1, 0.5, (p) => GameState.cursorsUpgradesValue = Math.round(p), easings.easeOutQuad)
		
		GameState.stats.powerupsBought = 0

		GameState.upgradesBought = ["c_0"]
		GameState.timeUntilAutoLoopEnds = 10
	}
}

export let scoreManager = new _scoreManager()