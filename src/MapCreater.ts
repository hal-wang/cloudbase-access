import { existsSync, readdirSync, writeFileSync } from "fs";

export default class MapCreater {
  constructor(private readonly cFolder = "controllers") {}

  getMap(): string[] {
    const existedMap = this.existedMap;
    if (existedMap) return existedMap;
    else return this.createMap();
  }

  private createMap(): string[] {
    const mapArr: string[] = [];
    this.load(process.cwd(), this.cFolder, mapArr);
    writeFileSync(this.mapPath, JSON.stringify(mapArr));
    return mapArr;
  }

  private load(basePath: string, folder: string, mapArr: string[]): void {
    const items = readdirSync(`${basePath}/${folder}`);
    console.log("items", items);
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.includes(".")) {
        this.load(`${basePath}/${folder}`, item, mapArr);
        continue;
      }

      if (item.toLowerCase().lastIndexOf(".js") != item.length - 3) continue;

      mapArr.push(item.toLowerCase());
    }
  }

  private get existedMap(): string[] | null {
    if (!existsSync(this.mapPath)) return null;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(this.mapPath);
  }

  private get mapPath(): string {
    return `${process.cwd()}/mvc-map.json`;
  }
  private get controllerFolder(): string {
    return `${process.cwd()}/${this.cFolder}`;
  }
}
