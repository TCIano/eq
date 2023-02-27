import { getOriginationApi } from '@/api/eqManage'
import { arr2Tree } from '@/utils'
const dataList = []
const generateList = data => {
   for (let i = 0; i < data.length; i++) {
      const node = data[i]
      const key = node.key
      const title = node.title
      dataList.push({ key, title })
      if (node.children) {
         generateList(node.children)
      }
   }
}

export const oriMixins = {
   data() {
      return {
         gData: [],
         autoExpandParent: true,
      }
   },
   methods: {
      onExpand(expandedKeys) {
         this.expandedKeys = expandedKeys
         this.autoExpandParent = false
      },
      //获取组织机构
      async getOrigination() {
         const { result } = await getOriginationApi()
         this.gData = arr2Tree(result)
         generateList(this.gData)
      },
   },
   created() {},
}
