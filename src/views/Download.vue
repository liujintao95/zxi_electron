<template>
  <div class="download">
    <div>
      <el-button-group>
        <el-button @click="selectionStart" icon="el-icon-download" size="small">下载</el-button>
        <el-button @click="selectionPause" icon="el-icon-video-pause" size="small">暂停</el-button>
        <el-button @click="selectioncancel" icon="el-icon-delete" size="small">取消</el-button>
      </el-button-group>
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
            <el-progress :percentage="scope.row.progress" v-if="scope.row.progress!==100"></el-progress>
            <el-progress :percentage="scope.row.progress" v-else status="success"></el-progress>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
          align="center">
          <template slot-scope="scope">
            <el-button @click="startDownload(scope.row)" type="text" size="small">下载</el-button>
            <el-button @click="pauseDownload(scope.row)" type="text" size="small">暂停</el-button>
            <el-button @click="cancelDownload(scope.row)" type="text" size="small">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Download',
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
      multipleSelection: [],
    };
  },
  methods: {
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
    startDownload(row){
      console.log(row)
    },
    pauseDownload(row){
      console.log(row)
    },
    cancelDownload(row){
      console.log(row)
    },
  }
}
</script>

<style>
.download{
  margin: 20px;
}
</style>