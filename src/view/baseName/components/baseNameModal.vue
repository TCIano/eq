<template>
   <a-modal :title="title" :visible="visible" :width="600" @cancel="handleCancel" @ok="handleOk">
      <a-form-model
         ref="ruleForm"
         :model="attrForm"
         :rules="rules"
         :label-col="labelCol"
         :wrapper-col="wrapperCol"
      >
         <a-form-model-item label="基础数据名称" prop="name">
            <a-input v-model="attrForm.name" placeholder="请输入基础数据名称" />
         </a-form-model-item>

         <a-form-model-item label="数据类型" prop="type">
            <a-select v-model="attrForm.type" placeholder="请选择数据类型">
               <a-select-option value="传感器">传感器</a-select-option>
               <a-select-option value="设备">设备</a-select-option>
               <a-select-option value="配件">配件</a-select-option>
               <a-select-option value="材料">材料</a-select-option>
               <a-select-option value="其他">其他</a-select-option>
            </a-select>
         </a-form-model-item>

         <a-form-model-item label="描述" prop="description">
            <a-textarea v-model="attrForm.description" placeholder="请输入描述信息" :rows="4" />
         </a-form-model-item>

         <a-form-model-item label="状态" prop="status">
            <a-radio-group v-model="attrForm.status">
               <a-radio value="启用">启用</a-radio>
               <a-radio value="禁用">禁用</a-radio>
            </a-radio-group>
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
            type: '',
            description: '',
            status: '启用',
         },
         rules: {
            name: [
               { required: true, message: '请输入基础数据名称', trigger: 'blur' },
               { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
            ],
            type: [{ required: true, message: '请选择数据类型', trigger: 'change' }],
            status: [{ required: true, message: '请选择状态', trigger: 'change' }],
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
