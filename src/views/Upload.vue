<template>
  <div class="upload">
    <div>
      <el-button-group>
        <el-button @click="selectionStart" icon="el-icon-upload2" size="small">开始</el-button>
        <el-button @click="selectionPause" icon="el-icon-video-pause" size="small">暂停</el-button>
        <el-button @click="selectionCancel" icon="el-icon-delete" size="small">取消</el-button>
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
    <div style="height: 100%">
      <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          height="85%"
          style="width: 100%;"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="文件名"></el-table-column>
        <el-table-column prop="size_fmt" label="大小" width="120"></el-table-column>
        <el-table-column prop="progress" label="进度条" width="240">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.progress" v-if="scope.row.progress!==100"></el-progress>
            <el-progress :percentage="scope.row.progress" v-else status="success"></el-progress>
          </template>
        </el-table-column>
        <el-table-column prop="rate" label="上传速率" width="120"></el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button v-if="!scope.row['uploading'] && !scope.row['is_complete']" @click="startUpload(scope.row)"
                       type="text" size="small">上传
            </el-button>
            <el-button v-else-if="scope.row['uploading'] && !scope.row['is_complete']" @click="pauseUpload(scope.row)"
                       type="text" size="small">暂停
            </el-button>
            <el-button v-if="!scope.row['is_complete']" @click="cancelUpload(scope.row)" type="text" size="small">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="text-align: center; margin-top: 20px">
        <el-pagination
            @current-change="pageChange"
            layout="prev, pager, next"
            :total=total
            :page-size=page_size
            :current-page=cpage>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
const ipcRenderer = window.require("electron").ipcRenderer;
export default {
  name: "Upload",
  data() {
    return {
      timeout: 3000,
      tableData: [],
      multipleSelection: [],
      total: 100,
      page_size: 10,
      cpage: 1,
      interval_map: {}
    };
  },
  methods: {
    pageChange(page) {
      this.cpage = page
      this.showUploadTable()
    },
    uploadLocalFile(upload_id, file_name, local_path) {
      this.showUploadInfo(upload_id).then(data => {
        let upload = data["upload_info"]["upload_map"]
        let block_list = data["upload_info"]["block_list"]
        if (upload["is_complete"] === 0) {
          this.uploadFile(upload_id, local_path, upload["block_size"], block_list)
              .catch(err => {
                console.log(err)
              })
          this.interval_map[upload_id] = setInterval(this.showProgress, this.timeout, upload_id)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    async uploadFile(upload_id, local_path, block_size, block_list) {
      let stream = this.$file.createFileStream(local_path, block_size)
      this.$stream_map[upload_id] = stream
      await this.$file.uploadFileStream(stream, upload_id, block_list)
    },
    uploadCheck() {
      for (let upload_info of this.tableData) {
        if (upload_info["uploading"] && !upload_info["is_complete"] && !this.$stream_map[upload_info["id"]]) {
          this.uploadLocalFile(
              upload_info["id"], upload_info["name"], upload_info["local_path"])
        }
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    selectionStart() {
      for (let row of this.multipleSelection){
        this.startUpload(row)
      }
    },
    selectionPause() {
      for (let row of this.multipleSelection){
        this.pauseUpload(row)
      }
    },
    selectionCancel() {
      for (let row of this.multipleSelection){
        this.cancelUpload(row)
      }
    },
    startUpload(row) {
      if (!row["uploading"] && !row["is_complete"]) {
        let form = new FormData()
        form.append('upload_id', row["id"])
        this.$axios
            .post(
                "/zxi/auth/upload/start",
                form
            )
            .then(() => {
              this.showUploadTable()
            })
            .catch((error) => {
              console.log(error);
            });
      }
    },
    pauseUpload(row) {
      if (row["uploading"] && !row["is_complete"]) {
        let form = new FormData()
        form.append('upload_id', row["id"])
        this.$axios
            .post(
                "/zxi/auth/upload/pause",
                form
            )
            .then(() => {
              this.$stream_map[row['id']].emit("end")
              delete this.$stream_map[row['id']]
              clearInterval(this.interval_map[row['id']])
              this.showUploadTable()
            })
            .catch((error) => {
              console.log(error);
            });
      }
    },
    cancelUpload(row) {
      if (!row["is_complete"]) {
        let form = new FormData()
        form.append('upload_id', row["id"])
        this.$axios
            .post(
                "/zxi/auth/upload/cancel",
                form
            )
            .then(() => {
              if (row["stream"]) {
                row["stream"].emit("end")
                clearInterval(this.interval_map[row['id']])
              }
            })
            .catch((error) => {
              console.log(error);
            });
      }
    },
    saveFile(path) {
      this.$file.getFilesList(path).then(data => {
        let form = new FormData()
        form.append('size', data[0]["size"])
        form.append('hash', data[0]["hash"])
        form.append('name', data[0]["name"])
        form.append('path', data[0]["path"])
        this.$axios
            .post(
                "/zxi/auth/upload/create",
                form
            )
            .then(() => {
              this.cpage = 1
              this.showUploadTable()
            })
            .catch((error) => {
              console.log(error);
            });
      })
    },
    saveDir(path) {
      this.$file.getFilesList(path).then(async data => {
        for (let file_info of data) {
          let form = new FormData()
          form.append('size', file_info["size"])
          form.append('hash', file_info["hash"])
          form.append('name', file_info["name"])
          form.append('path', file_info["path"])
          form.append('root', path)
          try {
            await this.$axios.post(
                "/zxi/auth/upload/create",
                form
            )
            this.cpage = 1
            this.showUploadTable()
          } catch (err) {
            console.log(err)
          }
        }
      })
    },
    openDoalog(type) {
      let _this = this;
      let ipc = ipcRenderer;
      if (type === "file") {
        ipc.send("open-directory-dialog", "openFile");
      } else {
        ipc.send("open-directory-dialog", "openDirectory");
      }
      ipc.once("selectedItem", function (event, path) {
        if (path && type === "file") {
          _this.saveFile(path);
        } else if (path) {
          _this.saveDir(path);
        }
      });
    },
    async showUploadInfo(upload_id) {
      let response = await this.$axios.get(
          "/zxi/auth/upload/info", {
            params: {
              upload_id: upload_id
            }
          }
      )
      return response.data
    },
    showUploadTable() {
      this.$axios.get(
          "/zxi/auth/upload/show", {
            params: {
              page: this.cpage,
              size: this.page_size
            }
          }
      ).then((response) => {
        let data = response.data
        this.total = data["count"]
        this.tableData = []
        for (let upload of data["upload_list"]) {
          upload.size_fmt = this.strSize(upload["size"])
          this.tableData.push(upload)
        }
        this.uploadCheck()
      }).catch((error) => {
        console.log(error);
      });
    },
    showProgress(upload_id) {
      this.$axios.get(
          "/zxi/auth/upload/progress", {
            params: {
              upload_id: upload_id
            }
          }
      ).then((response) => {
        let progress = response.data["progress"]
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i]["id"] === upload_id) {
            if (parseInt(progress) === 100) {
              this.tableData[i]["rate"] = ""
              this.tableData[i]["progress"] = progress
              this.tableData[i]["uploading"] = 0
              this.tableData[i]["is_complete"] = 1
              clearInterval(this.interval_map[upload_id])
            } else {
              let diff_value = progress - this.tableData[i]["progress"]
              if (diff_value > 0) {
                let rate = (diff_value / 100) * this.tableData[i]["size"] / (this.timeout / 1000)
                this.tableData[i]["rate"] = this.strSize(rate)
              }
              this.tableData[i]["progress"] = parseFloat(progress.toFixed(1))
            }
          }
        }
      }).catch((error) => {
        clearInterval(this.interval_map[upload_id])
        console.log(error);
      });
    },
    strSize(size) {
      let unitList = ["B", "KB", "MB", "GB", "TB"]
      let index = 0
      while (size > 1024) {
        index++
        size = size / 1024
      }
      return `${size.toFixed(2)}${unitList[index]}`
    }
  },
  mounted() {
    this.showUploadTable()
  }
};
</script>

<style>
.upload {
  margin: 20px;
  height: 90%;
}

.but_right {
  float: right;
}
</style>