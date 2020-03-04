<template>
  <el-container class="ctn">
    <el-header :style="'padding:0; height:170px;'">
      <div class="title">预约详情</div>
      <div class="info">
        <span class="red">{{'九寨沟县农特产品商贸有限公司'}}</span>
        办理
        <span class="red">{{'安全生产许可企业地址变更'}}</span>
      </div>

      <div class="btn">
        <el-button type="primary" v-for="(v,k) in btnList" :key="k" :plain="updataActive !== k" @click='clickChange(k)'>{{v}}</el-button>
      </div>
    </el-header>

    <el-main>

      <!-- 基础信息 -->
      <section v-if='updataActive === 0' class="basicInfo">
        <p class="title">事项信息</p>
        <table class="myTable">
          <tr>
            <td>事项名称：{{'安全生产许可企业地址变更'}}</td>
            <td>事项类型：{{'行政许可'}}</td>
            <td>咨询编号：{{'3885489565696'}}</td>
          </tr>

          <tr>
            <td>事项编号：{{'3885489565696'}}</td>
            <td>咨询人属性：{{'法人'}}</td>
            <td>承诺时限：{{'1天'}}</td>
          </tr>
        </table>

        <p class="title">咨询人/单位信息 <span class="red">（点击切换显示咨询人为自然人时的页面设计）</span></p>
        <table class="myTable">
          <tr>
            <td>
              主题性质：
              <el-radio-group v-model="formBasicInfo.radio" :disabled="!query.upData">
                <el-radio :label="3">国家行政机关</el-radio>
                <el-radio :label="6">事业单位</el-radio>
                <el-radio :label="9">企业</el-radio>
                <el-radio :label="2">其他</el-radio>
              </el-radio-group>
            </td>
            <td>机构名称：{{'九寨沟县农特产品商贸有限公司'}}</td>
            <!-- <td></td> -->
          </tr>
          <tr>
            <td>证件类型：{{'统一社会信用代码'}}</td>
            <td>法定代表人：{{'王光辉'}}</td>
            <!-- <td></td> -->
          </tr>
          <tr>
            <td>证件号码：{{'425678199004275678'}}</td>
            <td>联系电话：{{'18188888888'}}</td>
            <!-- <td></td> -->
          </tr>
          <tr>
            <td>通讯地址：{{'四川省阿坝藏族羌族自治州九寨沟县永乐镇风成寺路234号'}}</td>
            <td>电子邮件：{{'1818888888@163.com'}}</td>
            <!-- <td></td> -->
          </tr>
          <tr>
            <td>邮政编码：{{'466337'}}</td>
            <td>备注说明：{{'--'}}</td>
            <!-- <td></td> -->
          </tr>
        </table>

        <p class="title">应交材料</p>
        <el-table :data="tableData1" style="width: 100%">
          <el-table-column prop="a" label="材料名称"></el-table-column>
          <el-table-column prop="b" width="100" label="材料必要性"></el-table-column>
          <el-table-column prop="c" width="110" label="纸质材料份数"></el-table-column>
          <el-table-column prop="d" width="110" label="电子材料份数"></el-table-column>
          <el-table-column prop="e" width="100" label="示例样表">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row, 3)" type="text" size="small">下载查看</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="f" width="100" label="是否容缺"></el-table-column>
          <el-table-column prop="g" label="是否已交"></el-table-column>
          <el-table-column prop="h" label="材料附件"></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row, 1)" type="text" size="small">上传</el-button>
              <el-button @click="handleClick(scope.row, 2)" type="text" size="small">下载</el-button>
            </template>
          </el-table-column>
        </el-table>

        <p class="title">收费信息</p>
        <table class="myTable">
          <tr>
            <td>
              应收费用：{{'20.00元'}}
            </td>
            <td>
              是否已缴费：
              <el-radio-group v-model="formBasicInfo.radio2" :disabled="!query.upData">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </td>
          </tr>
        </table>

        <p class="title">审核意见</p>
        <el-input type="textarea" placeholder="请输入内容" v-model="formBasicInfo.textarea" maxlength="300" show-word-limit :rows='5' :disabled="!query.upData"></el-input>

        <p class="title">办结信息</p>
        <table class="myTable">
          <tr>
            <td>
              是否办结：
              <el-radio-group v-model="formBasicInfo.radio3" :disabled="!query.upData">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </td>
            <td>
              是否制证：
              <el-radio-group v-model="formBasicInfo.radio4" :disabled="!query.upData">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td>证件名称：{{'xxxx'}}</td>
            <td>证件编号：{{'--'}}</td>
          </tr>
          <tr>
            <td>
              是否已取件：
              <el-radio-group v-model="formBasicInfo.radio3" :disabled="!query.upData">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </td>
            <td></td>
          </tr>
        </table>

        <p class="title"><span class="red">咨询时间：2020-02-17 10:08:23</span></p>
      </section>

      <!-- 受理条件 -->
      <section v-if='updataActive === 1' class="acceptingConditions">
        <p class="box">
          <span>（1）具有辖区内户籍</span> <br/>
          <span>（2）持有第二代《中华人民共和国残疾人证》</span> <br/>
          <span>（3）享受城乡最低生活保障的残疾人。</span> <br/>
          <span>（4）残疾等级被评定为一级、二级且需要长期照护的重度残疾人。</span>
        </p>

        <p class="title"><span class="red">咨询时间：2020-02-17 10:08:23</span></p>
      </section>

      <!-- 审核要点 -->
      <section v-if='updataActive === 2' class="auditPoints">
        <table class="myTable">
          <tr>
            <td>编号</td>
            <td>审核要点</td>
          </tr>
          <tr>
            <td>1</td>
            <td>实施行政处罚的机关或组织是否具有法定行政处罚主体资格，作出的行政处罚行为是否超越法定职责权限</td>
          </tr>
          <tr>
            <td>2</td>
            <td>委托执法是否有法律、法规、规章的依据；被委托组织是否以委托机关名义实施行政处罚，是否超越了委托的范围从事行政处罚活动。</td>
          </tr>
          <tr>
            <td>3</td>
            <td>承办行政处罚案件的人员是否具备行政执法资格</td>
          </tr>
          <tr>
            <td>4</td>
            <td>被处罚对象主体是否适格，是否能够依法独立承担法律责任</td>
          </tr>
          <tr>
            <td>5</td>
            <td>当事人的行为是否属于依法应当给予行政处罚的行为，是否有充分的法律依据和事实证据。</td>
          </tr>
          <tr>
            <td>6</td>
            <td>违法行为的事实是否清楚；认定违法事实的证据是否确凿、充分。</td>
          </tr>
          <tr>
            <td>7</td>
            <td>违法行为发生的时间、地点，违法行为的内容、情节、性质和危害后果等是否核实。</td>
          </tr>
          <tr>
            <td>8</td>
            <td>违法行为发生的时间、地点，违法行为的内容、情节、性质和危害后果等是否核实并在执法文书上记载清楚。执法文书记载的内容前后是否一致。 </td>
          </tr>
          <tr>
            <td>9</td>
            <td>证据是否充分，能否足以证明法律事件或行为的事实、情节、性质及后果。对当事人的身份证明、营业执照、许可证等应当提取的证据有否全部提取。</td>
          </tr>
          <tr>
            <td>10</td>
            <td>与案件事实有关的证据材料是否符合形式要件，包括现场检查（勘验）笔录、抽样取证物品清单、涉案物品清单、现场照片、调查（询问）笔录、执法文书的送达回证以及当事人身份证、营业执照、许可证等证明材料，应有当事人签字确认的记录和执法人员的签名；当事人拒绝签字的，执法人员应当注明拒签的理由，有见证人的应由见证人签字。</td>
          </tr>
        </table>
        <p class="title"><span class="red">咨询时间：2020-02-17 10:08:23</span></p>
      </section>

      <!-- 审核流程 -->
      <section v-if='updataActive === 3' class="auditProcess">
        <div>工作流画板或svg回显</div>
        <p class="title"><span class="red">咨询时间：2020-02-17 10:08:23</span></p>
      </section>

      <!-- 常见问题解答 -->
      <section v-if='updataActive === 4' class="frequentlyAskedQuestions">
        <table class="myTable">
          <tr>
            <td>编号</td>
            <td>问题</td>
            <td>解答</td>
          </tr>
          <tr>
            <td>1</td>
            <td>实施行政处罚的机关或组织是否具有法定行政处罚主体资格，作出的行政处罚行为是否超越</td>
            <td>实施行政处罚的机关或组织是否具有法定行政处罚主体资格，作出的行政处罚行为是否超越</td>
          </tr>
          <tr>
            <td>2</td>
            <td>委托执法是否有法律、法规、规章的依据；被委托组织是否以委托机关名义实施行政处罚</td>
            <td>委托执法是否有法律、法规、规章的依据；被委托组织是否以委托机关名义实施行政处罚</td>
          </tr>
          <tr>
            <td>3</td>
            <td>承办行政处罚案件的人员是否具备行政执法资格</td>
            <td>承办行政处罚案件的人员是否具备行政执法资格</td>
          </tr>
          <tr>
            <td>4</td>
            <td>被处罚对象主体是否适格，是否能够依法独立承担法律责任</td>
            <td>被处罚对象主体是否适格，是否能够依法独立承担法律责任</td>
          </tr>
          <tr>
            <td>5</td>
            <td>当事人的行为是否属于依法应当给予行政处罚的行为，是否有充分的法律依据和事实证据。</td>
            <td>当事人的行为是否属于依法应当给予行政处罚的行为，是否有充分的法律依据和事实证据。</td>
          </tr>
          <tr>
            <td>6</td>
            <td>违法行为的事实是否清楚；认定违法事实的证据是否确凿、充分。</td>
            <td>违法行为的事实是否清楚；认定违法事实的证据是否确凿、充分。</td>
          </tr>
          <tr>
            <td>7</td>
            <td>违法行为发生的时间、地点，违法行为的内容、情节、性质和危害后果等是否核实。</td>
            <td>违法行为发生的时间、地点，违法行为的内容、情节、性质和危害后果等是否核实。</td>
          </tr>
          <tr>
            <td>8</td>
            <td>违法行为发生的时间、地点，违法行为的内容、情节、性质和危害后果等是否核实并在</td>
            <td>违法行为发生的时间、地点，违法行为的内容、情节、性质和危害后果等是否核实并在</td>
          </tr>
          <tr>
            <td>9</td>
            <td>证据是否充分，能否足以证明法律事件或行为的事实、情节、性质及后果。</td>
            <td>证据是否充分，能否足以证明法律事件或行为的事实、情节、性质及后果。</td>
          </tr>
          <tr>
            <td>10</td>
            <td>与案件事实有关的证据材料是否符合形式要件</td>
            <td>与案件事实有关的证据材料是否符合形式要件</td>
          </tr>
        </table>
        <p class="title"><span class="red">咨询时间：2020-02-17 10:08:23</span></p>
      </section>

      <!-- 办件日志 -->
      <section v-if='updataActive === 5' class="officeLog">
        <p class="title">1.网站预约</p>
        <table class="myTable">
          <tr>
            <td>业务节点</td>
            <td>预约账号</td>
            <td>IP地址</td>
            <td>提交预约时间</td>
          </tr>
          <tr>
            <td>--</td>
            <td>--</td>
            <td>--</td>
            <td>--</td>
          </tr>
        </table>

        <p class="title">2.部门受理</p>
        <table class="myTable">
          <tr>
            <td>业务节点</td>
            <td>操作人姓名</td>
            <td>操作人账号</td>
            <td>IP地址</td>
            <td>所属部门</td>
            <td>所属地区</td>
            <td>受理系统操作</td>
            <td>受理意见</td>
            <td>操作时间</td>
          </tr>
          <tr>
            <td>新增咨询</td>
            <td>陈阳</td>
            <td>chenyang12334</td>
            <td>125.119.100.179</td>
            <td>工商管理局</td>
            <td>九寨沟县永乐镇</td>
            <td>保存并受理</td>
            <td>--</td>
            <td>2020-02-17 10:08:23</td>
          </tr>
        </table>
        <p class="title"><span class="red">咨询时间：2020-02-17 10:08:23</span></p>
      </section>

      <div class="btn">
        <el-button @click="quit">返 回</el-button>
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
      btnList: [ '基础信息', '受理条件', '审核要点', '审核流程', '常见问题解答', '办件日志' ],
      formBasicInfo: {
        textarea: ''
      },
      tableDataUpdataActive: [
        {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9},
        {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9},
        {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9}
      ],
      tableData1: [
        {a: '汽车技术等级评定表', b: '必要', c: '1份', d: '--', e: '下载查看', f: '不容缺', g: '是', h: '汽车技术等级评定表.pdf'},
        {a: '汽车技术等级评定表', b: '必要', c: '1份', d: '--', e: '下载查看', f: '不容缺', g: '是', h: '汽车技术等级评定表.pdf'},
        {a: '汽车技术等级评定表', b: '必要', c: '1份', d: '--', e: '下载查看', f: '不容缺', g: '是', h: '汽车技术等级评定表.pdf'},
        {a: '汽车技术等级评定表', b: '必要', c: '1份', d: '--', e: '下载查看', f: '不容缺', g: '是', h: '汽车技术等级评定表.pdf'},
        {a: '汽车技术等级评定表', b: '必要', c: '1份', d: '--', e: '下载查看', f: '不容缺', g: '是', h: '汽车技术等级评定表.pdf'}
      ],
      query: {}
    }
  },
  methods: {
    clickChange (index) {
      sessionStorage.setItem('updataActive', index)
      this.updataActive = index
    },
    quit () {
      this.$router.push({name: 'consultation'})
    },
    tableDataUpdataActiveClick (row) {
      console.log(row)
    },
    handleClick (row, type) {
      switch (type) {
        case 1:
          console.log('上传', row)
          break
        case 2:
          console.log('下载', row)
          break
        case 3:
          console.log('下载查看', row)
          break
      }
    }
  },
  beforeCreate () {},
  created () {
    console.log(this.$route.query)
    this.query = this.$route.query
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
    }

    & > .btn{
      text-align: center;
      padding: 25px;
    }
  }
}
.red{
  color: red;
}

.myTable{
  border-collapse: collapse;
  width: 100%;
  & td{
    padding: 10px;
    border: 1px solid #ddd;
  }
}
.box{
  padding: 20px;
  background-color: #eee;
  font-size: 14px;
  &>span{
    display: inline-block;
    padding: 5px;
  }
}
</style>
