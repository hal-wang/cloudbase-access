<template>
  <div id="app">
    <a-form-model
      ref="form"
      :model="form"
      class="form"
      layout="horizontal"
      :rules="rules"
    >
      <a-form-model-item label="url" prop="url">
        <a-input v-model="form.url" placeholder="long url" />
      </a-form-model-item>
      <a-form-model-item label="custom" prop="custom">
        <a-input v-model="form.custom" placeholder="custom short url" />
      </a-form-model-item>
      <a-form-model-item label="expiration">
        <a-date-picker
          v-model="form.expire"
          show-time
          type="date"
          placeholder="Expiration time"
          style="width: 100%"
        />
      </a-form-model-item>
      <a-form-model-item label="limit">
        <a-input-number
          v-model="form.limit"
          style="width: 100%"
          :min="0"
          placeholder="maximum number of calls"
        />
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" block :loading="creating" @click="onSubmit">
          Create
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Validate from "@/utils/Validate";
import request from "@/utils/request";

@Component
export default class extends Vue {
  validateUrl(rule: any, value: string, callback: Function) {
    if (value === "") {
      callback(new Error("Please input url"));
    } else {
      if (Validate.isUrl(value)) {
        callback();
      } else {
        callback(new Error("Incorrect url format"));
      }
    }
  }

  form = {
    url: "",
    custom: "",
    limit: "",
    expire: "",
  };
  creating = false;
  rules = {
    url: [
      {
        required: true,
        message: "Please input url",
        trigger: "blur",
      },
      { validator: this.validateUrl, trigger: "blur" },
    ],
  };

  onSubmit() {
    (this.$refs.form as any).validate(async (valid: boolean) => {
      if (!valid) return;

      let url: string;
      this.creating = true;
      try {
        const res = await request.get("", {
          params: this.form,
        });
        url = res.data.url;
      } finally {
        this.creating = false;
      }

      this.successNotify(url);
    });
  }

  successNotify(url: string) {
    const key = `open${Date.now()}`;
    this.$notification.success({
      message: "created",
      duration: 0,
      description: url,
      btn: (h: any) => {
        return h(
          "a-button",
          {
            props: {
              type: "primary",
              size: "small",
            },
            on: {
              click: () => {
                this.copy(url);
                this.$notification.close(key);
              },
            },
          },
          "copy"
        );
      },
      key,
      onClose: close,
    });
  }

  copy(content: string) {
    var aux = document.createElement("input");
    aux.setAttribute("value", content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
  }
}
</script>


<style lang="scss" scoped>
#app {
  height: 100%;
  width: 100%;

  .form {
    width: 400px;
    margin: 0 auto;
    padding-top: 40px;
  }

  @media screen and (orientation: portrait) {
    .form {
      width: 94%;
      margin-left: 3%;
    }
  }
}
</style>
