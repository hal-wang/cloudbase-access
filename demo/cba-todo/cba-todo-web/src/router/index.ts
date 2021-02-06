import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    component: () => import("@/views/Todo/index.vue")
  },
  {
    path: "/login",
    component: () => import("@/views/Login/index.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
