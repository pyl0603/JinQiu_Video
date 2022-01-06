<template>
  <div class="newTag" v-if="dialogVisible">
    <!-- 弹窗 -->
    <el-dialog title="添加标签" :visible.sync="show" width="30%" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <div class="dialog-cont">
        <div>
          <div class="search-match mt20">
            <em>新增标签：</em>
            <el-input placeholder="请输入" v-model="tags"></el-input>
            <el-button type="dqx-btn" class="ml10" @click="sear">查重</el-button>
          </div>
          <div class="res-list mt20">
            查询结果：
            <div>
              <span
                v-for="item in resList"
                :key="item.id"
              >{{item.name}}</span>
            </div>
          </div>
          <div slot="footer" class="dialog-footer mt20 tac">
            <el-button type="dqx-btn" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
            <el-button @click="cancel">取消</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getTags,addTags,updateTags } from '@/api/edit'
export default {
  props: {
    dialogStatus: {
      type: String,
      default: "create"
    },
    dialogVisible:{
      type:Boolean,
      default:false
    },
    id:{
      type:Number
    },
    tagsNameVal:{
      type:String
    }
  },
  data() {
    return {
      resList:[],
      tags:'',
      show:true
    };
  },
  methods: {
    // 新增
    createData() {
      addTags({name:this.tags}).then(_ => {
        this.$message('新增成功')
        this.$emit('cancel',this.tags)
      })
    },
    // 编辑
    updateData() {
      updateTags({id:this.id,name:this.tags}).then(_ => {
        this.$message('修改成功')
        this.$emit('cancel')
      })
    },
    // 查询
    sear(){
        getTags({name:this.tags}).then(res => {
            this.resList = res.data;
        })
    },
    // 取消
    cancel(){
      this.$emit('cancel')
    },
  },
  watch:{
    tagsNameVal(newVal){
      this.tags = newVal;
    }
  }
};
</script>
<style lang="scss" scoped>
.res-list div{
  display: inline-block;
  width: calc(100% - 120px);
  padding: 0 10px;
  max-height: 120px;
  overflow-y: scroll;
  background:rgba(249,249,249,1);
  border:1px solid rgba(206,206,206,1);
  border-radius:8px;
  &::-webkit-scrollbar {
    display: none;
  }
  span{
    display: block;
    line-height: 30px;
  }
}
</style>
