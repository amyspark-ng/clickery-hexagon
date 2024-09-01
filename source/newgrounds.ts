import ng, { User } from "newgrounds.js";
import * as env from "./env.json"
import { GameState } from "./gamestate";
import { positionSetter } from "./game/plugins/positionSetter";
import { bop } from "./game/utils";
import { gameBg } from "./game/additives";

export let ngEnabled:boolean;
export let ngUser:User;

export function connectToNewgrounds() {
	return ng.connect(env.API_ID, env.ENCRIPTION_KEY);
}

export function postEverything() {
	if (ngEnabled) {
		ng.postScore(env.SCORE_LEADERBOARD_ID, GameState.scoreAllTime)
		// have to send the time in miliseconds
		ng.postScore(env.TIME_LEADERBOARD_ID, GameState.stats.totalTimePlayed * 1000)
		ng.postScore(env.MANA_LEADERBOARD_ID, GameState.ascension.manaAllTime)
	}
}

export async function newgroundsSceneContent() {
	gameBg.colorA = 0.9
	let newgroundsInfoText = "You don't seem to be signed in.\nWould you like to? Includes:\n +Your score in leaderboards\n+Medals in newgrounds (up to 300 points)\n+Cloud saves\nPretty good deal huh?"
	let titleText = add([
		text("You don't seem to be signed in.\nWould you like to?", { align: "center", size: 40 }),
		pos(center().x, center().y - 200),
		positionSetter(),
		anchor("center"),
	])

	// button
	let yesButton = add([
		sprite("newgroundsSignInButton"),
		pos(center().x - 300, center().y + 150),
		area(),
		anchor("center"),
		scale(),
		"newgroundsButton",
		{
			update() {
				if (this.isHovering()) this.opacity = 1
				else this.opacity = 0.4
			}
		}
	])

	async function userAgreed() {
		get("newgroundsButton").forEach((button) => {
			button.destroy()
		})
		
		titleText.text = "Ok im trying to sign you in.\nCheck your popups!"
	
		let popup = add([
			sprite("newgroundsPopup"),
			pos(center()),
			anchor("center"),
			"newgroundsPopup",
		])

		add([
			text("Close when done"),
			pos(popup.pos.x, center().y + popup.height / 2 + 60),
			anchor("center"),
			"newgroundsPopup",
		])
		
		// does actual api stuff
		let loginResult = await ng.login()
		let loggedIn = await ng.isLoggedIn()
		let session = await ng.getSession()

		if (loggedIn == true) {
			ngUser = session.user
			titleText.text = `Welcome: ${ngUser.name}\nClick to start the game!`
			ngEnabled = true
			onClick(() => go("gamescene"))
			get("newgroundsPopup").forEach(obj => obj.destroy())
			
			tween(titleText.pos.y, center().y, 0.1, (p) => titleText.pos.y = p, easings.easeOutExpo)
		}

		else {
			ngUser = null
			titleText.text = "Seems like there was an error. I'm sorry\nClick to start the game!"
			ngEnabled = false

			onClick(() => go("gamescene"))
			get("newgroundsPopup").forEach(obj => obj.destroy())
			tween(titleText.pos.y, center().y, 0.15, (p) => titleText.pos.y = p, easings.easeOutExpo)
		}
	}

	async function userDeclined() {
		get("newgroundsButton").forEach(button => button.destroy())
		get("newgroundsPopup").forEach(obj => obj.destroy())
		
		let phrases = [
			"Whatever you say man, goodbye",
			"Oh no :(",
			"Ok no worries, goodbye",
			"Why tho :pensive:",
			"Ok i don't mind goodbye"
		]
		
		titleText.text = choose(phrases) + "\nClick to start the game!"
		tween(titleText.pos.y, center().y, 0.15, (p) => titleText.pos.y = p, easings.easeOutExpo)
		
		onClick(() => go("gamescene"))
	}

	// button
	let noButton = add([
		sprite("newgroundsNahButton"),
		pos(center().x + 300, yesButton.pos.y),
		anchor("center"),
		area(),
		scale(),
		"newgroundsButton",
		{
			update() {
				if (this.isHovering()) this.opacity = 1
				else this.opacity = 0.4
			}
		}
	])

	get("newgroundsButton").forEach((button) => {
		button.onClick(() => {
			bop(button)
			button.area.scale = vec2(0)
			wait(0.1, () => {
				let howDidInteractionGo = button.sprite.includes("Nah") ? false : true
				if (howDidInteractionGo == true) userAgreed()
				else userDeclined()
			})
		})
	})
}