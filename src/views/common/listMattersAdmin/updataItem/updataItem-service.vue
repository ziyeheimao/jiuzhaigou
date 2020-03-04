<template>
  <section>
    <el-form :model="form" :rules="rules" ref="form" :label-width="labelWidth">
      <el-form-item label="法定节假日是否办理" prop="supHolidayProcess">
        <el-radio-group v-model="form.supHolidayProcess">
          <el-radio v-for="(v,k) in res.supHolidayProcess" :key="k" :label="v.label">{{v.name}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="办理时间" prop="">
        <div class="processing-time-box">
          <p>周一到周五</p>
          <div>
            <div class="box">
              <el-checkbox-group v-model="other.workingAm">
                <el-checkbox label="修改(上午)"></el-checkbox>
              </el-checkbox-group>

              <div v-if="other.workingAm.length === 0">{{form.time1}}至{{form.time2}}</div>
              <el-time-picker is-range v-model="form.time11" v-if="other.workingAm.length !== 0"
                range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
              </el-time-picker>
            </div>

            <div class="box">
              <el-checkbox-group v-model="other.workingPm">
                <el-checkbox label="修改(下午)"></el-checkbox>
              </el-checkbox-group>

              <div v-if="other.workingPm.length === 0">{{form.time3}}至{{form.time4}}</div>
              <el-time-picker is-range v-model="form.time22" v-if="other.workingPm.length !== 0"
                range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
              </el-time-picker>
            </div>
          </div>
        </div>

        <div class="processing-time-box" v-show="form.supHolidayProcess === 1">
          <p>法定节假日</p>
          <div>
            <div class="box">
              <el-checkbox-group v-model="other.holidayVacationsAm">
                <el-checkbox label="修改(上午)"></el-checkbox>
              </el-checkbox-group>

              <div v-if="other.holidayVacationsAm.length === 0">{{form.time5}}至{{form.time6}}</div>
              <el-time-picker is-range v-model="form.time33" v-if="other.holidayVacationsAm.length !== 0"
                range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
              </el-time-picker>
            </div>
            <div class="box">
              <el-checkbox-group v-model="other.holidayVacationsPm">
                <el-checkbox label="修改(下午)"></el-checkbox>
              </el-checkbox-group>

              <div v-if="other.holidayVacationsPm.length === 0">{{form.time7}}至{{form.time8}}</div>
              <el-time-picker is-range v-model="form.time44" v-if="other.holidayVacationsPm.length !== 0"
                range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
              </el-time-picker>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="办理地点" prop="processPlace">
        <el-input v-model="form.processPlace" type="textarea" :rows='4'></el-input>
      </el-form-item>

      <el-form-item label="咨询方式" prop="consultationInfo">
        <el-input v-model="form.consultationInfo" type="textarea" :rows='4'></el-input>
      </el-form-item>

      <el-form-item label="投诉联系方式" prop="complaintContactInfo">
        <el-input v-model="form.complaintContactInfo" type="textarea" :rows='4'></el-input>
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
import { openInfo, clone, time } from '@/utils'

export default {
  components: {
    // x
  },
  // props: [''],
  computed: {},
  data () {
    return {
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
        time8: '',

        time11: ['', ''],
        time22: ['', ''],
        time33: ['', ''],
        time44: ['', '']
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
      auditId: null
    }
  },
  methods: {
    // 返回
    quit () { this.$router.go(-1) },
    init () {
      let updataWork = JSON.parse(sessionStorage.getItem('updataWork'))
      this.workId = updataWork.workId

      if (sessionStorage.getItem('auditId')) this.auditId = Number(sessionStorage.getItem('auditId')) || null

      if (this.auditId) {
        this.$api.workServiceInfoByWorkId(this.workId, {auditId: this.auditId}).then(res => {
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

      this.form.time1 = _time.workingDay.amStart
      this.form.time2 = _time.workingDay.amEnd
      this.form.time3 = _time.workingDay.pmStart
      this.form.time4 = _time.workingDay.pmEnd
      this.form.time5 = _time.holidayVacations.amStart
      this.form.time6 = _time.holidayVacations.amEnd
      this.form.time7 = _time.holidayVacations.pmStart
      this.form.time8 = _time.holidayVacations.pmEnd
    },
    submit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let obj = {
            id: this.form.id,
            workId: this.form.workId,
            supHolidayProcess: this.form.supHolidayProcess,
            processPlace: this.form.processPlace,
            consultationInfo: this.form.consultationInfo,
            complaintContactInfo: this.form.complaintContactInfo
          }

          obj.processTime = JSON.stringify({
            workingDay: {
              amStart: this.form.time11 ? time(this.form.time11[0]) : '',
              amEnd: this.form.time11 ? time(this.form.time11[1]) : '',
              pmStart: this.form.time22 ? time(this.form.time22[0]) : '',
              pmEnd: this.form.time22 ? time(this.form.time22[1]) : ''
            },
            holidayVacations: {
              amStart: this.form.time33 ? time(this.form.time33[0]) : '',
              amEnd: this.form.time33 ? time(this.form.time33[1]) : '',
              pmStart: this.form.time44 ? time(this.form.time44[0]) : '',
              pmEnd: this.form.time44 ? time(this.form.time44[1]) : ''
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
    // 'form.supHolidayProcess' () {
    //   if (this.form.supHolidayProcess === 2) {
    //     this.form.time5 = ''
    //     this.form.time6 = ''
    //     this.form.time7 = ''
    //     this.form.time8 = ''
    //   }
    // },
    // 'other.workingAm' () {
    //   if (this.other.workingAm.length === 1) {
    //     this.form.time1 = ''
    //   }
    // }
  }
}
</script>

<style scoped lang='scss'>
@import './updataItem.scss';
.processing-time-box{
  margin-left: 50px;
  width: 720px;
  display: flex;
  justify-content: space-between;

  & .box{
    width: 500px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
