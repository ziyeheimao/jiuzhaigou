<template>
  <el-container class="ctn">
    <el-header :style="'padding:0; height:170px;'">
      <div class="title">预约详情</div>
      <div class="info">
        <span class="red">{{'九寨沟县农特产品商贸有限公司'}}</span>
        预约办理
        <span class="red">{{'安全生产许可企业地址变更'}}</span>
      </div>

      <div class="btn">
        <el-button type="primary" v-for="(v,k) in btnList" :key="k" :plain="updataActive !== k" @click='clickChange(k)'>{{v}}</el-button>
      </div>
    </el-header>

    <el-main>
      <section v-if='updataActive === 0' class="info">
        <p class="title">预约信息</p>
        <div class="table">
          <table>
            <tr>
              <td>预约人/单位：{{'九寨沟县农特产品商贸有限公司'}}</td>
              <td>预约时间：{{'2020-02-17'}}</td>
              <td>预约编号：{{'512001041003'}}</td>
            </tr>
            <tr>
              <td>联系方式：{{'18188888888'}}</td>
              <td>证件类型：{{'居民身份证'}}</td>
              <td>证件号码：{{'425678199004275678'}}</td>
            </tr>
            <tr>
              <td>预约状态：{{'预约中 || 已驳回 || 已受理'}}</td>
              <td></td>
              <td></td>
            </tr>
          </table>
        </div>
        <p class="title">事项信息</p>
        <div class="table">
          <table>
            <tr>
              <td>预约事项：{{'九寨沟县农特产品商贸有限公司'}}</td>
              <td>事项类型：{{'行政许可'}}</td>
              <td>事项编号：{{'512001041003'}}</td>
            </tr>
          </table>
        </div>
        <p class="title">受理信息</p>
        <div class="table">
          <table>
            <tr>
              <td>受理情况：{{'--'}}</td>
              <td>操作时间：{{'--'}}</td>
              <td></td>
            </tr>
            <tr>
              <td colspan="3">受理意见：{{'--'}}</td>
            </tr>
          </table>
        </div>
      </section>
      <section v-if='updataActive === 1' class="log">
        <p class="title">1.网站预约</p>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="a" label="业务节点"></el-table-column>
          <el-table-column prop="b" label="预约账号"></el-table-column>
          <el-table-column prop="c" label="IP地址"></el-table-column>
          <el-table-column prop="d" label="提交预约时间"></el-table-column>
        </el-table>

        <p class="title">2.部门受理</p>
        <el-table :data="tableData2" style="width: 100%">
          <el-table-column prop="a" label="业务节点"></el-table-column>
          <el-table-column prop="b" label="操作人姓名"></el-table-column>
          <el-table-column prop="c" label="操作人账号"></el-table-column>
          <el-table-column prop="d" label="IP地址"></el-table-column>
          <el-table-column prop="e" label="所属部门"></el-table-column>
          <el-table-column prop="f" label="所属地区"></el-table-column>
          <el-table-column prop="g" label="受理系统操作"></el-table-column>
          <el-table-column prop="h" label="受理意见"></el-table-column>
          <el-table-column prop="i" label="操作时间"></el-table-column>
        </el-table>
      </section>

      <div class="btn">
        <el-button @click="quit">返 回</el-button>
        <el-button type="danger">驳 回</el-button>
        <el-button type="primary">受 理</el-button>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  components: {},
  // props: [''],
  computed: {},
  data () {
    return {
      updataActive: 0,
      auditId: 0,
      btnList: [ '基础信息', '办件日志' ],
      tableData: [
        {a: '预约办件', b: '18188888888', c: '125.119.100.179', d: '2020-02-16 10:45:21'}
      ],
      tableData2: [
        {a: '受理预约', b: '陈阳', c: 'chenyang12334', d: '125.119.100.179', e: '工商管理局', f: '九寨沟县永乐镇', g: '受理', h: '--', i: '2020-02-16 10:45:21'}
      ]
    }
  },
  methods: {
    clickChange (index) {
      sessionStorage.setItem('updataActive', index)
      this.updataActive = index
    },
    quit () {
      this.$router.push({name: 'make'})
    }
  },
  beforeCreate () {},
  created () {
    console.log(this.$route.query)
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
@import '../../../../../style/index.scss';

.el-container.ctn{
  & > .el-header {
    &>.title, &>.info{
      padding: $titlePadding;
      font-size: 16px;
    }
    & > .title {
      background-color: $borderC;
    }
    & > .info {
      background-color: $titileBGC;
    }
    & > .btn{
      padding: 25px 25px 0;
    }
  }
  & > .el-main {
    & > section{
      border: 1px solid $borderC;
      border-radius: 5px;
      padding: 25px;
      & > .title {
        color: rgb(22,155,253);
        font-size: 16px;
        padding-top: 15px;
      }
    }

    & > section.log{

    }
    & > section.info{
      & > .table > table{
        border-collapse: collapse;
        width: 100%;
      }
      & > .table > table td{
        padding: 10px;
        border: 1px solid #ddd;
      }
    }

    & > .btn{
      text-align: center;
      padding: 25px;
    }
  }
  .red{
    color: red;
  }
}

</style>
