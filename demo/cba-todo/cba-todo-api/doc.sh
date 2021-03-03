set -e

if [ -d "./dist" ]; then
  rm -rf ./dist
fi
mkdir ./dist

tsc

find dist -name "*.d.ts" |xargs rm -rf

cba-doc dist/controllers doc.config.json doc.md
rm -rf dist