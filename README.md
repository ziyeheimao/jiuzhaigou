#jzg-zw-cms

views
  common
    login.vue                         // 登录页
    index.vue                         // 首页
    empty.vue                         // 空页面
    404.vue                           // 404

    listMattersAdmin
      listMattersAdmin.vue              // 事项清单管理
      newItem
        newItem.vue                       // 新建事项
        basics                            // 基础
        implementation                    // 实施
        service                           // 服务
        apply                             // 申请
        technologicalProcess              // 流程 `` 工作流 查看回显没做
        toExamine                         // 审核
        answer                            // 解答
      updataItem
        updataItem.vue                    // 编辑事项
        basics                            // 基础
        implementation                    // 实施
        service                           // 服务
        apply                             // 申请 `` 关联未做
        technologicalProcess              // 流程 `` 关联未做
        toExamine                         // 审核 
        answer                            // 解答
        log                               // 事项日志

    mattersApproval.vue               // 事项审批管理
    auditDetails                      // 事项审批详情
      approval                          // 审批信息
      basics                            // 基础
      implementation                    // 实施
      service                           // 服务
      apply                             // 申请
      technologicalProcess              // 流程
      toExamine                         // 审核
      answer                            // 解答
      log                               // 事项日志

    approval                          // 通用审批系统
      activeExercise                    // 主动行使事项
      comprehensiveInquiryOfEvents      // 事项综合查询


    comprehensiveAcceptance           // 一窗综合受理系统
      windowManagement                  // 窗口管理
        distinguish.vue                   // 窗口区分管理
        personnel.vue                     // 窗口人员管理
        mattersResidentIn.vue             // 事项驻进管理
      windowItems                       // 窗口事项
        make
          make.vue                          // 事项预约管理
          makeDetail.vue                    // 事项预约管理详情
        consultation
          consultation.vue                  // 事项咨询管理
        applicationOffice.vue             // 申请办件管理

      matter                            // 事项列表
      apply                             // 申请列表

    electronicSurveillance            // 电子监察
      overtime                          // 超时
      achievements                      // 绩效

    governmentAffairsCloud            // 政务云
      myCloudDisk                       // 我的云盘

    formAdmini                        // 表单管理
      formAdmin.vue                     // 表单管理页面
      addForm.vue                       // 动态添加表单
      control.vue                       // 控件管理页面

    workflow.vue                      // 添加工作流

    test.vue                          // 测试用


  modules
    sys
      config-add-or-update.vue
      config.vue
      log.vue
      menu-add-or-update.vue
      menu.vue
      role-add-or-update.vue
      role.vue
      user-add-or-update.vue
      user.vue

    dept
      dept.vue                          // 部门管理
    region
      region.vue                        // 地区管理
    workingDay
      workingDay.vue                    // 工作日管理
    user
      usr.vue                           // 用户管理
    role
      role.vue                          // 角色管理
  main.vue                            // 入口页面(顶栏侧栏)