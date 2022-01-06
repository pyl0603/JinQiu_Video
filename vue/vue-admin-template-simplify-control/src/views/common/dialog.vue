<template>
    <div class="dialog">
        <!-- 弹窗 -->
    <!-- 弹窗 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :show-close="false">
      <div class="dialog-cont">
        <div>
          <em>邮箱账号：</em>
          <el-input placeholder="请输入"></el-input>
          <el-button type="dqx-btn" class="ml20">发送</el-button>
        </div>
         <div class="mt30">
          <em>验证码：</em>
           <el-input placeholder="请输入"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="dqx-btn" @click="dialogVisible = false">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    </div>
</template>
<script>
export default {
  data(){
    return{
      dialogVisible:false
    }
  }
}
</script>
