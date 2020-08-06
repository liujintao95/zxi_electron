<template>
  <div class="upload">
    <div>
      <el-button-group>
        <el-button @click="selectionStart" icon="el-icon-upload2" size="small">上传</el-button>
        <el-button @click="selectionPause" icon="el-icon-video-pause" size="small">暂停</el-button>
        <el-button @click="selectioncancel" icon="el-icon-delete" size="small">取消</el-button>
      </el-button-group>
      <el-button type="primary" class="but_right" @click="uploadLoaclFile">上传本地文件<i class="el-icon-upload el-icon--right"></i></el-button>
    </div>
    <div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="file_name"
          label="文件名">
        </el-table-column>
        <el-table-column
          prop="file_size"
          label="大小"
          width="120">
        </el-table-column>
        <el-table-column
          prop="progress"
          label="进度条"
          width="240">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.progress" v-if="scope.row.progress!=100"></el-progress>
            <el-progress :percentage="scope.row.progress" v-else status="success"></el-progress>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
          align="center">
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
export default {
  name: 'Upload',
  components: {
  },
  data() {
    return{
      tableData: [{
        id: 1,
        file_name: '新建文件',
        file_size: '145KB',
        progress: 100
      }, {
        id: 2,
        file_name: '新建文件2',
        file_size: '425KB',
        progress: 34
      }],
      multipleSelection: []
    };
  },
  methods: {
    uploadLoaclFile(){

    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val;
    },
    selectionStart(){

    },
    selectionPause(){

    },
    selectioncancel(){

    },
    startUpload(row){
      console.log(row)
    },
    pauseUpload(row){
      console.log(row)
    },
    cancelUpload(row){
      console.log(row)
    },
  }
}
</script>

<style>
.upload{
  margin: 20px;
}
.but_right{
  float: right;
  width: 150px;
  margin-right: 50px;
}
</style>