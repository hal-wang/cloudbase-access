<template>
  <div class="header">
    <div class="logo">CBA-TODO</div>

    <a-space size="large">
      <a-button
        type="primary"
        shape="circle"
        icon="plus"
        size="large"
        @click="handleAddTodo"
      />

      <a-popover :title="user._id" trigger="click">
        <div slot="content">
          <a-popconfirm
            title="Are you sure you want to log out?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="handleLogout"
          >
            <a-button type="danger" block @click.stop=""> Logout </a-button>
          </a-popconfirm>
        </div>
        <a-button
          type="primary"
          shape="circle"
          icon="user"
          size="large"
          @click.stop=""
        />
      </a-popover>
    </a-space>
  </div>
</template>

<script lang="ts">
import User from "@/models/User";
import Vue from "vue";
export default Vue.extend({
  computed: {
    user(): User {
      return this.$store.state.user.user;
    },
  },
  methods: {
    handleAddTodo() {
      this.$emit("add");
    },
    handleLogout() {
      this.$store.dispatch("user/logout");
      this.$router.replace({
        path: "/login",
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.logo {
  color: white;
  font-weight: 300;
  letter-spacing: 8px;
  font-size: 22px;
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

@media only screen and (max-width: 600px) {
  .ant-layout-header {
    padding: 0 10px;
  }
}
</style>

<style lang="scss">
.todo-container {
  .header {
    .ant-btn {
      .anticon {
        margin-top: -2px;
      }
    }
  }
}
</style>
