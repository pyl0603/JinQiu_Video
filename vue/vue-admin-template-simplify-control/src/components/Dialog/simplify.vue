<template>
  <div v-if="showConn" class="simplify-dialog">
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" width="70%">
      <span class="close-pop cp" @click="closePop"><svg-icon icon-class="close" /></span>
      <div class="select-time">
        <el-date-picker
          v-model="dataRang"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          @change="change"
        />
      </div>

      <div class="cont">
        <match v-show="itemIndex == 'match'" ref="Match" :match-choose="matchChoose" :start-time="startTime" :end-time="endTime" @matchId="matchId" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Match from '@/views/common/match-item'
export default {
  name: 'SimplifyCont',
  components: {
    Match
  },
  props: {
    showConn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 表格数据
      itemIndex: 'match',
      matchChoose: true,
      dialogVisible: true,
      dataRang: '',
      startTime: 0,
      endTime: 0
    }
  },
  watch: {},
  mounted() {},
  methods: {
    change() {
      this.startTime = this.dataRang[0]
      this.endTime = this.dataRang[1] + 3600 * 1000 * 24 - 1000
    },
    matchId(val) {
      console.log(val)
      this.$emit('matchId', val)
    },
    // 关闭
    closePop() {
      this.$emit('closePop')
    }
  }
}
</script>

<style lang="scss">
.simplify-dialog {
    .el-dialog {
        padding-bottom: 1vh;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        margin-top: 0!important;
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
}
.close-pop{
  position: absolute;
  top: -8px;
  color: #666;
  right: -5px;
  font-size: 20px;
  z-index: 99;
}
.select-time {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 1vh 20px;
    height: 10vh;
}
// .el-dialog__body {
//     padding: 0;
// }
// .el-dialog__header {
//     padding: 0;
// }
</style>
