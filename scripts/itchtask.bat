echo -e "### UPLOADING TO ITCH.IO ###"
pnpm build

7z a -tzip ./clickerybuild.zip ./dist
butler push clickerybuild.zip amyspark-ng/clickery-hexagon:html5 --userversion 1.3.1

START https://www.newgrounds.com/projects/games/5901473/details