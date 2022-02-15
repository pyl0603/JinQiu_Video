<template>
  <div class="department">
     <top-tab ref="topTab" @chooseTab="chooseTab" :tabList="tabList"></top-tab>
     <depChild :is="currentTab" ref="depChild"></depChild>
  </div>
</template>
<script>
import TopTab from "@/views/common/top-tab";
import depChild from "./depChild"
import Role from '@/views/role/index'
import User from '@/views/permissions/staff-list'
export default {
  data() {
    return {
      tabList: [{name:'子部门管理',value:'depChild'}],
      addTxt:'新增子部门',
      currentTab:'depChild',
    };
  },
  components:{
    TopTab,
    depChild,
    Role,
    User
  },
  methods: {
    // tab选择
    async chooseTab(val){
      this.currentTab = val;
    },
  },
  async mounted() {
    if(this.$route.query.hasChild === 'false'){
      this.tabList = [{name:'角色管理',value:'Role'},{name:'成员管理',value:'User'}]
      this.currentTab = 'Role'

    }
    this.$store.commit("setPaging", false);
  }
};
</script>
