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
        <el-switch v-model="isStart" @change="changeSwitch" />
      </div>
      <span
        class="start-txt cada f16 mt20 mb20"
      >标准尺寸为1242*1863，系统将智能适配640*1136、640*960、1536*2048、800*1280、720*1280、400*800等分辨率的机型，以帮助你快速调整广告启动页。</span>
      <el-row>
        <el-col :span="7">
          <div class="start-img cada f16">
            <!-- 上传前 -->
            <div v-if="this.startImg == ''" class="upload-before">
              <svg-icon icon-class="tupian" />
              <span>1242*1863</span>
            </div>
            <div class="upload-after">
              <img :src="startImg" alt>
            </div>
            <upload ref="upload" @upImg="upImg" />
            <div class="mt10">*可实时预览您上传图片的展示效果*</div>
          </div>
        </el-col>
        <el-col :span="12" :push="2">
          关联内容：
          <!--<el-select v-model="select"  placeholder="请选择" @change="change">
              <el-option label="足球" value="0"></el-option>
              <el-option label="篮球" value="1"></el-option>
            </el-select>
            <span class="cp choose-cont cada" @click="getCont">{{ connCont |  typeTxt}}</span>-->
          <el-select v-model="select" placeholder="请选择关联内容" @change="change"  @blur="selectIndex">
            <el-option
              v-for="item in selectArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="12" :push="2" class="mt20">
          输入标题：
          <el-input v-model="cont" v-inputRule placeholder="请输入标题" />
        </el-col>
        <el-col v-if="isUrl" :span="12" :push="2" class="mt20">
          关联链接：
          <el-input v-model="urlString" type="text" v-inputUrl placeholder="请输入URL链接" />
        </el-col>
        <el-col :span="12" :push="2" class="mt20">
          展现时长：
          <el-input class="time" v-model="timeout" type="text" v-inputTime ><template slot="append">S</template></el-input>
        </el-col>
        <el-col :span="12" :push="2" class="mt20 start-submit">
          <el-button type="dqx-btn" @click="updateWelcome">提交</el-button>
        </el-col>
      </el-row>
    </el-col>

    <simplify-cont ref="simplifyCont" @matchId="matchId" :show-conn="showConn" @closePop="showConn = false" />
  </div>
</template>
<script>
import upload from '@/components/UploadImg/index'
import SimplifyCont from '@/components/Dialog/simplify'
import { getWelcome, putWelcome } from '@/api/setting'
import { setCategory } from '@/utils/auth'
export default {
  filters: {
  // 位置
    // typeTxt(connCont) {
    //   const typeT = {
    //     0: '文章',
    //     1: '比赛',
    //     2: '视频',
    //     3: '外链'
    //   }
    //   return typeT[connCont]
    // }
  },
  components: {
    upload,
    SimplifyCont
  },
  data() {
    return {
      showConn: false, // 显示弹窗
      isStart: false, // 是否开启启动页
      startImg: '', // 启动页图片地址
      defaultImg: 'this.src="' + require('img/ic_qd_pic.png') + '"',
      connId: '', // 关联对象Id
      connType: 0, // 关联类型
      cont: '', // 关联内容
      connCont: '请选择',
      url: '',
      timeout: 1,
      select: '',
      selectArr: [
        {
          value: '0',
          label: '足球比赛'
        },
        {
          value: '1',
          label: '篮球比赛'
        },
        {
          value: '2',
          label: '外链'
        }
      ],
      isUrl: false,
      urlString: ''
    }
  },
  mounted() {
    this.$store.commit('setPaging', false)
    getWelcome().then(res => {
      this.startImg = res.data.image
      this.isStart = res.data.on
      this.connCont = res.data.type
      this.connType = res.data.type
      this.cont = res.data.summary
      this.url = this.isUrl ? this.urlString : res.data.url
      this.timeout = res.data.timeout
      this.select = res.data.category.toString()
      setCategory(res.data.category)
    })
  },
  methods: {
    // 重置
    reset() {
      this.cont = ''
      this.urlString = ''
      this.url = ''
      this.timeout = null
      this.isUrl = false
    },
    // 设置足球或者篮球
    change(val) {
      console.log(val)
      this.reset()
      if (val === '0' || val === '1') {
        this.connType = 1
      }
      if (val === '2') {
        this.connType = 3
        this.isUrl = true
        return
      }
      this.isUrl = false
      this.getCont()
      setCategory(val)
    },
    selectIndex(val) {
      const text = val.target.value
      const selected = this.selectArr.find(item => item.value === this.select)
      if (selected && selected.label === text) {
        this.select = ''
      }
    },
    //   开关
    changeSwitch(val) {},
    // 图片上传
    upImg(val) {
      this.startImg = val
    },
    // 选择
    matchId(val) {
      console.log(val)
      if (val.length === 4) {
        //this.connType = val[2]
        this.url = val[1]
        this.connCont = 3
        this.cont = val[4]
      } else {
        this.connCont = val[0]
        this.cont = val[4]
        this.connId = val[2]
        //this.connType = val[3]
      }
      this.showConn = false
    },
    getCont() {
      this.showConn = true
    },
    updateWelcome() {
      if (this.timeout == null || this.timeout <= 0 || this.timeout > 60) {
        this.$message('展现时长限制1s-60s')
        return
      }
      // type=0 新闻
      // type=1 比赛
      // type=2 视频
      // type=3 外链
      // 如果type=1,且category=0，是足球比赛
      // 如果type=1,且category=1，是篮球比赛
      putWelcome({
        'on': this.isStart,
        'image': this.startImg,
        'timeout': this.timeout ? this.timeout * 1 : this.timeout,
        'type': this.connType,
        'target': this.connId,
        'summary': this.cont,
        'url': this.isUrl ? this.urlString : this.url,
        'category': this.select * 1
      }).then(_ => {
        this.$message('操作成功')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-select {
  width: calc(100% - 120px);
}
.el-input{
  width: calc(100% - 120px);
}
.time {
  display: inline-table;
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
  .start-submit {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

