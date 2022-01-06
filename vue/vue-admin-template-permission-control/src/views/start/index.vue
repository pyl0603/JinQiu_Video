<template>
  <div class="start">
      <el-col :span="6">
        <div class="phone-bg">
          <img :src="startImg" alt class="start-img-show" :onerror="defaultImg">
          <img src="~img/ic_qd_phone.png" alt class="phone-icon">
        </div>
      </el-col>
      <el-col :span="15" :push="8">
        <div class="start-btn f24 c171">
          <span>启动页设置</span>
          <el-switch v-model="isStart" @change="changeSwitch"/>
        </div>
        <span
          class="start-txt cada f16 mt20 mb20"
        >标准尺寸为1242*1863，系统将智能适配640*1136、640*960、1536*2048、800*1280、720*1280、400*800等分辨率的机型，以帮助你快速调整广告启动页。</span>
        <el-row>
          <el-col :span="7">
            <div class="start-img cada f16">
              <!-- 上传前 -->
              <div class="upload-before" v-if="this.startImg == ''">
                <svg-icon icon-class="tupian"></svg-icon>
                <span>1242*1863</span>
              </div>
              <div class="upload-after">
                <img :src="startImg" alt>
              </div>
              <upload ref="upload" @upImg="upImg"></upload>
              <div class="mt10">*可实时预览您上传图片的展示效果*</div>
            </div>
          </el-col>
          <el-col :span="12" :push="2">
            关联内容：
            <el-select v-model="select"  placeholder="请选择" @change="change">
              <el-option label="足球" value="0"></el-option>
              <el-option label="篮球" value="1"></el-option>
            </el-select>
            <span class="cp choose-cont cada" @click="getCont">{{ connCont |  typeTxt}}</span>
          </el-col>
          <el-col :span="12" :push="2" class="mt20">
            输入标题：
            <el-input  placeholder="请输入标题" v-inputRule v-model="cont"></el-input>
          </el-col>
          <el-col :span="12" :push="2" class="mt20">
            输入时间：
            <el-input type="number" placeholder="请输入时间" v-inputRule v-model="timeout"></el-input>
          </el-col>
        </el-row>
      </el-col>
      
      <el-button @click="updateWelcome">保存</el-button>
    <choose-cont ref="chooseCont" @matchId="matchId"  @closePop='showConn = false' :showConn="showConn" :isUrl="true"></choose-cont>
  </div>
</template>
<script>
import upload from "@/components/UploadImg/index";
import chooseCont from "@/components/Dialog/index";
import { getWelcome, putWelcome } from "@/api/setting";
import { getCategory,setCategory } from '@/utils/auth'
export default {
  data() {
    return {
      showConn: false, //显示弹窗
      isStart: false, //是否开启启动页
      startImg: "", //启动页图片地址
      defaultImg: 'this.src="' + require("img/ic_qd_pic.png") + '"',
      connId:'',//关联对象Id
      connType:0,//关联类型
      cont: "", //关联内容
      connCont:'请选择',
      url:'',
      timeout:'',
      select:'0'
    };
  },
    filters: {
  // 位置
    typeTxt(connCont) {
      let typeT = {
        0:'文章',
        1:'比赛',
        2:'视频',
        3:'外链'
      };
      return typeT[connCont];
    },
    },
  components: {
    upload,
    chooseCont
  },
  methods: {
    // 设置足球或者篮球
    change(val){
      setCategory(val)
    },
    //   开关
    changeSwitch(val) {},
    // 图片上传
    upImg(val) {
      this.startImg = val;
    },
    // 选择
    matchId(val) {
      if(val.length === 3){
        this.connType = val[2];
        this.url = val[1];
        this.connCont = 3;
        this.cont = val[1]

      }else{
      this.connCont = val[0]
      this.cont = val[1];
      this.connId = val[2];
      this.connType = val[3]
      }
      this.showConn = false;
    },
    getCont() {
      this.showConn = true;
    },
    updateWelcome() {
      putWelcome({
        'on': this.isStart,
        'image': this.startImg,
        'timeout': this.timeout*1,
        'type': this.connType,
        'target': this.connId,
        'summary':this.cont,
        'url':this.url,
        'category':this.select*1
      }).then(_ => {
        this.$message("操作成功");
      });
    }
  },
  mounted() {
    this.$store.commit("setPaging", false);
    getWelcome().then(res => {
      this.startImg = res.data.image;
      this.isStart = res.data.on;
      this.connCont = res.data.type;
      this.connType = res.data.type;
      this.cont = res.data.summary;
      this.url = res.data.url;
      this.timeout = res.data.timeout;
      this.select =  res.data.category.toString();
      setCategory(res.data.category)
    });
  }
};
</script>
<style lang="scss" scoped>
.el-button{
  position: absolute;
  bottom: 50px;
}
.el-select{
  width: 80px;
}
.el-input{
  width: calc(100% - 120px);
}
.start {
  padding-left: 13vw;
  padding-top: 11vh;
  .choose-cont {
    display: inline-block;
    width: calc(100% - 200px);
    padding-left: 20px;
    height: 40px;
    line-height: 40px;
    background: #f5f5f5;
  }
  .cont-det {
    margin-left: 80px;
  }
  .upload-after {
    img {
      width: 15vw;
      height: calc(100vh - 450px);
    }
  }
  /deep/.el-dialog__header {
    display: none;
  }
  .start-img {
    text-align: center;
    /deep/.inputFlie {
      width: 15vw;
      height: calc(100vh - 450px);
      position: absolute;
      margin-left: -7.3vw;
      margin-top: calc(450px - 100vh);
      opacity: 0;
      z-index: 1;
    }
    .upload-before {
      width: 15vw;
      height: calc(100vh - 450px);
      background: #f5f5f5;
      text-align: center;
      span {
        display: block;
      }
      .svg-icon {
        font-size: 39px;
        color: #adadad;
        margin-top: calc(50vh - 275px);
      }
    }
  }
  .start-txt {
    display: block;
    line-height: 24px;
    width: 100%;
  }
  .start-btn {
    display: flex;
    justify-content: space-between;
  }
  .phone-bg {
    width: 17vw;
    img.phone-icon {
      position: absolute;
      width: 17vw;
    }
    img.start-img-show {
      position: absolute;
      width: 15vw;
      margin-top: 1.5vh;
      margin-left: 1vw;
    }
  }
}
</style>

