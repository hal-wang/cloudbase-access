<template>
  <a-layout class="layout todo-container">
    <a-layout-header>
      <div class="header">
        <div class="logo">CBA-TODO</div>
        <a-space size="large">
          <a-button
            type="primary"
            shape="circle"
            icon="plus"
            size="large"
            @click="handleLogout"
          />
          <a-button
            type="danger"
            shape="circle"
            icon="logout"
            size="large"
            @click="handleLogout"
          />
        </a-space>
      </div>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <div>
        <div class="todo-items">
          <TodoItem
            v-for="todo in list"
            :key="todo._id"
            :todo="todo"
            @delete="onDelete(todo)"
          ></TodoItem>
        </div>
        <div class="pagination">
          <a-pagination
            show-size-changer
            show-quick-jumper
            :default-current="page"
            :total="total"
            @change="onPageChange"
            @showSizeChange="onShowSizeChange"
          />
        </div>
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      cba-todo ©2021 Created by hal.wang
    </a-layout-footer>
  </a-layout>
</template>

<script lang="ts">
import Vue from "vue";
import request from "@/utils/request";
import Todo from "@/models/Todo";
import User from "@/models/User";

export default Vue.extend({
  components: {
    TodoItem: () => import("./TodoItem.vue"),
  },
  data() {
    return {
      list: [] as Todo[],
      total: 0,
      page: 1,
      pageSize: 20,
    };
  },
  computed: {
    user(): User {
      return this.$store.state.user.user;
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    handleLogout() {
      this.$store.dispatch("user/logout");
      this.$router.replace({
        path: "/login",
      });
    },
    async getData() {
      if (!this.user) return;

      const res = await request({
        url: `user/${this.user._id}/todo`,
        method: "GET",
        params: {
          page: this.page,
          pageSize: this.pageSize,
        },
      });
      console.log("res", res);

      this.list = res.data.list;
      this.total = res.data.total;
    },
    onPageChange(page: number) {
      this.page = page;
    },
    onShowSizeChange(page: number, pageSize: number) {
      this.page = page;
      this.pageSize = pageSize;
    },
    onDelete(item: Todo) {
      this.list.splice(this.list.indexOf(item), 1);
    },
  },
});
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.logo {
  color: white;
  font-weight: 300;
  letter-spacing: 8px;
  font-size: 22px;
}

.todo-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
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
