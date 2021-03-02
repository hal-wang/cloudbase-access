import { writeFileSync, existsSync, lstatSync, readdirSync } from "fs";
import linq = require("linq");
import path = require("path");
import { ApiDocs } from "..";
import Action from "../Action";
import ApiDocsConfig from "./ApiDocsConfig";

export default class ApiDocsCreater {
  constructor(
    private readonly cfPath: string,
    private readonly config: ApiDocsConfig = {}
  ) {
    if (
      !this.cfPath ||
      !existsSync(this.cfPath) ||
      !lstatSync(this.cfPath).isDirectory()
    ) {
      throw new Error(
        "please input controllers folder path, for example 'src/controllers'"
      );
    }
  }

  get docs(): string {
    return this.readFilesFromFolder("", "");
  }

  public write(targetFile: string): void {
    if (!targetFile) {
      throw new Error(
        "please input target markdown file path, for example 'docs/api.md'"
      );
    }

    writeFileSync(path.join(process.cwd(), targetFile), this.docs);
  }

  private readFilesFromFolder(folderRePath: string, result: string): string {
    const storageItems = linq
      .from(readdirSync(path.join(this.cfPath, folderRePath)))
      .orderBy((item) => item)
      .select((item) => path.join(folderRePath, item));
    storageItems.forEach((storageItem) => {
      const stat = lstatSync(path.join(this.cfPath, storageItem));
      if (
        stat.isFile() &&
        (storageItem.endsWith(".js") || storageItem.endsWith(".ts"))
      ) {
        result += this.readFile(storageItem);
      } else if (stat.isDirectory()) {
        this.readFilesFromFolder(storageItem, result);
      }
    });
    return result;
  }

  private readFile(relativePath: string): string {
    const file = path.join(this.cfPath, relativePath);
    let action;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const actionClass = require(file).default;
      action = new actionClass() as Action;
    } catch {
      return "";
    }

    if (!action.docs) return "";
    else return this.docsToMd(this.getFileNameFromPath(file), action.docs);
  }

  private getFileNameFromPath(relativePath: string) {
    let index = relativePath.lastIndexOf(".");
    let result = relativePath.substr(0, index);

    result = result.replaceAll("\\", "/");
    index = result.lastIndexOf("/");
    result = result.substring(index + 1, result.length - 1);

    return result;
  }

  private docsToMd(relativePath: string, docs: ApiDocs): string {
    let result = "";
    result += `##${relativePath}`;

    result += "\n\n";
    return result;
  }
}
