import Vue from "vue";
import App from "./App.vue";

import "ant-design-vue/dist/antd.css";

import AntDesign from "ant-design-vue";

Vue.use(AntDesign);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
