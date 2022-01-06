<template>
  <div>
    <top-tab ref="topTab" @chooseTab="chooseTab" :tabList="tabList"></top-tab>
    <main :is="currentTab" ref="Main"></main>
  </div>
</template>
<script>
import TopTab from "@/views/common/top-tab";
import Main from "./main.vue"
import Match from './match.vue'
import Data from './data.vue'
export default {
  data() {
    return {
      tabList: [
        { name: "首页频道", value: 'Main' },
        { name: "赛事频道", value: 'Match' },
        { name: "数据频道", value: 'Data' }
      ],
      tableData: [],
      isMain: true,
      currentTab:'Main'
    };
  },
  components: {
    TopTab,
    Main,
    Match,
    Data
  },
  methods: {
    //   顶部tab,切换数据源
    chooseTab(val) {
      this.currentTab = val
    },
  },
  computed: {}
};
</script>

