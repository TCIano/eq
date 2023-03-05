import { getEquipInitMessageApi } from '@/api'
export const eqTypeMixin = {
   data() {
      return {
         eqMessage: {},
         fieldNames: {
            children: 'childNode',
            label: 'name',
            key: 'code',
            value: 'name',
         },
      }
   },
   methods: {
      //获取设备属性和类型
      async getEquipInitMessage() {
         this.eqMessage = await getEquipInitMessageApi()
         console.log(this.eqMessage)
      },
      filter(inputValue, path) {
         return path.some(
            option => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
         )
      },
   },
   created() {},
}
