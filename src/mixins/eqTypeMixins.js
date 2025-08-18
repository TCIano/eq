import { getAttributeListApi, getEquipmentTypeWithoutPageApi } from '@/api'
import { getOrgApi } from '@/api/org'

export const eqTypeMixin = {
  data() {
    return {
      orgList: [],
      eqMessage: {
        equipMajor: [],
        departs: [],
        equipTypes: [],
      },
      fieldNames: {
        children: 'children',
        label: 'name',
        key: 'id',
        value: 'id',
      },
    }
  },
  methods: {
    //获取设备属性和类型
    async getEquipInitMessage() {
      // this.eqMessage = await getEquipInitMessageApi()
      await this.getOrg()
      await this.getAttributeList()
      await this.getEqType()
    },
    async getAttributeList() {
      const { result } = await getAttributeListApi()
      this.eqMessage.equipMajor = result
    },
    async getOrg() {
      const { result } = await getOrgApi()
      // const l = [result]
      // this.orgList = [result]
      this.eqMessage.departs = [result]
    },
    async getEqType() {
      const { result } = await getEquipmentTypeWithoutPageApi()
      this.eqMessage.equipTypes = result
    },
    filter(inputValue, path) {
      return path.some(
          option => option.name.toLowerCase().
              indexOf(inputValue.toLowerCase()) > -1,
      )
    },
  },
  created() {},
}
