import router from "@/router";
import store from "@/store";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import AuthCookie from "./AuthCookie";

const title = "cba-todo";
function getPageTitle(pageTitle: string) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return `${title}`;
}

NProgress.configure({ showSpinner: false }); // NProgress Configuration

router.beforeEach(async (to: any, from: any, next: any) => {
  NProgress.start(); // start progress bar
  document.title = getPageTitle(to.meta.title); // set page title

  if (to.path == "/login" || store.state.user.user) {
    NProgress.done();
    next();
    return;
  }

  const password = AuthCookie.getPassword();
  const account = AuthCookie.getAccount();
  if (!account || !password) {
    NProgress.done();
    next(`/login`);
    return;
  }

  const user = await store.dispatch("user/login", { account, password });
  if (user) {
    NProgress.done();
    next({ ...to, replace: true } as any);
  } else {
    await store.dispatch("user/logout");
    NProgress.done();
    next(`/login`);
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
