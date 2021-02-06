import Cookies from "js-cookie";

export default class AuthCookie {
  static getAccount() {
    return Cookies.get("Account");
  }

  static setAccount(account: string) {
    return Cookies.set("Account", account, { expires: 365 * 100 });
  }

  static getPassword() {
    return Cookies.get("Password");
  }

  static setPassword(password: string) {
    return Cookies.set("Password", password, { expires: 91 });
  }

  static removePassword() {
    return Cookies.remove("Password");
  }
}
