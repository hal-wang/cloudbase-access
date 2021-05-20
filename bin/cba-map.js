#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const MapCreater = require("../dist/Map/MapCreater").default;
const path = require("path");
const config = require(path.join(process.cwd(), "cba.config.json"));

new MapCreater(path.join(config.target, config.router.controllers)).write();
