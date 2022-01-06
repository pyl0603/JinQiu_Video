<template>
  <div>
    <el-row>
      <el-col :span="12"
        >所属联赛：<el-input v-model="commonData.competition"></el-input
      ></el-col>
      <el-col :span="12"
        >赛事阶段：<el-input v-model="commonData.stage.competition"></el-input
      ></el-col>
    </el-row>
    <el-row class="mt20">
      <el-col :span="12"
        >开始时间：
        <el-date-picker
          v-model="commonData.matchTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          value-format="timestamp"
          placeholder="选择日期时间"
          default-time="12:00"
        >
        </el-date-picker>
      </el-col>
      <el-col :span="12">比赛状态：
         <el-select v-model="commonData.status" placeholder="请选择" @change="change">
           <el-option
              v-for="item in option"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
      </el-col>
    </el-row>
    <el-row class="mt20">
      比赛LOGO:
      <span
          class="upload-before"
          v-if="commonData.logo == ''"
          @click="isPopImg = true"
        >
          <svg-icon icon-class="tupian"></svg-icon>
          <span class="f14 cada">120*120</span>
        </span>
        <span
          class="upload-after"
          v-if="commonData.logo != ''"
          @click="isPopImg = true"
        >
          <img :src="commonData.logo" alt/></span
      >
    </el-row>
    <el-row class="mt20">
      主标题：
      <el-input v-model="commonData.title"></el-input>
    </el-row>
    <el-row class="mt20">
      副标题：
      <el-input v-model="commonData.subject"></el-input>
    </el-row>
    <el-row class="mt20">
      关联圈子：
          <el-select v-model="commId" placeholder="请选择" @change="changeComm">
            <el-option
              v-for="item in optionComm"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button type="text" @click="editC" class="ml20">{{
            isEditC ? "完成" : "编辑"
          }}</el-button>
          <div class="el-col-24 mt20 show-list">
            <span v-for="(item, index) in matList" :key="index" class="mr20 mt20">
              <el-button size="mini">{{ item }}</el-button>
              <svg-icon
                icon-class="delete"
                @click="delMac(index)"
                v-if="isEditC"
              ></svg-icon>
            </span>
          </div>
    </el-row>
    <el-row class="tac mt20">
      <el-button type="dqx-btn" @click="confirm">确定</el-button>
    </el-row>
     <!-- 图片选择器 -->
    <imgPop
      ref="imgPop"
      @cancel="cancelPop"
      v-if="isPopImg"
      @chooseItem="chooseItem"
      :isEdit="true"
      :widthNum="5"
      :heightNum="5"
    ></imgPop>
  </div>
</template>
<script>
import imgPop from "@/views/common/img-list-cut.vue";
import { addMatch,getCommunities } from '@/api/match.js'
export default {
  data() {
    return {
      isEditC: false,
      commId:0,
      matList: [],
      optionComm: [],
      isPopImg: false,
      imgSrc:'home',
      value:0,
      option: [{ key: 0, name: "未开始" },{ key: 1, name: "进行中" },{ key: 2, name: "比赛结束" },{ key: 3, name: "异常" }],
      // 自定义比赛数据
      commonData: {
        type: 98,
        status: 0,
        competition: "",
        logo: "",
        title: "",
        subject: "",
        matchTime: new Date(new Date()).getTime(),
        home: {
          name: "",
          logo: ""
        },
        away: {
          name: "",
          logo: ""
        },
        score: {
          home: 0,
          away: 0
        },
        stage: {
          competition: "", //赛事阶段描述
          match: "" //比赛阶段描述
        },
        communities: []
      }
    };
  },
  props: {
    dataList: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    imgPop
  },
  created () {
    getCommunities({page_size:30}).then(res => {
      this.optionComm = res.data
      this.commId = res.data[0].id
    })
  },
  methods: {
    // 频道编辑
    editC() {
      if (this.matList.length == 0) {
        this.$message("您还没有添加频道");
        return;
      }
      this.isEditC = !this.isEditC;
    },
    // 删除频道
    delMac(val) {
      this.matList.splice(val, 1);
      this.commonData.communities.splice(val, 1);
      console.log(this.matList, this.commonData.communities);
    },
    // 下拉选择频道
    changeComm(val) {
      let ids = [];
      this.commonData.communities.map(res => {
        ids.push(res.id);
      });
      if (ids.includes(val)) {
        return;
      }
      let name;
      this.optionComm.map(res => {
        if (res.id === val) {
          name = res.name;
          this.matList.push(res.name);
        }
      });
      this.commonData.communities.push({ id: val, name: name });
      console.log(this.commonData.communities);
    },
    // 图片选择框取消
    cancelPop() {
      this.isPopImg = false;
    },
    // 图片选择回调
    chooseItem(val) {
        this.commonData.logo = val
        this.isPopImg = false;
    },
    // 状态选择
    change(){},
    // 添加
    confirm(){
      if(this.commonData.competition == ''){
        this.$message('请填写联赛')
        return
      }
      if(this.commonData.logo == ''){
        this.$message('请上传logo')
        return
      }
      if(this.commonData.title == ''){
        this.$message('请填写主队主标题')
        return
      }
      addMatch(this.commonData).then(res => {
        this.$message('添加成功')
        this.$emit('succeed')
      })
    }
  },
  watch: {
    dataList(newVal) {
      this.commonData = newVal;
    }
  }
};
</script>
<style lang="scss" scoped>
.el-input {
  width: calc(100% - 100px);
}
.upload-after {
  img {
    width: 8.5vw;
    height: 8.5vw;
  }
}
.upload-before {
  display: inline-block;
  width: 8.5vw;
  height: 8.5vw;
  background: #f5f5f5;
  text-align: center;
  span {
    display: block;
  }
  .svg-icon {
    font-size: 39px;
    color: #adadad;
    margin-top: 2.5vw;
  }
}
.show-list {
  button {
    margin-bottom: 20px;
  }
    .svg-icon {
      color: red;
      font-size: 16px;
      position: absolute;
      margin-left: -8px;
      margin-top: -8px;
    }
  }
</style>
