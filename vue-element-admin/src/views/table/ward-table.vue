<template>
  <el-row>
    <el-row class="tool-bar">
      <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit">编辑</el-button>
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="add">添加</el-button>
      <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteWard">删除</el-button>
      <el-button type="primary" size="mini" icon="el-icon-download" @click="exportDataToExcle">导出Excel</el-button>
      <el-input v-model="listQuery.query" size="mini" placeholder="请输入内容" class="input-with-select">
        <el-select slot="prepend" v-model="listQuery.filed" style="width: 100px;" placeholder="请选择">
          <el-option label="病房号" value="no" />
          <el-option label="类型" value="type" />
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
        <el-table-column sortable prop="no" label="病房号" align="center" />
        <el-table-column sortable prop="bedNum" label="床位数" align="center" />
        <el-table-column sortable prop="address" label="病房地址" align="center" />
        <el-table-column sortable prop="type" label="病房类型" align="center" />
        <el-table-column sortable prop="status" label="状态" align="center">
          <template v-slot="scope">
            <span v-show="scope.row.status=== 0">未使用</span>
            <span v-show="scope.row.status=== 1">已使用</span>
          </template>
        </el-table-column>
        <el-table-column sortable prop="departmentName" label="所在科室" align="center" />
        <el-table-column sortable prop="createTime" label="创建时间" :formatter="formatter" align="center" />
        <el-table-column sortable label="操作" align="center">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
            >详情</el-button>
          </template>
        </el-table-column>
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
    <!--  添加病房信息-->
    <el-row class="form">
      <el-dialog title="添加病房信息" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :show-close="false">
        <el-form :model="form">
          <el-row>
            <el-col :span="10">
              <el-form-item label="房号" :label-width="formLabelWidth">
                <el-input v-model="form.no" autocomplete="off" />
              </el-form-item>
              <el-form-item label="床位数" :label-width="formLabelWidth">
                <el-input v-model="form.bedNum" />
              </el-form-item>
              <el-form-item label="科室" :label-width="formLabelWidth">
                <el-select v-model="form.departmentNo" placeholder="请选择">
                  <el-option
                    v-for="item in departmentNos"
                    :key="item.no"
                    :label="item.name"
                    :value="item.no"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="病房类型" :label-width="formLabelWidth">
                <el-select v-model="form.type" placeholder="请选择">
                  <el-option label="普通病房" value="普通病房" />
                  <el-option label="隔离病房" value="隔离病房" />
                  <el-option label="隔绝病房" value="隔绝病房" />
                  <el-option label="保护病房" value="保护病房" />
                </el-select>
              </el-form-item>
              <el-form-item label="病房状态" :label-width="formLabelWidth">
                <el-select v-model="form.status" placeholder="请选择">
                  <el-option label="未使用" :value="0" />
                  <el-option label="已使用" :value="1" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="21">
              <el-form-item label="病房地址" :label-width="formLabelWidth">
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
    <el-row>
      <el-dialog title="病床信息" :visible.sync="dialogVisible" :close-on-click-modal="false">
        <el-button type="primary" size="mini" icon="el-icon-edit" @click="editBed">编辑</el-button>
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addBed">添加</el-button>
        <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteBed">删除</el-button>
        <el-table
          ref="multipleTable1"
          laoding
          fit
          stripe
          border
          highlight-current-row
          :data="bedData"
          @select="handleSelect"
          @select-all="handleSelectAll"
          @row-click="handleRowClick"
        >
          <el-table-column type="selection" align="center" />
          <el-table-column type="index" label="序号" width="70" align="center" />
          <el-table-column sortable prop="no" label="病床号" align="center" />
          <el-table-column sortable prop="wardNo" label="病房号" align="center" />
          <el-table-column sortable prop="status" label="状态" align="center">
            <template v-slot="scope">
              <span v-show="scope.row.status=== 0">未使用</span>
              <span v-show="scope.row.status=== 1">已使用</span>
              <span v-show="scope.row.status=== 2">待清理</span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="createTime" label="创建时间" :formatter="formatter" align="center" />
        </el-table>
      </el-dialog>
    </el-row>
    <!--  添加病床信息-->
    <el-row class="form">
      <el-dialog title="添加病床信息" :visible.sync="dialogBedFormVisible" :close-on-click-modal="false" :show-close="false">
        <el-form :model="form1">
          <el-form-item label="床号" :label-width="formLabelWidth">
            <el-input v-model="form1.no" autocomplete="off" />
          </el-form-item>
          <el-form-item label="病房状态" :label-width="formLabelWidth">
            <el-select v-model="form1.status" placeholder="请选择">
              <el-option label="未使用" :value="0" />
              <el-option label="已使用" :value="1" />
              <el-option label="待清理" :value="2" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-row slot="footer" class="dialog-footer">
          <el-button @click="cancelForm1">取 消</el-button>
          <el-button type="primary" @click="submitForm1()">确 定</el-button>
        </el-row>
      </el-dialog>
    </el-row>
  </el-row>
</template>

<script>
import { wardList, deleteWard, addWard, updateWard, exportDataToExcle } from '@/api/ward'
import { bedList, deleteBed, addBed, updateBed } from '@/api/bed'
import { getDepartment } from '@/api/department'
import { formatDate } from '@/utils/formatter'
import { validWardForm } from '@/utils/valid'
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
        bedNum: null,
        address: null,
        type: null,
        status: null,
        departmentNo: null,
        createTime: null
      },
      formLabelWidth: '120px',
      showFileList: false,
      dialogVisible: false,
      form1: {
        id: null,
        no: null,
        status: null,
        wardNo: null,
        createTime: null
      },
      bedData: [],
      departmentNos: [],
      submitVisible1: 0,
      dialogBedFormVisible: false
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
      wardList(this.listQuery).then(response => {
        this.tableData = response.data.content
        this.total = response.data.totalElements
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 2 * 1000)
      })
    },
    add() { // 需改病房信息
      this.submitVisible = 2
      this.dialogFormVisible = true
    },
    edit() { // 修改病房信息
      const selectedData = this.$refs.multipleTable.selection
      if (selectedData.length > 1) {
        Vue.prototype.$message.error('选择的信息条数数过多，请选择一条数据进行修改！')
      } else if (selectedData.length === 0) {
        Vue.prototype.$message.error('请选择一条数据')
      } else {
        this.form.no = selectedData[0].no
        this.form.bedNum = selectedData[0].bedNum
        this.form.address = selectedData[0].address
        this.form.type = selectedData[0].type
        this.form.status = selectedData[0].status
        this.form.departmentNo = selectedData[0].departmentNo
        this.submitVisible = 1
        this.dialogFormVisible = true
      }
    },
    deleteWard() {
      const selectedData = this.$refs.multipleTable.selection
      const nos = []
      for (let i = 0; i < selectedData.length; i++) {
        nos.push(selectedData[i].no)
      }
      if (nos.length === 0) {
        Vue.prototype.$message.error('请先选择')
        return
      }
      this.$confirm(nos.toString(), '确定删除下列病房信息吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteWard(nos).then(response => {
          Vue.prototype.$message.success(response.message)
          this.getDataList()
        })
      })
    },
    submitForm() { // 提交表单中的数据
      if (validWardForm(this.form)) { // 先验证表单中的数据是否正确
        if (this.submitVisible === 1) { // 更新 更新方法走这里
          updateWard(this.form).then(response => {
            Vue.prototype.$message.success(response.message)
            this.dialogFormVisible = false
            this.getDataList()
          })
        } else if (this.submitVisible === 2) { // 添加信息走这里
          addWard(this.form).then(response => {
            this.getDataList()
            Vue.prototype.$message.success(response.message)
            this.dialogFormVisible = false
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
      this.form.no = null
      this.form.bedNum = null
      this.form.address = null
      this.form.type = null
      this.form.status = null
      this.form.departmentNo = null
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
    },

    handleEdit(index, row) {
      this.dialogVisible = true
      const param = { 'wardNo': row.no }
      this.form1.wardNo = row.no
      bedList(param).then(response => {
        this.bedData = response.data
      })
    },
    addBed() { // 需改病床信息
      this.submitVisible1 = 2
      this.dialogBedFormVisible = true
    },
    editBed() { // 修改病床信息
      const selectedData = this.$refs.multipleTable1.selection
      if (selectedData.length > 1) {
        Vue.prototype.$message.error('选择的信息条数数过多，请选择一条数据进行修改！')
      } else if (selectedData.length === 0) {
        Vue.prototype.$message.error('请选择一条数据')
      } else {
        this.form1.id = selectedData[0].id
        this.form1.no = selectedData[0].no
        this.form1.status = selectedData[0].status
        this.submitVisible1 = 1
        this.dialogBedFormVisible = true
      }
    },
    deleteBed() {
      const selectedData = this.$refs.multipleTable1.selection
      const nos = []
      for (let i = 0; i < selectedData.length; i++) {
        nos.push(selectedData[i].no)
      }
      nos.push(selectedData[0].wardNo) // 添加病床号
      this.$confirm(nos.toString(), '确定删除下列病床信息吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBed(nos).then(response => {
          Vue.prototype.$message.success(response.message)
          const param = { 'wardNo': this.form1.wardNo }
          bedList(param).then(response => { // 重新加载病床信息
            this.bedData = response.data
          })
          this.getDataList()
        })
      })
    },
    submitForm1() { // 提交表单中的数据
      if (this.submitVisible1 === 1) { // 更新 更新方法走这里
        updateBed(this.form1).then(response => {
          Vue.prototype.$message.success(response.message)
          const param = { 'wardNo': this.form1.wardNo }
          bedList(param).then(response => { // 重新加载病床信息
            this.bedData = response.data
          })
          this.dialogBedFormVisible = false
        })
      } else if (this.submitVisible1 === 2) { // 添加信息走这里
        addBed(this.form1).then(response => {
          Vue.prototype.$message.success(response.message)
          const param = { 'wardNo': this.form1.wardNo }
          bedList(param).then(response => { // 重新加载病床信息
            this.bedData = response.data
          })
          this.dialogBedFormVisible = false
          this.getDataList()
        })
      }
    },
    cancelForm1() { // 取消按钮
      this.dialogBedFormVisible = false
      this.form1.no = null
      this.form1.status = null
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
