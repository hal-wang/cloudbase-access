import StoreActionParam from "@/models/StoreActionParam";
import User from "@/models/User";
import AuthCookie from "@/utils/AuthCookie";
import request from "@/utils/request";

const state = {
  user: null,
};

const mutations = {
  SET_USER: (state: any, user: User) => {
    state.user = user;
  },
};

const actions = {
  async login(param: StoreActionParam, userInfo: any) {
    const { account, password } = userInfo;
    try {
      const res = await request.get(`user/${account}`, {
        headers: {
          password: password,
        },
      });

      param.commit("SET_USER", res.data);
      AuthCookie.setAccount(account);
      AuthCookie.setPassword(password);
      return res.data;
    } catch (res) {
      return;
    }
  },
  async signup(param: StoreActionParam, userInfo: any) {
    const { account, password } = userInfo;
    try {
      const res = await request.post(`user`, {
        account,
        password,
      });

      param.commit("SET_USER", res.data);
      AuthCookie.setAccount(account);
      AuthCookie.setPassword(password);
      return res.data;
    } catch (res) {
      return;
    }
  },
  logout(param: StoreActionParam) {
    AuthCookie.removePassword();
    param.commit("SET_USER", null);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
