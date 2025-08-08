import { getSelectEquipmentByOrg } from '@/api/eqManage'
import { getOrgApi } from '@/api/org'

export const mixin = {
  data() {
    return {
      equipment_node: undefined,
      replaceFields: {
        children: 'children',
        title: 'name',
        key: 'id',
        value: 'id',
      },
      treeData: [],
      eq: undefined,
      eqList: [],
    }
  },
  methods: {
    async getOrigination() {
      const { result } = await getOrgApi()
      this.treeData = [result]
    },
    async getEqByTree(value) {
      this.eq = undefined
      const { result } = await getSelectEquipmentByOrg(value)
      if (result) {
        this.eqList = result
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
