import Vue from 'vue'

/**
 * 病人信息提交时候的验证
 * @param form
 * @returns {boolean}
 */
export function validPatientForm(form) {
  const nameReg = /^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/
  if (form.name === '' || form.name === null) { // 验证姓名
    Vue.prototype.$message.error('请输入姓名！')
    return false
  } else if (!nameReg.test(form.name)) {
    Vue.prototype.$message.error('姓名格式不正确！姓名只能为汉字')
    return false
  }

  if (form.gender === '' || form.gender === null) { // 验证性别
    Vue.prototype.$message.error('请选择性别！')
    return false
  }

  const ageRge = /^[1-9]\d*$/
  if (form.age === '' || form.age === null) { // 验证年龄
    Vue.prototype.$message.error('请输入年龄！')
    return false
  } else if (!ageRge.test(form.age) || form.age < 0 || form > 200) {
    Vue.prototype.$message.error('年龄不合法，请重新输入！')
    return false
  }

  const heightReg = /^[1-9]\d*$/
  if (form.height === '' || form.height === null) { // 验证身高
    Vue.prototype.$message.error('请输入身高！')
    return false
  } else if (!heightReg.test(form.height)) {
    Vue.prototype.$message.error('身高不合法！')
    return false
  }

  const wightReg = /^[1-9]\d*$/
  if (form.wight === '' || form.wight === null) { // 验证体重
    Vue.prototype.$message.error('请输入体重！')
    return false
  } else if (!wightReg.test(form.wight)) {
    Vue.prototype.$message.error('体重不合法！')
    return false
  }

  const telephoneReg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
  if (form.telephone === '' || form.telephone === null) { // 验证手机号
    Vue.prototype.$message.error('请输入电话号码！')
    return false
  } else if (!telephoneReg.test(form.telephone)) {
    Vue.prototype.$message.error('手机号码格式不正确！')
    return false
  }

  const idCardReg = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  if (form.idCard === '' || form.idCard === null) { // 验证身份证号码
    Vue.prototype.$message.error('请输入身份证号！')
    return false
  } else if (!idCardReg.test(form.idCard)) {
    Vue.prototype.$message.error('身份证格式不正确！')
    return false
  }

  const birthdayReg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
  if (form.birthday === '' || form.birthday === null) { // 验证出生日期
    Vue.prototype.$message.error('请选择出生日期！')
    return false
  } else if (!birthdayReg.test(form.birthday)) {
    Vue.prototype.$message.error('出生日期格式有误！')
    return false
  }

  if (form.address === '' || form.address === null) {
    Vue.prototype.$message.error('请输入地址信息！')
    return false
  }
  return true
}

/**
 * 医生表单的验证
 * @param form
 * @returns {boolean}
 */
export function validDoctorForm(form) {
  const nameReg = /^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/
  if (form.name === '' || form.name === null) { // 验证姓名
    Vue.prototype.$message.error('请输入姓名！')
    return false
  } else if (!nameReg.test(form.name)) {
    Vue.prototype.$message.error('姓名格式不正确！姓名只能为汉字')
    return false
  }

  if (form.gender === '' || form.gender === null) { // 验证性别
    Vue.prototype.$message.error('请选择性别！')
    return false
  }

  const ageRge = /^[1-9]\d*$/
  if (form.age === '' || form.age === null) { // 验证年龄
    Vue.prototype.$message.error('请输入年龄！')
    return false
  } else if (!ageRge.test(form.age) || form.age < 0 || form > 200) {
    Vue.prototype.$message.error('年龄不合法，请重新输入！')
    return false
  }

  if (form.qualifications === '' || form.qualifications === null) { // 验证身高
    Vue.prototype.$message.error('请选着学历信心！')
    return false
  }

  if (form.jobTitle === '' || form.jobTitle === null) { // 验证体重
    Vue.prototype.$message.error('请选择职称！')
    return false
  }

  const telephoneReg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
  if (form.telephone === '' || form.telephone === null) { // 验证手机号
    Vue.prototype.$message.error('请输入电话号码！')
    return false
  } else if (!telephoneReg.test(form.telephone)) {
    Vue.prototype.$message.error('手机号码格式不正确！')
    return false
  }

  const idCardReg = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  if (form.idCard === '' || form.idCard === null) { // 验证身份证号码
    Vue.prototype.$message.error('请输入身份证号！')
    return false
  } else if (!idCardReg.test(form.idCard)) {
    Vue.prototype.$message.error('身份证格式不正确！')
    return false
  }

  const birthdayReg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
  if (form.birthday === '' || form.birthday === null) { // 验证出生日期
    Vue.prototype.$message.error('请选择出生日期！')
    return false
  } else if (!birthdayReg.test(form.birthday)) {
    Vue.prototype.$message.error('出生日期格式有误！')
    return false
  }

  if (form.departmentNo === '' || form.departmentNo === null) {
    Vue.prototype.$message.error('请选择科室')
    return false
  }
  return true
}

/**
 * 护士表单的验证
 * @param form
 * @returns {boolean}
 */
export function validNurseForm(form) {
  const nameReg = /^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/
  if (form.name === '' || form.name === null) { // 验证姓名
    Vue.prototype.$message.error('请输入姓名！')
    return false
  } else if (!nameReg.test(form.name)) {
    Vue.prototype.$message.error('姓名格式不正确！姓名只能为汉字')
    return false
  }

  if (form.gender === '' || form.gender === null) { // 验证性别
    Vue.prototype.$message.error('请选择性别！')
    return false
  }

  const ageRge = /^[1-9]\d*$/
  if (form.age === '' || form.age === null) { // 验证年龄
    Vue.prototype.$message.error('请输入年龄！')
    return false
  } else if (!ageRge.test(form.age) || form.age < 0 || form > 200) {
    Vue.prototype.$message.error('年龄不合法，请重新输入！')
    return false
  }

  const telephoneReg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
  if (form.telephone === '' || form.telephone === null) { // 验证手机号
    Vue.prototype.$message.error('请输入电话号码！')
    return false
  } else if (!telephoneReg.test(form.telephone)) {
    Vue.prototype.$message.error('手机号码格式不正确！')
    return false
  }

  const idCardReg = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  if (form.idCard === '' || form.idCard === null) { // 验证身份证号码
    Vue.prototype.$message.error('请输入身份证号！')
    return false
  } else if (!idCardReg.test(form.idCard)) {
    Vue.prototype.$message.error('身份证格式不正确！')
    return false
  }

  const birthdayReg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
  if (form.birthday === '' || form.birthday === null) { // 验证出生日期
    Vue.prototype.$message.error('请选择出生日期！')
    return false
  } else if (!birthdayReg.test(form.birthday)) {
    Vue.prototype.$message.error('出生日期格式有误！')
    return false
  }

  if (form.departmentNo === '' || form.departmentNo === null) {
    Vue.prototype.$message.error('请选择科室')
    return false
  }
  return true
}

/**
 * 部门表单的验证
 * @param form
 * @returns {boolean}
 */
export function validDepartmentForm(form) {
  const noReg = /^[0-9]*$/
  if (form.no === '' || form.no === null) { // 验证科室号
    Vue.prototype.$message.error('请输入科室号！')
    return false
  } else if (!noReg.test(form.no)) {
    Vue.prototype.$message.error('科室号格式错误，科室号只能为数字')
    return false
  }

  if (form.name === '' || form.name === null) { // 验证科室名称
    Vue.prototype.$message.error('请输入科室名称！')
    return false
  }

  const telephoneReg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
  if (form.telephone === '' || form.telephone === null) { // 验证手机号
    Vue.prototype.$message.error('请输入电话号码！')
    return false
  } else if (!telephoneReg.test(form.telephone)) {
    Vue.prototype.$message.error('电话号码格式不正确！')
    return false
  }

  if (form.director === '' || form.director === null) {
    Vue.prototype.$message.error('请输入科室主任')
    return false
  }

  if (form.address === '' || form.address === null) {
    Vue.prototype.$message.error('请输入科室地址')
    return false
  }
  return true
}

/**
 * 病房表单的验证
 * @param form
 * @returns {boolean}
 */
export function validWardForm(form) {
  const noReg = /^[0-9]*$/
  if (form.no === '' || form.no === null) { // 验证病房号
    Vue.prototype.$message.error('请输入病房号！')
    return false
  } else if (!noReg.test(form.no)) {
    Vue.prototype.$message.error('病房号格式错误，病房号只能为数字')
    return false
  }

  if (form.bedNum === '' || form.bedNum === null) {
    Vue.prototype.$message.error('请输入床位数！')
    return false
  }

  if (form.type === '' || form.type === null) {
    Vue.prototype.$message.error('请选择病房类型')
    return false
  }

  if (form.status === '' || form.status === null) {
    Vue.prototype.$message.error('请选择使用状态')
    return false
  }

  if (form.address === '' || form.address === null) {
    Vue.prototype.$message.error('请输入病房地址')
    return false
  }
  return true
}

/**
 * 病历表单的验证
 * @param form
 * @returns {boolean}
 */
export function validHospitalizationForm(form) {
  if (form.patientNo === '' || form.patientNo === null) { // 验证病人号
    Vue.prototype.$message.error('请选择病人！')
    return false
  }

  const departmentNoReg = /^[0-9]*$/
  if (form.departmentNo === '' || form.departmentNo === null) {
    Vue.prototype.$message.error('请选择科室！')
    return false
  } else if (!departmentNoReg.test(form.departmentNo)) {
    Vue.prototype.$message.error('科室错误')
    return false
  }

  const wardNoReg = /^[0-9]*$/
  if (form.wardNo === '' || form.wardNo === null) {
    Vue.prototype.$message.error('请选择病房！')
    return false
  } else if (!wardNoReg.test(form.wardNo)) {
    Vue.prototype.$message.error('病房号格式错误，病房号只能为数字')
    return false
  }

  if (form.bedNo === '' || form.bedNo === null) {
    Vue.prototype.$message.error('请选择病床！')
    return false
  }

  if (form.doctorNo === '' || form.doctorNo === null) {
    Vue.prototype.$message.error('请选择主治医生！')
    return false
  }

  if (form.nurseNo === '' || form.nurseNo === null) {
    Vue.prototype.$message.error('请选择护理人员！')
    return false
  }

  const bllodTypeReg = /^[A-Z]+$/
  if (form.bloodType === '' || form.bloodType === null) {
    Vue.prototype.$message.error('请为选择血型！')
    return false
  } else if (!bllodTypeReg.test(form.bloodType)) {
    Vue.prototype.$message.error('血型格式错误，病房号只能为字母')
    return false
  }

  if (form.type === '' || form.type === null) {
    Vue.prototype.$message.error('请为输入诊断类型！')
    return false
  }

  if (form.type === '' || form.type === null) {
    Vue.prototype.$message.error('请为输入诊断结果！')
    return false
  }

  return true
}
