<template>
  <div>
    <top-tab ref="topTab" @chooseTab="chooseTab" :tabList="tabList"></top-tab>
    <match :is="currentTab" ref="Main"></match>
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
        { name: "赛事频道", value: 'Match' },
        { name: "数据频道", value: 'Data' }
      ],
      tableData: [],
      isMain: true,
      currentTab:'Match'
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

