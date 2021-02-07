<template>
  <div class="login-container">
    <div class="title">
      <h1>CBA-TODO</h1>
    </div>

    <a-form :form="form" class="login-form" @submit="handleSubmit">
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
        <a-button type="primary" html-type="submit" class="login-btn">
          Login
        </a-button>
        <a-button type="default" html-type="submit"> Signup </a-button>
      </div>
    </a-form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      form: this.$form.createForm(this, { name: "coordinated" }),
    };
  },
  computed: {
    user() {
      return this.$store.state.user.user;
    },
  },
  mounted() {
    if (this.user) {
      this.$router.replace({
        path: "/",
      });
    }
  },
  methods: {
    handleSubmit() {
      this.form.validateFields(async (err, values) => {
        if (err) return;

        const user = await this.$store.dispatch("user/login", {
          account: values.email,
          password: values.password,
        });
        if (user) {
          this.$router.replace({
            path: "/",
          });
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

  .title {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .login-form {
    flex: 1;
    width: 360px;

    .btns {
      display: flex;

      .login-btn {
        flex: 1;
        margin-right: 10px;
      }
    }
  }
}
</style>
