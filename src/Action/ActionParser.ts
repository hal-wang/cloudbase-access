import Action from ".";
import { RequestParams } from "../Router";
import * as path from "path";
import PathParser from "./PathParser";
import ActionParserResult from "./ActionParserResult";

export default class ActionParser {
  constructor(
    readonly requestParams: RequestParams,
    readonly cFolder: string
  ) {}

  public getParseResult(): ActionParserResult {
    if (!this.isRequestPathValid) return {};

    let pathParser = new PathParser(this.cFolder, this.requestParams.path);
    if (pathParser.folderPath && pathParser.filePath) {
      return { action: this.getAction(pathParser.filePath) };
    } else if (this.requestParams.method) {
      pathParser = new PathParser(this.cFolder, this.restfullRequestPath);
      if (!pathParser.folderPath) {
        return {};
      } else if (!pathParser.filePath) {
        return { methodNotAllowed: true };
      } else {
        return {
          action: this.getAction(pathParser.filePath),
        };
      }
    } else {
      return {};
    }
  }

  private getAction(filePath: string): Action {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const actionClass = require(filePath).default;
    return new actionClass() as Action;
  }

  private get restfullRequestPath(): string {
    return path
      .join(this.requestParams.path, this.requestParams.method.toLowerCase())
      .replace(/\\/g, "/");
  }

  private get isRequestPathValid(): boolean {
    const requestPath = this.requestParams.path;

    if (!requestPath) return false;
    if (requestPath.includes("..")) return false;
    return true;
  }
}
