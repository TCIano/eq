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
const getParentKey = (key, tree) => {
   let parentKey
   for (let i = 0; i < tree.length; i++) {
      const node = tree[i]
      if (node.children) {
         if (node.children.some(item => item.key === key)) {
            parentKey = node.key
         } else if (getParentKey(key, node.children)) {
            parentKey = getParentKey(key, node.children)
         }
      }
   }
   return parentKey
}
export const oriMixins = {
   data() {
      return {
         expandedKeys: [],
         searchValue: '',
         gData: [],
         autoExpandParent: true,
      }
   },
   methods: {
      onExpand(expandedKeys) {
         this.expandedKeys = expandedKeys
         this.autoExpandParent = false
      },
      onChange(e) {
         const value = e.target.value
         const expandedKeys = dataList
            .map(item => {
               if (item.title.indexOf(value) > -1) {
                  return getParentKey(item.key, this.gData)
               }
               return null
            })
            .filter((item, i, self) => item && self.indexOf(item) === i)
         Object.assign(this, {
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
         })
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
