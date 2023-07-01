import request from '@/utils/request'

export function doctorList(params) {
  return request({
    url: '/doctor/paging_query',
    method: 'get',
    params: params
  })
}

export function addDoctor(data) {
  return request({
    url: '/doctor/add',
    method: 'post',
    data: data
  })
}

export function updateDoctor(data) {
  return request({
    url: '/doctor/update',
    method: 'post',
    data: data
  })
}

export function deleteDoctor(data) {
  return request({
    url: '/doctor/delete',
    method: 'post',
    data: data
  })
}

export function downloadExcelTemplate() {
  return request({
    url: '/doctor/downloadExcelTemplate',
    method: 'get',
    responseType: 'blob'
  })
}

export function exportDataToExcle() {
  return request({
    url: '/doctor/exportDataToExcel',
    method: 'get',
    responseType: 'blob'
  })
}

export function getDoctorNo(params) {
  return request({
    url: '/doctor/getDoctorNo',
    method: 'get',
    params: params
  })
}
