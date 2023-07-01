<template>
  <el-row>
    <el-row class="tool-bar">
      <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit">编辑</el-button>
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="add">添加</el-button>
      <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteNurse">删除</el-button>
      <el-button type="primary" size="mini" icon="el-icon-bottom" @click="downloadExcelTemplate">Excel模板下载</el-button>
      <el-button type="primary" size="mini" icon="el-icon-download" @click="exportDataToExcle">导出Excel</el-button>
      <el-upload class="upload-demo" accept=".xls,.xlsx" :show-file-list="showFileList" :limit="1" :action="uploadUrl()" :on-success="handleUpload1" :on-error="handleUpload2">
        <el-button size="mini" type="primary">导入Excel</el-button>
      </el-upload>
      <el-input v-model="listQuery.query" size="mini" placeholder="请输入内容" class="input-with-select">
        <el-select slot="prepend" v-model="listQuery.filed" style="width: 100px;" placeholder="请选择">
          <el-option label="姓名" value="name" />
          <el-option label="身份证号" value="idCard" />
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
        <el-table-column sortable prop="name" label="姓名" align="center" />
        <el-table-column sortable prop="gender" label="性别" align="center" />
        <el-table-column sortable prop="age" label="年龄" align="center" />
        <el-table-column sortable prop="telephone" label="电话号码" width="150" align="center" />
        <el-table-column sortable prop="idCard" label="身份证号" width="200" align="center" />
        <el-table-column sortable prop="birthday" label="出生日期" align="center" />
        <el-table-column sortable prop="departmentName" label="部门名称" align="center" />
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
      <el-dialog title="添加护士信息" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :show-close="false">
        <el-form :model="form">
          <el-row>
            <el-col :span="10">
              <el-form-item label="姓名" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" />
              </el-form-item>
              <el-form-item label="性别" :label-width="formLabelWidth">
                <el-radio v-model="form.gender" label="男" border>男</el-radio>
                <el-radio v-model="form.gender" label="女" border>女</el-radio>
              </el-form-item>
              <el-form-item label="科室" :label-width="formLabelWidth">
                <el-select v-model="form.departmentNo" placeholder="请选择">
                  <el-option v-for="item in departmentNos" :key="item.no" :label="item.name" :value="item.no" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="年龄" :label-width="formLabelWidth">
                <el-input v-model="form.age" />
              </el-form-item>
              <el-form-item label="出生日期" :label-width="formLabelWidth">
                <el-date-picker
                  v-model="form.birthday"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="21">
              <el-form-item label="电话号码" :label-width="formLabelWidth">
                <el-input v-model="form.telephone" autocomplete="off" />
              </el-form-item>
              <el-form-item label="身份证号" :label-width="formLabelWidth">
                <el-input v-model="form.idCard" autocomplete="off" />
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
import { nurseList, deleteNurse, addNurse, updateNurse, downloadExcelTemplate, exportDataToExcle } from '@/api/nurse'
import { formatDate } from '@/utils/formatter'
import { validNurseForm } from '@/utils/valid'
import { getDepartment } from '@/api/department'
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
        name: null,
        gender: null,
        age: null,
        telephone: null,
        idCard: null,
        birthday: null,
        departmentNo: null,
        departmentName: null
      },
      formLabelWidth: '120px',
      showFileList: false,
      departmentNos: []
    }
  },
  created() {
    this.getDataList()
    getDepartment().then(response => { // 加载科室下拉框中的值
      this.departmentNos = response
    })
  },
  methods: {
    getDataList() { // 获取表格数据
      this.listLoading = true
      nurseList(this.listQuery).then(response => {
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
        this.form.age = selectedData[0].age
        this.form.gender = selectedData[0].gender
        this.form.telephone = selectedData[0].telephone
        this.form.idCard = selectedData[0].idCard
        this.form.departmentNo = selectedData[0].departmentNo
        this.form.birthday = selectedData[0].birthday
        this.submitVisible = 1
        this.dialogFormVisible = true
      }
    },
    deleteNurse() {
      const selectedData = this.$refs.multipleTable.selection
      const idCards = []
      const names = []
      const array = {}
      for (let i = 0; i < selectedData.length; i++) {
        names.push(selectedData[i].name)
        idCards.push(selectedData[i].idCard)
        array[idCards[i]] = names[i]
      }
      if (names.length === 0) {
        Vue.prototype.$message.error('请先选择')
        return
      }
      this.$confirm(names.toString(), '确定删除下列护士信息吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteNurse(array).then(response => {
          Vue.prototype.$message.success(response.message)
          this.getDataList()
        })
      })
    },
    submitForm() { // 提交表单中的数据
      if (validNurseForm(this.form)) { // 先验证表单中的数据是否正确
        if (this.submitVisible === 1) { // 更新 更新方法走这里
          updateNurse(this.form).then(response => {
            Vue.prototype.$message.success(response.message)
            this.dialogFormVisible = false
            this.getDataList()
            this.cancelForm()
          })
        } else if (this.submitVisible === 2) { // 添加信息走这里
          addNurse(this.form).then(response => {
            this.getDataList()
            Vue.prototype.$message.success(response.message)
            this.dialogFormVisible = false
            this.cancelForm()
          })
        }
      }
    },
    downloadExcelTemplate() { // 下载Excel模板
      downloadExcelTemplate().then(response => {
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
    uploadUrl() {
      return `${process.env.VUE_APP_BASE_API}/nurse/uploadExcel` // 需要区分环境所以用process.env.VUE_APP_BASE_API获取基本域名/ip
    },
    handleUpload1(response) {
      this.getDataList()
      Vue.prototype.$message.success(response.message)
    },
    handleUpload2(response) {
      Vue.prototype.$message.error(response.message)
    },
    cancelForm() { // 取消按钮
      this.dialogFormVisible = false
      this.form.name = null
      this.form.gender = null
      this.form.age = null
      this.form.idCard = null
      this.form.telephone = null
      this.form.departmentNo = null
      this.form.birthday = null
      this.form.qualifications = null
      this.form.jobTitle = null
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
