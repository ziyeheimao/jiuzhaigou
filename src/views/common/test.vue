<template>
  <div id="DATE">
    <ul class="dateForm" @change="VpushDateTime((ymd+hour+minute))">
      <!-- 年月日 -->
      <li class="ymd">
        <div class="postion input">
          <label  @click.stop.prevent="selectState=true"><input type="text" v-model="ymd"><!--
         --><i class="glyphicon glyphicon-triangle-bottom"></i>
          </label>
        </div>
        <!-- 下拉列表年月日 -->
        <select v-if="selectState" v-model="ymd"  @click.stop="VgetSelect('ymdSelect',$event)"  class="postion list select" id="ymdSelect" size="4">
          <option v-for="itme in ymdList" v-text="itme" v-bind:value="itme"></option>
        </select>
      </li>
      <!-- 小时 -->
      <li class="hour">
        <div class="postion input">
          <label @click.stop="selectState=true"><input type="text" v-model="hour"><!--
         --><i class="glyphicon glyphicon-triangle-bottom"></i>
          </label>
        </div>
        <!-- 下拉列表小时 -->
        <select v-if="selectState" v-model="hour" @click.stop="VgetSelect('hourSelect',$event)" class="postion list select" id="hourSelect" size="4">
          <option v-for="(itme,i) in hourList" v-text="itme" v-bind:value="itme" ></option>
        </select>
      </li>
      <!-- 分钟 -->
      <li class="minute">
        <div class="postion input">
          <label @click.stop="selectState=true"><input type="text" v-model="minute"><!--
         --><i class="glyphicon glyphicon-triangle-bottom"></i>
          </label>
        </div>
        <!-- 下拉列表分钟 -->
        <select v-if="selectState" v-model="minute" @click.stop="VgetSelect('minuteSelect',$event)" class="postion list select" id="minuteSelect" size="4">
          <option v-for="itme in minuteList" v-text="itme" v-bind:value="itme"></option>
        </select>
      </li>
    </ul>
    <button @click="p=23,ps=!ps">change</button>
    <p v-if="ps">{{p}}</p>
  </div>
</template>
<script>
    import moment from 'moment'
// 设置时间核心插件语言
moment.locale('zh-cn')
// 字典=》全国放假日[因为不知道明年放假是如何定的，所以只写死今年]
const wordBookDate = ['2018年06月16日', '2018年06月17日', '2018年06月18日', '2018年09月22日', '2018年09月23日', '2018年09月24日', '2018年10月01日', '2018年10月02日', '2018年10月03日', '2018年10月04日', '2018年10月05日', '2018年10月06日', '2018年10月07日']

export default {
      props: {
        init: ''
      },
      data () {
        return {
          p: '12',
          ps: false,
                // 输入框
                // 年月日
          ymd: '',
                // 小时
          hour: '', // moment().format('HH')+'时'
                // 分钟
          minute: moment().format('mm') + '分',
            // 下拉框状态
          selectState: false
        }
    },
      methods: {
            // 向父组件传值
        VpushDateTime (data) {
          const _this = this
            //  _this.$emit("getDateTime", _this.ymd);
          _this.$emit('getDateTime', data)
        },
            // 下拉列表选择
        VgetSelect (selectName, e) {
          const _this = this
          const oSelec = document.querySelector('#' + selectName)

          if (selectName.startsWith('ymd')) {
                    // console.log('年月日');
                    // _this.ymd=(e.target).innerText;
          } else if (selectName.startsWith('hour')) {
                    // console.log('小时的');

          } else if (selectName.startsWith('minute')) {
                    // console.log('分钟的');

          }
                /* oSelec.addEventListener("click",function(e){
                  console.log(selectName)
                  if(selectName.startsWith('ymd')){
                    console.log('年月日');
                  }else if(selectName.startsWith('hour')) {
                    console.log('小时的');
                  }else if(selectName.startsWith('hour')){
                    console.log('分钟的');
                  }
                  //_this.ymd=(e.target).innerText;
                  _this.ymd=(e.target).innerText;
                  //_this.VpushDateTime(_this.ymd);
                },false) */
        },
            // 检测最终值是否正确
        Vcheck (date) {
          const _this = this
          _this.VpushDateTime(date)
        }

      },
      computed: {
            /*  year-month-day
                hour
                Minute */
            // 年月日
        ymdList: () => {
                /* const _this=this; */
          let arr = []
          const month = wordBookDate[(moment().month() + 2).toString()]
            // 取60天区间
          for (let i = 0; i < 60; i++) {
            let ymd = moment().add(i, 'day').format('L')
            let day = moment(ymd).day()
                // 过滤周六日
            if (!(day == 0 || day == 6)) {
              ymd = ymd.replace(/[/]/, '年')
                            .replace(/[/]/, '月') + '日'
              arr.push(ymd)
            }
                    // 过滤周六日完毕
          }
                // 取60天区间完毕
                // 过滤法定节日
          if (month.length != 0) {
                    // 传统写法
            for (let i = 0; i < arr.length; i++) {
              for (let m = 0; m <= month.length; m++) {
                if (arr[i] == month[m]) {
                                // 改变原数组
                  arr.splice(i, 1)
                }
              }
            }
          }
                // 过滤法定节日完毕
          return arr
        },
            // 时
        hourList: () => {
          return ['09时', '10时', '11时', '13时', '14时']
        },
            // 分
        minuteList: () => {
          return ['00分', '01分', '02分', '03分', '04分', '05分', '06分', '07分', '08分', '09分',
            '10分', '11分', '12分', '13分', '14分', '15分', '16分', '17分', '18分', '19分',
            '20分', '21分', '22分', '23分', '24分', '25分', '26分', '27分', '28分', '29分',
            '30分', '31分', '32分', '33分', '34分', '35分', '36分', '37分', '38分', '39分',
            '40分', '41分', '42分', '43分', '44分', '45分', '46分', '47分', '48分', '49分',
            '50分', '51分', '52分', '53分', '54分', '55分', '56分', '57分', '58分', '59分']
        }
      },
      mounted () {
        const _this = this
        // 当鼠标点击旁边隐藏下拉框
        document.documentElement.addEventListener('click', function (e) {
          _this.selectState = false
        })
        // console.clear();
        // console.log(_this.init.type);
        moment().hour() >= 15 ? _this.ymdList.splice(0, 1) : ''
        _this.ymd = _this.ymdList[0]// 年月日输入赋值，默认第一个
        _this.hour = _this.hourList[0]// 小时，默认第一个
        console.log(_this.hourList[0])
        _this.VpushDateTime((_this.ymd + _this.hour + _this.minute))
    }
    }
</script>
<style lang="scss" scoped>
  /* 整体样式 */
  .dateForm{
    list-style: none;
    padding: 0;margin:0;
    &>li{
      display: inline-block;
      position: relative;
    }
    .postion{
      position: absolute;
      top:0;left: 0;
    }
    .postion.input{
      z-index: 2;
      background:#fff;
    }
    .postion.list{
      padding: 0;
      box-sizing: border-box;
      width: 100%;
      top:28px;
    }
  }
  /* 输入框样式 */
  label {
    display: inline-block;
    height: 26px;
    line-height: 26px;
    border: 1px solid #ddd;
    padding: 0;
    margin: 0;
    overflow: hidden;
    input {
      padding: 0;
      margin: 0;
      outline: none;
      border: none;
      box-sizing: border-box;
      padding-left: 3px;
    }
    i {
      border-left: 1px solid #ddd;
      display: inline-block;
      line-height: 26px;
      vertical-align: bottom;
      text-align: center;
      cursor: pointer;
      font-size: 14px;
      color: #6d6d6d;
    }
  }
  .ymd {
    width: 145px;
    .postion.input{
      width: 145px;
      label{
        width: 145px;
      }
    }
    input {
      width: 122px;
    }
    i {
      padding-left: 3px;
    }
  }
  .hour,
  .minute {
    width: 60px;
    .postion.input{
      width: 60px;
      label{
        width: 60px;
      }
    }
    input {
      width: 36px;
    }
    i {
      width: 18px;
    }
  }
  /* 下拉列表样式 */
  .select{
    background: #fff;
    outline: none;
    margin: 0;
    padding:0;
    option{
      height: 28px;
      line-height: 28px;
      padding-top: 5px;
      padding-left: 5px;
      cursor: pointer;
    }
    option:hover,option:focus,option:active{
      background: #1883D7;
      color:#fff;
    }
  }
  .select::-webkit-scrollbar{
    width:2px;
    background: #6d6d6d;
  }
</style>