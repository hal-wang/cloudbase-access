import RequestMethod from "../Router/RequestMethod";

export default class PathParser {
  private readonly relativePath: string;
  private readonly relativePathWithoutExtension: string;
  constructor(relativePath: string) {
    this.relativePath = relativePath.replaceAll("\\", "/");

    const dotIndex = this.relativePath.lastIndexOf(".");
    this.relativePathWithoutExtension =
      dotIndex > 0 ? this.relativePath.substr(0, dotIndex) : this.relativePath;
  }

  public get fileName(): string {
    return this.getFileName(this.relativePath);
  }

  public get fileNameWithoutExtension(): string {
    return this.getFileName(this.relativePathWithoutExtension);
  }

  private getFileName(path: string) {
    const index = path.lastIndexOf("/");
    return path.substring(index + 1, path.length - 1);
  }

  public get isHttpMethodFile(): boolean {
    const fileNameWithoutExtension = this.fileNameWithoutExtension;

    if (
      fileNameWithoutExtension.toUpperCase() == RequestMethod.get ||
      fileNameWithoutExtension.toUpperCase() == RequestMethod.post ||
      fileNameWithoutExtension.toUpperCase() == RequestMethod.delete ||
      fileNameWithoutExtension.toUpperCase() == RequestMethod.patch ||
      fileNameWithoutExtension.toUpperCase() == RequestMethod.put
    ) {
      return true;
    }

    return false;
  }

  public get pathWithoutHttpMethod(): string {
    return this.getPathWithoutHttpMethod(this.relativePath);
  }

  public get pathWithoutHttpMethodAndExtension(): string {
    return this.getPathWithoutHttpMethod(this.relativePathWithoutExtension);
  }

  private getPathWithoutHttpMethod(path: string) {
    if (!this.isHttpMethodFile) return path;
    else {
      const index = path.lastIndexOf("/");
      return path.substr(0, index - 1);
    }
  }
}
