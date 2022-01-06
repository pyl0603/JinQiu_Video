<template>
  <div>
    <top-tab ref="topTab" :tab-list="tabList" @chooseTab="chooseTab" />
    <div class="list">
      <div class="el-col-24 mb20 cada f14">
        <div class="el-col-12 mt10">
          <span class="show-tab cp" :class="{c18c : itemIndex === 0}" @click="tabs(0)">正常版本</span>
          <span class="show-tab cp" :class="{c18c : itemIndex === 1}" @click="tabs(1)">强更版本</span>
        </div>
        <div class="el-col-12 tar">
          <el-button type="dqx-btn" @click="upNew">上传新版本</el-button>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%;">
        <el-table-column prop="name" label="版本号" />
         <el-table-column label="更新时间">
          <template slot-scope="scope">
            {{scope.row.updatedAt | formatTime}}          </template>
        </el-table-column>
        <!-- <el-table-column prop="updatedAt" label="更新时间" /> -->
        <el-table-column prop="introduction" label="版本说明" />
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹窗 -->
    <el-dialog title="添加新版本" :visible.sync="dialogVisible" width="30%" :show-close="false">
      <div class="dialog-cont">
        <div class="ver-info">
          <div class="mb20">
            <em>版本号：</em>
            <el-input v-model="name" v-inputNumberSpecial type="text" placeholder="请输入版本号" />
          </div>
          <div class="mb20">
            <em>版本序号：</em>
            <el-input v-model="version" v-inputNumberLetter type="text" placeholder="请输入版本序号" />
          </div>
          <div class="mb20">
            <em>简介：</em>
            <el-input v-model="introduction" v-inputRule placeholder="请输入简介" />
          </div>
          <div v-if="dialogStatus ==='create'" class="mb20">
            是否强更：
            <el-switch :value="isForce" @change="changeForce" />
          </div>
          <div v-if="type === 0">
            <em>上传：</em>
            <el-button type="dqx-btn">上传安装包</el-button>
            <upload ref="upload" @upAPK="upAPK" />
          </div>
        </div>
        <div slot="footer" class="dialog-footer mt20 tac">
          <el-button type="dqx-btn" @click="createData">保存</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TopTab from '@/views/common/top-tab'
import upload from '@/components/uploadAPK/index'
import { getVersions, addVersions, delVersions } from '@/api/setting'
import { mapGetters } from 'vuex'
import { formatTime } from '@/utils/index.js'
export default {
  components: {
    TopTab,
    upload
  },
  data() {
    return {
      tabList: [{ name: 'iOS', value: 1 }, { name: 'Android', value: 0 }],
      itemIndex: 0,
      tableData: [],
      type: 1, // 请求列表类型(Android、iOS...)
      force: false, // 是否强更版本
      dialogVisible: false,
      dialogStatus: 'create',
      name: '',
      version: '',
      introduction: '',
      isForce: false,
      downloadUrl: ''
    }
  },
  filters: {
    formatTime(time) {
      var date = new Date(time)
      return formatTime(date)
    }
  },
  mounted() {
    this.$store.commit('setPaging', true)
    this.getVerIndex()
  },
  methods: {
    // 新增
    upNew() {
      this.dialogVisible = true
    },
    // 新增
    createData() {
      addVersions({ name: this.name, version: this.version, type: this.type, introduction: this.introduction, force: this.isForce, downloadUrl: this.downloadUrl }).then(_ => {
        this.dialogVisible = false
        this.$message('添加成功')
        this.getVerIndex()
      })
    },
    // 上传apk
    upAPK(val) {
      this.downloadUrl = 'https://cdn.jinqiulive.com/apk/jinqiu_aligned_signed_simplied_dqx.apk'
      this.$message('上传成功')
    },
    // 删除
    del(val) {
      delVersions(val).then(_ => {
        this.$message('删除成功')
        this.getVerIndex()
      })
    },
    // 是否强更版本
    changeForce() {
      this.isForce = !this.isForce
    },
    //   顶部tab
    chooseTab(val) {
      this.downloadUrl = ''
      this.type = val
      this.itemIndex = 0
      this.force = false
    },
    changeForce() {
      this.isForce = !this.isForce
    },
    // 高亮
    tabs(val) {
      this.itemIndex = val
      this.force = val === 1
    },
    // 获取版本
    getVerIndex() {
      getVersions({ page: this.page, type: this.type, force: this.force }).then(
        res => {
          this.tableData = res.data
          this.$store.commit('setTotal', res.meta.pagination.total)
        }
      )
    }
  },
  computed: {
    ...mapGetters(['page']),
    dataList() {
      return [this.page, this.force, this.type]
    }
  },
  watch: {
    dataList(newVal) {
      this.getVerIndex()
    }
  }
}
</script>
<style lang="scss" scoped>
.show-tab {
  display: inline-block;
  width: 120px;
  text-align: center;
}
.show-tab + .show-tab {
  border-left: 1px solid #f5f5f5;
}
/deep/.inputFlieA{
  position: absolute;
  width: 120px;
  margin-top: -40px;
  height: 40px;
  margin-left: 70px;
  opacity: 0;
}
</style>

