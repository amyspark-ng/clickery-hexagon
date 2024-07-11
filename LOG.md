# [Issues](#issues)
# [Bookmarks](#bookmarks)
# [Ideas](#ideas)

this game MIGHT be getting done

* Do "-" for issues, "*" for notes, "^" for comments on either

<!-- KAPLAY -->
- there might be a bug in the loop function

# ISSUES (hell)
## Current TODO (small stuff mostly)
- make all the cards a single animation and change them using the frame
- So in the end what do i do with the increaseComboAnim, or do i do nothing??
- add the mute dialogue option
- price texts could be draws instead of objects??? 

- work on the new number formatting function
```js
// this is pretty helpful
function updateMoney() {
	moneyText.innerHTML = "Your money: " + money.toFixed(2);
	
	// if money is inside the limits (will always try to be)
	if (money < Math.pow(1000, 11)) {
		// run until it finds the numType
		for (let i = 1; money >= Math.pow(1000, 1); i++) {
			// turn it into a smaller version
			moneyText.text = "Your money: " + (money / Math.pow(1000, i)).toFixed(2) + numTypes[i];
		}
	}

	else {
		moneyText.innerHTML = "Your money: " + (money.toExponential(2)).toFixed(2);
	}
}
```
- Fix panderito hitbox (just make it bigger damn angle stuff)

- make it so when you click the powerup timer it adds a little log (cookie clicker style that says how much production increased for how much time)
- Add multiplier number to powerup timers

- fix music waving speed
- Fix weird workings of the combo bar content

## Next features
- Prototype ascending mechanic (prestige/mana, what time do you get to ascend, actually add the percentages)

## Complex stuff
- and click priortiy (holy moly)
	* For clicking behind object should check if any other window that is not the current one is active, if any other window is active the button should not work

- I REALLYYY need to fix the hover animations
	* and the mouse animations
	^ Maybe do keep the tag system, just uhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
	* I think i had this crazy idea that 

# IDEAS (good)
- Little side to side when doing the param pam pam pam in the combo animation
- add a text that comes from the bottom and stops a little below the hexagon that says (Click production increased for 1 min)
- Add achievement for making the hexagon black and the bg white (bad apple)

# Missing
- Ascend mechanic
	* Mechanics, numbers
- Newgrounds api

# Bookmarks
- Saving this for explosion stuff
https://kaplay.lajbel.com/?code=eJx9UstOwzAQvOcr9lZbjdqUUoRUygUhrhUHDiAOqb1JrTh2ZDt9gPo3%2FAk%2FxpIX7YWT7ZnZnfXYRbqxtmQ8irLaiKCsATxU2nrasUMMRw6fEYCwxgcwdblOXVBCo4cVXCdLojLrgGkMoAhKlrTcXQgJGY%2FbLgDTKTw6H1BrNLAjs0ZWoDZQqgAfdfb9pbXK0cETerHdKyNVXiBxtZHwrMQ21CZverUz%2BQpRkrNLjWSzJIlhdpvw5ZlCKtfzxM5vLtmqm5MkqZTsraEAHIrA5iTncYdU1reB9ICw2jrm8g1rei9%2BrZOEx%2FDfkQ%2FlqRFbqh8JNAHdaMBLu0NGM8ft1QZcqwx9lRqWTBYD6EWqsfUnOIarvv97d0kK%2FHUI1cMLui5Vyl9Syn3%2BjXifqtA3m8XQGAHjsLrvng%2Boxgdnj6yPrbM5NespOkWRNQ9aiYKd1%2F19qdLWHtcUJZ9QmGenI49O%2FAerrLvf
