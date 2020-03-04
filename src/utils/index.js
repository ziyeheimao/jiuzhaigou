import Vue from 'vue'
import router from '@/router'
import store from '@/store'
const vue = new Vue()
/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  Vue.cookie.delete('token')
  store.commit('resetStore')
  router.options.isAddDynamicMenuRoutes = false
}

export function clone (arr) {
  let newArr = {}
  for (let k in arr) {
    newArr[k] = arr[k]
  }
  return newArr
}

export const openInfo = function (msg, type = 'i') {
  switch (type) {
    case 'i':
      vue.$message({ showClose: true, message: msg, type: 'info' })
      break
    case 's':
      vue.$message({ showClose: true, message: msg, type: 'success' })
      break
    case 'w':
      vue.$message({ showClose: true, message: msg, type: 'warning' })
      break
    case 'e':
      vue.$message({ showClose: true, message: msg, type: 'error' })
      break
  }
}

export async function confirm (title, callback) {
  vue.$confirm(
        `${title}`,
        '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
      ).then(() => {
        callback()
      })
}
export const time = function (date, reduction) {
  // var Y = date.getFullYear()                                                             // 年
  // var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) // 月
  // var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())                // 日
  if (date === '') return date
  if (!reduction) {
    try {
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours())               // 时
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())         // 分
      var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())         // 秒
      return `${h}:${m}:${s}`
    } catch (e) {
      return ''
    }
  } else {
    let arr = date.split(':')
    if (arr.length !== 3) return []
    return arr
  }
}

export function notNullClone (arr) {
  let newArr = {}
  for (let k in arr) {
    if (arr[k]) newArr[k] = arr[k]
  }
  return newArr
}

//                     对象数组    当前属性值       当前属性名称       目标属性名称
export function getVlaue (arr, currentValue, currentAttribute, targetAttribute) {
  for (let i of arr) {
    if (i[currentAttribute] === currentValue) {
      return i[targetAttribute]
    }
  }
}
