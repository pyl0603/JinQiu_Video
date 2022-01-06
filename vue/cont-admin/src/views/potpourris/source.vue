<template>
  <div class="dialog-cont">
    <div class="item">
      <div>
          <em>直播源名称：</em>
          <el-input placeholder="请输入" v-model="name"></el-input>
          <em>移动端地址：</em>
          <el-input placeholder="请输入" v-model="url"></el-input>
          <el-button type="primary" @click="addList" :disabled="isNull"
            >导入</el-button
          >
        </div>
    </div>
    <div class="list already">
      <div v-if="listSource.length > 0" class="mt20">已添加列表</div>
      <div class="item mb20" v-for="(item, index) in listSource" :key="index">
        <div>
          <em>直播源名称：</em>
          <el-input placeholder="请输入" v-model="item.name"></el-input>
          <em>移动端地址：</em>
          <el-input placeholder="请输入" v-model="item.url"></el-input>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            class="ml20"
            @click="delSources(item, index)"
          ></el-button>
          
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer mt20 tac">
      <el-button @click="getLive">获取三方高清直播源</el-button>
      <el-button
        type="dqx-btn"
        :disabled="isAdd"
        @click="
          dialogStatusSource === 'create'
            ? createSourceData()
            : updateSourceData()
        "
        >{{dialogStatusSource === 'create' ? '保存' : '修改'}}</el-button
      >
      <el-button @click="cancel()">取消</el-button>
    </div>
  </div>
</template>
<script>
import {
  getSimple,
  getSource,
  addSource,
  putSource,
  delSource,
  refreshMatch
} from "@/api/setting";
import { getMatches, getMatchesReport } from "@/api/public";
import {
  getPotp,
  addPotp,
  putPotp,
  delPotp,
  sortPotp,
  fixPop,
  movePop,
  getThirdUrl
} from "@/api/potpourris";
export default {
  props: {
    liveId: {
      type: Number
    },
    isAddSour:{
      type:Boolean
    }
  },
  data() {
    return {
      dialogStatusSource: "create", //修改|新增
      listSource: [], //直播源列表
      isNull: true,
      isAdd: true,
      url:'',
      name:''
    };
  },
  mounted() {
    this.listSource = [];
    console.log(this.liveId);
    this.getSources(this.liveId);
  },
  methods: {
    // 获取三方直播源
    getLive(){
      // this.liveId
      getThirdUrl(this.liveId).then(res => {
        this.name = '高清三方源'
        this.url = res.data.mobileLink
      })
    },
    // 新增
    createSourceData() {
      // this.urlSourceList.push({name:this.name,url:this.url})
      addSource(this.liveId, this.urlSourceList).then(_ => {
        this.$message("操作成功");
        this.dialogVisibleSource = false;
        this.$emit("cancel");
        // this.getMatche();
      });
    },
    // 修改
    updateSourceData() {
      addSource(this.liveId, this.urlSourceList).then(_ => {
        this.$message("操作成功");
        this.dialogVisibleSource = false;
        this.$emit("cancel");
        // this.getMatche();
      });
    },
    // 删除数据
    delSources(val, e) {
      if (val.id) {
        delSource(val.id).then(_ => {
          this.$message("已删除");
        });
      }
      this.listSource.splice(e, 1);
    },
    // 新增一条数据
    addList() {
        if (this.name != "" && this.url != "") {
          this.listSource.push({name:this.name,url:this.url})
          this.name = '';
          this.url = '';
        }
    },
    // 获取直播源
    getSources(val) {
      getSource(val).then(res => {
        if (res.data.length > 0) {
          this.listSource = res.data;
          this.dialogStatusSource = "update";
          this.isAdd = false;
        }else{
          this.dialogStatusSource = 'create'
        }
      });
    },
    cancel() {
      this.$emit("cancel");
    }
  },
  computed: {
    urlSourceList() {
      return this.listSource.filter(res => {
        return res.url != "" && res.name != "";
      });
    }
  },
  watch: {
    liveId(newVal) {
      this.listSource = [];
      this.getSources(newVal);
    },
    isAddSour(){
      this.listSource = [];
      this.getSources(this.liveId);
    },
    listSource: {
      handler(val) {
        // 列表为空时保存按钮置灰
        if (val.length === 1 && (val[0].name === "" || val[0].url === "")) {
          this.isAdd = true;
        } else {
          this.isAdd = false;
        }
        // 列表存在为空项时添加直播源按钮置灰
        let num = 0;
        val.map(res => {
          if (res.url === "" || res.name === "") {
            num++;
          }
        });
        if (num > 0) {
          this.isNull = true;
        } else {
          this.isNull = false;
        }
      },
      deep: true //加上这
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog-cont em {
  width: 90px;
}
.cont {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.tab-name {
  display: inline-block;
  padding: 0 20px;
}
.list {
  max-height: 500px;
  overflow-y: scroll;
}
.tab-name + .tab-name {
  border-left: 1px solid #d0d0d0;
}
.left {
  width: 45vw;
}
.right {
  width: calc(55vw - 40px);
}
.el-input {
  width: calc(50% - 150px);
}
.el-date-editor {
  width: 250px;
}
/deep/.inputFlieV {
  position: absolute;
  margin-top: -35px;
  width: 80px;
  // margin-left: 80px;
  z-index: 9;
  opacity: 0;
}
.history em {
  display: inline-block;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.upload-after {
  display: inline-block;
  img {
    width: 8vw;
    height: 5vw;
  }
}
.upload-before {
  display: inline-block;
  width: 8vw;
  height: 5vw;
  background: #f5f5f5;
  text-align: center;
  span {
    display: block;
  }
  .svg-icon {
    font-size: 39px;
    color: #adadad;
    margin-top: 1.2vw;
  }
}
</style>
