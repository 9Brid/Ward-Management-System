import request from '@/utils/request'

export function nurseList(params) {
  return request({
    url: '/nurse/paging_query',
    method: 'get',
    params: params
  })
}

export function addNurse(data) {
  return request({
    url: '/nurse/add',
    method: 'post',
    data: data
  })
}

export function updateNurse(data) {
  return request({
    url: '/nurse/update',
    method: 'post',
    data: data
  })
}

export function deleteNurse(data) {
  return request({
    url: '/nurse/delete',
    method: 'post',
    data: data
  })
}

export function downloadExcelTemplate() {
  return request({
    url: '/nurse/downloadExcelTemplate',
    method: 'get',
    responseType: 'blob'
  })
}

export function exportDataToExcle() {
  return request({
    url: '/nurse/exportDataToExcel',
    method: 'get',
    responseType: 'blob'
  })
}

export function getNurseNo(params) {
  return request({
    url: '/nurse/getNurseNo',
    method: 'get',
    params: params
  })
}
