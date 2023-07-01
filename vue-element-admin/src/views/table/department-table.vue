<template>
  <el-row>
    <el-row class="tool-bar">
      <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit">编辑</el-button>
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="add">添加</el-button>
      <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteDepartment">删除</el-button>
      <el-button type="primary" size="mini" icon="el-icon-download" @click="exportDataToExcle">导出Excel</el-button>
      <el-input v-model="listQuery.query" size="mini" placeholder="请输入内容" class="input-with-select">
        <el-select slot="prepend" v-model="listQuery.filed" style="width: 100px;" placeholder="请选择">
          <el-option label="科室名称" value="name" />
          <el-option label="科室主任" value="director" />
        </el-select>
        <el-button slot="append" type="primary" plain icon="el-icon-search" @click="getDataList">搜索</el-button>
      </el-input>
    </el-row>
    <el-row class="table">
      <el-table
        ref="multipleTable"
        :loading="listLoading"
        height="565"
        fit
        stripe
        border
        highlight-current-row
        element-loading-text="拼命加载中"
        :data="tableData"
        :row-class-name="tableRowClassName"
        @select="handleSelect"
        @select-all="handleSelectAll"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column type="index" label="序号" width="70" align="center" />
        <el-table-column sortable prop="no" label="科室号" align="center" />
        <el-table-column sortable prop="name" label="科室名称" align="center" />
        <el-table-column sortable prop="telephone" label="电话号码" width="150" align="center" />
        <el-table-column sortable prop="director" label="科室主任" width="200" align="center" />
        <el-table-column sortable prop="address" label="科室地址" align="center" />
        <el-table-column sortable prop="createTime" label="创建时间" :formatter="formatter" align="center" />
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="listQuery.currentPage"
        :page-sizes="[20,50, 100, 500, 1000]"
        :page-size="listQuery.pageSize"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
    <el-row class="form">
      <el-dialog title="添加科室信息" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :show-close="false">
        <el-form :model="form">
          <el-row>
            <el-col :span="10">
              <el-form-item label="科室号" :label-width="formLabelWidth">
                <el-input v-model="form.no" autocomplete="off" />
              </el-form-item>
              <el-form-item label="科室主任" :label-width="formLabelWidth">
                <el-input v-model="form.director" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="科室名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="21">
              <el-form-item label="电话号码" :label-width="formLabelWidth">
                <el-input v-model="form.telephone" autocomplete="off" />
              </el-form-item>
              <el-form-item label="科室地址" :label-width="formLabelWidth">
                <el-input v-model="form.address" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row slot="footer" class="dialog-footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="submitForm()">确 定</el-button>
        </el-row>
      </el-dialog>
    </el-row>
  </el-row>
</template>

<script>
import { departmentList, deleteDepartment, addDepartment, updateDepartment, exportDataToExcle } from '@/api/department'
import { formatDate } from '@/utils/formatter'
import { validDepartmentForm } from '@/utils/valid'
import Vue from 'vue'

export default {
  data() {
    return {
      listLoading: false,
      tableData: [],
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        query: '',
        filed: ''
      },
      total: null,
      dialogFormVisible: false,
      submitVisible: 0,
      form: {
        no: null,
        name: null,
        telephone: null,
        director: null,
        address: null,
        departmentName: null
      },
      formLabelWidth: '120px',
      showFileList: false
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    getDataList() { // 获取表格数据
      this.listLoading = true
      departmentList(this.listQuery).then(response => {
        this.tableData = response.data.content
        this.total = response.data.totalElements
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 2 * 1000)
      })
    },
    add() { // 添加病人信息
      this.submitVisible = 2
      this.dialogFormVisible = true
    },
    edit() { // 修改病人信息
      const selectedData = this.$refs.multipleTable.selection
      if (selectedData.length > 1) {
        Vue.prototype.$message.error('选择的信息条数数过多，请选择一条数据进行修改！')
      } else if (selectedData.length === 0) {
        Vue.prototype.$message.error('请选择一条数据')
      } else {
        this.form.name = selectedData[0].name
        this.form.no = selectedData[0].no
        this.form.director = selectedData[0].director
        this.form.telephone = selectedData[0].telephone
        this.form.address = selectedData[0].address
        this.submitVisible = 1
        this.dialogFormVisible = true
      }
    },
    deleteDepartment() {
      const selectedData = this.$refs.multipleTable.selection
      const nos = []
      const names = []
      const array = {}
      for (let i = 0; i < selectedData.length; i++) {
        names.push(selectedData[i].name)
        nos.push(selectedData[i].no)
        array[nos[i]] = names[i]
      }
      if (names.length === 0) {
        Vue.prototype.$message.error('请先选择')
        return
      }
      this.$confirm(names.toString(), '确定删除下列科室吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDepartment(array).then(response => {
          Vue.prototype.$message.success(response.message)
          this.getDataList()
        })
      })
    },
    submitForm() { // 提交表单中的数据
      if (validDepartmentForm(this.form)) { // 先验证表单中的数据是否正确
        if (this.submitVisible === 1) { // 更新 更新方法走这里
          updateDepartment(this.form).then(response => {
            Vue.prototype.$message.success(response.message)
            this.dialogFormVisible = false
            this.getDataList()
            this.cancelForm()
          })
        } else if (this.submitVisible === 2) { // 添加信息走这里
          addDepartment(this.form).then(response => {
            this.getDataList()
            Vue.prototype.$message.success(response.message)
            this.dialogFormVisible = false
            this.cancelForm()
          })
        }
      }
    },
    exportDataToExcle() {
      exportDataToExcle().then(response => {
        const blob = new Blob([response.data], {
          type: 'application/octet-stream;charset=utf-8'
        })
        const url = window.URL.createObjectURL(blob)
        const fileName = decodeURI(response.headers['content-disposition']).split('filename=')[1] // 对文件名进行解码
        const a = document.createElement('a')
        a.href = url
        a.download = fileName // 文件名称需要自己定义。如果需要知道也可以在header中自定义一个文件名称返回 也可以随机生成一个 我这里是已经提前知道了文件名
        a.click()
        Vue.prototype.$message.success('下载成功')
      })
    },
    cancelForm() { // 取消按钮
      this.dialogFormVisible = false
      this.form.name = null
      this.form.no = null
      this.form.director = null
      this.form.address = null
      this.form.telephone = null
    },
    handleSizeChange(pageSize) { // 改变页面大小
      this.listQuery.pageSize = pageSize
      this.getDataList()
    },
    handleCurrentChange(currentPage) { // 改变当前页数据量
      this.listQuery.currentPage = currentPage
      this.getDataList()
    },
    formatter(row, column) { // 格式化日期
      return formatDate('YYYY-mm-dd', row[column.property])
    },
    handleSelect(selection, row) { // 手动点击勾选框触发的事件
      // selection,row  传递两个参数，row直接是对象
      // 只传一个参数得到的是数组
      if (row.className === 'normal') {
        row.className = 'tableSelectedRowBgColor'
      } else {
        row.className = 'normal'
      }
    },
    handleSelectAll(selection) { // select-all 手动点击全选触发的事件
      if (selection.length > 0) {
        selection.forEach((item) => {
          if (item.className === 'normal') {
            item.className = 'tableSelectedRowBgColor'
          }
        })
      } else {
        // 空数组初始化className
        this.tableData.forEach((item) => {
          if (item.className === 'tableSelectedRowBgColor') {
            item.className = 'normal'
          }
        })
      }
    },
    tableRowClassName({ row }) { // 选中背景色
      return row.className
    },
    handleRowClick(row) { // 点击行触发，切换复选框状态
      this.$refs.multipleTable.toggleRowSelection(row)
      if (row.className === 'normal') {
        row.className = 'tableSelectedRowBgColor'
      } else {
        row.className = 'normal'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.input-with-select {
  float: right;
  margin-left: 10px;
  width: 400px;
}
.upload-demo{
  display: inline-block;
  margin-left: 10px;
}
.tableSelectedRowBgColor td {
  background-color: #fedcbd !important;
}
</style>
