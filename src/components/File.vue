<template>
  <div class="file" @mouseleave="icon_show=false" @mouseenter="icon_show=true" @dblclick="openFile">
    <div class='file_img'>
      <img :src="show_img" width="100px" height="100px"/>
    </div>
    <div class="text" :title="msg.name" @click="openFile">{{ msg.name }}</div>
    <div v-if="icon_show">
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
  props: {
    msg: {
      type: Object,
    }
  },
  data() {
    return {
      icon_show: false,
      show_img: require("../assets/text.png"),
      img_map: {
        accdb: require("../assets/accdb.png"),
        avi: require("../assets/avi.png"),
        bmp: require("../assets/bmp.png"),
        css: require("../assets/css.png"),
        docx: require("../assets/docx_win.png"),
        doc: require("../assets/docx_win.png"),
        eml: require("../assets/eml.png"),
        eps: require("../assets/eps.png"),
        fla: require("../assets/fla.png"),
        gif: require("../assets/gif.png"),
        html: require("../assets/html.png"),
        ind: require("../assets/ind.png"),
        ini: require("../assets/ini.png"),
        jpeg: require("../assets/jpeg.png"),
        jpg: require("../assets/jpeg.png"),
        jsf: require("../assets/jsf.png"),
        midi: require("../assets/midi.png"),
        mov: require("../assets/mov.png"),
        mp3: require("../assets/mp3.png"),
        mpeg: require("../assets/mpeg.png"),
        pdf: require("../assets/pdf.png"),
        png: require("../assets/png.png"),
        pptx: require("../assets/pptx_win.png"),
        ppt: require("../assets/pptx_win.png"),
        proj: require("../assets/proj.png"),
        psd: require("../assets/psd.png"),
        pst: require("../assets/pst.png"),
        pub: require("../assets/pub.png"),
        rar: require("../assets/rar.png"),
        readme: require("../assets/readme.png"),
        settings: require("../assets/settings.png"),
        text: require("../assets/text.png"),
        tiff: require("../assets/tiff.png"),
        url: require("../assets/url.png"),
        vsd: require("../assets/vsd.png"),
        wav: require("../assets/wav.png"),
        wma: require("../assets/wma.png"),
        wmv: require("../assets/wmv.png"),
        xlsx: require("../assets/xlsx_win.png"),
        xls: require("../assets/xlsx_win.png"),
        zip: require("../assets/zip.png"),
        '7z': require("../assets/zip.png"),
      },
    };
  },
  methods: {
    openFile() {
      console.log('打开文件')
    },
    downloadFile() {
      let form = new FormData()
      form.append('file_id', this.msg["id"])
      form.append('download_path', 'C:\\Users\\LoveTt\\Desktop\\ZXi_Net_Disk\\zxi_network_disk_electron')
      this.$axios
          .post(
              "/zxi/auth/download/create",
              form
          )
          .then(() => {
            this.$message.success("成功添加下载："+this.msg["name"])
          })
          .catch((error) => {
            console.log(error);
          });
    },
    moveFile() {
      console.log('移动文件')
    },
    renameFile() {
      console.log('重命名文件')
    },
    deleteFile() {
      console.log('删除文件')
    },
    getImg() {
      let name_list = this.msg.name.split('.')
      let key = name_list[name_list.length - 1]

      if (this.img_map[key] !== undefined) {
        this.show_img = this.img_map[key]
      }
    }
  },

  mounted() {
    this.getImg()
  }
};
</script>

<style>
.file {
  text-align: center;
  padding: 10px;
}

.file:hover {
  background: rgb(226, 226, 226);
}

.text {
  font-size: 16px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text:hover {
  color: rgb(39, 161, 247);
}

.icon {
  font-size: 18px;
  margin: 0 5px;
  cursor: pointer;
}
</style>