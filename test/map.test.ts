import MapCreater from "../src/Map/MapCreater";
import * as fs from "fs";

test("router test", async function () {
  const creater = new MapCreater("test/controllers");
  const map = creater.map;
  expect(!!map).toBe(true);
  creater.write();

  const filePath = `${process.cwd()}/cba-map.json`;
  expect(fs.existsSync(filePath)).toBe(true);
  fs.rmSync(filePath);
});
