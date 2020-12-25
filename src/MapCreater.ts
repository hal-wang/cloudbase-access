import { existsSync, readdirSync, writeFileSync } from "fs";
import linq = require("linq");
import { Action, RequestParams } from ".";
import MapItem from "./MapItem";

export default class MapCreater {
  constructor(
    private readonly requestParams: RequestParams,
    private readonly cFolder = "controllers"
  ) {}

  getMaps(): MapItem[] {
    const existedMap = this.existedMap;
    if (existedMap) return existedMap;
    else return this.createMap();
  }

  getMap(): MapItem | undefined {
    const maps = this.getMaps();
    const mapItem = linq
      .from(maps)
      .where((ap) => this.isPathMatched(ap.path))
      .firstOrDefault();
    return mapItem;
  }

  private isPathMatched(mapPath: string) {
    const mPath = mapPath.toLowerCase().replace(/\\/g, "/");
    const path = `${this.requestParams.path}.js`
      .toLowerCase()
      .replace(/\\/g, "/");

    return mPath == path;
  }

  private createMap(): MapItem[] {
    const mapArr: MapItem[] = [];
    this.load("", mapArr);
    writeFileSync(this.mapPath, JSON.stringify(mapArr));
    return mapArr;
  }

  private load(folder: string, mapArr: MapItem[]): void {
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

      this.createMapItem(mapArr, itemPath);
    }
  }

  private get existedMap(): MapItem[] | null {
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

  private createMapItem(mapArr: MapItem[], path: string): void {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const actionClass = require(`${this.cFolderPath}/${path}`).default;
    const routerAction = new actionClass(this.requestParams) as Action;
    const mapItem = <MapItem>{
      path,
      roles: routerAction.roles,
    };
    mapArr.push(mapItem);
  }
}
