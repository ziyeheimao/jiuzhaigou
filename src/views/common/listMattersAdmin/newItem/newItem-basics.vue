<template>
  <section class="ctn">
    <el-form :model="form" :rules="rules" ref="form" :label-width="labelWidth">
      <div class="form-item-box">
        <el-form-item label="事项名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="事项编码" prop="workCode">
          <el-input v-model="form.workCode"></el-input>
        </el-form-item>
      </div>

      <div class="form-item-box">
        <el-form-item label="所属部门" prop="department">
          <el-select v-model="form.department">
            <el-option v-for="(v,k) in res.department" :key="k" :label="v.label" :value="v.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属行业" prop="industry">
          <el-select v-model="form.industry">
            <el-option v-for="(v,k) in res.industry" :key="k" :label="v.label" :value="v.value"></el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="form-item-box">
        <el-form-item label="事项类型" prop="workType">
          <el-select v-model="form.workType">
            <el-option v-for="(v,k) in res.workType" :key="k" :label="v.label" :value="v.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="办理结果名称" prop="processResult">
          <el-input v-model="form.processResult"></el-input>
        </el-form-item>
      </div>

      <div class="form-item-box">
        <el-form-item label="服务对象" prop="serviceObj">
          <el-radio-group v-model="form.serviceObj">
            <el-radio v-for="(v,k) in res.serviceObj" :key="k" :label="v.label">{{v.name}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="办件类型" prop="processType">
          <el-radio-group v-model="form.processType">
            <el-radio v-for="(v,k) in res.processType" :key="k" :label="v.label">{{v.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <el-form-item label="事项决定权" prop="workDecision">
        <el-radio-group v-model="form.workDecision">
          <el-radio v-for="(v,k) in res.workDecision" :key="k" :label="v.label">{{v.name}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="按主题分类" prop="themeClass">
        <el-input v-model="form.themeClass" type="textarea" :rows='4'></el-input>
      </el-form-item>

      <el-form-item label="受理条件" prop="acceptCondition">
        <el-input v-model="form.acceptCondition" type="textarea" :rows='4'></el-input>
      </el-form-item>

      <el-form-item label="适用范围" prop="scopeApplication">
        <el-input v-model="form.scopeApplication" type="textarea" :rows='4'></el-input>
      </el-form-item>

      <el-form-item label="办理流程" prop="processFlow">
        <el-input v-model="form.processFlow" type="textarea" :rows='4'></el-input>
      </el-form-item>

      <div class="btn">
        <!-- <el-button type="primary" @click="click(1)">上一步</el-button> -->
        <el-button type="primary" @click="click(2, 'form')">下一步</el-button>
        <!-- <el-button type="primary" @click="click(4)">上 报</el-button> -->
        <el-button @click="click(3)">取消</el-button>
      </div>
    </el-form>
  </section>
</template>

<script>
import { openInfo } from '@/utils'
export default {
  components: {
    // x
  },
  // props: [''],
  computed: {

  },
  data () {
    return {
      form: {
        name: '', // string 事项名称
        acceptCondition: '', // string 受理条件
        workCode: '', // string 事项编码
        department: '', // integer($int32) 所属部门
        industry: '', // string 所属行业
        workType: '', // string 事项类型
        processResult: '', // string 办理结果名称
        serviceObj: '', // integer($int32) 服务对象
        processType: '', // integer($int32) 办件类型
        workDecision: '', // integer($int32) 事项决定权
        themeClass: '', // string 按主题分类
        scopeApplication: '', // string 适用范围
        processFlow: '' // string 办理流程

        // activitiKey: '', // string 关联工作流程key
        // applyType: '', // integer($int32) 申请类型
        // auditStatus: '', // integer($int32) 审核状态
        // createTime: '', // string($date-time) 创建时间
        // createUserId: '', // integer($int64) 创建用户id
        // editBeforeStatus: '', // integer($int32) 事项改变前状态
        // editStatus: '', // integer($int32) 事项状态 1-草稿 2-上报中 3-申请变更中 4-申请启用中 5-申请停用中 6-申请废止中 7-已启用 8-已停用 9-已废止
        // formKey: '', // string 关联表单key
        // id: '', // integer($int64) 主键id
        // isDel: '', // integer($int32) 是否删除
        // updateTime: '', // string($date-time) 修改时间
        // updateUserId: '', // integer($int64) 修改用户id
        // version: '', // integer($int32) 版本
      },
      rules: {
        name: [ { required: true, message: '请输入', trigger: 'blur' } ],
        acceptCondition: [ { required: true, message: '请输入', trigger: 'blur' } ],
        workCode: [ { required: true, message: '请输入', trigger: 'blur' } ],
        department: [ { required: true, message: '请输入', trigger: 'blur' } ],
        industry: [ { required: true, message: '请输入', trigger: 'blur' } ],
        workType: [ { required: true, message: '请输入', trigger: 'blur' } ],
        processResult: [ { required: true, message: '请输入', trigger: 'blur' } ],
        serviceObj: [ { required: true, message: '请输入', trigger: 'blur' } ],
        processType: [ { required: true, message: '请输入', trigger: 'blur' } ],
        workDecision: [ { required: true, message: '请输入', trigger: 'blur' } ],
        themeClass: [ { required: true, message: '请输入', trigger: 'blur' } ],
        scopeApplication: [ { required: true, message: '请输入', trigger: 'blur' } ],
        processFlow: [ { required: true, message: '请输入', trigger: 'blur' } ]
      },
      res: {
        department: [
          {value: 1, label: '教育部'},
          {value: 2, label: '行政审批局'},
          {value: 3, label: '应急管理局'}
        ],
        industry: [
          {value: 1, label: '经济'},
          {value: 2, label: '教育'},
          {value: 3, label: '科学'},
          {value: 4, label: '宗教'},
          {value: 5, label: '公安'},
          {value: 6, label: '民政'},
          {value: 7, label: '司法'},
          {value: 8, label: '财政'},
          {value: 9, label: '人事'},
          {value: 10, label: '国土'},
          {value: 11, label: '环境'},
          {value: 12, label: '交通'},
          {value: 13, label: '水利'},
          {value: 14, label: '农业'},
          {value: 15, label: '林业'},
          {value: 16, label: '商务'},
          {value: 17, label: '文化'},
          {value: 18, label: '卫生'},
          {value: 19, label: '审计'},
          {value: 20, label: '税务'},
          {value: 21, label: '工商'},
          {value: 22, label: '质检'},
          {value: 23, label: '药检'},
          {value: 24, label: '新闻'},
          {value: 25, label: '体育'},
          {value: 26, label: '统计'},
          {value: 27, label: '旅游'},
          {value: 28, label: '国防'},
          {value: 29, label: '档案'},
          {value: 30, label: '气象'},
          {value: 31, label: '通信'},
          {value: 32, label: '烟草'},
          {value: 33, label: '其他'}
        ],
        workType: [
          {value: 1, label: '行政许可'},
          {value: 2, label: '行政处罚'},
          {value: 3, label: '行政强制'},
          {value: 4, label: '行政裁决'},
          {value: 5, label: '行政确认'},
          {value: 6, label: '行政给付'},
          {value: 7, label: '行政奖励'},
          {value: 8, label: '行政检查'},
          {value: 9, label: '其他行政权力'},
          {value: 10, label: '其他群众事项'},
          {value: 11, label: '公共服务'},
          {value: 12, label: '依法申请服务'},
          {value: 13, label: '咨询'},
          {value: 14, label: '未归类事项'}
        ],
        serviceObj: [
          {label: 1, name: '法人'},
          {label: 2, name: '自然人'},
          {label: 3, name: '其他组织'}
        ],
        processType: [
          {label: 1, name: '即办件'},
          {label: 2, name: '承办件'}
        ],
        workDecision: [
          {label: 1, name: '县'},
          {label: 2, name: '乡'},
          {label: 3, name: '村'}
        ]
      },
      labelWidth: '120px'
    }
  },
  methods: {
    submit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$api.workAdd(this.form).then(res => {
            if (res.code === 0) {
              openInfo('保存成功', 's')
              sessionStorage.setItem('workId', res.bean.id)
              this.$store.commit('common/updateNext') // 下一步
            } else {
              openInfo('保存失败，请按参照规范修改后重新提交', 'e')
            }
          })
        }
      })
    },
    click (type, form) {
      switch (type) {
        case 1:
          this.$store.commit('common/updatePrevious') // 上一步

          break
        case 2:
          this.submit(form) // 提交当前页表单
          break
        case 3:
          this.$store.commit('common/updateQuit') // 取消 / 返回

          break
        case 4:
          this.$store.commit('common/updateSubmit') // 上报

          break
      }
    }
  },
  beforeCreate () {},
  created () {},
  beforeMount () {},
  mounted () {},
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  deactivated () {},
  watch: {}
}
</script>

<style scoped lang='scss'>
@import './newItem.scss';
</style>
