<template>
  <div>
    <a href="javascript:;" class="file">
      导入表格
      <input
        id="upload"
        type="file"
        @change="importfxx(this)"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      >
    </a>
    <el-button @click="exportExcel">导出表格</el-button>
    <el-table
    id="out-table"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="status"
        label="姓名"
        width="180">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
 import FileSaver from 'file-saver'
 import XLSX from 'xlsx'
export default {
    data() {
        return {
          tableData: [{
            id: '2016-05-02',
            status: '王小虎',
          }, {
            id: '2016-05-04',
            status: '王小虎',
          }, {
            id: '2016-05-01',
            status: '王小虎',
          }, {
            id: '2016-05-03',
            status: '王小虎',
          }]
        }
      },
  methods: {
    //   导出表格
       exportExcel () {
         /* generate workbook object from table */
         var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
         /* get binary string as output */
         var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
         try {
             FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '敏感词.xlsx')
         } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
         return wbout
     },
    importfxx(obj) {
      let _this = this;
      let inputDOM = this.$refs.inputer;
      // 通过DOM取文件数据
      this.file = event.currentTarget.files[0];
      var rABS = false; //是否将文件读取为二进制字符串
      var f = this.file;
      var reader = new FileReader();
      FileReader.prototype.readAsBinaryString = function(f) {
        var binary = "";
        var rABS = false; //是否将文件读取为二进制字符串
        var pt = this;
        var wb; //读取完成的数据
        var outdata;
        var reader = new FileReader();
        reader.onload = function(e) {
          var bytes = new Uint8Array(reader.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          var XLSX = require("xlsx");
          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              //手动转化
              type: "base64"
            });
          } else {
            wb = XLSX.read(binary, {
              type: "binary"
            });
          }
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
          this.da = [...outdata];
          let arr = [];
          this.da.map(v => {
            let obj = {};
            obj.id = v.id;
            obj.status = v.status;
            arr.push(obj);
          });
          console.log(arr)
          _this.tableData = arr
          let para = {
            withList: arr
          };
          _this.$message({
            message: "导入成功",
            type: "success"
          });
        };
        reader.readAsArrayBuffer(f);
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    }
  }
};
</script>
