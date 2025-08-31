YELLOW='\033[0;33m'
LIGHTBLUE='\033[1;36m'
OFF='\033[0m'

echo -e "${YELLOW}### UPLOADING TO ITCH.IO ###${OFF}"
pnpm build
7z a -tzip ./build.zip ./public
butler push build.zip amyspark-ng/clickery-hexagon:html5 --userversion 1.1.0
# pnpm desktop:build
# butler push src/tauri/target/release/clickery-hexagon.exe amyspark-ng/clickery-hexagon:windows --userversion 1.1.0