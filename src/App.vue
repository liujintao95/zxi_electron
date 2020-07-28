<template>
  <div id="app">
    <div id="nav">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" :router="true">
          <el-menu-item index="/">个人仓库</el-menu-item>
          <el-menu-item index="/public">公共仓库</el-menu-item>
          <el-menu-item index="/setting">设置</el-menu-item>
      </el-menu>
    </div>
    <router-view/>
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
      activeIndex: 'private',
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style>
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
  text-align: center;
  color: #2c3e50;
  min-width: 700px;
}
</style>
