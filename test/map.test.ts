import MapCreater from "../src/Map/MapCreater";

test("router test", async function () {
  const creater = new MapCreater("test/controllers");
  const map = creater.map;
  expect(!!map).toBe(true);
  creater.write();
});
