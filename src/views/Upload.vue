<template>
  <div class="upload">
    <div>
      <el-button-group>
        <el-button @click="selectionStart" icon="el-icon-upload2" size="small">开始</el-button>
        <el-button @click="selectionPause" icon="el-icon-video-pause" size="small">暂停</el-button>
        <el-button @click="selectioncancel" icon="el-icon-delete" size="small">取消</el-button>
      </el-button-group>
      <el-dropdown @command="openDoalog" class="but_right">
        <el-button type="primary">
          上传文件
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="file">选择文件</el-dropdown-item>
          <el-dropdown-item command="dir">选择文件夹</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <el-button type="primary" class="but_right" @click="uploadLoaclFile">上传本地文件<i class="el-icon-upload el-icon--right"></i></el-button> -->
    </div>
    <div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="Name" label="文件名"></el-table-column>
        <el-table-column prop="Size" label="大小" width="120"></el-table-column>
        <el-table-column prop="Progress" label="进度条" width="240">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.Progress" v-if="scope.row.Progress!==100"></el-progress>
            <el-progress :percentage="scope.row.Progress" v-else status="success"></el-progress>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button @click="startUpload(scope.row)" type="text" size="small">上传</el-button>
            <el-button @click="pauseUpload(scope.row)" type="text" size="small">暂停</el-button>
            <el-button @click="cancelUpload(scope.row)" type="text" size="small">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
const ipcRenderer = window.require("electron").ipcRenderer;
export default {
  name: "Upload",
  data() {
    return {
      tableData: [],
      multipleSelection: [],
    };
  },
  methods: {
    uploadLoaclFile() {},
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    selectionStart() {},
    selectionPause() {},
    selectioncancel() {},
    startUpload(row) {
      console.log(row);
    },
    pauseUpload(row) {
      console.log(row);
    },
    cancelUpload(row) {
      console.log(row);
    },

    uploadFile(path) {
      this.$file.getFilesList(path).then((data) => {
        this.$axios
          .post("/zxi/auth/file/savefileinfo", data[0])
          .then((response) => {
            this.showUploads()
          })
          .catch((error) => {
            console.log(error);
          });
      });
    },

    uploadDir(path) {
      this.$file.getFilesList(path).then((data) => {
        console.log(data)
        this.$axios
          .post("/zxi/auth/file/savefilesinfo",
              {
                files: data,
                root: path
              }
          )
          .then((response) => {
            this.showUploads()
          })
          .catch((error) => {
            console.log(error);
          });
      });
    },

    openDoalog(type) {
      let _this = this;
      let ipc = ipcRenderer;
      let result = [];
      if (type === "file") {
        ipc.send("open-directory-dialog", "openFile");
      } else {
        ipc.send("open-directory-dialog", "openDirectory");
      }
      ipc.once("selectedItem", function (event, path) {
        if (path && type === "file") {
          _this.uploadFile(path);
        } else if (path) {
          _this.uploadDir(path);
        }
      });
    },
    showUploads(){
      this.$axios.get(
          "/zxi/auth/file/showuploads"
      ).then((response) => {
        console.log(response)
        let data = response.data
        this.tableData = data.upload_list
      }).catch((error) => {
        console.log(error);
      });
    },
  },
  mounted() {
    this.showUploads()
  }
};
</script>

<style>
.upload {
  margin: 20px;
}
.but_right {
  float: right;
}
</style>