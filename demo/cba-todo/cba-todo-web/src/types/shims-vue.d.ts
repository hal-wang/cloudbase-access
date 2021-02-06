import VueRouter, { Route } from "vue-router";

declare module "*.vue" {
  import Vue from "vue";

  export default Vue;
}

declare module "vue/types/vue" {
  interface Vue {
    $post: function;
    $store: any;
    $route: Route;
    $router: VueRouter;
    $confirm: function;
    $message: function;
  }
}
