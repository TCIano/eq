<template>
   <div>
      <a-row type="flex" justify="end" align="middle">
         <a-col>
            <a-form layout="inline" style="width: 550px">
               <a-form-item label="设备节点">
                  <a-tree-select
                     v-model="equipment_node"
                     style="width: 200px"
                     :replaceFields="replaceFields"
                     :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                     :tree-data="treeData"
                     @select="getEqByTree"
                     placeholder="请选择设备组织节点"
                  ></a-tree-select>
               </a-form-item>
               <a-form-item label="设备">
                  <a-select v-model="eq" placeholder="请选择设备" style="width: 200px">
                     <a-select-option
                        :value="item.equipment_id"
                        v-for="item in eqList"
                        :key="item.equipment_id"
                     >
                        {{ item.equipment_name }}
                     </a-select-option>
                  </a-select>
               </a-form-item>
            </a-form>
         </a-col>
         <a-col>
            <a-space>
               <a-button type="primary" icon="search" @click="reSearch">查询</a-button>
               <a-button type="primary" icon="sync" @click="reset">重置</a-button>
            </a-space>
         </a-col>
      </a-row>
      <fault-diagnosis theme="" ref="faultDia" :equipment_id="equipment_id" />
   </div>
</template>

<script>
import { getEquipmentListApi, getOriginationApi } from '@/api/eqManage'
import FaultDiagnosis from '../eqMonitoring/components/faultDiagnosis.vue'
import { arr2Tree } from '@/utils'
import { getExternalFaultDiagnosisApi } from '@/api/eqDiagnosis'
export default {
   components: { FaultDiagnosis },
   data() {
      return {
         equipment_id: '',
         equipment_node: undefined,
         treeData: [],
         replaceFields: {
            children: 'children',
            title: 'title',
            key: 'key',
            value: 'key',
         },
         eq: undefined,
         eqList: [],
      }
   },
   methods: {
      async getOrigination() {
         const { result } = await getOriginationApi()
         this.treeData = arr2Tree(result)
         // generateList(this.treeData)
      },
      async getEqByTree(value) {
         this.eq = undefined
         const { result } = await getEquipmentListApi(
            Array.isArray(value) ? value : value.split(',')
         )
         if (result) {
            this.eqList = result
         }
      },
      async getExternalFaultDiagnosis() {
         const { result } = await getExternalFaultDiagnosisApi()
         if (result) {
            this.equipment_id = result.equipment_id
            this.equipment_node = result.equipment_node
            this.getEqByTree(this.equipment_node)
            this.eq = result.equipment_name
            this.$refs.faultDia.handleOption(result)
         }
      },
      reSearch() {
         this.getExternalFaultDiagnosis()
      },
      reset() {
         this.equipment_node = undefined
         this.eq = undefined
         this.eqList = []
      },
   },
   created() {
      this.getOrigination()
      this.getExternalFaultDiagnosis()
   },
}
</script>

<style scoped></style>
