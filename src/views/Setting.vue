<template>
  <div class="setting">
    <div class="content">
      <el-form ref="form" :model="form" label-width="120px" class="option_form">
        <div class="option_content">
          <el-form-item label="下载文件地址">
            <el-input placeholder="请输入内容" v-model="form.download_path" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="loaclFile"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="上传并发任务数">
            <el-input-number v-model="form.upload_num" :min="1" :max="10"></el-input-number>
          </el-form-item>
          <el-form-item label="下载并发任务数">
            <el-input-number v-model="form.download_num" :min="1" :max="10"></el-input-number>
          </el-form-item>
          <el-form-item label="下载完成关机">
            <el-switch v-model="form.shutdown"></el-switch>
          </el-form-item>
          <el-form-item label="上传传输速率">
            <el-radio-group v-model="form.upload_restrictions">
              <el-radio label="无限制"></el-radio>
              <el-radio label="限数为"></el-radio>
            </el-radio-group>
            <el-input placeholder v-model="form.upload_rate" :disabled="form.upload_restrictions=='无限制'" class="input-rate"></el-input>KB/s
          </el-form-item>
          <el-form-item label="下载传输速率">
            <el-radio-group v-model="form.download_restrictions">
              <el-radio label="无限制"></el-radio>
              <el-radio label="限数为"></el-radio>
            </el-radio-group>
            <el-input placeholder v-model="form.download_rate" :disabled="form.download_restrictions=='无限制'" class="input-rate"></el-input>KB/s
          </el-form-item>
        </div>
        <el-form-item>
          <el-button
            type="primary"
            style="float: right; width: 100px; margin-right:100px"
            @click="onSubmit"
            :disabled="isObjectValueEqual(init_form, form)"
          >保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Setting",
  props: {},
  data() {
    return {
      init_form: {
        download_path:
          "C:\\Users\\LoveTt\\Desktop\\ZXi_Net_Disk\\zxi_network_disk_electron",
        upload_num: 5,
        download_num: 5,
        shutdown: false,
        upload_restrictions: "无限制",
        upload_rate: 0,
        download_restrictions: "无限制",
        download_rate: 0,
      },
      form: {
        download_path:
          "C:\\Users\\LoveTt\\Desktop\\ZXi_Net_Disk\\zxi_network_disk_electron",
        upload_num: 5,
        download_num: 5,
        shutdown: false,
        upload_restrictions: "无限制",
        upload_rate: 0,
        download_restrictions: "无限制",
        download_rate: 0,
      },
    };
  },
  methods: {
    isObjectValueEqual(a, b) {
      var aProps = Object.getOwnPropertyNames(a);
      var bProps = Object.getOwnPropertyNames(b);

      if (aProps.length != bProps.length) {
        return false;
      }

      for (var i = 0; i < aProps.length; i++) {
        if (aProps[i].startsWith("__")) {
          continue;
        }
        var propName = aProps[i];
        var propA = a[propName];
        var propB = b[propName];
        if (propA !== propB) {
          return false;
        }
      }
      return true;
    },
    loaclFile() {
      console.log("显示路径");
    },
    onSubmit() {
      console.log("submit!");
    },
  },
  mounted() {},
};
</script>

<style scoped>
.setting {
  margin: 30px;
  height: 90%;
}
.content {
  height: 100%;
}
.option_form {
  height: 100%;
}
.input {
  width: 80%;
}
.item {
  margin: 30px 0;
}
.input-rate {
  margin-left: 5px;
  width: 80px;
}
.option_content {
  height: 90%;
}
</style>
