<template>
  <a-layout v-if="user" class="layout todo-container">
    <a-layout-header>
      <Header @add="handleAddTodo" />
    </a-layout-header>
    <a-layout-content>
      <div>
        <div class="todo-items">
          <TodoItem
            v-for="todo in list"
            :key="todo._id"
            :todo="todo"
            @delete="onDelete(todo)"
            @click.native.stop="handleEditTodo(todo)"
          ></TodoItem>
        </div>
        <div class="pagination">
          <a-pagination
            :loading="true"
            show-size-changer
            show-quick-jumper
            :default-current="page"
            :total="total"
            :pageSize="pageSize"
            @change="onPageChange"
            @showSizeChange="onShowSizeChange"
          />
        </div>
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      cba-todo ©2021 Created by hal.wang
    </a-layout-footer>

    <TodoEditDialog ref="todoEditDialog" @add="onTodoAdd" @edit="onTodoEdit" />
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
    TodoEditDialog: () => import("./TodoEditDialog.vue"),
    Header: () => import("./Header.vue"),
  },
  data() {
    return {
      list: [] as Todo[],
      total: 0,
      page: 1,
      pageSize: 10,
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

      this.list = res.data.list;
      this.total = res.data.total;
    },
    onPageChange(page: number) {
      this.page = page;
      this.getData();
    },
    onShowSizeChange(page: number, pageSize: number) {
      this.page = page;
      this.pageSize = pageSize;
      this.getData();
    },
    onDelete(item: Todo) {
      this.list.splice(this.list.indexOf(item), 1);
      this.total--;
      if (!this.list.length) {
        this.getData();
      }
    },
    handleAddTodo() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.$refs.todoEditDialog as any).$init();
    },
    handleEditTodo(todo: Todo) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.$refs.todoEditDialog as any).$init(todo);
    },
    onTodoAdd(todo: Todo) {
      this.list.splice(0, 0, todo);
      this.total++;
    },
    onTodoEdit(todo: Todo, oldTodo: Todo) {
      this.list.splice(this.list.indexOf(oldTodo), 1);
      this.list.splice(0, 0, todo);
    },
  },
});
</script>

<style lang="scss" scoped>
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
