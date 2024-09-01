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
		
		// stuff bought for price calculation
		clickPercentagesBought: 0,
		cursorsPercentagesBought: 0,
		powerupPowersBought: 0,
		critPowersBought: 0,
	}

	unlockedAchievements:string[] = []

	unlockedWindows:string[] = []
	taskbar:string[] = []

	stats = {
		timesClicked: 0,
		powerupsClicked: 0,
		timesAscended: 0,
		powerupsBoughtThisRun: 0,
		powerupsBought: 0,
		totalTimePlayed: 0,
		/**
		 * Time it took you to complete the game
		 */
		timeGameComplete: 0,
		beenGnomed: false,
		hasDevkyGoobered: false,
	}

	settings = {
		sfx: { volume: 1, muted: false },
		music: { volume: 1, muted: false, paused: false, favoriteIdx: 0 },
		volume: 1,
		hexColor: new saveColor(255, 255, 255),
		bgColor: new saveColor(0, 0, 0, 0.84),
		commaInsteadOfDot: false,
		fullscreen: false,
		spsTextMode: 1,

		panderitoMode: false,
	}

	save(anim = true) {
		if (this.scoreAllTime < 25) return
		setData("hexagon-save", this)
		if (anim) saveAnim()
	}

	load() {
		const newSave = new _GameState()
		
		let gottenData = getData("hexagon-save") as _GameState
		
		if (!gottenData) gottenData = newSave
		
		else if (gottenData.saveVersion == undefined || gottenData.saveVersion == null || gottenData.saveVersion < this.saveVersion) {
			gottenData = newSave
		}

		Object.assign(this, gottenData)
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
		return console.log("=== HEXAGON-SAVE DELETED ===")
	}

	cheat() {
		this.clickers = 100
		this.cursors = 100
		this.score = scoreManager.ascensionConstant
		this.scoreThisRun = scoreManager.ascensionConstant
		this.scoreAllTime = scoreManager.ascensionConstant
		stopAllSounds()
		go("gamescene")
		this.settings.music.muted = true
	}

	/**
	 *  Every time there's a change to the gamestate save this has to be changed
	 */
	// 0.9 was in the last days before the release of the game
	// 0.91 was has been gnomed, devky goobered
	// 1.0 will be in the moment of release
	saveVersion = 0.91
}

export let GameState = new _GameState()

class _scoreManager {
	combo = 1
	
	// score per click (no combo or powerups or percentage)
	scorePerClick_Vanilla = () => {
		return Math.round(GameState.clickers * GameState.clicksUpgradesValue) 
	}

	/**
	 * Gets the score per click with powerups combo cards mana and possibly crit
	 * @param includeCrits Wheter to also include crit power
	 * @returns The score
	 */
	scorePerClick = (includeCrits?:boolean) => {
		const vanillaValue = this.scorePerClick_Vanilla()
		const countingPowerups = vanillaValue * powerupTypes.clicks.multiplier * powerupTypes.awesome.multiplier
		const countingCombo = countingPowerups * this.combo
		const countingCards = countingCombo + percentage(countingCombo, GameState.clickPercentage)
		const countingManaAT = countingCards + percentage(countingCards, GameState.ascension.manaAllTime)
		
		includeCrits = includeCrits ?? false
		if (includeCrits) return Math.round(countingManaAT * GameState.critPower)
		else return Math.round(countingManaAT) 
	}

	// score per cursor click (not including powerups or percentages)
	scorePerAutoClick_Vanilla = () => {
		return Math.round(GameState.cursors * GameState.cursorsUpgradesValue)
	}

	/**
	 * Gets the score per auto click
	 * @param includePowerups wheter to include powerups in the formula or not
	 */
	scorePerAutoClick = (includePowerups?:boolean) => {
		includePowerups = includePowerups ?? false
		
		const vanillaValue = this.scorePerAutoClick_Vanilla()
		
		let nextValue = vanillaValue
		if (includePowerups == true) nextValue = vanillaValue * powerupTypes.cursors.multiplier * powerupTypes.awesome.multiplier

		const countingCards = vanillaValue + percentage(vanillaValue, GameState.cursorsPercentage)
		const countingManaAT = countingCards + percentage(countingCards, GameState.ascension.manaAllTime)
		return Math.round(countingManaAT)
	}

	// the score per second you're getting by cursors
	// no rounding because can be decimal (0.1)
	autoScorePerSecond = () => {
		return this.scorePerAutoClick() / GameState.timeUntilAutoLoopEnds
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
		ROOT.trigger("scoreDecreased", amount)
		tween(GameState.score, GameState.score - amount, 0.32, (p) => GameState.score = p, easings.easeOutExpo).onEnd(() => {
			ROOT.trigger("scoreDecreased", amount)
		})
	}

	addTweenScore(amount:number) {
		ROOT.trigger("scoreIncreased", amount)
		tween(GameState.score, GameState.score + amount, 0.32, (p) => GameState.score = p, easings.easeOutExpo).onEnd(() => {
			ROOT.trigger("scoreIncreased", amount)
		})
		GameState.scoreThisRun += amount
		GameState.scoreAllTime += amount
	}

	// =====================
	//   ASCENSION STUFF
	// =====================
	// Mana is a spendable currency
	// When score is greater than scoreTilNextMana, mana is added by one
	// Every mana all time gives +1% of score production 

	/**
	 * This is the number you start getting mana at
	 */
	ascensionConstant = 5_000_000

	/**
	 * The actual formula used to calculate the score needed for a certain mana 
	 * @param manaAllTime The mana all time
	 * @returns The score needed for that mana all time
	 */
	getScoreForManaAT = (manaAllTime = GameState.ascension.manaAllTime + 1) => {
		return (manaAllTime ** 1.05) * this.ascensionConstant;
	}

	/**
	 * Why does this exist
	 * @returns The score you get the next mana at
	 */
	scoreYouGetNextManaAt = () => {
		return Math.round(this.getScoreForManaAT(GameState.ascension.manaAllTime + 1));
	}

	// Oliver the goat 
	manaPerSecond = () => {
		const scoreNeededForNextMana = this.getScoreForManaAT(GameState.ascension.manaAllTime + 1) - Math.round(GameState.scoreAllTime);

		// Calculate time to reach the next mana
		const timeToNextMana = scoreNeededForNextMana / GameState.scoreAllTime;
	
		// Calculate mana per second
		const manaPerSecond = timeToNextMana > 0 ? 1 / timeToNextMana : 0;

		return manaPerSecond;
	}
	
	resetRun() {
		tween(GameState.score, 0, 0.32, (p) => GameState.score = p, easings.easeOutCirc)
		tween(GameState.scoreThisRun, 0, 0.32, (p) => GameState.scoreThisRun = p, easings.easeOutCirc)
	
		tween(GameState.clickers, 1, 0.5, (p) => GameState.clickers = Math.round(p), easings.easeOutQuad)
		tween(GameState.cursors, 0, 0.5, (p) => GameState.cursors = Math.round(p), easings.easeOutQuad)

		tween(GameState.clicksUpgradesValue, 1, 0.5, (p) => GameState.clicksUpgradesValue = Math.round(p), easings.easeOutQuad)
		tween(GameState.cursorsUpgradesValue, 1, 0.5, (p) => GameState.cursorsUpgradesValue = Math.round(p), easings.easeOutQuad)
		
		GameState.hasUnlockedPowerups = false
		GameState.stats.powerupsBoughtThisRun = 0

		GameState.upgradesBought = ["c_0"]
		GameState.timeUntilAutoLoopEnds = 10
	}
}

export let scoreManager = new _scoreManager()