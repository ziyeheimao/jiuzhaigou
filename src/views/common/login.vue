<template>
  <div class="ctn" :style="'height:'+height+'px;'">
    <section class="modal">
      <h2>欢迎登录九寨沟政务后台管理系统</h2>

      <el-form :model="form" :rules="rules" ref="form" class="login-el-form">
        <el-form-item prop="username">
          <el-input v-model="form.username" @keyup.native.13="login('form')" placeholder="请输入账号/用户名"></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="form.password" @keyup.native.13="login('form')" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>

        <el-form-item prop="captcha">
          <div class="eq-code">
            <el-input v-model="form.captcha" @keyup.native.13="login('form')" placeholder="请输入验证码"></el-input>
            <div class="eq-code-img" @click="getCaptcha">
              <img :src="blob" alt="captcha 验证码">
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button style="width: 100%" type="primary" @click="login('form')">登 录</el-button>
        </el-form-item>
      </el-form>

      <el-link>忘记密码?</el-link>
    </section>
  </div>
</template>

<script>
  import { getUUID } from '@/utils'
  export default {
    computed: {},
    data () {
      return {
        height: 700,
        dialogVisible: true,
        blob: '',
        form: {
          username: 'admin',
          password: 'admin123',
          captcha: '',
          uuid: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入昵称', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          captcha: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      this.getCaptcha()
    },
    mounted () {
      this.height = window.innerHeight
    },
    methods: {
      // 登录
      login (form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/login`),
              method: 'post',
              data: this.$http.adornData(
                this.form
              )
            }).then(({ data }) => {
              if (data && data.code === 0) {
                sessionStorage.setItem('userName', this.form.username)
                this.$cookie.set('token', data.bean.token)
                this.$router.replace({name: 'index'})
              } else {
                this.getCaptcha()
                this.$message.error(data.msg)
              }
            })
          }
        })
      },

      // 获取验证码
      getCaptcha () {
        this.form.uuid = getUUID()
        this.blob = this.$http.adornUrl(`/captcha.jpg?uuid=${this.form.uuid}`)
      },

      // 提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/login', this.$constant.baseUrlType.login),
              method: 'post',
              data: this.$http.adornData({
                'username': this.dataForm.userName,
                'password': this.dataForm.password,
                'uuid': this.dataForm.uuid,
                'captcha': this.dataForm.captcha
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$cookie.set('token', data.bean.token)
                this.$router.replace({name: 'index'})
              } else {
                this.getCaptcha()
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss">
.login-el-form{
  & input, & button{
    height: 50px;
  }
  & .el-form-item{
    margin-bottom: 40px;
  }
}
</style>
<style lang="scss" scoped>
.ctn{
  background-image: url('../../assets/img/login.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
  position: relative;
  & > .modal{
    width: 614px;
    height: 558px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -307px 0 0 -279px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 3px;
    box-shadow: 0 0 20px #00000050;
    padding: 30px 50px;
    text-align: center;
    &>h2{
      font-size: 27px;
      margin-bottom: 50px;
    }
    & .eq-code{
      display: grid;
      grid-template-columns: 6fr 4fr;
      grid-column-gap: 20px;
    }
  }
}
</style>
