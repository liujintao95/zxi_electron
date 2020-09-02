<template>
  <div class="dir" @mouseleave="iconShow=false" @mouseenter="iconShow=true" @dblclick="openFile">
    <div class='file_img'>
      <img :src="imgDir" width="100px" height="100px"/>
    </div>
    <div class="text" :title="msg.Name" @click="openFile">{{ msg.Name }}</div>
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
  name: "dir",
  components: {
    File,
  },
  props:{
    msg: {
      type: Object,
    }
  },
  data() {
    return {
      iconShow:false,
      imgDir: require("../assets/dir.png"),
    };
  },
  methods: {
    openFile(){
      this.$emit('open', this.msg);
    },
    downloadFile(){
      console.log('下载文件夹')
    },
    moveFile(){
      console.log('移动文件夹')
    },
    renameFile(){
      console.log('重命名文件夹')
    },
    deleteFile(){
      console.log('删除文件夹')
    },
  }
};
</script>

<style>
.dir{
  text-align: center;
  padding: 10px;
}
.dir:hover{
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