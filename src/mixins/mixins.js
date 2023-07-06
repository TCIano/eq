import { getEquipmentListApi, getOriginationApi } from '@/api/eqManage'
import { arr2Tree } from '../utils'
export const mixin = {
   data() {
      return {
         equipment_node: undefined,
         replaceFields: {
            children: 'children',
            title: 'title',
            key: 'key',
            value: 'key',
         },
         treeData: [],
         eq: undefined,
         eqList: [],
      }
   },
   methods: {
      async getOrigination() {
         const { result } = await getOriginationApi()
         this.treeData = arr2Tree(result)
      },
      async getEqByTree(value) {
         this.eq = undefined
         const { result } = await getEquipmentListApi({
            filtration: Array.isArray(value) ? value : value.split(','),
         })
         if (result) {
            this.eqList = result.datas
         }
      },
      //获取数据处理
      handleTreeNode(result) {
         this.equipment_node = result.equipment_tree.join(',')
         this.getEqByTree(this.equipment_node)
         this.eq = result.equipment_id
      },
      reSetTreeNode() {
         this.equipment_node = undefined
         this.eq = undefined
         this.eqList = []
      },
   },
   created() {
      this.getOrigination()
   },
}
