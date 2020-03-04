// import * as a from './api'
import { shunt, adornUrl } from '@/constants/api'
import VueCookie from 'vue-cookie'

const api = {
  // 事项基础信息 Work Controller -----------------------------------------------------------------------
  workPage: (data) => {
    return shunt(`/work`, 'get', data) // 获取 Work事项清单 分页+模糊+条件
  },

  workAdd: (data) => {
    return shunt(`/work`, 'post', data) // 添加 Work事项
  },

  workUpdataById: (data) => {
    return shunt(`/work`, 'put', data) // 通过id更新Work事项清单
  },

  workGetById: (id, data) => {
    return shunt(`/work/${id}`, 'get', data) // 通过id获取Work
  },

  workDeleById: (id) => {
    return shunt(`/work/${id}`, 'delete') // 通过id删除Work
  },

  workUpdate: (data) => {
    return shunt(`/work/update`, 'put', data) // 提交变更申请 修改传多个对象无改动的传null
  },

  workUpdateStatus: (data) => {
    return shunt(`/work/update/status`, 'put', data) // 通过id更新Work状态status=2-上报 4-申请启用5-申请停用 6-申请废止
  },

  workworkUpdataStatusById: (data) => {
    return shunt(`/update/status`, 'put', data) // 通过id更新Work状态
  },
  // 事项基础信息 Work Controller -----------------------------------------------------------------------

  // 事项实施信息 Work Implementation Controller -----------------------------------------------------------------------
  workImplementationPage: (data) => {
    return shunt(`/work/implementation`, 'GET', data) // WorkImplementation获取分页列表
  },

  workImplementationAdd: (data) => {
    return shunt(`/work/implementation`, 'POST', data) // 添加WorkImplementation
  },

  workImplementationUpdataById: (data) => {
    return shunt(`/work/implementation`, 'PUT', data) // 通过id更新WorkImplementation
  },

  workImplementationById: (data, id) => {
    return shunt(`/work/implementation/${id}`, 'PUT', data) // 通过id获取WorkImplementation
  },

  workImplementationDelById: (data, id) => {
    return shunt(`/work/implementation/${id}`, 'DELETE', data) // 通过id删除WorkImplementation
  },

  workImplementationByWorkId: (workId, data) => {
    return shunt(`/work/implementation/workId/${workId}`, 'get', data) // 通过workid获取WorkImplementation
  },
  // 事项实施信息 Work Implementation Controller -----------------------------------------------------------------------

  // 事项审批管理 Work Audit Controller -----------------------------------------------------------------------
  workAuditPage: (data) => {
    return shunt(`/work-audit`, 'GET', data) // WorkAudit获取分页列表
  },

  workAuditAdd: (data) => {
    return shunt(`/work-audit`, 'POST', data) // 添加WorkAudit
  },

  workAuditUpdataById: (data) => {
    return shunt(`/work-audit`, 'PUT', data) // 通过id更新WorkAudit
  },

  workAuditById: (id, data) => {
    return shunt(`/work-audit/${id}`, 'GET', data) // 通过id获取WorkAudit
  },

  workAuditDelById: (data, id) => {
    return shunt(`/work-audit/${id}`, 'DELETE', data) // 通过id删除WorkAudit
  },

  workAuditAuditPost: (data) => {
    return shunt(`/work-audit/auditPost`, 'POST', data) // 提交审批意见
  },
  // 事项审批管理 Work Audit Controller -----------------------------------------------------------------------

  // 事项审核要点 Work Audit Point Controller -----------------------------------------------------------------------
  workAuditPointPage: (data) => {
    return shunt(`/work/audit-point`, 'GET', data) // WorkAuditPoint获取分页列表
  },

  workAuditPointAdd: (data) => {
    return shunt(`/work/audit-point`, 'POST', data) // 添加WorkAuditPoint
  },

  workAuditPointUpdata: (data) => {
    return shunt(`/work/audit-point`, 'PUT', data) // 通过id更新WorkAuditPoint id ???????????
  },

  workAuditPointById: (id) => {
    return shunt(`/work/audit-point/${id}`, 'GET') // 通过id获取WorkAuditPoint
  },

  workAuditPointDelById: (id) => {
    return shunt(`/work/audit-point/${id}`, 'DELETE') // 通过id删除WorkAuditPoint
  },

  workAuditPointDelIds: (data) => {
    return shunt(`/work/audit-point/ids`, 'post', data) // 通过数组id删除WorkAuditPoint
  },
  // 事项审核要点 Work Audit Point Controller -----------------------------------------------------------------------

  // 事项常见问题 Work Question Controller -----------------------------------------------------------------------
  workQuestionPage: (data) => {
    return shunt(`/work/question`, 'GET', data) // WorkQuestion获取分页列表
  },

  workQuestionAdd: (data) => {
    return shunt(`/work/question`, 'POST', data) // 添加WorkQuestion
  },

  workQuestionUpdata: (data) => {
    return shunt(`/work/question`, 'PUT', data) // 通过id更新WorkQuestion
  },

  workQuestionById: (id) => {
    return shunt(`/work/question/${id}`, 'GET') // 通过id获取WorkQuestion
  },

  workQuestionDelById: (id) => {
    return shunt(`/work/question/${id}`, 'DELETE') // 通过id删除WorkQuestion
  },

  workQuestionDelByIds: (data) => {
    return shunt(`/work/question/ids`, 'POST', data) // 通过数组id删除Question
  },
  // 事项常见问题 Work Question Controller -----------------------------------------------------------------------

  // 事项操作日志 Work Operate Log Controller -----------------------------------------------------------------------
  workOperateLogPage: (data) => {
    return shunt(`/work/operate-log`, 'GET', data) // WorkOperateLog获取分页列表
  },

  workOperateLogAdd: (data) => {
    return shunt(`/work/operate-log`, 'POST', data) // 添加WorkOperateLog
  },

  workOperateLogUpdata: (data) => {
    return shunt(`/work/operate-log`, 'PUT', data) // 通过id更新WorkOperateLog
  },

  workOperateLogById: (data, id) => {
    return shunt(`/work/operate-log/${id}`, 'GET', data) // 通过id获取WorkOperateLog
  },

  workOperateLogDelById: (data, id) => {
    return shunt(`/work/operate-log/${id}`, 'DELETE', data) // 通过id删除WorkOperateLog
  },
  // 事项操作日志 Work Operate Log Controller -----------------------------------------------------------------------

  // 事项服务信息 Work Service Info Controller -----------------------------------------------------------------------
  workServiceInfoPage: (data) => {
    return shunt(`/work/service-info`, 'GET', data) // WorkServiceInfo获取分页列表
  },

  workServiceInfoAdd: (data) => {
    return shunt(`/work/service-info`, 'POST', data) // 添加WorkServiceInfo
  },

  workServiceInfoUpdata: (data) => {
    return shunt(`/work/service-info`, 'PUT', data) // 通过id更新WorkServiceInfo
  },

  workServiceInfoById: (data, id) => {
    return shunt(`/work/service-info/${id}`, 'GET', data) // 通过id获取WorkServiceInfo
  },

  workServiceInfoDelById: (data, id) => {
    return shunt(`/work/service-info/${id}`, 'DELETE', data) // 通过id删除WorkServiceInfo
  },

  workServiceInfoByWorkId: (workId, data) => {
    return shunt(`/work/service-info/workId/${workId}`, 'get', data) // 通过id获取WorkServiceInfo
  },
  // 事项服务信息 Work Service Info Controller -----------------------------------------------------------------------

  // 事项流程配置 Work Activiti Controller -----------------------------------------------------------------------
  workActivitiPage: (data) => {
    return shunt(`/work/activiti`, 'GET', data) // WorkActiviti获取分页列表
  },

  workActivitiAdd: (data) => {
    return shunt(`/work/activiti`, 'POST', data) // 添加WorkActiviti
  },

  workActivitiUpdata: (data) => {
    return shunt(`/work/activiti`, 'PUT', data) // 通过id更新WorkActiviti
  },

  workActivitiById: (id) => {
    return shunt(`/work/activiti/${id}`, 'GET') // 通过id获取WorkActiviti
  },

  workActivitiDelById: (data, id) => {
    return shunt(`/work/activiti/${id}`, 'DELETE', data) // 通过id删除WorkActiviti
  },

  workActivitiActList: (data) => {
    return shunt(`/work/activiti/act-list`, 'get', data) // 获取可用工作流分页列表
  },
  // 事项流程配置 Work Activiti Controller -----------------------------------------------------------------------

  // 事项申请材料 Work Apply Material Controller -----------------------------------------------------------------------
  workApplyMaterialPage: (data) => {
    return shunt(`/work/apply-material`, 'GET', data) // WorkApplyMaterial获取分页列表
  },

  workApplyMaterialAdd: (data) => {
    return shunt(`/work/apply-material`, 'POST', data) // 添加WorkApplyMaterial
  },

  workApplyMaterialUpdata: (data) => {
    return shunt(`/work/apply-material`, 'PUT', data) // 通过id更新WorkApplyMaterial
  },

  workApplyMaterialById: (id) => {
    return shunt(`/work/apply-material/${id}`, 'GET') // 通过id获取WorkApplyMaterial
  },

  workApplyMaterialDelById: (id) => {
    return shunt(`/work/apply-material/${id}`, 'DELETE') // 通过id删除WorkApplyMaterial
  },

  workApplyMaterialDelByIds: (data) => {
    return shunt(`/work/apply-material/ids`, 'post', data) // 通过数组id删除WorkApplyMaterial
  },

  workApplyMaterialFormList: (data) => {
    return shunt(`/work/apply-material/form-list`, 'get', data) // 可用关联表单列表
  },
  // 事项申请材料 Work Apply Material Controller -----------------------------------------------------------------------

  // 用户反馈 Feed Back Controller -----------------------------------------------------------------------
  feedbackDeal: (data) => {
    return shunt(`/feedback/deal`, 'POST', data) // 反馈处理
  },

  feedbackList: (data) => {
    return shunt(`/feedback/list`, 'POST', data) // 反馈列表
  },
  // 用户反馈 Feed Back Controller -----------------------------------------------------------------------

  // 表单数据控制类 Form Data Controller -----------------------------------------------------------------------
  formDataAdd: (data) => {
    return shunt(`/form/data/add`, 'POST', data) // 新增表单数据
  },

  formDataDetail: (data) => {
    return shunt(`/form/data/detail`, 'POST', data) // 表单数据详情
  },

  formDataList: (data) => {
    return shunt(`/form/data/list`, 'POST', data) // 数据列表
  },

  formDataQueryColumn: (data) => {
    return shunt(`/form/data/query/column`, 'GET', data) // 获取查询字段
  },

  formDataUpdate: (data) => {
    return shunt(`/form/data/update`, 'POST', data) // 表单数据修改
  },
  // 表单数据控制类 Form Data Controller -----------------------------------------------------------------------

  // 表单相关 Form Controller -----------------------------------------------------------------------
  formAdd: (data) => {
    return shunt(`/form/add`, 'POST', data) // 新增表单
  },

  formDetail: (data) => {
    return shunt(`/form/detail`, 'GET', data) // 表单详情
  },

  formEnable: (data) => {
    return shunt(`/form/enable`, 'POST', data) // 表单启用
  },

  formList: (data) => {
    return shunt(`/form/list`, 'GET', data) // 表单列表
  },

  formUpdate: (data) => {
    return shunt(`/form/update`, 'PUT', data) // 表单修改
  },
  // 表单相关 Form Controller -----------------------------------------------------------------------

  // sys-oss-controller -----------------------------------------------------------------------
  sysOssUpload: () => {
    return adornUrl(`/sys/oss/upload?token=${VueCookie.get('token')}`) // 文件上传 返回文件访问地址
  },
  // sys-oss-controller -----------------------------------------------------------------------

  // 工作流 -----------------------------------------------------------------------
  activitiPage: (data) => {
    return shunt(`/activiti`, 'GET', data) // Activiti获取分页列表
  },

  activitiAdd: (data) => {
    return shunt(`/activiti`, 'POST', data) // 添加Activiti
  },

  activitiUpdataById: (data) => {
    return shunt(`/activiti`, 'PUT', data) // 通过id更新Activiti
  },

  activitiById: (id) => {
    return shunt(`/activiti/${id}`, 'GET') // 通过id获取Activiti
  },

  activitiDelById: (id) => {
    return shunt(`/delete?modelId=${id}`, 'DELETE') // 通过id删除Activiti
  },
  activitiRevokePublish: (id) => {
    return shunt(`/revokePublish?modelId=${id}`, 'DELETE') // 通过id作废Activiti
  },
  activitiPublish: (id) => {
    return shunt(`/publish?modelId=${id}`, 'DELETE') // 通过id启用Activiti
  },
  modelsPng: (modelId) => {
    return shunt(`/models/${modelId}/png`, 'GET' // { 'responseType': 'blob' }
    ) // 获取工作流图片
  },

  // 工作流 -----------------------------------------------------------------------

  // 字典接口 -----------------------------------------------------------------------
  sysDictDelete: (data) => {
    return shunt(`/sys/dict/delete`, 'DELETE', data) // 通过id删除字典
  },

  sysDictGet: (data) => {
    return shunt(`/sys/dict/get`, 'GET', data) // 获取字典详情
  },

  sysDictList: (data) => {
    return shunt(`/sys/dict/list`, 'GET', data) // 字典列表
  },

  sysDictSave: (data) => {
    return shunt(`/sys/dict/save`, 'POST', data) // 保存字典
  },

  sysDictSelectItemsByDictType: (data) => {
    return shunt(`/sys/dict/selectItemsByDictType`, 'GET', data) // 根据字典类型获取字典项
  },

  sysDictUpdate: (data) => {
    return shunt(`/sys/dict/update`, 'PUT', data) // 修改字典
  },
  // 字典接口 -----------------------------------------------------------------------

  // 字典项接口 -----------------------------------------------------------------------
  sysDictItemDelete: (data) => {
    return shunt(`/sys/dict/item/delete`, 'DELETE', data) // 删除字典项
  },

  sysDictItemGet: (data) => {
    return shunt(`/sys/dict/item/get`, 'GET', data) // 获取字典项
  },

  sysDictItemList: (data) => {
    return shunt(`/sys/dict/item/list`, 'GET', data) // 字典项列表
  },

  sysDictItemSave: (data) => {
    return shunt(`/sys/dict/item/save`, 'POST', data) // 保存字典项
  },

  sysDictItemUpdate: (data) => {
    return shunt(`/sys/dict/item/update`, 'PUT', data) // 修改字典项
  },
  // 字典项接口 -----------------------------------------------------------------------

  // 部门 sys-dept-controller -----------------------------------------------------------------------

  sysDeptDelete: (deptId) => {
    return shunt(`/sys/dept/delete?deptId=${deptId}`, 'PUT') // delete
  },

  // sysDeptInfo: () => {
  //   return shunt(`/sys/dept/info`, 'GET') // info
  // },

  sysDeptInfo: (deptId) => {
    return shunt(`/sys/dept/info/${deptId}`, 'GET') // info
  },

  sysDeptList: (data) => {
    return shunt(`/sys/dept/list`, 'GET', data) // list
  },

  sysDeptSave: (data) => {
    return shunt(`/sys/dept/save`, 'POST', data) // save
  },

  sysDeptSelect: () => {
    return shunt(`/sys/dept/select`, 'GET') // select
  },

  sysDeptUpdate: (data) => {
    return shunt(`/sys/dept/update`, 'PUT', data) // update
  },
  // 部门 -----------------------------------------------------------------------

  // 地区管理 Sys Area Controller -----------------------------------------------------------------------
  sysAreaDelete: (deptId) => {
    return shunt(`/sys/area/delete?deptId=${deptId}`, 'PUT') // 删除
  },

  sysAreaInfo: (deptId) => {
    return shunt(`/sys/area/info/${deptId}`, 'GET') // 单个详细信息
  },

  sysAreaSave: (data) => {
    return shunt(`/sys/area/save`, 'POST', data) // 新增
  },

  sysAreaSelect: () => {
    return shunt(`/sys/area/select`, 'GET') // 初始化
  },

  sysAreaUpdate: (data) => {
    return shunt(`/sys/area/update`, 'PUT', data) // 修改
  },
  // 地区管理 Sys Area Controller -----------------------------------------------------------------------

  // 用户管理 user -----------------------------------------------------------------------
  sysUserDelete: (data) => {
    return shunt(`/sys/user/delete`, 'POST', data) // delete
  },

  // sysUserInfo: (data) => {
  //   return shunt(`/sys/user/info`, 'GET', data) // info
  // }

  sysUserInfo: (userId, data) => {
    return shunt(`/sys/user/info${userId}`, 'GET', data) // info
  },

  sysUserList: (data) => {
    return shunt(`/sys/user/list`, 'GET', data) // list
  },

  sysUserPassword: (data) => {
    return shunt(`/sys/user/password`, 'POST', data) // password
  },

  sysUserSave: (data) => {
    return shunt(`/sys/user/save`, 'POST', data) // save
  },

  sysUserUpdate: (data) => {
    return shunt(`/sys/user/update`, 'POST', data) // update
  }
  // 用户管理 user -----------------------------------------------------------------------

}

export default api
