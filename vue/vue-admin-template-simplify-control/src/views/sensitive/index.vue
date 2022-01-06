<template>
  <div>
    <div class="el-col-24 mb30">
      <div class="el-col-18">
        <em>敏感词查重：</em>
        <el-input v-inputRule class="ml10" v-model="keys"></el-input>
        <el-button type="dqx-btn" class="ml20" @click="getSensi">查询</el-button>
        <el-button type="dqx-btn" class="ml20" @click="resetSensi">重置</el-button>
      </div>
      <div class="el-col-6 tar">
        <!-- <el-button type="dqx-btn" class="ml20">上传</el-button> -->
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%;">
      <el-table-column prop="title" label="文档名称" width="200"></el-table-column>
      <el-table-column prop="updateTime" label="上次更新时间">
        <template slot-scope="scope">
          {{scope.row.updateTime | formatTime}}
        </template>
      </el-table-column>
      <el-table-column label="调整(上传文档名字应为sensitiveData.txt)" width="400">
        <template slot-scope="scope">
          <div class="update">
            <el-button @click="handleClick(scope.row)" type="text" size="small">更新</el-button>
            <upload @upFlie="upFlie"></upload>
          </div>
          <a :href="scope.row.url + '?' + 'timestamp' + timestamp" download='test.txt' target='_blank'>
          <el-button type="text" size="small">下载</el-button></a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getWord ,isSensitive} from "@/api/setting";
import { formatTime } from "@/utils/index.js";
import upload from "@/components/UploadFile/index";
export default {
  data() {
    return {
      tableData: [],
      temp: {
        avater: "",
        phone: "",
      },
      keys:'',
      timestamp: new Date().getTime(),
    };
  },
  filters: {
    formatTime(time) {
      var date = new Date(time);
      return formatTime(date);
    }
  },
  components: {
    upload
  },
  methods: {
    // 重置查询的敏感词
    resetSensi() {
      this.keys = ''
    },
    // 判断敏感词是否已存在
    getSensi(){
      isSensitive({text:this.keys}).then(res => {
        this.$message(res.data?'该词语已存在':'该词语不存在')
      })
    },
    // 文件上传
    upFlie(val) {
      if (val === 0) {
        this.$message("更新成功");
        this.getList();
      }
    },
    // 新增事件
    newSens() {},
    // 获取敏感词库
    getList() {
      getWord().then(res => {
        this.tableData = [];
        this.tableData.push(res.data);
      });
    }
  },
  mounted() {
    this.getList();
    this.$store.commit("setPaging", false);
  },
  computed: {}
};
</script>
<style lang="scss" scoped>
.el-input {
  width: 300px;
}
.update {
  display: inline-block;
  width: 60px;
}
/deep/.inputFlie {
  position: absolute;
  margin-top: -22px;
  width: 50px;
  opacity: 0;
}
</style>


