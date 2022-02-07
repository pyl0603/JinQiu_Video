<template>
  <div class="choose-dialog" v-if="showConn">
    <el-dialog :visible.sync="dialogVisible" width="70%" :show-close="false" :close-on-click-modal="false">
     
    <span class="close-pop cp" @click="closePop"><svg-icon icon-class="close"/></span>
     <div class="choose-tab">
        <div
          :span="3"
          v-for="(item,index) in items"
          :key="index"
          @click="tabs(item,index)"
          class="el-col-3"
          :class="{ on : item.value == itemIndex }"
        >{{item.name}}</div>
        <div :span="8" class="el-col-8 ml30 cp tar">
          <el-date-picker
          v-model="dataRang"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          @change="change"
           v-if="itemIndex != 'urlLink'"
        ></el-date-picker></div>
      </div>
      <div class="cont">
        <Match
          is="UrlLink"
          ref="Match"
          :matchChoose="matchChoose"
          @matchId="matchId"
          :select="select"
          :cont="cont"
           :startTime="startTime" 
           :endTime="endTime"
        ></Match>
        <!-- <match ref="Match" v-show="itemIndex == 'match'" :matchChoose="matchChoose" @matchId="matchId" :startTime="startTime" :endTime="endTime"></match>
        <Article ref="Article" v-show="itemIndex == 'article'" @article="matchId" :startTime="startTime" :endTime="endTime"></Article>
        <Video ref="Video" v-show="itemIndex == 'video'" @videos="matchId" :startTime="startTime" :endTime="endTime"></Video>
        <UrlLink ref="UrlLink" v-show="itemIndex == 'urlLink'" @matchId="matchId" v-if="isUrl"></UrlLink> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Match from '@/views/common/match-item'
import SelfMatch from '@/views/common/self-match'
import Article from '@/views/common/article'
import Video from '@/views/common/video'
import UrlLink from './urlLink'
export default {
  props:{
    showConn:{
      type:Boolean,
      default:false
    },
    isMain:{
      type:Boolean,
      default:true
    },
    isUrl:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      // 表格数据
      dialogVisible: true,
      items: [
        { name: "比赛", value: "Match" },
        { name: "自建比赛", value: "SelfMatch" },
        { name: "文章", value: "Article" },
        { name: "视频", value: "Video" },
        { name: "链接", value: "UrlLink" }
      ],
      itemIndex: 'match',
      matchChoose:true,
      dataRang:'',
      startTime:0,
      endTime:0,
      cont: '',
      select: '1',
      currentTab: "Match"
    };
  },
  components: {
    Match,
    Article,
    Video,
    UrlLink,
    SelfMatch
  },
  methods: {
    handleClose(done) {},
    // 选择比赛
    matchId(val){
      console.log(val)
        this.$emit('matchId',val)
    },
    // 关闭
    closePop(){
      this.$emit('closePop')
    },
    // tab切换
    tabs(val, item) {
      this.itemIndex = val.value;
      this.pageType = val.name;
      this.startTime = 0;
      this.endTime = 0;
      this.currentTab = val.value;
    },
    change(){
      this.startTime = this.dataRang[0];
      this.endTime = this.dataRang[1] + 3600 * 1000 * 24 - 1000;
    }
  },
  mounted() {},
  watch:{
    isMain(newVal){
      if(!newVal){
        this.items = [{ name: "文章", value: "Article" },{ name: "视频", value: "Video" },{ name: "链接", value: "UrlLink" }]
        this.itemIndex = 'Article'
        this.currentTab = 'Article'
      }else{
        this.items = [
        { name: "比赛", value: "Match" },
        { name: "自建比赛", value: "SelfMatch" },
        { name: "文章", value: "Article" },
        { name: "视频", value: "Video" },
        { name: "链接", value: "UrlLink" }
      ]
      }
    }
  }
};
</script>
<style lang="scss">
.close-pop{
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
  .choose-tab {
    height: 60px;
    line-height: 60px;
    text-align: center;
    background: #eeeeee;
    cursor: pointer;
    .on{
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
}
</style>
