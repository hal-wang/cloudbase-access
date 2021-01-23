import { writeFileSync, existsSync, lstatSync, readdirSync } from "fs";
import linq = require("linq");
import path = require("path");

export default class MapCreater {
  private readonly cFolder: string;

  constructor(cfPath: string) {
    this.cFolder = path.join(process.cwd(), cfPath);
    if (
      !cfPath ||
      !existsSync(this.cFolder) ||
      !lstatSync(this.cFolder).isDirectory()
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

  private readFilesFromFolder(folderRePath: string, result: Array<string>) {
    const storageItems = linq
      .from(readdirSync(path.join(this.cFolder, folderRePath)))
      .select((item) => path.join(folderRePath, item));
    storageItems.forEach((storageItem) => {
      const stat = lstatSync(path.join(this.cFolder, storageItem));
      if (stat.isDirectory()) {
        this.readFilesFromFolder(storageItem, result);
      } else if (
        stat.isFile() &&
        (storageItem.endsWith(".js") || storageItem.endsWith(".ts"))
      ) {
        result.push(storageItem);
      }
    });
    return result;
  }
}
