import { writeFileSync, existsSync, lstatSync, readdirSync } from "fs";
import linq = require("linq");
import path = require("path");

export default class MapCreater {
  constructor(private readonly cFolder: string) {
    if (
      !this.cFolder ||
      !existsSync(this.cfPath) ||
      !lstatSync(this.cfPath).isDirectory()
    ) {
      throw new Error(
        "please input controllers folder path, for example 'src/controllers'"
      );
    }
  }

  get map(): string[] {
    return this.readFilesFromFolder("", []);
  }

  write(): void {
    writeFileSync(
      path.join(process.cwd(), "cba-map.json"),
      JSON.stringify(this.map)
    );
  }

  private get cfPath(): string {
    return path.join(process.cwd(), this.cFolder);
  }

  private readFilesFromFolder(folderRePath: string, result: Array<string>) {
    const storageItems = linq
      .from(readdirSync(path.join(this.cfPath, folderRePath)))
      .select((item) => path.join(folderRePath, item));
    storageItems.forEach((storageItem) => {
      const stat = lstatSync(path.join(this.cfPath, storageItem));
      if (stat.isDirectory()) {
        this.readFilesFromFolder(storageItem, result);
      } else if (
        stat.isFile() &&
        (storageItem.endsWith(".js") || storageItem.endsWith(".ts"))
      ) {
        result.push(storageItem.replace(/\\/g, "/"));
      }
    });
    return result;
  }
}
