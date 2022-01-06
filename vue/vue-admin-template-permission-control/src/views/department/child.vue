<template>
  <div class="department">
    <div class="new-tab">
      <div class="el-col-24 mt10 mb20 cada f14">
        <span
          class="show-tab cp"
          v-for="item in tabList"
          :key="item.id"
          @click="tabs(item)"
        >{{item.name}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getMyDep
} from "@/api/staff";
export default {
  data() {
    return {
      tabList: []
    };
  },
  methods: {
    // 获取当前用户的部门列表
    async getDeps() {
      return new Promise((resolve, reject) => {
        getMyDep().then(res => {
          return resolve(res.data);
        });
      });
    },
    // 切换部门
    async tabs(val){
      this.$router.push({
        path: "/depDet",
        query: {id: val.id.toString(),hasChild:val.hasChildren == false ?'false':'true' }
      });
    }
  },
  async mounted() {
    let data = await this.getDeps();
    data.map(res => {
        this.tabList.push(res);
    });
  },
};
</script>
<style lang="scss" scoped>
.show-tab {
  display: inline-block;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
  margin-bottom: 20px;
  margin-right: 20px;
  text-align: center;
  background: #18CE94;
  color: #fff;
  border-radius: 8px;
}
</style>
