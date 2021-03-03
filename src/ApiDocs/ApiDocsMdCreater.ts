import ApiDocs from ".";
import PathParser from "../Map/PathParser";
import ApiDocsConfig from "./ApiDocsConfig";
import ApiDocsInputParams from "./ApiDocsInputParams";
import ApiDocsOutputParams from "./ApiDocsOutputParams";
import ApiDocsParam from "./ApiDocsParam";
import ApiDocsIOParams from "./ApiDocsIOParams";
import ApiDocsStateCode from "./ApiDocsStateCode";

export default class ApiDocsMdCreater {
  constructor(
    private readonly relativePath: string,
    private readonly docs: ApiDocs,
    private readonly config: ApiDocsConfig
  ) {}

  public get result(): string {
    let result = this.getTitle();
    result += "\n\n";
    result += this.getDesc(this.docs);
    result += "\n\n";

    if (this.docs.input) {
      result += this.getInputParams(this.docs.input);
      result += "\n\n";
    }

    if (this.docs.output) {
      result += this.getOutputParams(this.docs.output);
    }

    return result.trimEnd();
  }

  private getTitle(): string {
    const pathParser = new PathParser(this.relativePath);
    const httpMethod = pathParser.httpMethod;

    let result = `## `;
    result += `${httpMethod ? httpMethod : "ANY"}`;
    result += ` `;
    if (this.docs.name) {
      result += `${this.docs.name}`;
      result += `\n>`;
    }
    result += `/${pathParser.pathWithoutHttpMethodAndExtension}`;
    return result;
  }

  private getDesc(docs: ApiDocs) {
    if (!docs.desc) return "";
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

    if (input.desc) {
      result += input.desc;
      result += "\n\n";
    }

    const bpResult = this.getBaseParams(input, this.config.baseInputHeaders);
    if (bpResult) {
      result += bpResult;
      result += "\n\n";
    }

    const params = <ApiDocsParam[]>[];
    params.push(...(this.config.baseParams || <ApiDocsParam[]>[]));
    params.push(...(input.params || <ApiDocsParam[]>[]));
    if (params && params.length) {
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

    if (output.desc) {
      result += output.desc;
      result += "\n\n";
    }

    const codes = <ApiDocsStateCode[]>[];
    codes.push(...(this.config.baseCodes || <ApiDocsStateCode[]>[]));
    codes.push(...(output.codes || <ApiDocsStateCode[]>[]));
    if (codes && codes.length) {
      result += `#### Status Code\n\n`;
      for (let i = 0; i < codes.length; i++) {
        const code = codes[i];
        result += `- ${code.code}`;
        if (code.desc) {
          result += `: ${code.desc}`;
        }
        result += "\n";
      }
      result += "\n";
    }

    const bpResult = this.getBaseParams(output, this.config.baseOutputHeaders);
    if (bpResult) {
      result += bpResult;
    }

    return result.trimEnd();
  }

  private getBaseParams(params: ApiDocsIOParams, baseHeaders?: ApiDocsParam[]) {
    let result = "";

    const headers = <ApiDocsParam[]>[];
    headers.push(...(baseHeaders || <ApiDocsParam[]>[]));
    headers.push(...(params.headers || <ApiDocsParam[]>[]));
    if (headers && headers.length) {
      result += "#### Headers\n\n";
      result += this.getParams(headers);
      result += "\n\n";
    }

    if (params.body) {
      result += "#### Body\n\n";
      if (Array.isArray(params.body)) {
        result += this.getParams(params.body);
      } else {
        result += this.getParam(params.body);
      }
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
    if (!param.name) return "";

    let result = this.padLeft(depth);

    if (index) {
      result += index;
      result += ". ";
      result += param.name;
    }

    if (param.type) {
      result += "\n";
      result += this.padLeft(depth + 1);
      result += "- Type: ";
      result += param.type;
    }

    if (param.desc) {
      result += "\n";
      result += this.padLeft(depth + 1);
      result += "- Desc: ";
      result += param.desc;
    }

    if (param.children) {
      result += "\n";
      result += this.padLeft(depth + 1);
      result += "- Children:";
      result += "\n";

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
      result += "   ";
    }
    return result;
  }
}
