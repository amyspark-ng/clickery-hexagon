import ng from "newgrounds.js";
import * as env from "./env.json"

let ngEnabled:boolean;

export async function newgroundsManagement() {
	let connectionToNg = ng.connect("", "");

	// if (connectionToNg.success == false) ngEnabled = false
	
}