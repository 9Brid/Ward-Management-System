import request from '@/utils/request'

export function wardList(params) {
  return request({
    url: '/ward/paging_query',
    method: 'get',
    params: params
  })
}

export function addWard(data) {
  return request({
    url: '/ward/add',
    method: 'post',
    data: data
  })
}

export function updateWard(data) {
  return request({
    url: '/ward/update',
    method: 'post',
    data: data
  })
}

export function deleteWard(data) {
  return request({
    url: '/ward/delete',
    method: 'post',
    data: data
  })
}

export function exportDataToExcle() {
  return request({
    url: '/ward/exportDataToExcel',
    method: 'get',
    responseType: 'blob'
  })
}

export function getWardNo(params) {
  return request({
    url: '/ward/getWardNo',
    method: 'get',
    params: params
  })
}
