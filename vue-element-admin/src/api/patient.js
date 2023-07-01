import request from '@/utils/request'

export function patientList(params) {
  return request({
    url: '/patient/paging_query',
    method: 'get',
    params: params
  })
}

export function addPatient(data) {
  return request({
    url: '/patient/add',
    method: 'post',
    data: data
  })
}

export function updatePatient(data) {
  return request({
    url: '/patient/update',
    method: 'post',
    data: data
  })
}

export function deletePatient(data) {
  return request({
    url: '/patient/delete',
    method: 'post',
    data: data
  })
}

export function downloadExcelTemplate() {
  return request({
    url: '/patient/downloadExcelTemplate',
    method: 'get',
    responseType: 'blob'
  })
}

export function exportDataToExcle() {
  return request({
    url: '/patient/exportDataToExcel',
    method: 'get',
    responseType: 'blob'
  })
}
