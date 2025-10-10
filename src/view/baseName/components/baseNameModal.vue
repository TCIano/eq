<template>
  <a-modal :title="title" :visible="visible" :width="600" @cancel="handleCancel" @ok="handleOk">
    <a-form-model
        ref="ruleForm"
        :label-col="labelCol"
        :model="attrForm"
        :rules="rules"
        :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="基础信息名称" prop="name">
        <a-input v-model="attrForm.name" placeholder="请输入基础数据名称" />
      </a-form-model-item>
      
      <a-form-model-item label="单位" prop="unit">
        <a-input v-model="attrForm.unit" placeholder="请输入基础数据名称" />
      </a-form-model-item>
    
    
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  name: 'BaseNameModal',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      attrForm: {
        id: '',
        name: '',
        unit: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入基础数据名称', trigger: 'blur' },
        ],
        unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
      },
    }
  },
  watch: {
    /**
     * 监听表单数据变化
     * @param {Object} newVal 新值
     */
    formData: {
      handler(newVal) {
        if (newVal) {
          this.attrForm = { ...newVal }
        }
      },
      deep: true,
      immediate: true,
    },
    
    /**
     * 监听弹窗显示状态
     * @param {Boolean} newVal 新值
     */
    visible(newVal) {
      if (!newVal) {
        this.resetForm()
      }
    },
  },
  methods: {
    /**
     * 确定按钮处理
     */
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 验证通过，提交表单
          const formData = { ...this.attrForm }
          
          // 如果是新增，删除id字段
          
          if (this.title === '新增') {
            delete formData.id
          }
          
          this.$emit('handleBaseName', formData, this.title)
        } else {
          this.$message.error('请检查表单信息')
          return false
        }
      })
    },
    
    /**
     * 取消按钮处理
     */
    handleCancel() {
      this.$emit('update:visible', false)
      this.resetForm()
    },
    
    /**
     * 重置表单
     */
    resetForm() {
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields()
      this.attrForm = {
        id: '',
        name: '',
        type: '',
        description: '',
        status: '启用',
      }
    },
  },
}
</script>

<style lang="less" scoped>
// 可以根据需要添加样式
</style>
