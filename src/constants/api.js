import http from '../utils/httpRequest'

// get delete 请求
const paramsAjax = (url, type, params = {}, configObj = {}) => {
  return new Promise((resolve, reject) => {
    http({
      url: http.adornUrl(url),
      method: type,
      params: http.adornParams(params)
    }).then((res) => {
      resolve(res)
    })
  })
}

// put post 请求
const adornAjax = function (url, type, data = {}, configObj = {}) {
  return new Promise((resolve, reject) => {
    http({
      url: http.adornUrl(url),
      method: type,
      data: http.adornParams(data)
    }).then((res) => {
      resolve(res)
    })
  })
}

export const adornUrl = (url) => {
  return http.adornUrl(url)
}

// 区分请求方式
export const shunt = (url, type, data, configObj) => {
  if (type === 'get' || type === 'Get' || type === 'GET' || type === 'delete' || type === 'Delete' || type === 'DELETE') {
    return new Promise((resolve, reject) => {
      paramsAjax(url, type, data, configObj).then(({data}) => {
        resolve(data)
      })
    })
  } else if (type === 'post' || type === 'Post' || type === 'POST' || type === 'put' || type === 'Put' || type === 'PUT') {
    return new Promise((resolve, reject) => {
      adornAjax(url, type, data, configObj).then(({data}) => {
        resolve(data)
      })
    })
  } else {
    throw new Error('请求方式错误')
  }
}
