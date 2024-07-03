# [Issues](#issues)
# [Bookmarks](#bookmarks)
# [Ideas](#ideas)

this game is never getting done bruh

-- MUSIC WORKS PRETTY FUCKIGN WEIRD WHEN DOING LOADMUSIC INSTEAD OF SOUND DON'T GET SCARED
	* Time text not working, music not looping, etc

* Do "-" for issues, "*" for notes, "^" for comments on either

<!-- KABOOM -->
- there might be a bug in the loop function

# ISSUES (hell)
## Current TODO (small stuff mostly)
- Fix everything related to debug (add something for when the game is on debug (a text on a corner or something))
- Figure out why fold sfx is so loud
	* Make it higher when opening and deep when closing
* some loop related to powerups is crashing the game (might not be there anymore we'll see)
- Format actual working numbers (spsText and scoreText and priceText)

- Fix updateTime animation in powerup timers
- Add multiplier number to powerup timers

- fix music waving speed
- Fix panderito hitbox (just make it bigger damn angle stuff)
- Fix weird workings of the combo bar content 
- The sps, spm and sph don't work at all fym i get 80 per second and 1.33 per minute :skull:
- make background faster depending on scoreUntilAscend
- tweak hexagon speed depending on scoreUntilAscend

## Next features
- Prototype achievements

## Complex stuff
- and click priortiy (holy moly)
	* For clicking behind object should check if any other window that is not the current one is active, if any other window is active the button should not work
- I REALLYYY need to fix the hover animations
- and the mouse animations
	* Maybe do keep the tag system, just uhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

# IDEAS (good)
- Little side to side when doing the param pam pam pam in the combo animation
- maybe the vignette for powerups could be a small gradient on top of the backgroudn that has color depending on the powerup on the bottom part of the screen
- Add achievement for making the hexagon black and the bg white (bad apple)
- Do the funny thing with music title in clicker.wav like deltarune did
- Add an achievement for opening all windows in your taskbar at the same time
- Discount powerup (very short)
- when clicking run through every achievement in an object that has a clicking property and check if the score is higher or equal to a value property, so:
```ts

	let achievements = {
		scoreGaining: {
			"100score": {
				predicate: "GameState.score >= 100" 
			}
		}
	}

	hexagon.clickRelease(() => {
		achivements.scoreGaining.forEach((achievement) => {
			if (!GameState.achievements.includes(achievement) && achievement.predicate == true) unlockAchievement("100score")
		})
	})
```
- When doing achievements i need to add a timeAfter property that waits a time to actually add the toast that indicates you unlocked it
- ADD THE THING WHERE THE GNOME WALKS ACROSS THE SCREEN AND BE LIKE HOLY SHIT GUYS DID YOU SEE THAT?
	* Every second have a chance of something% that triggers it

# Missing
- Ascend mechanic
	* Everything
- Medals/Achievmeents
	* Everything
- Newgrounds api

# Bookmarks
- Saving this for explosion stuff
https://kaplay.lajbel.com/?code=eJx9UstOwzAQvOcr9lZbjdqUUoRUygUhrhUHDiAOqb1JrTh2ZDt9gPo3%2FAk%2FxpIX7YWT7ZnZnfXYRbqxtmQ8irLaiKCsATxU2nrasUMMRw6fEYCwxgcwdblOXVBCo4cVXCdLojLrgGkMoAhKlrTcXQgJGY%2FbLgDTKTw6H1BrNLAjs0ZWoDZQqgAfdfb9pbXK0cETerHdKyNVXiBxtZHwrMQ21CZverUz%2BQpRkrNLjWSzJIlhdpvw5ZlCKtfzxM5vLtmqm5MkqZTsraEAHIrA5iTncYdU1reB9ICw2jrm8g1rei9%2BrZOEx%2FDfkQ%2FlqRFbqh8JNAHdaMBLu0NGM8ft1QZcqwx9lRqWTBYD6EWqsfUnOIarvv97d0kK%2FHUI1cMLui5Vyl9Syn3%2BjXifqtA3m8XQGAHjsLrvng%2Boxgdnj6yPrbM5NespOkWRNQ9aiYKd1%2F19qdLWHtcUJZ9QmGenI49O%2FAerrLvf

# Medals
- click 25 tims
- click blah blah
- reach full combo