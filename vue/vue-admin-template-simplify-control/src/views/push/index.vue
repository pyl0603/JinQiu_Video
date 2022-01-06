<template>
  <div class="push">
    <top-tab ref="topTab" :tab-list="tabList" @chooseTab="chooseTab" />
    <div v-if="type != 4" class="mb20 tar"><el-date-picker
      v-model="dataRang"
      type="daterange"
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="timestamp"
      @change="change"
    /></div>
    <news :is="currentTab" ref="News" :is-push="false" :is-sys="false" :match-choose="true" :start-time="startTime" :end-time="endTime" @showPop="showPop" />
    <el-dialog title="推送" :visible.sync="dialogVisible" width="60%" :show-close="false">
      <other ref="Other" :is-page="false" :type="type" :is-msg="true" :push-info="pushInfo" :is-sys="false" @cancle="dialogVisible=false" />
    </el-dialog>
  </div>
</template>
<script>
import TopTab from '@/views/common/top-tab'
import News from '@/views/common/article'
import Match from '@/views/common/match-item'
import Video from '@/views/common/video'
import Other from '@/views/newPush/new-notice'
export default {
  components: {
    News,
    Match,
    Video,
    Other,
    TopTab
  },
  data() {
    return {
      currentTab: 'News',
      dataRang: '',
      tabList: [
        { name: '文章', value: 'News' },
        { name: '视频', value: 'Video' },
        { name: '赛事', value: 'Match' },
        { name: '外链', value: 'Other' }
      ],
      dialogVisible: false,
      type: 1,
      pushInfo: {},
      startTime: 0,
      endTime: 0
    }
  },
  methods: {
    // tab切换
    chooseTab(val) {
      if (val === 'News') this.type = 1
      if (val === 'Video') this.type = 3
      if (val === 'Match') this.type = 2
      if (val === 'Other') this.type = 4
      this.currentTab = val
      this.dataRang = ''
      this.startTime = 0
      this.endTime = 0
    },
    // 弹窗
    showPop(val) {
      console.log(val)
      this.pushInfo = val
      this.dialogVisible = true
    },
    // 时间选择
    change() {
      this.startTime = this.dataRang[0]
      this.endTime = this.dataRang[1] + 3600 * 1000 * 24 - 1000
    }
  }
}
</script>
