<template>
  <div class="networkdisk">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">个人资料</a></el-breadcrumb-item>
        <el-breadcrumb-item>文件</a></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="content">
      <Dir class="file_list" @open="openDir" v-for="(msg, index) in dir_list" v-bind:msg="msg" :key="index"></Dir>
      <File class="file_list" @open="openFile" v-for="(msg, index) in file_list" v-bind:msg="msg" :key="index+'file'"></File>
    </div>
  </div>
</template>

<script>
import File from '@/components/File.vue'
import Dir from '@/components/Dir.vue'
export default {
  name: 'NetworkDisk',
  components: {
    File,
    Dir
  },
  data() {
    return {
      imgDir: require("../assets/dir.png"),
      dir_list: [],
      file_list: [],
      cur_dir: {
        path: "",
        id: 0
      }
    };
  },
  methods: {
    filesShow(){
      this.$axios.get("/zxi/auth/file/show", 
      {
        params: {
          path: this.cur_dir.path,
          dir_id: this.cur_dir.id,
        }
      })
      .then((response) => {
        let data = response.data
        this.dir_list = data.dir_list
        this.file_list = data.file_list
      })
      .catch((error) => {
        console.log(error);
      });
    },
    openDir(msg){
      console.log("open:", msg.Name)
    },
    openFile(msg){

    }
  },

  mounted() {
    this.filesShow()
  },
}
</script>

<style>
.networkdisk{
  margin: 20px;
}
.header{
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgb(224, 223, 223);
}
.file_list{
  width: 120px;
  margin: 0 10px;
  float: left;
}
</style>