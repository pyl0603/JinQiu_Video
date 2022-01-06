<template>
  <!--
    给editor加key是因为给tinymce keep-alive以后组件切换时tinymce编辑器会显示异常，
    在activated钩子里改变key的值可以让编辑器重新创建
  -->
  <div class="tinymce">
    <editor id="tinymceEditor" :init="tinymceInit" v-model="content" :key="tinymceFlag"></editor>
  </div>
</template>
<script type='text/javascript'>
import tinymce from "tinymce/tinymce";
import "tinymce/themes/silver/theme";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/advlist";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/paste";
import "tinymce/plugins/preview";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/tabfocus";
export default {
  name: "TinymceEditor",
  components: {
    editor: Editor
  },
  data() {
    return {
      tinymceFlag: 1,
      tinymceInit: {},
      content: ""
    };
  },
  props:{
    imgUrl:{
      type:Array,
      default:()=>[]
    },
    videoUrl:{
      type:String,
      default:''
    },
    isAddVdo:{
      type:Boolean,
      default:false
    },
     isAddImg:{
      type:Boolean,
      default:false
    },
    contentDet:{
      type:String,
      default:''
    }
  },
  methods: {
    // 插入图片至编辑器
    insertImage(res, file) {
      let src = ""; // 图片存储地址
      tinymce.execCommand("mceInsertContent", false, `<img src=${src}>`);
    }
  },
  created() {
    const that = this;
    this.tinymceInit = {
      skin_url: "/tinymce/skins/ui/oxide",
      language_url: `/tinymce/zh_CN.js`,
      language: "zh_CN",
      preformatted: true,
      nonbreaking_force_tab: true,
      height: document.body.offsetHeight - 350,
      browser_spellcheck: true, // 拼写检查
      branding: false, // 去水印
      // elementpath: false,  //禁用编辑器底部的状态栏
      statusbar: false, // 隐藏编辑器底部的状态栏
      paste_data_images: true, // 允许粘贴图像
      menubar: false, // 隐藏最上方menu
      content_css: `/tinymce/skins/content/default/content.min.css`,
      plugins: "advlist table lists paste preview fullscreen tabfocus",
      toolbar:
        "fontselect fontsizeselect forecolor backcolor bold italic underline strikethrough | alignleft aligncenter alignright alignjustify undo | imageUpload media quicklink h2 h3 blockquote table numlist bullist preview fullscreen",
      /**
       * 下面方法是为tinymce添加自定义插入图片按钮
       * 借助iview的Upload组件,将图片先上传到存储云上，再将图片的存储地址放入编辑器内容
       */
      setup: editor => {
        editor.on("FullscreenStateChanged", e => {
          that.fullscreen = e.state;
        }),
          editor.ui.registry.addButton("imageUpload", {
            tooltip: "插入图片",
            icon: "image",
            onAction: () => {
              this.$emit("chooseImg")
            }
          });
          editor.ui.registry.addButton("media", {
            tooltip: "插入视频",
            icon: "media",
            onAction: () => {
              this.$emit("chooseVdo")
            }
          });
      }
    };
  },
  mounted(){
  },
  activated() {
    this.tinymceFlag++;
  },
  mounted() {},
  watch:{
    isAddImg(newVal){
      this.imgUrl.map(res => {
        if(res.fullImgPath.indexOf('.gif') > -1){
          tinymce.execCommand("mceInsertContent", false, `<p><img src=${res.fullImgPath} width="100%"></p>`);
        }else{
          tinymce.execCommand("mceInsertContent", false, `<p><img src=${res.fullImgPath + '?x-oss-process=style/image-w750'} width="100%"></p>`);
        }
      })
      
    },
    isAddVdo(newVal){
      // tinymce.execCommand("mceInsertContent", false, `<video src=${this.videoUrl} controls="controls" width="100%"></video>`);
      tinymce.execCommand("mceInsertContent",false,`<p class="mce-preview-object mce-object-video" contenteditable="false" data-mce-object="video" data-mce-p-allowfullscreen="allowfullscreen" data-mce-p-frameborder="no" data-mce-p-scrolling="no" data-mce-p-src=${this.videoUrl} data-mce-html="%20"><video src=${this.videoUrl} width="100%" style="object-fit:cover" poster="https://duoquxiang.oss-cn-shenzhen.aliyuncs.com/user/2019-09-26/ad040fec3e89490d8600ac5c59eb518e.png" controls="controls"></video></p>`)
    },
    content(newVal){
      this.$emit('cont',newVal)
    },
    contentDet(newVal){
      this.content = newVal;
    }
  },
};
</script>
<style lang="scss" scoped>
img{
  width: 100%;
}
</style>


