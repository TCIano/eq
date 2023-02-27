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
            equipment_tree: Array.isArray(value) ? value : value.split(','),
         })
         if (result) {
            this.eqList = result
         }
      },
   },
   created() {
      this.getOrigination()
   },
}
