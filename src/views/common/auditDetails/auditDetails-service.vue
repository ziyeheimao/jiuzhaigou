
<template>
  <section>
    <el-form :model="form" :rules="rules" ref="form" :label-width="labelWidth">
      <el-form-item label="法定节假日是否办理" prop="supHolidayProcess">
        <el-radio-group v-model="form.supHolidayProcess" :disabled="disabled">
          <el-radio v-for="(v,k) in res.supHolidayProcess" :key="k" :label="v.label">{{v.name}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="办理时间" prop="">
        <div class="processing-time-box">
          <p>周一到周五</p>
          <div>
            <div class="box">
              <el-checkbox-group v-model="other.workingAm" :disabled="disabled">
                <el-checkbox label="上午"></el-checkbox>
              </el-checkbox-group>
              <el-time-picker format='HH:mm:ss' v-model="form.time1" :disabled="other.workingAm.length === 0"></el-time-picker>
              到
              <el-time-picker format='HH:mm:ss' v-model="form.time2" :disabled="other.workingAm.length === 0"></el-time-picker>
            </div>

            <div class="box">
              <el-checkbox-group v-model="other.workingPm" :disabled="disabled">
                <el-checkbox label="下午"></el-checkbox>
              </el-checkbox-group>
              <el-time-picker format='HH:mm:ss' v-model="form.time3" :disabled="other.workingPm.length === 0"></el-time-picker>
              到
              <el-time-picker format='HH:mm:ss' v-model="form.time4" :disabled="other.workingPm.length === 0"></el-time-picker>
            </div>
          </div>
        </div>

        <div class="processing-time-box" v-show="form.supHolidayProcess === 1">
          <p>法定节假日</p>
          <div>
            <div class="box">
              <el-checkbox-group v-model="other.holidayVacationsAm" :disabled="disabled">
                <el-checkbox label="上午"></el-checkbox>
              </el-checkbox-group>

              <el-time-picker format='HH:mm:ss' v-model="form.time5" :disabled="other.holidayVacationsAm.length === 0"></el-time-picker>
              到
              <el-time-picker format='HH:mm:ss' v-model="form.time6" :disabled="other.holidayVacationsAm.length === 0"></el-time-picker>
            </div>
            <div class="box">
              <el-checkbox-group v-model="other.holidayVacationsPm" :disabled="disabled">
                <el-checkbox label="下午"></el-checkbox>
              </el-checkbox-group>

              <el-time-picker format='HH:mm:ss' v-model="form.time7" :disabled="other.holidayVacationsPm.length === 0"></el-time-picker>
              到
              <el-time-picker format='HH:mm:ss' v-model="form.time8" :disabled="other.holidayVacationsPm.length === 0"></el-time-picker>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="办理地点" prop="processPlace">
        <el-input v-model="form.processPlace" type="textarea" :rows='4' :disabled="disabled"></el-input>
      </el-form-item>

      <el-form-item label="咨询方式" prop="consultationInfo">
        <el-input v-model="form.consultationInfo" type="textarea" :rows='4' :disabled="disabled"></el-input>
      </el-form-item>

      <el-form-item label="投诉联系方式" prop="complaintContactInfo">
        <el-input v-model="form.complaintContactInfo" type="textarea" :rows='4' :disabled="disabled"></el-input>
      </el-form-item>

      <div class="btn">
        <!-- <el-button type="primary" @click="submit('form')">变更申请</el-button> -->
        <el-button type="primary" @click="quit">返 回</el-button>
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
import { openInfo, clone, time } from '@/utils'

export default {
  components: {
    // x
  },
  // props: [''],
  computed: {},
  data () {
    return {
      disabled: true, // 全部表单锁定

      dialogVisible: false,
      workId: '',
      labelWidth: '150px',
      form: {
        id: '',
        workId: '',
        supHolidayProcess: '',
        processPlace: '',
        consultationInfo: '',
        complaintContactInfo: '',

        time1: '',
        time2: '',
        time3: '',
        time4: '',
        time5: '',
        time6: '',
        time7: '',
        time8: ''
      },
      res: {
        supHolidayProcess: [
          {label: 1, name: '办理'},
          {label: 2, name: '不办理'}
        ]
      },
      other: {
        workingAm: [],
        workingPm: [],
        holidayVacationsAm: [],
        holidayVacationsPm: []
      },
      rules: {
        supHolidayProcess: [ { required: true, message: '请输入', trigger: 'blur' } ],
        processPlace: [ { required: true, message: '请输入', trigger: 'blur' } ],
        consultationInfo: [ { required: true, message: '请输入', trigger: 'blur' } ],
        complaintContactInfo: [ { required: true, message: '请输入', trigger: 'blur' } ]
      },
      seeAuditId: null
    }
  },
  methods: {
    // 返回
    quit () { this.$router.go(-1) },
    init () {
      let updataWork = JSON.parse(sessionStorage.getItem('updataWork'))
      this.workId = updataWork.workId

      if (sessionStorage.getItem('seeAuditId')) this.seeAuditId = Number(sessionStorage.getItem('seeAuditId')) || null

      if (this.seeAuditId) {
        this.$api.workServiceInfoByWorkId(this.workId, {auditId: this.seeAuditId}).then(res => {
          if (res.code === 0 && res.bean) this.distribution(res.bean)
        })
      } else {
        this.$api.workServiceInfoByWorkId(this.workId).then(res => {
          if (res.code === 0 && res.bean) this.distribution(res.bean)
        })
      }
    },
    distribution (bean) {
      this.form = bean
      let _time = JSON.parse(bean.processTime)

      let t = time(_time.workingDay.amStart, true)
      if (t.length === 3) this.form.time1 = new Date(2010, 2, 2, t[0], t[1], t[2])

      t = time(_time.workingDay.amEnd, true)
      if (t.length === 3) this.form.time2 = new Date(2010, 2, 2, t[0], t[1], t[2])

      t = time(_time.workingDay.pmStart, true)
      if (t.length === 3) this.form.time3 = new Date(2010, 2, 2, t[0], t[1], t[2])

      t = time(_time.workingDay.pmEnd, true)
      if (t.length === 3) this.form.time4 = new Date(2010, 2, 2, t[0], t[1], t[2])

      t = time(_time.workingDay.amEnd, true)
      if (t.length === 3) this.form.time5 = new Date(2010, 2, 2, t[0], t[1], t[2])

      t = time(_time.workingDay.amEnd, true)
      if (t.length === 3) this.form.time6 = new Date(2010, 2, 2, t[0], t[1], t[2])

      t = time(_time.workingDay.amEnd, true)
      if (t.length === 3) this.form.time7 = new Date(2010, 2, 2, t[0], t[1], t[2])

      t = time(_time.workingDay.amEnd, true)
      if (t.length === 3) this.form.time8 = new Date(2010, 2, 2, t[0], t[1], t[2])
    },

    submit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let obj = clone(this.form)
          obj.processTime = JSON.stringify({
            workingDay: {
              amStart: time(this.form.time1),
              amEnd: time(this.form.time2),
              pmStart: time(this.form.time3),
              pmEnd: time(this.form.time4)
            },
            holidayVacations: {
              amStart: time(this.form.time5),
              amEnd: time(this.form.time6),
              pmStart: time(this.form.time7),
              pmEnd: time(this.form.time8)
            }
          })

          let req = { workServiceInfo: obj, workId: this.workId }
          this.$api.workUpdate(req).then(res => {
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
  watch: {
    'form.supHolidayProcess' () {
      if (this.form.supHolidayProcess === 2) {
        this.form.time5 = ''
        this.form.time6 = ''
        this.form.time7 = ''
        this.form.time8 = ''
      }
    },
    'other.workingAm' () {
      if (this.other.workingAm.length === 1) {
        this.form.time1 = ''
      }
    }
  }
}
</script>

<style scoped lang='scss'>
@import './auditDetails.scss';
.processing-time-box{
  margin-left: 50px;
  width: 720px;
  display: flex;
  justify-content: space-between;

  & .box{
    width: 600px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
