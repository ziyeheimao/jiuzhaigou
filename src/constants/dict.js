import httpRequest from '@/utils/httpRequest'
export function sysDict () {
  return httpRequest({
    url: httpRequest.adornUrl('/equip/affiliation/list/sys'),
    method: 'get',
    params: httpRequest.adornParams()
  })
}

export function levelDict (id) {
  return httpRequest({
    url: httpRequest.adornUrl('/equip/affiliation/list/level'),
    method: 'get',
    params: httpRequest.adornParams({id})
  })
}
