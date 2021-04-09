export default class Validate {
  static isUrl(url: string): boolean {
    const reg = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;
    return reg.test(url);
  }
}
