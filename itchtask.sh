
echo "### UPLOADING TO ITCH.IO ###"
pnpm build
7z a -tzip ./build.zip ./www
butler push build.zip amyspark-ng/clickery-hexagon:html5 --userversion 1.0

echo "# Uploading source #"

# upload source
7z a -tzip ./source.zip ./www ./source
butler push source.zip amyspark-ng/clickery-hexagon:source --userversion 1.0
