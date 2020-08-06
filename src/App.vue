<template>
  <div id="app">
    <div class="l_f">
      <el-menu
        class="el-menu-vertical-demo"
        @select="handleSelect" 
        :router="true"
        :default-active="activeIndex">
        <el-menu-item index="/">
          <i class="el-icon-s-cooperation"></i>
          <span slot="title">个人仓库</span>
        </el-menu-item>
        <el-submenu index="/download">
          <template slot="title">
            <i class="el-icon-upload"></i>
            <span>传输列表</span>
          </template>
            <el-menu-item index="/download">下载列表</el-menu-item>
            <el-menu-item index="/upload">上传列表</el-menu-item>
        </el-submenu>
        <el-menu-item index="/setting">
          <i class="el-icon-user-solid"></i>
          <span slot="title">个人设置</span>
        </el-menu-item>
      </el-menu>
    </div> 
    <div class="r_f">
      <router-view class="router_content"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  props: {
    msg: String
  },
  data () {
    return {
      activeIndex: '/',
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      this.activeIndex = key
      console.log(key, keyPath);
    }
  }
}
</script>

<style>
html, body{
  height: 100%;
  width: 100%;
}
body,div,ul,ol,dl,dt,dd,li,dl,h1,h2,h3,h4{
  margin:0;padding:0;
}
ol,ul,li{
  list-style:none;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-user-select: none;
  color: #2c3e50;
  min-width: 800px;
  height: 100%;
  width: 100%;
}
.el-row{
  height: 100%;
  width: 100%;
}
.el-col{
  height: 100%;
  width: 100%;
}
.el-menu-vertical-demo{
  height: 100%;
  width: 100%;
  
}
.el-menu-item{
  font-size: 16px;
}
.l_f{
  float: left;
  width: 200px;
  height: 100%;
}
.r_f{
  float: right;
  width: calc(100% - 200px);
  height: 100%;
}
</style>
