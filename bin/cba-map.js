#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const MapCreater = require("../dist/Map/MapCreater").default;

const controllers = process.argv[2];
new MapCreater(controllers).write();
