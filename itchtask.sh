YELLOW='\033[0;33m'
LIGHTBLUE='\033[1;36m'
OFF='\033[0m'

# send the build to itch.io
echo -e "${YELLOW}### UPLOADING TO ITCH.IO ###${OFF}"
pnpm build
7z a -tzip ./build.zip ./dist
butler push build.zip amyspark-ng/clickery-hexagon:html5 --userversion 1.0

reset

# upload source
echo -e "${LIGHTBLUE}# Uploading source #${OFF}"
7z a -tzip ./source.zip ./public ./src
butler push source.zip amyspark-ng/clickery-hexagon:source --userversion 1.0
