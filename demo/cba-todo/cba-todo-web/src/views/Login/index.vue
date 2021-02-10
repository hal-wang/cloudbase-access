<template>
  <div
    class="login-container"
    :style="{ backgroundImage: `url(${background})` }"
  >
    <a-form :form="form" class="login-form">
      <div class="title">
        <h1>CBA-TODO</h1>
      </div>
      <a-form-item>
        <a-input
          v-decorator="[
            'email',
            {
              rules: [
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ],
            },
          ]"
          placeholder="Email"
        >
          <a-icon
            slot="prefix"
            type="user"
            style="color: rgba(0, 0, 0, 0.25)"
          />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="[
            'password',
            {
              rules: [
                { required: true, message: 'Please input your Password!' },
              ],
            },
          ]"
          type="password"
          placeholder="Password"
        >
          <a-icon
            slot="prefix"
            type="lock"
            style="color: rgba(0, 0, 0, 0.25)"
          />
        </a-input>
      </a-form-item>

      <div class="btns">
        <a-button
          type="primary"
          html-type="submit"
          class="login-btn"
          :loading="loginLoading"
          @click="handleLogin"
        >
          Login
        </a-button>
        <a-button
          type="default"
          html-type="submit"
          :loading="signupLoading"
          @click="handleSignup"
        >
          Signup
        </a-button>
      </div>
      <div class="tips">
        <span>
          A demo of
          <a
            href="https://github.com/hal-wang/cloudbase-access"
            target="_blank"
          >
            cloudbase-access
          </a>
          ,
        </span>
        <span>data persistence is not guaranteed!</span>
      </div>
    </a-form>

    <div class="bing">from bing</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import request from "@/utils/request";

export default Vue.extend({
  data() {
    return {
      form: this.$form.createForm(this, { name: "coordinated" }),
      background: "",
      loginLoading: false,
      signupLoading: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.user.user;
    },
  },
  async created() {
    const res = await request.get(`bing`);
    const img = res.data;

    const bingUrl = "https://www.bing.com";
    this.background = "".startsWith(bingUrl) ? img.url : `${bingUrl}${img.url}`;
    console.log("bg", this.background);
  },
  mounted() {
    if (this.user) {
      this.$router.replace({
        path: "/",
      });
    }
  },
  methods: {
    handleLogin() {
      this.login("login");
    },
    handleSignup() {
      this.login("signup");
    },
    login(loginType: "login" | "signup") {
      this.form.validateFields(async (err, values) => {
        if (err) return;

        const loading = `${loginType}Loading` as
          | "loginLoading"
          | "signupLoading";
        this[loading] = true;
        try {
          const user = await this.$store.dispatch(`user/${loginType}`, {
            account: values.email,
            password: values.password,
          });

          if (user) {
            this.$router.replace({
              path: "/",
            });
          }
        } finally {
          this[loading] = false;
        }
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  position: relative;

  .login-form {
    width: 400px;
    background-color: white;
    padding: 20px 40px;
    border-radius: 4px;

    .title {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .btns {
      display: flex;

      .login-btn {
        flex: 1;
        margin-right: 10px;
      }
    }

    .tips {
      display: flex;
      flex-direction: column;
      margin-top: 6px;
      font-size: 14px;
      font-weight: 300;
    }
  }

  .bing {
    position: absolute;
    right: 8px;
    bottom: 10px;
    background: #fff9;
    padding: 4px 10px;
    font-size: 14px;
    line-height: 14px;
  }

  @media only screen and (max-width: 600px) {
    .login-form {
      width: 100%;
      padding: 20px;
      min-width: 300px;
      border-radius: 0;
    }
  }
}
</style>
