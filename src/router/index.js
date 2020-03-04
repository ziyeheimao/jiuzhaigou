/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
import { clearLoginInfo } from '@/utils'
import { baseUrlType } from '@/constants/hostConfig'
Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  { path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } },
  { path: '/test', component: _import('common/test'), name: 'test', meta: { title: '测试' } }
  // { path: '/detail', components:detail}

  // { path: '/', component: _import('common/index'), name: 'index', meta: { title: '首页' } },
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  redirect: { name: 'index' },
  meta: { title: '主入口整体布局' },
  children: [
    // 通过meta对象设置路由展示方式 // #//demo-echarts
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!

    { path: '/index', component: _import('common/index'), name: 'index', meta: { title: '首页' } },

    { path: '/listMattersAdmin', component: _import('common/listMattersAdmin/listMattersAdmin'), name: 'listMattersAdmin', meta: { title: '事项清单管理' } },
    { path: '/newItem', component: _import('common/listMattersAdmin/newItem/newItem'), name: 'newItem', meta: { title: '新建事项' } },
    { path: '/updataItem', component: _import('common/listMattersAdmin/updataItem/updataItem'), name: 'updataItem', meta: { title: '编辑事项' } },

    { path: '/mattersApproval', component: _import('common/mattersApproval'), name: 'mattersApproval', meta: { title: '事项审批' } },
    { path: '/auditDetails', component: _import('common/auditDetails/auditDetails'), name: 'auditDetails', meta: { title: '事项审批详情' } },

    // 表单管理
    { path: '/formAdmin', component: _import('common/formAdmini/formAdmin'), name: 'formAdmin', meta: { title: '表单管理' } },
    { path: '/control', component: _import('common/formAdmini/control'), name: 'control', meta: { title: '控件组管理' } },
    { path: '/addForm', component: _import('common/formAdmini/addForm'), name: 'addForm', meta: { title: '添加表单' } },

    // 通用审批
    { path: '/matterApproval', component: _import('common/approval/matterApproval/matterApproval'), name: 'matterApproval', meta: { title: '事项审批管理' } },

    // 一窗综合管理系统
    // 窗口管理
    { path: '/distinguish', component: _import('common/comprehensiveAcceptance/windowManagement/distinguish'), name: 'distinguish', meta: { title: '窗口区分管理' } },
    { path: '/personnel', component: _import('common/comprehensiveAcceptance/windowManagement/personnel'), name: 'personnel', meta: { title: '窗口人员管理' } },
    { path: '/mattersResidentIn', component: _import('common/comprehensiveAcceptance/windowManagement/mattersResidentIn'), name: 'mattersResidentIn', meta: { title: '事项驻进管理' } },

    // 窗口事项
    { path: '/applicationOffice', component: _import('common/comprehensiveAcceptance/windowItems/applicationOffice/applicationOffice'), name: 'applicationOffice', meta: { title: '申请办件管理' } },
    { path: '/applicationOfficeDetail', component: _import('common/comprehensiveAcceptance/windowItems/applicationOffice/applicationOfficeDetail'), name: 'applicationOfficeDetail', meta: { title: '申请办件管理详情' } },
    { path: '/consultation', component: _import('common/comprehensiveAcceptance/windowItems/consultation/consultation'), name: 'consultation', meta: { title: '事项咨询管理' } },
    { path: '/consultationDetail', component: _import('common/comprehensiveAcceptance/windowItems/consultation/consultationDetail'), name: 'consultationDetail', meta: { title: '事项咨询管理详情' } },
    { path: '/make', component: _import('common/comprehensiveAcceptance/windowItems/make/make'), name: 'make', meta: { title: '事项预约管理' } },
    { path: '/makeDetail', component: _import('common/comprehensiveAcceptance/windowItems/make/makeDetail'), name: 'makeDetail', meta: { title: '事项预约管理详情' } },

    // 电子监察
    { path: '/overtime', component: _import('common/electronicSurveillance/overtime'), name: 'overtime', meta: { title: '超时' } },
    { path: '/achievements', component: _import('common/electronicSurveillance/achievements'), name: 'achievements', meta: { title: '绩效' } },

    // 政务云
    { path: '/myCloudDisk', component: _import('common/governmentAffairsCloud/myCloudDisk'), name: 'myCloudDisk', meta: { title: '政务云' } },

    // 工作流
    { path: '/workflow', component: _import('common/workflow/workflow'), name: 'workflow', meta: { title: '工作流' } },
    { path: '/addWorkflow', component: _import('common/workflow/addWorkflow'), name: 'addWorkflow', meta: { title: '新增工作流' } },

    { path: '/empty', component: _import('common/empty'), name: 'empty', meta: { title: '空白页' } }
    // { path: '/theme', component: _import('common/theme'), name: 'theme', meta: { title: '主题' } },
    // { path: '/demo-echarts', component: _import('demo/echarts'), name: 'demo-echarts', meta: { title: 'demo-echarts', isTab: true } },
    // { path: '/demo-ueditor', component: _import('demo/ueditor'), name: 'demo-ueditor', meta: { title: 'demo-ueditor', isTab: true } }
    // { path: '/detail', component: _import('./../components/deList/detail.vue'), name: '/detail', meta: { title: 'detail', isTab: false } }
  ],
  beforeEnter (to, from, next) {
    let token = Vue.cookie.get('token')
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      next({ name: 'login' })
    }
    next()
  }
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    next()
  } else {
    http({
      url: http.adornUrl('/sys/menu/nav', baseUrlType.sys),
      method: 'get',
      params: http.adornParams()
    }).then(({ data }) => {
      if (data && data.code === 0) {
        fnAddDynamicMenuRoutes(data.bean.menuList)
        router.options.isAddDynamicMenuRoutes = true
        sessionStorage.setItem('menuList', JSON.stringify(data.bean.menuList || '[]'))
        sessionStorage.setItem('permissions', JSON.stringify(data.bean.permissions || '[]'))
        next({ ...to, replace: true })
      } else {
        sessionStorage.setItem('menuList', '[]')
        sessionStorage.setItem('permissions', '[]')
        next()
      }
    }).catch((e) => {
      router.push({ name: 'login' })
    })
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      var route = {
        path: menuList[i].url.replace('/', '-'),
        component: null,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].url}`) || null
        } catch (e) { }
      }
      console.log(12345789, route)
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      { path: '*', redirect: { name: '404' } }
    ])
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
    console.log('\n')
    console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    console.log(mainRoutes.children)
    console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')
  }
}

export default router
