import { GameObj } from "kaplay";
import { getRandomElementDifferentFrom, removeNumbersOfString } from "../utils";
import { ascension } from "./ascension";

const defaultTalkingSpeed = 0.025

class Dialogue {
	/**
	 * The key of the dialogue (back1, back2, etc) 
	 */
	key:string;
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

	constructor(key:string, text:string, extra?:boolean, speed?:number) {
		this.key = key
		this.text = text
		this.extra = extra || false
		this.speed = speed || defaultTalkingSpeed // 1 is extremly slow remember that
	}
}

export const mageDialogues = [
	new Dialogue("tutorial1", "Welcome..."),
	new Dialogue("tutorial2", "Im glad you're here..."),
	new Dialogue("tutorial3", "You're ascending, which means you have a lot of stuff to learn..."),
	new Dialogue("tutorial4", "These are cards, when they're clicked you get an additive percentage"),
	new Dialogue("tutorial5", "You buy them with mana, which you get after gaining large amounts of score"),
	new Dialogue("tutorial6", "For every mana you get, you'll get +1% on your score production"),
	new Dialogue("tutorial7", "When returning with your new cards, all your score will be lost"),
	new Dialogue("tutorial8", "Good luck traveller (so corny)"),

	// extra ones
	new Dialogue("eye1", "Stop that", true),
	new Dialogue("eye2", "Don't do that", true),
	new Dialogue("eye3", "STOP", true),
	new Dialogue("eye4", "I'm throwing hands if you keep doing that", true),
	new Dialogue("eye5", "How would YOU like your eye getting clicked", true),
	new Dialogue("eye6", "...", true),
	new Dialogue("eye7", "Ok", true),
	
	new Dialogue("hex1", "No backsies", true),
	new Dialogue("hex2", "Mine now", true),
	new Dialogue("hex3", "I want to play with it :(", true),
	new Dialogue("hex4", "I'm not giving this back", true),
	new Dialogue("hex5", "Pick a card", true),
	new Dialogue("hex6", "Stop it", true),
	
	new Dialogue("back1", "Welcome back...", true),
	new Dialogue("back2", "Here again?", true),
	new Dialogue("back2", "Not busy it seems", true),
	new Dialogue("back3", "Really putting in the work, huh?", true),
	new Dialogue("back4", "Another one", true),
	
	new Dialogue("fun1", "Fun fact: Hexagons have 6 (six) sides", true),
	new Dialogue("fun2", "Welcome to fortnite", true),
	new Dialogue("fun3", "Cold, so cold...", true),
	new Dialogue("fun4", "Find my obituaries", true),
	new Dialogue("fun5", `"Gimmicking" your hexagon?`, true),
	new Dialogue("fun6", "Tasty hexa-gone, none for you", true),
	
	new Dialogue("fun7", "Gotta click them all", true),
	new Dialogue("fun8", "Hum... Hum...", true, 0.1),
	new Dialogue("fun9", "Y U M M E R S", true, 0.1),
]

export const yummersKey = mageDialogues.find(dialogue => dialogue.text == "Y U M M E R S").key
export const humKey = mageDialogues.find(dialogue => dialogue.text == "Hum... Hum...").key

export function getDialogue(key:string) : Dialogue {
	return mageDialogues[mageDialogues.indexOf(mageDialogues.filter(dialogue => dialogue.key === key)[0])]
}

type dialogueType = "tutorial" | "eye" | "hex" | "back" | "fun"

/**
 * Gets a random
 * @param generalType eg: tutorial, eye, hex
 * @returns A random dialogue corresponding to the key 
 */
export function getRandomDialogue(generalType:dialogueType) : Dialogue {
	let arrayOfDialoguesWithThatType = mageDialogues.filter(dialogue => dialogue.key.includes(generalType))
	return choose(arrayOfDialoguesWithThatType)
}

export function startDialoguing() {
	dialogue = add([])
	dialogue.box = addDialogueBox()
	dialogue.textBox = addDialogueText()
}

function playerReadAction() {
	if (dialogue.textBox.text != currentlySaying) skipTalk()
	else continueDialogue(ascension.currentDialoguekey)
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
		playerReadAction()
	})

	box.onKeyPress(["space", "enter"], () => {
		playerReadAction()
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

	dialogue.box.trigger("talk", speaker, thingToSay)

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
			// playSfx(`mage_e`, { detune: rand(-150, 150) }); 
			
			if (index == thingToSay.length - 1) {
				// i have to search in magedialogues for thingToSay and get its key

				let dialogueKey:string = undefined
				mageDialogues.forEach(dialogue => {
					if (dialogue.text == thingToSay) dialogueKey = dialogue.key
				})
				if (dialogueKey == undefined) dialogueKey = null

				dialogue.box.trigger("dialogueEnd", dialogueKey)
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
	let currentDialogue = getDialogue(dialogueKey);

	/**
	 * Is the new dialogue, the one that will be played, the continued one
	 */
	let thePlayedNewDialogue:Dialogue = null;

	if (currentDialogue.extra == true) {
		let dialogueType = removeNumbersOfString(dialogueKey)
		let newRandDialogue = getRandomDialogue(dialogueType as dialogueType)

		if (currentDialogue.key.includes("back")) {
			// you already welcomed, move on
			dialogueType = "fun"
			newRandDialogue = getRandomDialogue(dialogueType as dialogueType)
		}
		
		thePlayedNewDialogue = newRandDialogue
		ascension.currentDialoguekey = thePlayedNewDialogue.key
	}

	// serious dialogue
	else {
		let tutorialDialoguesKeys = mageDialogues.map(dialogue => dialogue.key).filter(key => key.includes("tutorial"))
		let index = tutorialDialoguesKeys.findIndex(key => key == dialogueKey)
		let nextDialogueKey = tutorialDialoguesKeys[index + 1]

		if (nextDialogueKey != undefined) {
			thePlayedNewDialogue = getDialogue(nextDialogueKey)
			ascension.currentDialoguekey = thePlayedNewDialogue.key
		}

		// the continuated dialogue is over, play a random one
		else {
			// are extra but no specific ones like the eye, hex or back
			let extraDialogueKeys = mageDialogues.map(dialogue => dialogue.key).filter(key => key.includes("fun"))
			let nextDialogueKey = getRandomElementDifferentFrom(extraDialogueKeys,  ascension.currentDialoguekey) 
			
			thePlayedNewDialogue = getDialogue(nextDialogueKey)
			ascension.currentDialoguekey = thePlayedNewDialogue.key
		}
	}

	talk("mage", thePlayedNewDialogue.text, thePlayedNewDialogue.speed)
}

function skipTalk() {
	activeLetterWaits.forEach(waitCall => waitCall.cancel());
	dialogue.textBox.text = currentlySaying
	tween(dialogue.box.defaultPos.y + 10, dialogue.box.defaultPos.y, 0.25, (p) => dialogue.box.pos.y = p, easings.easeOutQuint)
	tween(dialogue.box.defaultPos.x + 10, dialogue.box.defaultPos.x, 0.25, (p) => dialogue.box.pos.x = p, easings.easeOutQuint)
	
	currentOnEnd()
	dialogue.box.trigger("dialogueEnd", ascension.currentDialoguekey)
}