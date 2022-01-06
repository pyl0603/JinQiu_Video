<template>
  <div class="permissions">
    <!-- <top-tab ref="topTab" @chooseTab="chooseTab" :tabList="tabList"></top-tab> -->
    <list :is="currentTab" ref="List"></list>
  </div>
</template>
<script>
import TopTab from "@/views/common/top-tab";
import List from './list.vue'
import Manager from './manager.vue'
export default {
  data() {
    return {
      tabList: [{ name: "员工列表", value: "List" }, { name: "员工管理", value: "Manager" }],
      currentTab:'List'
    };
  },
  components:{
      TopTab,
      List,
      Manager
  },
  methods: {
    chooseTab(val) {
        this.currentTab = val
    }
  },
  mounted() {
  }
};
</script>
