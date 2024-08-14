import { GameObj } from "kaplay";
import { removeNumbersOfString } from "../utils";
import { ascension } from "./ascension";
import { spawnCards } from "./cards";
import { playSfx } from "../../sound";

class Dialogue {
	/**
	 * The text of the dialogue
	 */
	text:string;
	/**
	 * The speed of the dialogue
	 */
	speed?:number;
	/**
	 * Wheter the dialogue is a random one that has no continuing or if it's something like tutorial
	 */
	extra?: boolean;

	constructor(text:string, extra?:boolean, speed?:number) {
		this.text = text
		this.extra = extra || false
		this.speed = speed || 0.025 // 1 is extremly slow remember that
	}
}

export const mageDialogues = {
	"tutorial1": new Dialogue("Welcome..."),
	"tutorial2": new Dialogue("Im glad you're here..."),
	"tutorial3": new Dialogue("You're ascending, which means you have a lot of stuff to learn..."),
	"tutorial4": new Dialogue("These are cards, when they're clicked you get an additive percentage"),
	"tutorial5": new Dialogue("You buy them with mana, which you get after gaining large amounts of score"),
	"tutorial6": new Dialogue("When returning with your new cards, all your score will be lost"),
	"tutorial7": new Dialogue("Good luck traveller (so corny)"),
	
	"eye1": new Dialogue("Stop that", true),
	"eye2": new Dialogue("Don't do that", true),
	"eye3":new Dialogue("STOP", true),
	"hex1": new Dialogue("No backsies", true),
	"hex2": new Dialogue("Mine now", true),
	"hex3": new Dialogue("I want to play with it :(", true),
	"back1": new Dialogue("Welcome back...", true),
	"fun1": new Dialogue("Here's a fun text", true),
	"fun2": new Dialogue("Here's another one", true),
	"fun3": new Dialogue("Devky please write these", true),
	"fun4": new Dialogue("I beg of you", true),
	"fun5": new Dialogue("Welcome to fortnite", true),
}

type dialogueType = "tutorial" | "eye" | "hex"

/**
 * Gets a random
 * @param generalType eg: tutorial, eye, hex
 * @returns A random dialogue corresponding to the key 
 */
export function getRandomDialogue(generalType:dialogueType) : Dialogue {
	let thing = Object.keys(mageDialogues).filter(key => key.includes(generalType)).map((key) => mageDialogues[key])
	return choose(thing)
}

export function startDialoguing() {
	dialogue = add([])
	dialogue.box = addDialogueBox()
	dialogue.textBox = addDialogueText()
}

function addDialogueBox() {
	let box = add([
		sprite("dialogue"),
		pos(623, 144),
		anchor("center"),
		scale(),
		area({ scale: 0.8 }),
		opacity(),
		layer("ascension"),
		z(1),
		"textbox",
		{
			defaultPos: vec2(623, 144),
		}
	])

	box.on("talk", (speaker) => {
		if (speaker == "card") {
			box.use(sprite("hoverDialogue"))
			tween(box.defaultPos.y + 10, box.defaultPos.y, 0.25, (p) => box.pos.y = p, easings.easeOutQuint)
		}
		
		else if (speaker == "mage") {
			box.use(sprite("dialogue"))
			tween(box.defaultPos.x - 10, box.defaultPos.x, 0.25, (p) => box.pos.x = p, easings.easeOutQuint)
		}

		tween(0.75, 1, 0.25, (p) => box.scale.x = p, easings.easeOutQuint)
	})

	box.onClick(() => {
		if (dialogue.textBox.text != currentlySaying) skipTalk()
		else continueDialogue(ascension.currentDialoguekey)
	})

	tween(0.5, 1, 0.25, (p) => box.scale.x = p, easings.easeOutQuint)
	tween(0, 1, 0.25, (p) => box.opacity = p, easings.easeOutQuint)

	return box
}

function addDialogueText() {
	let textBox = add([
		text("", {
			styles: {
				"wavy": (idx) => ({
					pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5)),
				}),
			},
			width: 606, // width without tail
			align: "center",
			size: 25,
		}),
		pos(670, 127),
		anchor("center"),
		color(BLACK),
		layer("ascension"),
		opacity(),
		z(dialogue.box.z + 1),
		"textbox",
		"boxText",
	])

	return textBox
}

let activeLetterWaits = []
let currentlySaying = ""

export let dialogue:GameObj;

/**
 * Holds the current onEnd function, when you talk and set a new onEnd it gets modified
 */
let currentOnEnd = () => {}

export function talk(speaker:"mage" | "card", thingToSay:string, speed?:number, onEnd?:() => void) {
	if (!onEnd) currentOnEnd = () => {}
	else currentOnEnd = onEnd

	dialogue.box.trigger("talk", speaker)

	speaker = speaker || "card"
	thingToSay = thingToSay || "No dialogue, missing a dialogue here"
	speed = speed || 0.025
	
	if (currentlySaying == thingToSay) speed /= 2
	currentlySaying = thingToSay

	activeLetterWaits.forEach(waitCall => waitCall.cancel());
	activeLetterWaits = [];
	dialogue.textBox.text = ""

	let currentDelay = 0
	Array.from(thingToSay).forEach((letter, index) => {
		let delay = speed;
		if (letter === ',' || letter === "_") {
			delay = speed * 5; // Adjust the multiplier as needed for commas and spaces
		}

		// Increment currentDelay by the calculated delay
		currentDelay += delay;

		const waitCall = wait(currentDelay, () => {
			dialogue.textBox.text += letter;

			// playSfx(`${speaker}_e`, { detune: rand(-150, 150) }); 
			playSfx(`mage_e`, { detune: rand(-150, 150) }); 
			
			if (index == thingToSay.length - 1) {
				currentOnEnd()
			}
		});

		activeLetterWaits.push(waitCall);
	});
}

/**
 * Will get a new dialogue based on the one you pass
 * @param dialogueKey The dialogueType with the number (the key) eg: "tutorial4"
 */
function continueDialogue(dialogueKey:string) {
	// this is the original dialogue, the one it's coming from
	let currentDialogue = mageDialogues[dialogueKey]
	// this wil be the new dialogue
	let newDialogue = null;
	let newDialogueKey = null;

	if (currentDialogue.extra == true) {
		let dialogueType = removeNumbersOfString(dialogueKey)
		let newRandDialogue = getRandomDialogue(dialogueType as dialogueType)
		let keyOfNewRandDialogue = Object.keys(mageDialogues).filter(key => mageDialogues[key].text == newRandDialogue.text)[0]
		
		ascension.currentDialoguekey = keyOfNewRandDialogue
		newDialogue = newRandDialogue
		newDialogueKey = keyOfNewRandDialogue
	}

	// serious dialogue
	else {
		// they're supposedly ordered so good!
		let tutorialDialogues = Object.keys(mageDialogues).filter(dialogue => dialogue.includes("tutorial"))
		let index = tutorialDialogues.findIndex(key => key == dialogueKey)
		let nextDialogueKey = tutorialDialogues[index + 1]

		if (nextDialogueKey != undefined) {
			ascension.currentDialoguekey = nextDialogueKey
			let nextDialogue = mageDialogues[nextDialogueKey]
			newDialogue = nextDialogue
			newDialogueKey = nextDialogueKey
		}

		else {
			// are extra but no specific ones like the eye, hex or back 
			let extraDialogueKeys = Object.keys(mageDialogues).filter(dialogue => dialogue.includes("fun"))
			let nextDialogueKey = choose(extraDialogueKeys)
			
			ascension.currentDialoguekey = nextDialogueKey
			newDialogue = mageDialogues[nextDialogueKey]
			nextDialogueKey = nextDialogueKey
		}
	}

	// can't be bothered to soft code it
	if (newDialogueKey == "tutorial4") {
		spawnCards()
	}

	talk("mage", newDialogue.text, newDialogue.speed)
}

function skipTalk() {
	activeLetterWaits.forEach(waitCall => waitCall.cancel());
	dialogue.textBox.text = currentlySaying
	tween(dialogue.box.defaultPos.y + 10, dialogue.box.defaultPos.y, 0.25, (p) => dialogue.box.pos.y = p, easings.easeOutQuint)
	tween(dialogue.box.defaultPos.x + 10, dialogue.box.defaultPos.x, 0.25, (p) => dialogue.box.pos.x = p, easings.easeOutQuint)
	
	currentOnEnd()
}
