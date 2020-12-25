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
    this.load("", mapArr);
    writeFileSync(this.mapPath, JSON.stringify(mapArr));
    return mapArr;
  }

  private load(folder: string, mapArr: string[]): void {
    const items = readdirSync(`${this.cFolderPath}/${folder}`);
    console.log("items", items);
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemPath = `${folder}/${item}`;
      if (!item.includes(".")) {
        this.load(itemPath, mapArr);
        continue;
      }

      if (item.lastIndexOf(".js") != item.length - 3) continue;

      mapArr.push(itemPath);
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
  private get cFolderPath(): string {
    return `${process.cwd()}/${this.cFolder}`;
  }
}
