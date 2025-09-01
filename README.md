# Clickery Hexagon

"Simple" clicker game
Clicker/Idle game where you click an hexagon to make virtual numbers go up until they can't anymore.

Made in [KAPLAY](https://kaplayjs.com)

You can read the changelog in: [here](/assets/CHANGELOG.md)

## CREDITS:
- [AmySparK](https://amyspark-ng.github.io) - Code
- [DevkyRD](https://twitter.com/devkyRD) - Art & Design
- [lajbel](https://lajbel.com) - Code & Design
- MF - Code & Shaders
- Khriz28 - Playtesting & Support & Achievement titles
- niceEli - Code & Desktop support

### Extra / Special Thanks:
- Enysmo - Music & SFX
- Candy&Carmel - Number support
- Oliver_is_here - Code/General support
- [Lambda font] (https://ggbot.itch.io/lambda-font)
- Webadazzz <33

There's also in-game credits

## RUNNING
1. `pnpm i` - Installs all the dependencies
2. `pnpm dev` - Starts hosting the game locally in localhost:8000
3. You have to make a `env.json` file in `source`, holding this:
```json
{
	"API_ID": "",
	"ENCRIPTION_KEY": "",
	"LEADERBOARD_ID": 0,
    "TIME_LEADERBOARD_ID": 0,
    "MANA_LEADERBOARD_ID": 0,
    "DEVKY_MEDAL_ID": 0
}
```
- After this, go to the [globals](/source/globals.ts) file and set `enabledNg` to `false`
- The newgrounds code should not work if no keys are present, but this is so imports don't nag you

4. Edit the files to work on it :thumbsup:
