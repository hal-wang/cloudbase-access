import { writeFileSync, existsSync, lstatSync, readdirSync } from "fs";

export default class ApiDocsCreater {
  constructor(private readonly cfPath: string) {
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
}
