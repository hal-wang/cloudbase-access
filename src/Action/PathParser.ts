import { existsSync, readdirSync } from "fs";
import linq = require("linq");

export default class {
  folderPath?: string; // file's parent folder
  filePath?: string; // real file path

  constructor(
    private readonly cFolder: string,
    private readonly requestPath: string
  ) {
    const folderSeparator = requestPath.lastIndexOf("/");
    if (folderSeparator < 0) return;
    if (folderSeparator >= requestPath.length - 1) return;

    const folderPath = this.getFolderPath(folderSeparator);
    if (!folderPath) return;
    this.folderPath = folderPath;

    const actionFileName = this.getActionFileName(folderSeparator);
    if (!actionFileName) return;

    this.filePath = this.getFilePath(folderPath, actionFileName);
  }

  private getFolderPath(folderSeparator: number): string | undefined {
    const folder = this.requestPath.substr(0, folderSeparator);
    const folderPath = `${process.cwd()}/${this.cFolder}${folder}`.replace(
      /\\/g,
      "/"
    );
    if (!existsSync(folderPath)) return;
    return folderPath;
  }

  private getActionFileName(folderSeparator: number) {
    return this.requestPath.substr(
      folderSeparator + 1,
      this.requestPath.length - folderSeparator - 1
    );
  }

  private getFilePath(
    folderPath: string,
    actionFileName: string
  ): string | undefined {
    const files = readdirSync(folderPath);
    const fileName = linq
      .from(files)
      .where(
        (f) =>
          f.toLowerCase() == actionFileName.toLowerCase() + ".js" ||
          f.toLowerCase() == actionFileName.toLowerCase() + ".ts"
      )
      .orderByDescending((f) => f)
      .firstOrDefault();
    if (!fileName) return;
    return `${folderPath}/${fileName}`;
  }
}
