<template>
  <div class="manager">
    <el-row>
      <el-col :span="8" class="cada f14 tac">
        <span
          v-for="(item,index) in tablist"
          class="el-col-5 tabitem cp"
          :key="index"
          :class="{c18c : index === itemIndex}"
          @click="chooseTab(item,index)"
        >{{item.name}}</span>
      </el-col>
      <el-col :span="16" class="tar">
        <el-button type="dqx-btn">新增</el-button>
      </el-col>
    </el-row>
    <per-data :is="currentTab" ref="perData"></per-data>
  </div>
</template>
<script>
import perData from './personalData.vue'
import staffMan from './staffMan.vue'
import Account from './account.vue'
export default {
  data() {
    return {
      tablist: [
        { name: "个人资料", value: "perData" },
        // { name: "员工管理", value: "staffMan" },
        { name: "账户安全", value: "Account" }
      ],
      itemIndex: 0,
      currentTab:"perData"
    };
  },
  components:{
      perData,
      staffMan,
      Account
  },
  methods:{
      chooseTab(e,val){
          this.currentTab = e.value;
          this.itemIndex = val;
      }
  },
  mounted() {
  }
};
</script>
<style lang="scss" scoped>
.manager {
  .tabitem + .tabitem {
    border-left: 1px solid #f5f5f5;
  }
}
</style>

