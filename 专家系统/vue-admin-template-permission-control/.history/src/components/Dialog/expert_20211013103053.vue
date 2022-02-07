<template>
  <div class="choose-dialog" v-if="showConn">
    <el-dialog
      :visible.sync="dialogVisible"
      width="70%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <span class="close-pop cp" @click="closePop"
        ><svg-icon icon-class="close"
      /></span>
      <div class="choose-tab">
        <div
          :span="2"
          v-for="(item, index) in items"
          :key="index"
          @click="tabs(item, index)"
          class="el-col-2"
          :class="{ on: item.value == itemIndex }"
        >
          {{ item.name }}
        </div>
        <div class="el-col-14 ml30 cp tar">
          <el-date-picker
            v-model="dataRang"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            @change="change"
            v-if="currentTab == 'FMatch' || currentTab == 'BMatch'"
          ></el-date-picker>
        </div>
      </div>
      <div class="cont">
        <div>cont</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import UrlLink from "./urlLink";
export default {
  props: {
    showConn: {
      type: Boolean,
      default: false
    },
    isMain: {
      type: Boolean,
      default: true
    },
    isUrl: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 表格数据
      dialogVisible: true,
      items: [
        // { name: "直播间", value: "Live" },
        // { name: "足球比赛", value: "FMatch" },
        // { name: "篮球比赛", value: "BMatch" },
        { name: "专家方案", value: "expertPlan" },
        { name: "外链", value: "urlLink" },

      ],
      itemIndex: "expertPlan",
      matchChoose: true,
      dataRang: "",
      startTime: 0,
      endTime: 0,
      keyworlds: '',
      select: '1',
      cont: "",
      currentTab: "expertPlan"
    };
  },
  components: {
    UrlLink
  },
  methods: {
    handleClose(done) {},
    // 选择比赛
    associated(val) {
      this.$emit("associated", val);
    },
    // 关闭
    closePop() {
      this.$emit("closePop");
    },
    // 
    setTitle(){
      this.cont = this.keyworlds;
      this.select = this.select;
    },
    // tab切换
    tabs(val, item) {
      this.itemIndex = val.value;
      this.pageType = val.name;
      this.startTime = 0;
      this.endTime = 0;
      this.currentTab = val.value;
    },
    change() {
      this.startTime = this.dataRang[0];
      this.endTime = this.dataRang[1] + 3600 * 1000 * 24 - 1000;
    }
  },
  mounted() {}
};
</script>
<style lang="scss">
.close-pop {
  position: absolute;
  top: -8px;
  color: #666;
  right: -5px;
  font-size: 20px;
  z-index: 99;
}
.choose-dialog {
  .el-dialog {
    padding-bottom: 1vh;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    margin-top: 0 !important;
  }
  .cont {
    padding: 1vh 20px;
    height: 80vh;
    td,
    th {
      border-right: none;
    }
    .el-table thead,
    .el-table th {
      background: #f5f5f5;
    }
    .el-table td,
    .el-table th {
      padding: 5px 0;
    }
  }
  .choose-tab {
    height: 60px;
    line-height: 60px;
    text-align: center;
    background: #eeeeee;
    cursor: pointer;
    .on {
      background: #fff;
    }
    .el-col-4 {
      border-right: 2px solid #e6e6e6;
    }
    .el-col-4.on {
      background: #f6f6f6;
    }
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-dialog__header {
    padding: 0;
  }
  /deep/.el-input-group__prepend {
  position: absolute;
  margin-top: 0px;
  line-height: 40px;
  width: 120px;
  height: 40px;
  z-index: 999;
  border-radius: 0;
}
.el-input {
  display: inline-block;
  width: calc(100% - 220px);
  margin-right: 120px;
}
/deep/.el-input-group > .el-input__inner {
  margin-left: 120px;
}
/deep/.el-input-group .el-select .el-input__inner {
  width: 120px;
  margin-left: -50px;
}
/deep/.el-input-group .el-select .el-input .el-select__caret{
  margin-left: -90px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
}

</style>
