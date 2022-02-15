<template>
  <div>
    <top-tab ref="topTab" :tabList="tabList"></top-tab>
    <Logistics  ref="Logistics"></Logistics>
  </div>
</template>
<script>
import TopTab from "@/views/common/top-tab";
// import Chart from './chart.vue'
// import Set from './set.vue'
// import Code from './code.vue'
// import InviDetail from './inviDetail.vue'
import Logistics from './logistics.vue'
// import Gift from './gift.vue'
export default {
  data() {
    return { 
      // {name: "用户拉新详情",value:'InviDetail'},
      // ,{name: "兑换码查询",value:'Code'}
      tabList: [{name: "物流管理",value:'Logistics'}],
      currentTab:'Logistics'
    };
  },
  components: {
    TopTab,
    // Chart,
    // Set,
    // Code,
    // InviDetail,
    Logistics,
    // Gift
  },
  methods: {
    //   顶部tab
    chooseTab(val) {
      console.log(val);
      this.currentTab = val;
    },
  },
  mounted() {
    // this.$store.commit("setPaging", true);
  },
  computed: {
  }
};
</script>
