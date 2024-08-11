import ng, { User } from "newgrounds.js";
import * as env from "./env.json"
import { ngScene } from "./game/scenes/ngScene";

export let ngEnabled:boolean;
export let ngUser:User | void;

export async function newgroundsManagement() {
	let connectionToNg = ng.connect(env.API_ID, env.ENCRIPTION_KEY);
}

export async function newgroundsSceneContent() {
	debug.log("you don't seem to be signed in, would you like to?")

	onKeyPress("enter", async () => {
		ngUser = await ng.login().then(null)
		
		if (await ng.getUsername() != null) {
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