import Action from ".";
import { RequestParams } from "../Router";
import { existsSync, readdirSync } from "fs";
import linq = require("linq");

export default class ActionParser {
  constructor(
    readonly requestParams: RequestParams,
    readonly cFolder: string
  ) {}

  public getAction(): Action | undefined {
    const path = this.getActionPath();
    if (!path) return;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const actionClass = require(path).default;
    return new actionClass() as Action;
  }

  private getActionPath(): string | undefined {
    if (!this.requestParams.path) return;
    if (this.requestParams.path.includes("..")) return;

    const folderIndex = this.requestParams.path.lastIndexOf("/");
    if (folderIndex < 0 || folderIndex >= this.requestParams.path.length - 1) {
      return;
    }

    const folder = this.requestParams.path.substr(0, folderIndex);
    const folderPath = `${process.cwd()}/${this.cFolder}${folder}`;
    if (!existsSync(folderPath)) return;

    const actionFile = this.requestParams.path.substr(
      folderIndex + 1,
      this.requestParams.path.length - folderIndex - 1
    );
    const files = readdirSync(folderPath);

    const file = linq
      .from(files)
      .where(
        (f) =>
          f.toLowerCase() == actionFile.toLowerCase() + ".js" ||
          f.toLowerCase() == actionFile.toLowerCase() + ".ts"
      )
      .orderByDescending((f) => f)
      .firstOrDefault();
    if (!file) return;

    return `${folderPath}/${file}`;
  }
}
