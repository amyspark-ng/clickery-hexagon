# [Issues](#issues)
# [Bookmarks](#bookmarks)
# [Ideas](#ideas)

-- MUSIC WORKS PRETTY FUCKIGN WEIRD WHEN DOING LOADMUSIC INSTEAD OF SOUND DON'T GET SCARED
* Do "-" for issues, "*" for notes, "^" for comments on either

# TODAY
- Delete the log y position getting updated
- Fix the playSfx functions that were already written to use opt
	* Figure out why the sfx is not getting played with a different tune or speed 
- Format actual working numbers
	* SPSWORKING RELIES ON THIS ^
- spstext doesn't work with the spsTextMode at all lol 
	* It's completely broken
	* Make it work with new shorten numbers setting (might not do)
------------------------------------------
- Re-design/make working toasts
	* add toast condition where there's title but no body
	* onsAdd support for ic
	* Make the log the height of the icon and the width be determind by body width
		* Change the queue stuff to support different heights

# The day after
- Keep working on store
	* I have to tell devky to make the upgrade icons and the upgrade store element, then i can work on it 
	* Rework tooltips for upgrades
- Fix panderito hitbox
- I REALLYYY need to fix the hover animations
- and the mouse animations
	* Maybe do keep the tag system, just uhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
- Make working stats and make stats window
- fix music waving speed
- Why does medal look extremely big????

# Pasado pasado mañana
- Prototype medals window

# Soon
- and click priortiy (holy moly)

# Issues!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
## General

## Windows
* For clicking behind object should check if any other window that is not the current one is active, if any other window is active the button should not work

# Ideas
- Add achievement for making the hexagon black and the bg white (bad apple)
- Do the funny thing with music title in clicker.wav like deltarune did
- Add an achievement for opening all windows in your taskbar at the same time
- Make unactive windows grayscale
- Discount powerup (very short)
- when clicking run through every achievement in an object that has a clicking property and check if the score is higher or equal to a value property, so:
```js
	onClick(() => {
		achivements.forEach((achievement) => {
			if (!achievement.clicking) return;
			if (GameState.score >= achievement.value && !gamestate.unlockedAchievements.100score) unlockAchievement(achivements.100score)
		})
	})
```
- ADD THE THING WHERE THE GNOME WALKS ACROSS THE SCREEN AND BE LIKE HOLY SHIT GUYS DID YOU SEE THAT?
	* Every second have a chance of something% that triggers it

# Missing
- Ascend mechanic
	* Everything
- Powerups
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