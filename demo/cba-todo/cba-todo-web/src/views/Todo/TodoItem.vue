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

    <a-popconfirm
      title="Are you sure delete this todo?"
      ok-text="Yes"
      cancel-text="No"
      @confirm="ondeleteConfirm"
    >
      <a-button
        :loading="deleteLoading"
        type="link"
        icon="delete"
        class="delete-btn"
        @click.stop=""
      />
    </a-popconfirm>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
import request from "@/utils/request";
import User from "@/models/User";

export default Vue.extend({
  props: {
    todo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      deleteLoading: false,
    };
  },
  computed: {
    user(): User {
      return this.$store.state.user.user;
    },
    updateAt(): string {
      return moment(this.todo.update_at).format("YYYY-MM-DD HH:mm:ss");
    },
    schedule(): string {
      return moment(this.todo.schedule).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  methods: {
    async ondeleteConfirm() {
      this.deleteLoading = true;
      try {
        await request.delete(`todo/${this.user._id}/${this.todo._id}`);
        this.$emit("delete");
      } finally {
        this.deleteLoading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.todo-item-container {
  background-color: white;
  width: 600px;
  min-width: 340px;
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

@media only screen and (max-width: 600px) {
  .todo-item-container {
    width: 100%;
  }
}
</style>
