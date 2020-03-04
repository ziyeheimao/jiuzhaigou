
<template>
  <section>
    <el-form :model="form" :rules="rules" ref="form" :label-width="labelWidth">
      <el-form-item label="窗口办理" prop="windowProcess">
        <el-radio-group v-model="form.windowProcess">
          <el-radio v-for="(v,k) in res.windowProcess" :key="k" :label="v.label">{{v.name}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <div class="form-item-box">
        <el-form-item label="是否支持网上预约" prop="supNetAppoint">
          <el-radio-group v-model="form.supNetAppoint">
            <el-radio v-for="(v,k) in res.supNetAppoint" :key="k" :label="v.label">{{v.name}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="办事者到场次数" prop="presentTimes">
          <el-input-number v-model="form.presentTimes"></el-input-number> &nbsp;次
        </el-form-item>
      </div>

      <div class="form-item-box">
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

      <div class="form-item-box">
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
        <el-button type="primary" @click="click(1)">上一步</el-button>
        <el-button type="primary" @click="click(2, 'form')">下一步</el-button>
        <!-- <el-button type="primary" @click="click(4)">上 报</el-button> -->
        <el-button @click="click(3)">取消</el-button>
      </div>
    </el-form>
  </section>
</template>

<script>
import { openInfo, clone } from '@/utils'

export default {
  components: {
    // x
  },
  // props: [''],
  computed: {
  },
  data () {
    return {
      labelWidth: '210px',
      checkAll: false,
      checkedCities: [],
      isIndeterminate: true,
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
    submit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let req = clone(this.form)
          req.downTown = req.downTown.toString()
          this.$api.workImplementationAdd(req).then(res => {
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
  watch: {}

}
</script>

<style scoped lang='scss'>
@import './newItem.scss';
</style>
