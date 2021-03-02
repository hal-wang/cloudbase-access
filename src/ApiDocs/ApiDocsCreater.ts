import { writeFileSync, existsSync, lstatSync, readdirSync } from "fs";
import linq = require("linq");
import path = require("path");
import { ApiDocs, ApiDocsParam } from "..";
import Action from "../Action";
import PathParser from "../Map/PathParser";
import ApiDocsConfig from "./ApiDocsConfig";
import ApiDocsInputParams from "./ApiDocsInputParams";
import ApiDocsOutputParams from "./ApiDocsOutputParams";
import ApiDocsParamsBase from "./ApiDocsParamsBase";

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
    return this.readFilesFromFolder("");
  }

  public write(targetFile: string): void {
    if (!targetFile) {
      throw new Error(
        "please input target markdown file path, for example 'docs/api.md'"
      );
    }

    writeFileSync(path.join(process.cwd(), targetFile), this.docs);
  }

  private readFilesFromFolder(folderRePath: string): string {
    let result = "";
    const storageItems = linq
      .from(readdirSync(path.join(this.cfPath, folderRePath)))
      .select((item) => path.join(folderRePath, item))
      .toArray();

    const files = linq
      .from(storageItems)
      .where((storageItem) => {
        const stat = lstatSync(path.join(this.cfPath, storageItem));
        return (
          stat.isFile() &&
          (storageItem.endsWith(".js") || storageItem.endsWith(".ts"))
        );
      })
      .orderBy((item) => item)
      .toArray();
    for (let i = 0; i < files.length; i++) {
      result += this.readFile(files[i]);
    }

    const folders = linq
      .from(storageItems)
      .where((storageItem) => {
        const stat = lstatSync(path.join(this.cfPath, storageItem));
        return stat.isDirectory();
      })
      .orderBy((item) => item)
      .toArray();
    for (let i = 0; i < folders.length; i++) {
      result += this.readFilesFromFolder(folders[i]);
    }

    return result;
  }

  private readFile(relativePath: string): string {
    const file = path.join(process.cwd(), this.cfPath, relativePath);
    let action;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const actionClass = require(file).default;
      action = new actionClass() as Action;
      if (!action) return "";
    } catch (err) {
      return "";
    }

    if (!action.docs) return "";
    else return this.docsToMd(relativePath, action.docs);
  }

  private docsToMd(relativePath: string, docs: ApiDocs): string {
    let result = this.getTitle(relativePath);
    result += "\n\n";
    result += this.getDesc(docs);
    result += "\n\n";

    if (docs.input) {
      result += "### Input\n\n";
      result += this.getInputParams(docs.input);
    }

    if (docs.output) {
      result += "### Output\n\n";
      result += this.getOutputParams(docs.output);
    }

    return result;
  }

  private getTitle(relativePath: string): string {
    const pathParser = new PathParser(relativePath);
    const httpMethod = pathParser.httpMethod;

    let result = `## `;
    result += `${httpMethod ? httpMethod : "ANY"}`;
    result += `  `;
    result += `${pathParser.pathWithoutHttpMethodAndExtension}`;
    return result;
  }

  private getDesc(docs: ApiDocs) {
    docs.input;
    let result = "### Desc \n\n";
    result += docs.desc || "Empty";
    return result;
  }

  private getInputParams(input?: ApiDocsInputParams): string {
    let result = "### Input\n\n";
    if (!input) {
      result += "No";
      return result;
    }

    result = this.getBaseParams(input, this.config.baseInputHeaders);
    result += "\n\n";

    const params = this.config.baseParams || <ApiDocsParam[]>[];
    params.push(...(input.params || <ApiDocsParam[]>[]));
    if (params) {
      result += "#### Params\n\n";
      result += this.getParams(params);
      result += "\n\n";
    }

    if (input.query) {
      result += "#### Query\n\n";
      result += this.getParams(input.query);
      result += "\n\n";
    }

    return result.trimEnd();
  }

  private getOutputParams(output?: ApiDocsOutputParams): string {
    let result = "### Output\n\n";
    if (!output) {
      result += "No";
      return result;
    }

    result += `Status Code: ${output.code}\n\n`;
    result = this.getBaseParams(output, this.config.baseOutputHeaders);
    return result;
  }

  private getBaseParams(
    params: ApiDocsParamsBase,
    baseHeaders?: ApiDocsParam[]
  ) {
    let result = "";

    const headers = baseHeaders || <ApiDocsParam[]>[];
    headers.push(...(params.headers || <ApiDocsParam[]>[]));
    if (headers && headers.length) {
      result += "#### Headers\n\n";
      result += this.getParams(headers);
      result += "\n\n";
    }

    if (params.body) {
      result += "#### Body\n\n";
      result += this.getParam(params.body);
      result += "\n\n";
    }

    return result.trimEnd();
  }

  private getParams(params: ApiDocsParam[]) {
    let result = "";
    for (let i = 1; i <= params.length; i++) {
      result += this.getParam(params[i - 1], 0, i);
      result += "\n";
    }
    return result.trimEnd();
  }

  private getParam(param: ApiDocsParam, depth = 0, index?: number): string {
    let result = this.padLeft(depth);

    if (index) {
      result += index;
      result += ". ";
    }
    result += param.name;
    result += "\n";
    result += this.padLeft(depth + 1);
    result += "- Type: ";
    result += param.type;

    result += "\n";
    result += this.padLeft(depth + 1);
    result += "- Desc: ";
    result += param.desc;

    if (param.children) {
      result += "\n";
      result += this.padLeft(depth + 1);
      result += "- Children: ";
      result += "\n\n";

      for (let i = 1; i <= param.children.length; i++) {
        result += this.getParam(param.children[i - 1], depth + 1, i);
        result += "\n";
      }
    }

    return result.trimEnd();
  }

  private padLeft(depth: number) {
    let result = "";
    for (let i = 0; i < depth; i++) {
      result += "    ";
    }
    return result;
  }
}
