#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const MapCreater = require("../dist/Map/MapCreater").default;

const cfPath = process.argv[2];
new MapCreater(cfPath).write();
