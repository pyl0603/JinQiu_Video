<template>
  <div class="folder-mana">
    <el-row>
      <span class="el-col-12">
        <el-button type="dqx-btn">添加文件夹</el-button>
      </span>
      <span class="el-col-12 tar">
        搜索：
        <el-input placeholder="请输入"></el-input>
        <el-button type="dqx-btn" class="ml20">查询</el-button>
      </span>
    </el-row>
    <el-row class="mt30">
      <el-tree
        :data="data"
        show-checkbox
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
      >
        <span class="custom-tree-node tar" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text" size="mini" @click="() => append(data)">编辑</el-button>
            <el-button type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
            <el-button type="text" size="mini" @click="() => remove(node, data)">添加</el-button>
          </span>
        </span>
      </el-tree>
    </el-row>
  </div>
</template>
<script>
let id = 10;
export default {
  data() {
    return {
      data: [
        {
          id: 1,
          label: "第一级文件夹",
          children: [
            {
              id: 4,
              label: "第二级文件夹",
              children: [
                {
                  id: 9,
                  label: "第三级文件夹"
                },
                {
                  id: 10,
                  label: "第三级文件夹"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "第一级文件夹",
          children: [
            {
              id: 5,
              label: "第二级文件夹"
            },
            {
              id: 6,
              label: "第二级文件夹"
            }
          ]
        },
        {
          id: 3,
          label: "第一级文件夹",
          children: [
            {
              id: 7,
              label: "第二级文件夹"
            },
            {
              id: 8,
              label: "第二级文件夹"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  }
};
</script>
<style lang="scss" scoped>
.folder-mana {
  /deep/.el-input {
    width: 250px;
  }
  /deep/.el-tree-node__content{
    // padding: 5px 0;
    height: 50px;
  }
  /deep/.custom-tree-node {
    display: block;
    width: 100%;
    text-align: left;
    span:first-child {
      display: inline-block;
      width: 40%;
    }
    span:nth-child(2) {
      display: inline-block;
      width: 50%;
      text-align: right;
      position: absolute;
      right: 40px;
    }
  }
}
</style>

