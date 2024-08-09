# Clickery Hexagon

"Simple" clicker game

Made in [KAPLAY](https://kaplayjs.com)

## CREDITS:
- AmySpark - Code
- DevkyRD - Art & Design
- lajbel - Code & Design
- MF - Code & Shaders
- Khriz28 - Playtesting & Support

### Extra / Special Thanks:
- niceEli - Desktop support/Port to Vite
- Candy&Carmel - Number support
- Oliver_is_here - Code/General support
- [Lambda font](https://ggbot.itch.io/lambda-font)
- Webadazzz <3

## RUNNING
1. `pnpm i` - Installs all the dependencies
2. `pnpm dev` - Starts hosting the game locally in localhost:8000
3. You have to make a `env.json` file in `src`, holding this:
```js
{
	"API_ID": "",
	"ENCRIPTION_KEY": "",
	"LEADERBOARD_ID": 0
}
```
- The code disables newgrounds if no keys are present, but this is so imports don't nag you
4. Edit the files to work on it :thumbsup:
