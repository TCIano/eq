<template>
   <a-form-model ref="form" :mode="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="所属组织" prop="equipment_tree">
         <!-- <a-tree-select
            v-model="form.equipment_tree"
            :treeData="treeData"
            :replaceFields="replaceFields"
            placeholder="请选择组织机构"
            @select="selectOri"
         /> -->
         <a-cascader
            v-model="form.equipment_tree"
            :options="eqMessage.departs"
            :fieldNames="fieldNames"
            placeholder="请选择组织机构"
         />
      </a-form-model-item>
      <a-form-model-item label="设备属性" prop="equipment_attribute">
         <a-select v-model="form.equipment_attribute" placeholder="请选择设备属性">
            <a-select-option
               :value="item.code"
               v-for="item in eqMessage.equipMajor"
               :key="item.code"
            >
               {{ item.name }}
            </a-select-option>
         </a-select>
      </a-form-model-item>
      <a-form-model-item label="设备类型" prop="equipment_type">
         <a-cascader
            v-model="form.equipment_type"
            :options="eqMessage.equipTypes"
            :fieldNames="fieldNames"
            placeholder="请选择设备类型"
            @change="getBitByType"
         ></a-cascader>
      </a-form-model-item>
      <a-form-model-item label="设备名称" prop="equipment_name">
         <a-select v-model="form.equipment_name" placeholder="请选择设备名称" @focus="getEqName">
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
export default {
   mixins: [eqTypeMixin],
   name: 'basicInfo',
   props: {
      form: {
         type: Object,
      },
   },
   data() {
      return {
         // equipment_type: ['第一次', '第一1次'],
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
      selectOri(value, e) {
         console.log(value)
      },
      //根据设备类型获取设备位号
      getBitByType(param) {
         console.log(param)
         this.$emit('getType', param)
      },
      async getEqName() {
         this.equipNameList = await getEqNameApi({})
      },
   },

   created() {
      this.getEquipInitMessage()
   },
}
</script>

<style scoped></style>
