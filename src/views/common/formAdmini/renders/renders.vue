<template>
  <section>
    <el-form-item :label="obj.label" class="renders"
      :prop="prop.mustFill === 1 ? 'mustFill' : ''">

      <!-- 输入框 -->
      <el-input v-if="ele === 'el-input'"  v-model="form.input" clearable
        :maxlength='obj.maxlength' :placeholder='obj.placeholder'></el-input>

      <!-- 文本域 -->
      <el-input v-if="ele === 'textarea'"  v-model="form.textarea"
        type="textarea" clearable
        :placeholder='obj.placeholder' show-word-limit rows='5' :maxlength='obj.maxlength'></el-input>

      <!-- 单选框组 -->
      <el-radio-group v-if="ele === 'el-radio'" v-model="form.radio">
        <el-radio :label="1">选项 1</el-radio>
        <el-radio :label="2">选项 2</el-radio>
        <el-radio :label="3">选项 3</el-radio>
      </el-radio-group>

      <!-- 多选框组 -->
      <el-checkbox-group v-if="ele === 'el-checkbox'" v-model="form.checkbox">
        <el-checkbox label="复选 1"></el-checkbox>
        <el-checkbox label="复选 2"></el-checkbox>
        <el-checkbox label="复选 3"></el-checkbox>
      </el-checkbox-group>

      <!-- 计数器 -->
      <el-input-number v-if="ele === 'el-input-number'" v-model="form.number"
        :min='obj.min' :max='obj.max'></el-input-number>

      <!-- 选择器 -->
      <el-select v-if="ele === 'el-select'" v-model="form.select" clearable :placeholder='obj.placeholder'>
        <el-option :label="'选项 1'" :value="1"></el-option>
        <el-option :label="'选项 2'" :value="2"></el-option>
        <el-option :label="'选项 3'" :value="3"></el-option>
      </el-select>

      <!-- 按钮 -->
      <!-- <el-button v-if="ele === 'el-button'" type="primary">{{obj.text}}</el-button> -->
    </el-form-item>
  </section>
</template>

<script>
export default {
  name: 'renders',
  data () {
    return {
      form: {
        input: '',
        textarea: '',
        radio: '',
        checkbox: [],
        number: ''
      }
    }
  },
  props: {
    // 当前控件的类型
    ele: { type: String, default: 'input' },

    // 当前控件的配置
    obj: {
      type: Object,
      default () {
        return {}
      }
    },
    prop: {
      type: Object,
      default () {
        return {}
      }
    }

    /*
    // 当前控件的index,config 和 delete 会用到
    index: {
      type: Number,
      default: 0
    },

    // 整个表单的数据
    data: {
      type: Object,
      default () {
        return {}
      }
    },

    // 是否显示配置按钮
    configIcon: {
      type: Boolean,
      default: false
    },

    // 当前控件绑定的值 方便数据回填
    value: [String, Number, Array],

    // 当前被clone控件列表
    sortableItem: {
      type: Array,
      default () {
        return []
      }
    }
    */
  }
}
</script>
