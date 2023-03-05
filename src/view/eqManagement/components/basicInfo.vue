<template>
   <a-form-model
      ref="form"
      :rules="rules"
      :model="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
   >
      <a-form-model-item label="所属组织" prop="equipment_tree">
         <!-- <a-tree-select
            v-model="form.equipment_tree"
            :treeData="treeData"
            :replaceFields="replaceFields"
            placeholder="请选择组织机构"
            @select="selectOri"
         /> -->
         <a-cascader
            :disabled="disabled"
            v-model="form.equipment_tree"
            :options="eqMessage.departs"
            :fieldNames="fieldNames"
            :show-search="{ filter }"
            placeholder="请选择组织机构"
         />
      </a-form-model-item>
      <a-form-model-item label="设备属性" prop="equipment_attribute">
         <a-select
            :disabled="disabled"
            v-model="form.equipment_attribute"
            placeholder="请选择设备属性"
         >
            <a-select-option
               :value="item.name"
               v-for="item in eqMessage.equipMajor"
               :key="item.code"
            >
               {{ item.name }}
            </a-select-option>
         </a-select>
      </a-form-model-item>
      <a-form-model-item label="设备类型" prop="equipment_type">
         <a-cascader
            :disabled="disabled"
            v-model="form.equipment_type"
            :options="eqMessage.equipTypes"
            :fieldNames="fieldNames"
            :show-search="{ filter }"
            placeholder="请选择设备类型"
            @change="getBitByType"
         ></a-cascader>
      </a-form-model-item>
      <a-form-model-item label="设备名称" prop="equipment_name">
         <a-select
            :disabled="disabled"
            :value="form.equipment_name"
            @change="nameChange"
            placeholder="请选择设备名称"
            @focus="getEqName"
         >
            <a-select-option :value="item.code" v-for="item in equipNameList" :key="item.code">
               {{ item.name }}
            </a-select-option>
         </a-select>
      </a-form-model-item>
      <a-form-model-item label="状态位号" prop="equipment_status">
         <a-input v-model="form.equipment_status" placeholder="请输入状态位号"></a-input>
      </a-form-model-item>
   </a-form-model>
</template>

<script>
import { eqTypeMixin } from '@/mixins/eqTypeMixins'
import { getEqNameApi } from '@/api/eqManage'
import { storageStore } from '@/store/local'
import { isObjectEqual } from '@/utils'
export default {
   mixins: [eqTypeMixin],
   name: 'basicInfo',
   props: {
      form: {
         type: Object,
      },
      title: {
         type: String,
      },
   },
   data() {
      return {
         rules: {
            equipment_tree: [{ required: true, trigger: 'blur', message: '请选择所属组织' }],
            equipment_attribute: [{ required: true, trigger: 'blur', message: '请选择所属组织' }],
            equipment_type: [{ required: true, trigger: 'blur', message: '请选择所属组织' }],
         },
         disabled: this.title === '修改' ? true : false,
         labelCol: {
            span: 8,
         },
         wrapperCol: { span: 8 },
         treeData: [],
         equipment_tree: '',
         equipNameList: [],
      }
   },
   methods: {
      nameChange(code) {
         this.form.equipment_id = code
         this.form.equipment_name = this.equipNameList.find(item => item.code === code).name
         storageStore.set('basic-info-addInfo', this.form)
      },
      // selectOri(value, e) {},
      //根据设备类型获取设备位号
      getBitByType(param) {
         storageStore.set('isTypeChange', true)
         this.$emit('getType', param)
      },
      getEqName() {
         this.getNameList(this.form)
      },
      async getNameList(params) {
         //判断设备属性类型组织是否变化，变化则重新获取设备名称
         if (!isObjectEqual(storageStore.get('basic-info-addInfo'), params)) {
            const { data } = await getEqNameApi({
               depart: params.equipment_tree[0],
               section: params.equipment_tree[1],
               equipMajorDIC: params.equipment_attribute,
               equipType: params.equipment_type[params.equipment_type.length - 1],
            })
            if (data) {
               this.equipNameList = data
            }
         }
      },
   },
   created() {
      // if (this.title === '修改') {
      //    this.getNameList()
      // }
      this.getEquipInitMessage()
   },
}
</script>

<style scoped></style>
