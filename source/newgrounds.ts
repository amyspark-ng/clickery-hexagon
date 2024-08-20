import ng, { User } from "newgrounds.js";
import * as env from "./env.json"
import { gameBg } from "./game/additives";
import { GameState } from "./gamestate";

export let ngEnabled:boolean;
export let ngUser:User | void;

export function newgroundsManagement() {
	return ng.connect(env.API_ID, env.ENCRIPTION_KEY);
}

export function postEverything() {
	if (ngEnabled) {
		ng.postScore(env.SCORE_LEADERBOARD_ID, GameState.scoreAllTime)
		// have to send the time in miliseconds
		ng.postScore(env.TIME_LEADERBOARD_ID, GameState.stats.totalTimePlayed * 1000)
	}
}

export async function newgroundsSceneContent() {
	debug.log("you don't seem to be signed in, would you like to?")

	onKeyPress("enter", async () => {
		ngUser = await ng.login().then(null)
		
		if (ng.getUsername() != null) {
			ngEnabled = true
			debug.log("You logged in! Youhoo!!!")
			wait(1, () => {
				go("gamescene")
			})
		}

		else {
			debug.log("something went wrong im sorry...")
		}
	})

	onKeyPress("escape", async () => {
		// so sad
		wait(1, () => {
			go("gamescene")
		})
	})
}