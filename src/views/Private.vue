<template>
  <div class="private">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">个人资料</a></el-breadcrumb-item>
        <el-breadcrumb-item>文件</a></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="content">
      <File class="file_list"></File>
      <File class="file_list"></File>
      <File class="file_list"></File>
    </div>
  </div>
</template>

<script>
import File from '@/components/File.vue'
export default {
  name: 'Private',
  components: {
    File
  },
  data() {
    return {
      imgDir: require("../assets/dir.png"),
    };
  },
  methods: {
  
  }
}
</script>

<style>
.header{
  margin: 20px 30px 0 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgb(224, 223, 223);
}
.content{
  margin: 20px 20px;
}
.file_list{
  width: 120px;
  margin: 0 10px;
  float: left;
}
</style>