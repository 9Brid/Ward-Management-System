<template>
  <el-row>
    <el-row class="tool-bar">
      <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit">编辑</el-button>
      <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteHospitalization">删除</el-button>
      <el-button type="primary" size="mini" icon="el-icon-download" @click="exportDataToExcle">导出Excel</el-button>
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
        <el-table-column sortable prop="patient.name" label="姓名" width="150" align="center" />
        <el-table-column sortable prop="patient.gender" label="性别" width="80" align="center" />
        <el-table-column sortable prop="patient.age" label="年龄" width="80" align="center" />
        <el-table-column sortable prop="patient.idCard" label="身份证号" width="200" align="center" />
        <el-table-column sortable prop="bloodType" label="血型" width="110" align="center" />
        <el-table-column sortable prop="type" label="诊断类型" width="200" align="center" />
        <el-table-column sortable prop="result" label="诊断结果" width="150" align="center" />
        <el-table-column sortable prop="status" label="状态" width="100" align="center">
          <template v-slot="scope">
            <span v-show="scope.row.status=== 0" class="row-status1">已出院</span>
            <span v-show="scope.row.status=== 1" class="row-status2">未出院</span>
          </template>
        </el-table-column>
        <el-table-column sortable prop="doctor.name" label="主治医生" width="150" align="center" />
        <el-table-column sortable prop="nurse.name" label="护理人员" width="150" align="center" />
        <el-table-column sortable prop="nurse.telephone" label="护理人员电话" width="200" align="center" />
        <el-table-column sortable prop="wardNo" label="病房号" width="100" align="center" />
        <el-table-column sortable prop="bed.no" label="病床号" width="100" align="center" />
        <el-table-column sortable prop="department.name" label="所属科室" width="150" align="center" />
        <el-table-column sortable prop="createTime" label="创建时间" :formatter="formatter" width="150" align="center" />
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
      <el-dialog :title="form.name" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :show-close="false">
        <el-form :model="form">
          <el-row>
            <el-col :span="12"> <!-- 第一列------------------------------------------ -->
              <el-form-item label="科室" :label-width="formLabelWidth">
                <el-select v-model="form.departmentNo" placeholder="请选择">
                  <el-option v-for="item in departmentNos" :key="item.no" :label="item.name" :value="item.no" />
                </el-select>
              </el-form-item>
              <el-form-item label="病房号" :label-width="formLabelWidth">
                <el-select v-model="form.wardNo" placeholder="请选择" @click.native="valid1(1)">
                  <el-option v-for="item in wardNos" :key="item.no" :label="item.no" :value="item.no" />
                </el-select>
              </el-form-item>
              <el-form-item label="主治医生" :label-width="formLabelWidth">
                <el-select v-model="form.doctorNo" placeholder="请选择" @click.native="valid1(3)">
                  <el-option v-for="item in doctorNos" :key="item.no" :label="item.name" :value="item.no" />
                </el-select>
              </el-form-item>
              <el-form-item label="血型" :label-width="formLabelWidth">
                <el-select v-model="form.bloodType" placeholder="请选择">
                  <el-option label="A" value="A" />
                  <el-option label="B" value="B" />
                  <el-option label="AB" value="AB" />
                  <el-option label="O" value="O" />
                  <el-option label="RH" value="RH" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12"> <!-- 第二列------------------------------------------ -->
              <el-form-item label="状态" :label-width="formLabelWidth">
                <el-select v-model="form.status" placeholder="请选择">
                  <el-option label="已出院" :value="0" />
                  <el-option label="未出院" :value="1" />
                </el-select>
              </el-form-item>
              <el-form-item label="床号" :label-width="formLabelWidth">
                <el-select v-model="form.bedId" placeholder="请选择" @click.native="valid1(2)">
                  <el-option v-for="item in bedNos" :key="item.id" :label="item.no" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="护理人员" :label-width="formLabelWidth">
                <el-select v-model="form.nurseNo" placeholder="请选择" @click.native="valid1(4)">
                  <el-option v-for="item in nurseNos" :key="item.no" :label="item.name" :value="item.no" />
                </el-select>
              </el-form-item>
              <el-form-item label="诊断类型" :label-width="formLabelWidth">
                <el-select v-model="form.type" placeholder="请选择">
                  <el-option label="复杂类型" value="复杂类型" />
                  <el-option label="长期化疗类型" value="长期化疗类型" />
                  <el-option label="急诊类型" value="急诊类型" />
                  <el-option label="简单类型" value="简单类型" />
                  <el-option label="传染类型" value="传染类型" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="诊断结果" :label-width="formLabelWidth">
              <el-input v-model="form.result" autocomplete="off" />
            </el-form-item>
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
import { hospitalizationList, deleteHospitalization, updateHospitalization, exportDataToExcle } from '@/api/hospitalization'
import { formatDate } from '@/utils/formatter'
import { validHospitalizationForm } from '@/utils/valid'
import Vue from 'vue'
import { getWardNo } from '@/api/ward'
import { getBedNo } from '@/api/bed'
import { getDoctorNo } from '@/api/doctor'
import { getNurseNo } from '@/api/nurse'
import { getDepartment } from '@/api/department'

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
      formLabelWidth: '120px',
      showFileList: false,
      form: {
        no: null,
        patientNo: null,
        wardNo: null,
        bedId: null,
        nurseNo: null,
        doctorNo: null,
        departmentNo: null,
        bloodType: null,
        result: null,
        type: null,
        status: null
      },
      departmentNos: [],
      wardNos: [],
      bedNos: [],
      doctorNos: [],
      nurseNos: []
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    getDataList() { // 获取表格数据
      this.listLoading = true
      hospitalizationList(this.listQuery).then(response => {
        this.tableData = response.data.content
        this.total = response.data.totalElements
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 2 * 1000)
      })
    },
    deleteHospitalization() {
      const selectedData = this.$refs.multipleTable.selection
      const nos = []
      const names = []
      const array = {}
      for (let i = 0; i < selectedData.length; i++) {
        names.push(selectedData[i].patient.name)
        nos.push(selectedData[i].no)
        array[nos[i]] = names[i]
      }
      if (names.length === 0) {
        Vue.prototype.$message.error('请先选择')
        return
      }
      this.$confirm(names.toString(), '确定删除下列病历信息吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteHospitalization(array).then(response => {
          Vue.prototype.$message.success(response.message)
          this.getDataList()
        })
      })
    },
    edit() { // 编辑病历信息
      const selectedData = this.$refs.multipleTable.selection
      if (selectedData.length > 1) {
        Vue.prototype.$message.error('选择的信息条数数过多，请选择一条数据进行修改！')
      } else if (selectedData.length === 0) {
        Vue.prototype.$message.error('请选择一条数据')
      } else {
        this.form.no = selectedData[0].no
        this.form.bloodType = selectedData[0].bloodType
        this.form.result = selectedData[0].result
        this.form.type = selectedData[0].type
        this.form.status = selectedData[0].status
        this.form.patientNo = selectedData[0].patientNo
        this.form.wardNo = selectedData[0].wardNo
        this.form.bedId = selectedData[0].bedId
        this.form.nurseNo = selectedData[0].nurseNo
        this.form.doctorNo = selectedData[0].doctorNo
        this.form.departmentNo = selectedData[0].departmentNo

        getDepartment().then(response => { // 加载科室下拉框中的值
          this.departmentNos = response
        })
        getWardNo({ 'departmentNo': this.form.departmentNo }).then(response => {
          this.wardNos = response
        })
        getBedNo({ 'wardNo': this.form.wardNo }).then(response => {
          this.bedNos = response
        })
        getDoctorNo({ 'departmentNo': this.form.departmentNo }).then(response => {
          this.doctorNos = response
        })
        getNurseNo({ 'departmentNo': this.form.departmentNo }).then(response => {
          this.nurseNos = response
        })
        this.dialogFormVisible = true
      }
    },
    submitForm() { // 提交表单中的数据
      if (validHospitalizationForm(this.form)) { // 先验证表单中的数据是否正确
        updateHospitalization(this.form).then(response => {
          Vue.prototype.$message.success(response.message)
          this.getDataList()
          this.dialogFormVisible = false
        })
      }
    },
    cancelForm() { // 取消按钮
      this.dialogFormVisible = false
      this.form.patientNo = null
      this.form.departmentNo = null
      this.form.wardNo = null
      this.form.bedNo = null
      this.form.doctorNo = null
      this.form.nurseNo = null
      this.form.bloodType = null
      this.form.type = null
      this.form.result = null
    },
    valid1(flag) {
      switch (flag) {
        case 1:
          if (this.form.departmentNo === null || this.form.departmentNo === '') {
            Vue.prototype.$message.error('请先选择科室')
          } else {
            getWardNo({ 'departmentNo': this.form.departmentNo }).then(response => {
              this.wardNos = response
            })
          }
          break
        case 2:
          if (this.form.departmentNo === null || this.form.departmentNo === '') {
            Vue.prototype.$message.error('请先选择科室')
          } else if (this.form.wardNo === null || this.form.wardNo === '') {
            Vue.prototype.$message.error('请先选择病房')
          } else {
            getBedNo({ 'wardNo': this.form.wardNo }).then(response => {
              this.bedNos = response
            })
          }
          break
        case 3:
          if (this.form.departmentNo === null || this.form.departmentNo === '') {
            Vue.prototype.$message.error('请先选择科室')
          } else {
            getDoctorNo({ 'departmentNo': this.form.departmentNo }).then(response => {
              this.doctorNos = response
            })
          }
          break
        case 4:
          if (this.form.departmentNo === null || this.form.departmentNo === '') {
            Vue.prototype.$message.error('请先选择科室')
          } else {
            getNurseNo({ 'departmentNo': this.form.departmentNo }).then(response => {
              this.nurseNos = response
            })
          }
          break
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
.row-status2 {
  color: #2f2c2c;
  background-color: #e3ae85;
  padding: 10px 15px;
  border-radius: 10px;
}
.row-status1 {
  color: #2f2c2c;
  background-color: #63b484;
  padding: 10px 15px;
  border-radius: 5px;
}
</style>
