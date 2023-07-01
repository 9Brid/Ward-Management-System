import request from '@/utils/request'

export function departmentList(params) {
  return request({
    url: '/department/paging_query',
    method: 'get',
    params: params
  })
}

export function addDepartment(data) {
  return request({
    url: '/department/add',
    method: 'post',
    data: data
  })
}

export function updateDepartment(data) {
  return request({
    url: '/department/update',
    method: 'post',
    data: data
  })
}

export function deleteDepartment(data) {
  return request({
    url: '/department/delete',
    method: 'post',
    data: data
  })
}

export function exportDataToExcle() {
  return request({
    url: '/department/exportDataToExcel',
    method: 'get',
    responseType: 'blob'
  })
}

export function getDepartment() {
  return request({
    url: '/department/getDepartment',
    method: 'get'
  })
}
