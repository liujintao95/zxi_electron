<template>
  <div class="networkdisk">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><a @click="dirChange()">首页</a></el-breadcrumb-item>
        <el-breadcrumb-item v-for="item, index in history_list" :key="index+'breadcrumb'">
          <a @click="dirChange(item, index)">{{ item.name }}</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="content">
      <Dir class="file_list" @open="openDir" v-for="(msg, index) in dir_list" v-bind:msg="msg" :key="index"></Dir>
      <File class="file_list" @open="openFile" v-for="(msg, index) in file_list" v-bind:msg="msg"
            :key="index+'file'"></File>
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
        id: 0,
        path: "",
        name: "",
      },
      history_list: []
    };
  },
  methods: {
    filesShow() {
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
    openDir(msg) {
      console.log("befor", this.history_list)
      this.cur_dir.id = msg["id"]
      this.cur_dir.name = msg["name"]
      if (msg.path.charAt(msg["path"].length - 1) !== "/") {
        this.cur_dir.path = msg["path"] + "/" + msg["name"]
      } else {
        this.cur_dir.path = msg["path"] + msg["name"]
      }
      this.history_list.push({
        id: msg["id"],
        name: msg["name"],
        path: this.cur_dir["path"],
      })
      console.log(this.history_list)
      this.filesShow()
    },
    dirChange(item, index) {
      if (item) {
        this.cur_dir = {
          id: item["id"],
          path: item["path"],
          name: item["name"],
        }
        this.history_list = this.history_list.slice(0, index + 1)
      } else {
        this.history_list = []
        this.cur_dir = {
          id: 0,
          path: "",
          name: "",
        }
      }
      this.filesShow()
    },
    openFile(msg) {

    }
  },

  mounted() {
    this.filesShow()
  },
}
</script>

<style>
.networkdisk {
  margin: 20px;
}

.header {
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgb(224, 223, 223);
}

.file_list {
  width: 120px;
  margin: 0 10px;
  height: 150px;
  float: left;
}
</style>