<template>
  <div class="download">
    <div>
      <el-button-group>
        <el-button @click="selectionStart" icon="el-icon-download" size="small">下载</el-button>
        <el-button @click="selectionPause" icon="el-icon-video-pause" size="small">暂停</el-button>
        <el-button @click="selectionCancel" icon="el-icon-delete" size="small">取消</el-button>
      </el-button-group>
    </div>
    <div style="height: 100%">
      <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          height="85%"
          style="width: 100%"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="name"
            label="文件名">
        </el-table-column>
        <el-table-column
            prop="size_fmt"
            label="大小"
            width="120">
        </el-table-column>
        <el-table-column
            prop="progress"
            label="进度条"
            width="240">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.progress" v-if="scope.row.progress!==100"></el-progress>
            <el-progress :percentage="scope.row.progress" v-else status="success"></el-progress>
          </template>
        </el-table-column>
        <el-table-column prop="rate" label="下载速率" width="120"></el-table-column>
        <el-table-column
            label="操作"
            width="150"
            align="center">
          <template slot-scope="scope">
            <el-button v-if="!scope.row['downloading'] && !scope.row['is_complete']" @click="startDownload(scope.row)" type="text" size="small">下载</el-button>
            <el-button v-else-if="scope.row['downloading'] && !scope.row['is_complete']" @click="pauseDownload(scope.row)" type="text" size="small">暂停</el-button>
            <el-button v-if="!scope.row['is_complete']" @click="cancelDownload(scope.row)" type="text" size="small">取消</el-button>
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
export default {
  name: 'Download',
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
      this.showDownloadTable()
    },
    downloadZXiFile(download_id, file_name, local_path){
      this.showDownloadInfo(download_id).then(data=>{
        let download = data["download_info"]
        if (download["is_complete"] === 0) {
          this.downloadFile(download_id, local_path, download["block_size"], download["block_list"])
              .catch(err => {
              })
          this.interval_map[download_id] = setInterval(this.showProgress, this.timeout, download_id)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    async downloadFile(download_id, local_path, block_size, block_list) {
      let stream = this.$file.createWriteStream(local_path, block_size)
      this.$stream_map[download_id] = stream
      await this.$file.downloadFileStream(stream, download_id, block_list)
    },
    downloadCheck() {
      for (let download_info of this.tableData) {
        if (download_info["downloading"] && !download_info["is_complete"]) {
          this.downloadZXiFile(
              download_info["id"], download_info["name"], download_info["local_path"])
        }
      }
    },
    handleSelectionChange(val) {
      console.log(val)
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
    startDownload(row) {
      if (!row["downloading"] && !row["is_complete"]) {
        let form = new FormData()
        form.append('download_id', row["id"])
        this.$axios
            .post(
                "/zxi/auth/download/start",
                form
            )
            .then(() => {
              this.showDownloadTable()
            })
            .catch((error) => {
              console.log(error);
            });
      }
    },
    pauseDownload(row) {
      if (row["downloading"] && !row["is_complete"]) {
        let form = new FormData()
        form.append('download_id', row["id"])
        this.$axios
            .post(
                "/zxi/auth/download/pause",
                form
            )
            .then(() => {
              this.$stream_map[row['id']].emit("end")
              delete this.$stream_map[row['id']]
              clearInterval(this.interval_map[row['id']])
              this.showDownloadTable()
            })
            .catch((error) => {
              console.log(error);
            });
      }
    },
    cancelDownload(row) {
      if (!row["is_complete"]) {
        let form = new FormData()
        form.append('download_id', row["id"])
        this.$axios
            .post(
                "/zxi/auth/download/cancel",
                form
            )
            .then(() => {
              if (row["downloading"]) {
                clearInterval(this.interval_map[row['id']])
              }
            })
            .catch((error) => {
              console.log(error);
            });
      }
    },
    showDownloadTable() {
      this.$axios.get(
          "/zxi/auth/download/show", {
            params: {
              page: this.cpage,
              size: this.page_size
            }
          }
      ).then((response) => {
        let data = response.data
        this.total = data["count"]
        this.tableData = []
        for (let download of data["download_list"]) {
          download.size_fmt = this.strSize(download["size"])
          this.tableData.push(download)
        }
        this.downloadCheck()
      }).catch((error) => {
        console.log(error);
      });
    },
    showProgress(download_id) {
      this.$axios.get(
          "/zxi/auth/download/progress", {
            params: {
              download_id: download_id
            }
          }
      ).then((response) => {
        let progress = response.data["progress"]
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i]["id"] === upload_id) {
            if (parseInt(progress) === 100) {
              this.tableData[i]["rate"] = ""
              this.tableData[i]["progress"] = progress
              this.tableData[i]["downloading"] = 0
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
        clearInterval(this.interval_map[download_id])
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
  mounted(){
    this.showDownloadTable()
  }
  
}
</script>

<style>
.download {
  margin: 20px;
  height: 90%;
}

</style>