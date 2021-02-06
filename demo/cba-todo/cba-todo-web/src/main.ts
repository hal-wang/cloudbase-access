import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/utils/permission";

import "ant-design-vue/dist/antd.css";

import AntDesign from "ant-design-vue";

Vue.use(AntDesign);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
