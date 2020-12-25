set -e

if [ -d "./dist" ]; then
  rm -rf ./dist
fi
mkdir ./dist

tsc

find dist -name "*.d.ts" |xargs rm -rf
cp package.json dist/package.json
touch dist/build-time_$(date "+%Y-%m-%d_%H.%M.%S")

