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
                <el-checkbox label="上午"></el-checkbox>
              </el-checkbox-group>
              <el-time-picker v-model="form.time1" :disabled="other.workingAm.length === 0"></el-time-picker>
              到
              <el-time-picker format='HH:mm:ss' v-model="form.time2" :disabled="other.workingAm.length === 0"></el-time-picker>
            </div>

            <div class="box">
              <el-checkbox-group v-model="other.workingPm">
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
              <el-checkbox-group v-model="other.holidayVacationsAm">
                <el-checkbox label="上午"></el-checkbox>
              </el-checkbox-group>
              <el-time-picker format='HH:mm:ss' v-model="form.time5" :disabled="other.holidayVacationsAm.length === 0"></el-time-picker>
              到
              <el-time-picker format='HH:mm:ss' v-model="form.time6" :disabled="other.holidayVacationsAm.length === 0"></el-time-picker>
            </div>
            <div class="box">
              <el-checkbox-group v-model="other.holidayVacationsPm">
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
        <el-input v-model="form.processPlace" type="textarea" :rows='4'></el-input>
      </el-form-item>

      <el-form-item label="咨询方式" prop="consultationInfo">
        <el-input v-model="form.consultationInfo" type="textarea" :rows='4'></el-input>
      </el-form-item>

      <el-form-item label="投诉联系方式" prop="complaintContactInfo">
        <el-input v-model="form.complaintContactInfo" type="textarea" :rows='4'></el-input>
      </el-form-item>

      <div class="btn">
        <el-button type="primary" @click="click(1)">上一步</el-button>
        <el-button type="primary" @click="click(2, 'form')">下一步</el-button>
        <!-- <el-button type="primary" @click="click(4)">上 报</el-button> -->
        <el-button @click="click(3)">取消</el-button>
      </div>
    </el-form>
  </section>
</template>

<script>
import { openInfo, time } from '@/utils'

export default {
  components: {
    // x
  },
  // props: [''],
  computed: {
  },
  data () {
    return {
      labelWidth: '120px',
      form: {
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
      }
    }
  },
  methods: {
    submit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let req = {
            workId: this.form.workId,
            supHolidayProcess: this.form.supHolidayProcess,
            processPlace: this.form.processPlace,
            consultationInfo: this.form.consultationInfo,
            complaintContactInfo: this.form.complaintContactInfo,
            processTime: JSON.stringify({
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
          }
          console.log(req)
          this.$api.workServiceInfoAdd(req).then(res => {
            if (res.code === 0) {
              this.$store.commit('common/updateNext') // 下一步
              openInfo('保存成功', 's')
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
  mounted () {
    this.form.workId = sessionStorage.getItem('workId')
  },
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
    }
  }

}
</script>

<style scoped lang='scss'>
@import './newItem.scss';
</style>
