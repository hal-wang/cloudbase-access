<template>
  <div class="todo-item-container">
    <div class="content">
      {{ todo.content }}
    </div>

    <a-row type="flex" align="middle">
      <a-col>
        <a-space>
          <a-icon type="edit" />
          <span>{{ updateAt }}</span>
        </a-space>
      </a-col>
      <a-col flex="auto"></a-col>
      <a-col>
        <a-space>
          <a-icon type="clock-circle" />
          <span>{{ schedule }}</span>
        </a-space>
      </a-col>
    </a-row>

    <a-button
      type="link"
      icon="delete"
      class="delete-btn"
      @click.stop="handleDelete"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";

export default Vue.extend({
  props: {
    todo: {
      type: Object,
      required: true,
    },
  },
  computed: {
    updateAt() {
      return moment(this.todo.update_at).format("YYYY-MM-DD HH:mm:ss");
    },
    schedule() {
      return moment(this.todo.schedule).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  methods: {
    async handleDelete() {
      this.$emit("delete");
    },
  },
});
</script>

<style lang="scss" scoped>
.todo-item-container {
  background-color: white;
  width: 600px;
  padding: 10px;
  font-weight: 300;
  position: relative;
  margin-bottom: 1px;
  cursor: pointer;

  .content {
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 1px;
    font-weight: 400;
    word-wrap: break-word;
    margin-bottom: 14px;
    margin-right: 16px;
  }

  .delete-btn {
    position: absolute;
    right: 1px;
    top: 1px;
    color: red;
  }
}
</style>
