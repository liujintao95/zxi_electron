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
            <el-button v-if="!scope.row['Uploading'] && !scope.row['IsComplete']" @click="startUpload(scope.row)" type="text" size="small">上传</el-button>
            <el-button v-else-if="scope.row['Uploading'] && !scope.row['IsComplete']" @click="pauseUpload(scope.row)" type="text" size="small">暂停</el-button>
            <el-button v-if="!scope.row['IsComplete']" @click="cancelUpload(scope.row)" type="text" size="small">取消</el-button>
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
      tableData: [],
      multipleSelection: [],
      total: 100,
      page_size: 10,
      cpage: 1,
      interval_map: {}
    };
  },
  methods: {
    pageChange(page){
      this.cpage = page
      this.showUploads()
    },
    uploadLocalFile(upload_id, file_name, local_path) {
      this.showUploadInfo(upload_id).then(data=>{
        if(data["IsComplete"] === 0){
          let states = this.$file.fileInfo(local_path)
          if (states.size < 1024*1024){
            this.uploadSmallFile(upload_id, local_path).then(()=>{
              this.showUploads()
              this.$message.success(`${file_name} 上传成功`)
            }).catch(err=>{
              console.log(err)
            })
          } else {
            this.uploadBigFile(upload_id, local_path, data["BlockSize"], data["BlockList"]).then(() => {
              this.showUploads()
              this.$message.success(`${file_name} 上传成功`)
            }).catch(err => {
              console.log(err)
            })
            this.interval_map[upload_id] = setInterval(this.showProgress, 3000, upload_id)
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    async uploadBigFile(upload_id, local_path, block_size, block_list){
      let stream = this.$file.createFileStream(local_path, block_size)
      for(let i=0; i<this.tableData.length; i++){
        if(this.tableData[i]["Id"] === upload_id){
          this.tableData[i]["stream"] = stream
        }
      }
      await this.$file.uploadFileStream(stream, upload_id, block_list)

    },
    async uploadSmallFile(upload_id, local_path){
      let file = this.$file.readSmallFile(local_path)
      let formData = new FormData()
      let headers = formData.getHeaders()

      formData.append('id', upload_id)
      formData.append('file', file)
      await this.$axios.post(
          "/zxi/auth/upload/file",
          formData,
          {headers}
      )
    },
    uploadStart(){
      for (let upload_info of this.tableData){
        if (upload_info["Uploading"] && !upload_info["IsComplete"]){
          this.uploadLocalFile(
              upload_info["Id"], upload_info["Name"], upload_info["LocalPath"])
        }
      }
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    selectionStart() {},
    selectionPause() {},
    selectionCancel() {},
    startUpload(row) {
      this.uploadLocalFile(row['Id'], row["Name"], row['LocalPath'])
    },
    pauseUpload(row) {
      console.log(row);
      row["stream"].emit("end")
      clearInterval(this.interval_map[row['Id']])
    },
    cancelUpload(row) {
      console.log(row);
    },
    saveFile(path) {
      this.$file.getFilesList(path).then(data=>{
        this.$axios
            .post("/zxi/auth/file/savefileinfo", data[0])
            .then(() => {
              this.cpage = 1
              this.showUploads()
            })
            .catch((error) => {
              console.log(error);
            });
      })
    },
    saveDir(path) {
      this.$file.getFilesList(path).then(data=>{
        this.$axios
            .post("/zxi/auth/file/savefilesinfo",
                {
                  files: data,
                  root: path
                }
            )
            .then(() => {
              this.cpage = 1
              this.showUploads()
            })
            .catch((error) => {
              console.log(error);
            })
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
    async showUploadInfo(upload_id){
      let response = await this.$axios.get(
          "/zxi/auth/upload/info", {
            params:{
              id: upload_id
            }
          }
      )
      return response.data["upload_info"]
    },
    showUploads(){
      this.$axios.get(
          "/zxi/auth/upload/show", {
            params:{
              page: this.cpage,
              size: this.page_size
            }
          }
      ).then((response) => {
        let data = response.data
        this.total = data["count"]
        this.tableData = data["upload_list"]
      }).catch((error) => {
        console.log(error);
      });
    },
    showProgress(upload_id){
      this.$axios.get(
          "/zxi/auth/upload/progress", {
            params:{
              id: upload_id
            }
          }
      ).then((response) => {
        let progress = response.data["progress"]
        for(let i=0; i<this.tableData.length; i++){
          if(this.tableData[i]["Id"] === upload_id){
            this.tableData[i]["Progress"] = progress
          }
        }
        if (progress === 100){
          clearInterval(this.interval_map[upload_id])
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    openUpload(){
      this.$axios.get(
          "/zxi/auth/upload/show", {
            params:{
              page: this.cpage,
              size: this.page_size
            }
          }
      ).then((response) => {
        let data = response.data
        this.total = data["count"]
        this.tableData = data["upload_list"]
        this.uploadStart()
      }).catch((error) => {
        console.log(error);
      });
    }
  },
  mounted() {
    this.openUpload()
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