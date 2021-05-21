import { writeFileSync, existsSync, lstatSync, readdirSync } from "fs";
import linq = require("linq");
import path = require("path");

export default class MapCreater {
  constructor(private readonly dir: string) {
    if (
      !this.dir ||
      !existsSync(this.dirPath) ||
      !lstatSync(this.dirPath).isDirectory()
    ) {
      throw new Error(
        "please input controllers folder path, for example 'src/controllers'"
      );
    }
  }

  get map(): string[] {
    return this.readFilesFromFolder("", []);
  }

  write(filePath = "cba-map.json"): void {
    writeFileSync(path.join(process.cwd(), filePath), JSON.stringify(this.map));
  }

  private get dirPath(): string {
    return path.join(process.cwd(), this.dir);
  }

  private readFilesFromFolder(folderRePath: string, result: Array<string>) {
    const storageItems = linq
      .from(readdirSync(path.join(this.dirPath, folderRePath)))
      .select((item) => path.join(folderRePath, item));

    const files = linq
      .from(storageItems)
      .where((storageItem) => {
        const stat = lstatSync(path.join(this.dirPath, storageItem));
        return (
          stat.isFile() &&
          (storageItem.endsWith(".js") || storageItem.endsWith(".ts"))
        );
      })
      .orderBy((item) => item)
      .toArray();
    for (let i = 0; i < files.length; i++) {
      result.push(files[i].replace(/\\/g, "/"));
    }

    const folders = linq
      .from(storageItems)
      .where((storageItem) => {
        const stat = lstatSync(path.join(this.dirPath, storageItem));
        return stat.isDirectory();
      })
      .orderBy((item) => item)
      .toArray();
    for (let i = 0; i < folders.length; i++) {
      this.readFilesFromFolder(folders[i], result);
    }

    return result;
  }
}
