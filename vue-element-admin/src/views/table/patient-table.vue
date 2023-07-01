<template>
  <el-row>
    <el-row class="tool-bar">
      <el-button class="addWard" size="mini" icon="el-icon-circle-plus-outline" @click="addToHospitalization">添加至病房系统</el-button>
      <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit">编辑</el-button>
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="add">添加</el-button>
      <el-button type="primary" size="mini" icon="el-icon-delete" @click="deletePatient">删除</el-button>
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
        <el-table-column sortable prop="name" label="姓名" width="150" align="center" />
        <el-table-column sortable prop="gender" label="性别" width="80" align="center" />
        <el-table-column sortable prop="age" label="年龄" width="80" align="center" />
        <el-table-column sortable prop="height" label="身高(cm)" width="110" align="center" />
        <el-table-column sortable prop="wight" label="体重(kg)" width="100" align="center" />
        <el-table-column sortable prop="telephone" label="电话号码" width="150" align="center" />
        <el-table-column sortable prop="idCard" label="身份证号" width="200" align="center" />
        <el-table-column sortable prop="birthday" label="出生日期" width="200" align="center" />
        <el-table-column sortable prop="address" label="住址" width="600" align="center" />
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
      <el-dialog title="添加病人信息" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :show-close="false">
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
              <el-form-item label="身高" :label-width="formLabelWidth">
                <el-input v-model="form.height" autocomplete="off" placeholder="单位 (cm)" />
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
              <el-form-item label="体重" :label-width="formLabelWidth">
                <el-input v-model="form.wight" autocomplete="off" placeholder="单位 (kg)" />
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
              <el-form-item label="地址" :label-width="formLabelWidth">
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
    <el-row class="form">
      <el-dialog :title="form.name" :visible.sync="dialogFormVisible1" :close-on-click-modal="false" :show-close="false">
        <el-form :model="form1">
          <el-row>
            <el-col :span="12"> <!-- 第一列------------------------------------------ -->
              <el-form-item label="科室" :label-width="formLabelWidth">
                <el-select v-model="form1.departmentNo" placeholder="请选择">
                  <el-option v-for="item in departmentNos" :key="item.no" :label="item.name" :value="item.no" />
                </el-select>
              </el-form-item>
              <el-form-item label="病房号" :label-width="formLabelWidth">
                <el-select v-model="form1.wardNo" placeholder="请选择" @click.native="valid1(1)">
                  <el-option v-for="item in wardNos" :key="item.no" :label="item.no" :value="item.no" />
                </el-select>
              </el-form-item>
              <el-form-item label="主治医生" :label-width="formLabelWidth">
                <el-select v-model="form1.doctorNo" placeholder="请选择" @click.native="valid1(3)">
                  <el-option v-for="item in doctorNos" :key="item.no" :label="item.name" :value="item.no" />
                </el-select>
              </el-form-item>
              <el-form-item label="血型" :label-width="formLabelWidth">
                <el-select v-model="form1.bloodType" placeholder="请选择">
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
                <el-select v-model="form1.status" placeholder="请选择" :disabled="true">
                  <el-option label="已出院" :value="0" />
                  <el-option label="未出院" :value="1" />
                </el-select>
              </el-form-item>
              <el-form-item label="床号" :label-width="formLabelWidth">
                <el-select v-model="form1.bedId" placeholder="请选择" @click.native="valid1(2)">
                  <el-option v-for="item in bedNos" :key="item.id" :label="item.no" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="护理人员" :label-width="formLabelWidth">
                <el-select v-model="form1.nurseNo" placeholder="请选择" @click.native="valid1(4)">
                  <el-option v-for="item in nurseNos" :key="item.no" :label="item.name" :value="item.no" />
                </el-select>
              </el-form-item>
              <el-form-item label="诊断类型" :label-width="formLabelWidth">
                <el-select v-model="form1.type" placeholder="请选择">
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
              <el-input v-model="form1.result" autocomplete="off" />
            </el-form-item>
          </el-row>
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
import { patientList, deletePatient, addPatient, updatePatient, downloadExcelTemplate, exportDataToExcle } from '@/api/patient'
import { addHospitalization } from '@/api/hospitalization'
import { formatDate } from '@/utils/formatter'
import { validPatientForm, validHospitalizationForm } from '@/utils/valid'
import Vue from 'vue'
import { getDepartment } from '@/api/department'
import { getWardNo } from '@/api/ward'
import { getBedNo } from '@/api/bed'
import { getDoctorNo } from '@/api/doctor'
import { getNurseNo } from '@/api/nurse'

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
        gender: null,
        age: null,
        height: null,
        wight: null,
        telephone: null,
        idCard: null,
        birthday: null,
        address: null
      },
      formLabelWidth: '120px',
      showFileList: false,
      dialogFormVisible1: false,
      form1: {
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
    getDepartment().then(response => { // 加载科室下拉框中的值
      this.departmentNos = response
    })
  },
  methods: {
    getDataList() { // 获取表格数据
      this.listLoading = true
      patientList(this.listQuery).then(response => {
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
        this.form.height = selectedData[0].height
        this.form.wight = selectedData[0].wight
        this.form.telephone = selectedData[0].telephone
        this.form.idCard = selectedData[0].idCard
        this.form.address = selectedData[0].address
        this.form.birthday = selectedData[0].birthday
        this.submitVisible = 1
        this.dialogFormVisible = true
      }
    },
    deletePatient() {
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
      this.$confirm(names.toString(), '确定删除下列病人信息吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePatient(array).then(response => {
          Vue.prototype.$message.success(response.message)
          this.getDataList()
        })
      })
    },
    submitForm() { // 提交表单中的数据
      if (validPatientForm(this.form)) { // 先验证表单中的数据是否正确
        if (this.submitVisible === 1) { // 更新 更新方法走这里
          updatePatient(this.form).then(response => {
            Vue.prototype.$message.success(response.message)
            this.dialogFormVisible = false
            this.getDataList()
          })
        } else if (this.submitVisible === 2) { // 添加信息走这里
          addPatient(this.form).then(response => {
            this.getDataList()
            Vue.prototype.$message.success(response.message)
            this.dialogFormVisible = false
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
      return `${process.env.VUE_APP_BASE_API}/patient/uploadExcel` // 需要区分环境所以用process.env.VUE_APP_BASE_API获取基本域名/ip
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
      this.form.address = null
      this.form.height = null
      this.form.wight = null
      this.form.birthday = null
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
    //  -------------------------------------------------------------------------------------------------from1
    addToHospitalization() { // 添加病历信息
      const selectedData = this.$refs.multipleTable.selection
      if (selectedData.length > 1) {
        Vue.prototype.$message.error('选择的信息条数数过多，请选择一条数据进行修改！')
      } else if (selectedData.length === 0) {
        Vue.prototype.$message.error('请选择一条数据')
      } else {
        this.form.name = selectedData[0].name
        this.form1.patientNo = selectedData[0].no
        this.form1.status = 1
        this.dialogFormVisible1 = true
      }
    },
    submitForm1() { // 提交表单中的数据
      if (validHospitalizationForm(this.form1)) { // 先验证表单中的数据是否正确
        addHospitalization(this.form1).then(response => {
          Vue.prototype.$message.success(response.message)
          this.dialogFormVisible1 = false
        })
      }
    },
    cancelForm1() { // 取消按钮
      this.dialogFormVisible1 = false
      this.form1.patientNo = null
      this.form1.departmentNo = null
      this.form1.wardNo = null
      this.form1.bedNo = null
      this.form1.doctorNo = null
      this.form1.nurseNo = null
      this.form1.bloodType = null
      this.form1.type = null
      this.form1.result = null
    },
    valid1(flag) {
      switch (flag) {
        case 1:
          if (this.form1.departmentNo === null || this.form1.departmentNo === '') {
            Vue.prototype.$message.error('请先选择科室')
          } else {
            getWardNo({ 'departmentNo': this.form1.departmentNo }).then(response => {
              this.wardNos = response
            })
          }
          break
        case 2:
          if (this.form1.departmentNo === null || this.form1.departmentNo === '') {
            Vue.prototype.$message.error('请先选择科室')
          } else if (this.form1.wardNo === null || this.form1.wardNo === '') {
            Vue.prototype.$message.error('请先选择病房')
          } else {
            getBedNo({ 'wardNo': this.form1.wardNo }).then(response => {
              this.bedNos = response
            })
          }
          break
        case 3:
          if (this.form1.departmentNo === null || this.form1.departmentNo === '') {
            Vue.prototype.$message.error('请先选择科室')
          } else {
            getDoctorNo({ 'departmentNo': this.form1.departmentNo }).then(response => {
              this.doctorNos = response
            })
          }
          break
        case 4:
          if (this.form1.departmentNo === null || this.form1.departmentNo === '') {
            Vue.prototype.$message.error('请先选择科室')
          } else {
            getNurseNo({ 'departmentNo': this.form1.departmentNo }).then(response => {
              this.nurseNos = response
            })
          }
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.addWard{
  background-color: #f17768;
  color: white;
}
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
