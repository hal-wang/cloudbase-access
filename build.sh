set -e

if [ -d "./dist" ]; then
  rm -rf ./dist
fi

tsc
tsc ./tsbin/*.ts --outDir ./bin