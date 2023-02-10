<template>
   <a-form-model ref="form" :mode="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="所属组织" prop="equipment_tree">
         <a-tree-select
            v-model="form.equipment_tree"
            :treeData="treeData"
            :replaceFields="replaceFields"
            placeholder="请选择组织机构"
         />
      </a-form-model-item>
      <a-form-model-item label="设备属性" prop="equipment_attribute">
         <a-select placeholder="请选择设备属性"></a-select>
      </a-form-model-item>
      <a-form-model-item label="设备类型" prop="equipment_type">
         <a-select placeholder="请选择设备类型"></a-select>
      </a-form-model-item>
      <a-form-model-item label="设备名称" prop="equipment_name">
         <a-select placeholder="请选择设备名称"></a-select>
      </a-form-model-item>
      <a-form-model-item label="状态位号" prop="equipment_status">
         <a-input placeholder="请输入状态位号"></a-input>
      </a-form-model-item>
   </a-form-model>
</template>

<script>
import { arr2Tree } from '@/utils'
import { getOriginationApi } from '@/api/eqManage'
export default {
   name: 'basicInfo',
   props: {
      form: {
         type: Object,
         default: () => {},
      },
   },
   data() {
      return {
         labelCol: {
            span: 8,
         },
         wrapperCol: { span: 8 },
         treeData: [],
         replaceFields: {
            children: 'children',
            title: 'title',
            key: 'key',
            value: 'key',
         },
      }
   },
   methods: {
      async getOrigination() {
         const result = await getOriginationApi()
         this.treeData = arr2Tree(result, false)
      },
   },
   created() {
      this.getOrigination()
   },
}
</script>

<style scoped></style>
