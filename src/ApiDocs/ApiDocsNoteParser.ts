import ApiDocs from ".";
import { readFileSync, writeFileSync } from "fs";
import ApiDocsNoteParserStruct from "./ApiDocsNoteParserStruct";
import path = require("path");

export default class ApiDocsNoteParser {
  constructor(private readonly file: string) {}

  public get docs(): ApiDocs | null {
    const note = this.note;
    if (!note) return null;
    const parserResult = this.parser(note, 1);
    console.log("parserResult", parserResult);
    writeFileSync(
      path.join(process.cwd(), "test.json"),
      JSON.stringify(parserResult)
    );
    return null;
  }

  private get note(): string | null {
    const content = readFileSync(this.file, "utf-8");
    const regs = /(\/\*\*[\s]*\*[\s]*)(@action)([\s\S]*?\*\/)/gi.exec(content);
    if (!regs || !regs.length) return null;

    const note = regs[0]
      .replace(/^[\s]*\*[\s]*$/gm, "")
      .replace(/^[\s]*\*[\s]*/gm, "")
      .replace(/[\s]*\/[\s]*$/, "")
      .replace(/^[\s]*\/\*\*[\s]*/, "");
    return note;
  }

  private parser(note: string, deep: number): ApiDocsNoteParserStruct[] | null {
    const reg = this.getRegExp(deep);
    const matchs = note.match(reg);
    if (!matchs || !matchs.length) return null;
    const splits = note.split(reg);
    if (!splits || !splits.length) return null;
    splits.splice(0, 1);
    console.log("test2", matchs, splits);
    if (matchs.length != splits.length) return null;

    const result = [] as ApiDocsNoteParserStruct[];
    for (let i = 0; i < matchs.length; i++) {
      const header = matchs[i];
      let title: string;
      let value: string;
      if (header.includes(" ")) {
        const headerStrs = header.split(" ");
        title = headerStrs[0];
        value = header.replace(`${title} `, "");
      } else {
        title = header;
        value = "";
      }

      result.push({
        title: title,
        value: value,
        children: splits[i] ? this.parser(splits[i], deep + 1) : null,
      });
    }
    return result;
  }

  private getRegExp(deep: number) {
    let chars = "";
    for (let i = 0; i < deep; i++) {
      chars += "@";
    }
    return RegExp(`^${chars}[^@].*$`, "gm");
  }
}
