/**
 * 生产环境
 */
;(function () {
  window.SITE_CONFIG = {}

  // api接口请求地址
  // window.SITE_CONFIG['baseUrl'] = 'http://47.111.7.64:5085';

  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.101.13:8002/back'
  window.SITE_CONFIG['baseUrl'] = 'http://59.213.217.36:9001/back'
  window.SITE_CONFIG['workflowUrl'] = 'http://47.111.7.64:9083'
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.204.108:7080/back';
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.204.98:7080/back';
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.204.108:7080/back';
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.204.204:8001/back';
  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = './' // 域名
  window.SITE_CONFIG['version'] = ''   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})()
