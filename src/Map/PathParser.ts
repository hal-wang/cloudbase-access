import RequestMethod from "../Router/RequestMethod";

export default class PathParser {
  private readonly relativePath: string;
  private readonly relativePathWithoutExtension: string;
  constructor(relativePath: string) {
    this.relativePath = relativePath.replace(/\\/g, "/");

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
    return path.substr(index + 1, path.length - index - 1);
  }

  public get httpMethod(): RequestMethod | undefined {
    const fileNameWithoutExtension = this.fileNameWithoutExtension;

    switch (fileNameWithoutExtension.toUpperCase()) {
      case RequestMethod.get:
        return RequestMethod.get;
      case RequestMethod.post:
        return RequestMethod.post;
      case RequestMethod.delete:
        return RequestMethod.delete;
      case RequestMethod.patch:
        return RequestMethod.patch;
      case RequestMethod.put:
        return RequestMethod.put;
      case RequestMethod.head:
        return RequestMethod.head;
      case RequestMethod.trace:
        return RequestMethod.trace;
      case RequestMethod.options:
        return RequestMethod.options;
      case RequestMethod.connect:
        return RequestMethod.connect;
      default:
        return undefined;
    }
  }

  public get pathWithoutHttpMethod(): string {
    return this.getPathWithoutHttpMethod(this.relativePath);
  }

  public get pathWithoutHttpMethodAndExtension(): string {
    return this.getPathWithoutHttpMethod(this.relativePathWithoutExtension);
  }

  private getPathWithoutHttpMethod(path: string) {
    if (!this.httpMethod) return path;
    else {
      const index = path.lastIndexOf("/");
      return path.substr(0, index);
    }
  }
}
