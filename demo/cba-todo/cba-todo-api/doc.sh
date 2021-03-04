set -e

if [ -d "./dist" ]; then
  rm -rf ./dist
fi
mkdir ./dist

tsc

find dist -name "*.d.ts" |xargs rm -rf

cba-doc dist/controllers test.md docConfigs/base.json
rm -rf dist