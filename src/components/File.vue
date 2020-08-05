<template>
  <div class="file" @mouseleave="iconShow=false" @mouseenter="iconShow=true" @dblclick="openFile">
    <div class='file_img'>
      <img :src="imgDir" width="100px" height="100px"/>
    </div>
    <div class="text" title="文件名" @click="openFile">文件名</div>
    <div v-show="iconShow">
      <i class="el-icon-download icon" title="下载" @click="downloadFile"></i>
      <i class="el-icon-right icon" title="移动" @click="moveFile"></i>
      <i class="el-icon-edit icon" title="重命名" @click="renameFile"></i>
      <i class="el-icon-delete icon" title="删除" @click="deleteFile"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "File",
  components: {
    File,
  },
  data() {
    return {
      iconShow:false,
      imgDir: require("../assets/dir.png"),
    };
  },
  methods: {
    openFile(){
      console.log('打开文件夹')
    },
    downloadFile(){
      console.log('下载文件')
    },
    moveFile(){
      console.log('移动文件')
    },
    renameFile(){
      console.log('重命名文件')
    },
    deleteFile(){
      console.log('删除文件')
    },
  }
};
</script>

<style>
.file{
  text-align: center;
  padding: 10px;
}
.file:hover{
  background: rgb(226, 226, 226);
}
.text{
  font-size: 16px;
  cursor:pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.text:hover{
  color: rgba(39, 161, 247);
}
.icon{
  font-size: 18px;
  margin: 0 5px;
  cursor:pointer;
}
</style>