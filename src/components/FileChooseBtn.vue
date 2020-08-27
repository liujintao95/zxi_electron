<template>
  <el-button v-bind="$attrs" v-on="btnListeners">{{caption}}</el-button>
</template>

<script>
const ipcRenderer = window.electron.ipcRenderer;
export default {
  name: "FileChooseBtn",
  props: ["caption", "dir"],
  inheritAttrs: false,
  computed: {
    btnListeners() {
      let _this = this;
      let ipc = ipcRenderer;
      return Object.assign({}, this.$listeners, {
        click: function (event) {
          if (_this.dir != "file") {
            ipc.send("open-directory-dialog", "openDirectory");
          } else {
            ipc.send("open-directory-dialog", "openFile");
          }
          ipc.once("selectedItem", function (event, path) {
            _this.$emit("btnSelectItem", path);
          });
        },
      });
    },
  },
};
</script>

<style>
</style>