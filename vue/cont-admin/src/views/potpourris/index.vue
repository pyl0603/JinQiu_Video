<template>
  <div>
    <top-tab ref="topTab" @chooseTab="chooseTab" :tabList="tabList"></top-tab>
    <LiveRoom :is="currentTab" ref="LiveRoom"></LiveRoom>
  </div>
</template>
<script>
import TopTab from "@/views/common/top-tab";
import LiveRoom from './liveRoom.vue'
import RecComp from './recComp.vue'
export default {
  data() {
    return { 
      tabList: [{name:"赛事直播间",value:'LiveRoom'},{name: "推荐赛事",value:'RecComp'}],
      currentTab:'LiveRoom'
    };
  },
  components: {
    TopTab,
    LiveRoom,
    RecComp
  },
  methods: {
    //   顶部tab
    chooseTab(val) {
      // console.log(val);
      if(val === 'List') this.$store.commit("setPaging", false);
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
