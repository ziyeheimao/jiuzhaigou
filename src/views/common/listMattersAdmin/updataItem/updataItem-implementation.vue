
<template>
  <section>
    <el-form :model="form" :rules="rules" ref="form" :label-width="labelWidth">
      <el-form-item label="窗口办理" prop="windowProcess">
        <el-radio-group v-model="form.windowProcess">
          <el-radio v-for="(v,k) in res.windowProcess" :key="k" :label="v.label">{{v.name}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <div class="box">
        <el-form-item label="是否支持网上预约" prop="supNetAppoint">
          <el-radio-group v-model="form.supNetAppoint">
            <el-radio v-for="(v,k) in res.supNetAppoint" :key="k" :label="v.label">{{v.name}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="办事者到场次数" prop="presentTimes">
          <el-input-number v-model="form.presentTimes"></el-input-number> &nbsp;次
        </el-form-item>
      </div>


      <div class="box">
        <el-form-item label="是否支持全省范围内就近申请" prop="supProvinceApply">
          <el-radio-group v-model="form.supProvinceApply">
            <el-radio v-for="(v,k) in res.supProvinceApply" :key="k" :label="v.label">{{v.name}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否支持全省范围内就近领取" prop="supProvinceReceive">
          <el-radio-group v-model="form.supProvinceReceive">
            <el-radio v-for="(v,k) in res.supProvinceReceive" :key="k" :label="v.label">{{v.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <div class="box">
        <el-form-item label="网上办理" prop="netProcess">
          <el-radio-group v-model="form.netProcess">
            <el-radio v-for="(v,k) in res.netProcess" :key="k" :label="v.label">{{v.name}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="网办类型" prop="netProcessType">
          <el-radio-group v-model="form.netProcessType">
            <el-radio v-for="(v,k) in res.netProcessType" :key="k" :label="v.label">{{v.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <el-form-item label="认证等级要求" prop="authLevel">
        <el-radio-group v-model="form.authLevel">
          <el-radio v-for="(v,k) in res.authLevel" :key="k" :label="v.label">{{v.name}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="是否下放" prop="isDown">
        <el-radio-group v-model="form.isDown">
          <el-radio v-for="(v,k) in res.isDown" :key="k" :label="v.label">{{v.name}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="下放单位" prop="downTown" v-if="form.isDown === 1">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="form.downTown" @change="handleCheckedChange">
          <el-checkbox v-for='(v,k) in res.downTown' :key="k" :label="v">{{v}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="办理查询" prop="proessSelect">
        <el-radio-group v-model="form.proessSelect">
          <el-radio v-for="(v,k) in res.proessSelect" :key="k" :label="v.label">{{v.name}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="特别程序" prop="specialProgram">
        <el-input v-model="form.specialProgram" type="textarea" :rows='4' placeholder="请输入特别程序,无特别程序填写“无”"></el-input>
      </el-form-item>

      <div class="btn">
        <el-button type="primary" @click="submit('form')">变更申请</el-button>
        <el-button @click="dialogVisible = true">取 消</el-button>
      </div>
    </el-form>

    <el-dialog title="确认操作" :visible.sync="dialogVisible" width="30%" :append-to-body='true'>
      <span>取消后本次填写的内容将不会保存，确定取消？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="quit">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { openInfo, clone } from '@/utils'

export default {
  components: {
    // x
  },
  // props: [''],
  computed: {},
  data () {
    return {
      auditId: null,
      dialogVisible: false,
      labelWidth: '210px',
      checkAll: false,
      checkedCities: [],
      isIndeterminate: true,
      workId: '',
      form: {
        workId: '',
        windowProcess: '', // 窗口办理
        supNetAppoint: '', // 是否支持网上预约
        presentTimes: 1, // presentTimes 办事者到场次数
        supProvinceApply: '',
        supProvinceReceive: '',
        netProcess: '',
        netProcessType: '',
        authLevel: '',
        isDown: '',
        downTown: [],
        proessSelect: '',
        specialProgram: ''
      },
      res: {
        windowProcess: [
          {label: 1, name: '是'},
          {label: 2, name: '否'}
        ],
        supNetAppoint: [
          {label: 1, name: '是'},
          {label: 2, name: '否'}
        ],
        supProvinceApply: [
          {label: 1, name: '是'},
          {label: 2, name: '否'}
        ],
        supProvinceReceive: [
          {label: 1, name: '是'},
          {label: 2, name: '否'}
        ],
        netProcess: [
          {label: 1, name: '是'},
          {label: 2, name: '否'}
        ],
        netProcessType: [
          {label: 1, name: '原件预审'},
          {label: 2, name: '原件核审'}
        ],
        authLevel: [
          {label: 1, name: '身份证实名认证'},
          {label: 2, name: '社保卡实名认证'},
          {label: 3, name: '实体大厅现场认证'},
          {label: 4, name: '统一社会信用代码认证'},
          {label: 5, name: '护照'}
        ],
        isDown: [
          {label: 1, name: '是'},
          {label: 2, name: '否'}
        ],
        downTown: ['漳扎镇', '永乐镇', '黑河乡', '白河乡', '双河乡', '草地乡', '凌江乡', '郭元乡', '玉瓦乡', '大录乡', '永丰乡', '保华乡', '罗依乡', '永和乡', '马家乡'],
        proessSelect: [
          {label: 1, name: '电话查询'},
          {label: 2, name: '窗口查询'},
          {label: 3, name: '门户网站查询'}
        ]
      },
      rules: {
        windowProcess: [ { required: true, message: '请输入', trigger: 'blur' } ], // 窗口办理
        supNetAppoint: [ { required: true, message: '请输入', trigger: 'blur' } ], // 是否支持网上预约
        presentTimes: [ { required: true, message: '请输入', trigger: 'blur' } ], // presentTimes 办事者到场次数
        supProvinceApply: [ { required: true, message: '请输入', trigger: 'blur' } ],
        supProvinceReceive: [ { required: true, message: '请输入', trigger: 'blur' } ],
        netProcess: [ { required: true, message: '请输入', trigger: 'blur' } ],
        netProcessType: [ { required: true, message: '请输入', trigger: 'blur' } ],
        authLevel: [ { required: true, message: '请输入', trigger: 'blur' } ],
        isDown: [ { required: true, message: '请输入', trigger: 'blur' } ],
        downTown: [ { required: true, message: '请输入', trigger: 'blur' } ],
        proessSelect: [ { required: true, message: '请输入', trigger: 'blur' } ],
        specialProgram: [ { required: true, message: '请输入', trigger: 'blur' } ]
      }
    }
  },
  methods: {
    // 全选
    handleCheckAllChange (val) {
      this.form.downTown = val ? this.res.downTown : []
      this.isIndeterminate = false
    },
    handleCheckedChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.res.downTown.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.res.downTown.length
    },
    init () {
      let updataWork = JSON.parse(sessionStorage.getItem('updataWork'))
      this.workId = updataWork.workId

      if (sessionStorage.getItem('auditId')) this.auditId = Number(sessionStorage.getItem('auditId')) || null

      if (this.auditId) {
        this.$api.workImplementationByWorkId(this.workId, {auditId: this.auditId}).then(res => {
          if (res.code === 0 && res.bean) this.form = res.bean
        })
      } else {
        this.$api.workImplementationByWorkId(this.workId).then(res => {
          if (res.code === 0 && res.bean) this.form = res.bean
        })
      }
    },
    // 返回
    quit () { this.$router.go(-1) },
    submit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let workImplementation = clone(this.form)
          workImplementation.downTown = workImplementation.downTown.toString()
          let req = { workImplementation, workId: this.workId }
          this.$api.workUpdate(req).then(res => {
            console.log(res)
            if (res.code === 0) {
              openInfo('修改成功', 's')
            } else {
              openInfo('修改失败，请按参照规范修改后重新提交', 'e')
            }
          })
        }
      })
    }
  },
  beforeCreate () {},
  created () {
    this.init()
  },
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
@import './updataItem.scss';
</style>
