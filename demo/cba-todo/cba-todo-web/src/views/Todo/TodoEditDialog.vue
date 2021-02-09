<template>
  <div>
    <a-modal
      v-model="visible"
      :title="todo ? 'Edit TODO' : 'Add TODO'"
      okText="Submit"
      :confirm-loading="submitLoading"
      @ok="handleSubmit"
    >
      <div>
        <a-form-model :model="formData">
          <a-form-model-item>
            <a-textarea
              v-model="formData.content"
              placeholder="Content"
              :auto-size="{ minRows: 3, maxRows: 8 }"
            />
          </a-form-model-item>

          <a-form-model-item>
            <a-space>
              <a-icon type="clock-circle"></a-icon>
              <a-date-picker v-model="formData.date"> </a-date-picker>
              <a-time-picker v-model="formData.time"> </a-time-picker>
            </a-space>
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import Todo from "@/models/Todo";
import Vue from "vue";
import moment from "moment";
import request from "@/utils/request";
import User from "@/models/User";

export default Vue.extend({
  data() {
    return {
      visible: false,
      todo: null as Todo | null,

      formData: {
        content: "",
        date: moment(),
        time: moment(),
      },
      submitLoading: false,
    };
  },
  computed: {
    user(): User {
      return this.$store.state.user.user;
    },
    schedule: {
      get(): number {
        return moment(
          this.formData.date.format("YYYY-MM-DD") +
            " " +
            this.formData.time.format("HH:mm:ss")
        ).valueOf();
      },
      set(val: number): void {
        this.formData.date = moment(moment(val).format("YYYY-MM-DD"));
        this.formData.time = moment(
          moment(val).valueOf() -
            this.formData.date.valueOf() +
            moment(moment().format("YYYY-MM-DD")).valueOf()
        );
      },
    },
  },
  methods: {
    $init(todo: Todo | null): void {
      this.todo = todo;

      this.formData.content = todo ? todo.content : "";
      this.schedule = todo ? todo.schedule : moment().valueOf();

      this.visible = true;
    },
    async handleSubmit() {
      if (!this.formData.content) {
        this.$message.warning("Please input content!");
        return;
      }
      if (!this.formData.date) {
        this.$message.warning("Please select date!");
        return;
      }
      if (!this.formData.time) {
        this.$message.warning("Please select time!");
        return;
      }

      const formObj = {
        schedule: this.schedule,
        content: this.formData.content,
      };
      this.submitLoading = true;
      try {
        if (this.todo) {
          const res = await request.patch(
            `todo/${this.user._id}/${this.todo._id}`,
            formObj
          );
          this.$emit("edit", res.data, this.todo);
        } else {
          const res = await request.post(`user/${this.user._id}/todo`, formObj);
          this.$emit("add", res.data);
        }
      } finally {
        this.submitLoading = false;
      }

      this.visible = false;
    },
  },
});
</script>
