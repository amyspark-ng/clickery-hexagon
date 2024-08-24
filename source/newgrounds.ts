import ng, { User, Execute } from "newgrounds.js";
import * as env from "./env.json"
import { gameBg } from "./game/additives";
import { GameState } from "./gamestate";
import { openWindow, windowsDefinition } from "./game/windows/windows-api/windowManaging";
import { Session } from "newgrounds.js/dist/first";
import { DEBUG } from "./main";

export let ngEnabled:boolean;
export let ngUser:User;

export function connectToNewgrounds() {
	return ng.connect(env.API_ID, env.ENCRIPTION_KEY);
}

export async function isLoggedIn() : Promise<boolean> {
    const session = await ng.NewgroundsClient.call("App.checkSession");
    return session?.result?.data?.session?.user == null ? false : true;
}

export async function getSession() : Promise<Session> {
    const session = await ng.NewgroundsClient.call("App.checkSession");
    return session?.result?.data?.session;
}

export function postEverything() {
	if (ngEnabled) {
		ng.postScore(env.SCORE_LEADERBOARD_ID, GameState.scoreAllTime)
		// have to send the time in miliseconds
		ng.postScore(env.TIME_LEADERBOARD_ID, GameState.stats.totalTimePlayed * 1000)
	}
}

export async function newgroundsSceneContent() {
	let titleText = add([
		text("You don't seem to be signed in.\nWould you like to?", { align: "center"}),
		pos(center().x, center().y - 200),
		anchor("center"),
	])

	titleText.on("userInteraction", (userThoughts) => {
		get("newgroundsButton").forEach((button) => {
			button.destroy()
		})
		
		// agreed
		if (userThoughts == true) {
			titleText.text = "Ok im trying to sign you in.\nCheck your popups!"
		}

		// declined
		else {
			titleText.text = "Ok no worries, goodbye!"
		}
	})

	// button
	let yesButton = add([
		text("yes"),
		pos(center().x - 100, center().y),
		area(),
		"newgroundsButton",
	])

	async function userAgreed() {
		let loginResult = await ng.login()
		let session = await getSession()

		console.log(session)

		if (session.user != null) {
			debug.log("got an user")
			ngUser = session.user
			ngEnabled = true
		}

		else {
			debug.log("no user, sad")
		
			ngUser = null
			ngEnabled = false
		}
	}

	yesButton.onClick(() => {
		titleText.trigger("userInteraction", true)
		userAgreed()
	})

	// button
	let noButton = add([
		text("no"),
		pos(center().x + 100, center().y),
		area(),
		"newgroundsButton"
	])

	async function userDeclined() {
		// so sad
		wait(1, () => {
			go("gamescene")
		})
	}

	noButton.onClick(() => {
		titleText.trigger("userInteraction", false)
		userDeclined()
	})
}