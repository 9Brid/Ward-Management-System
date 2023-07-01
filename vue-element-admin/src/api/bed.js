import request from '@/utils/request'

export function bedList(params) {
  return request({
    url: '/bed/query',
    method: 'get',
    params: params
  })
}

export function addBed(data) {
  return request({
    url: '/bed/add',
    method: 'post',
    data: data
  })
}

export function updateBed(data) {
  return request({
    url: '/bed/update',
    method: 'post',
    data: data
  })
}

export function deleteBed(data) {
  return request({
    url: '/bed/delete',
    method: 'post',
    data: data
  })
}

export function getBedNo(params) {
  return request({
    url: '/bed/getBedNo',
    method: 'get',
    params: params
  })
}
