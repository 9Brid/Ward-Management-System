import request from '@/utils/request'

export function hospitalizationList(params) {
  return request({
    url: '/hospitalization/paging_query',
    method: 'get',
    params: params
  })
}

export function addHospitalization(data) {
  return request({
    url: '/hospitalization/add',
    method: 'post',
    data: data
  })
}

export function updateHospitalization(data) {
  return request({
    url: '/hospitalization/update',
    method: 'post',
    data: data
  })
}

export function deleteHospitalization(data) {
  return request({
    url: '/hospitalization/delete',
    method: 'post',
    data: data
  })
}

export function exportDataToExcle() {
  return request({
    url: '/hospitalization/exportDataToExcel',
    method: 'get',
    responseType: 'blob'
  })
}
