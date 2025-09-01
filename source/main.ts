import "./kaplay.ts";
import "./loader.ts";
import { DEBUG, GAME_VERSION } from "./globals.ts";

console.log("Game's version: " + GAME_VERSION);

// @ts-ignore
if (DEBUG == true) document.body.style.backgroundColor = "rgb(1, 3, 13)";
else document.body.style.backgroundColor = "rgb(0, 0, 0)";
