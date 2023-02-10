import cloneDeep from 'lodash.clonedeep'
/**
 *
 * @param {Object} data 被拷贝对象
 * @returns
 */
export const deepClone = data => {
   return cloneDeep(data)
}
/**
 * 二维数组转为链表
 * @param {二维数组} arr
 * @returns
 */
function arr2List(arr, isSelectAll) {
   const list = []
   let key = arr[0]
   const head = {
      title: arr[0],
      key: arr[0],
      children: [],
      selectable: isSelectAll ? true : false,
   }
   let prev = head
   list.push(prev)
   for (let i = 1; i < arr.length; i++) {
      key += ',' + arr[i]
      let current
      if (isSelectAll) {
         current = {
            title: arr[i],
            key: key,
            scopedSlots: { title: 'title' },
            selectable: true,
            children: [],
         }
      } else {
         current = {
            title: arr[i],
            key: key,
            scopedSlots: { title: 'title' },
            selectable: i === arr.length - 1 ? true : false,
            children: [],
         }
      }
      prev.children.push(current)
      prev = current
   }
   return list
}

function mergeList(tree, list) {
   if (!tree) {
      return
   }
   const hasCommonParent = tree.some(treeItem => {
      // 有共同的父节点
      if (treeItem.title === list[0].title) {
         mergeList(treeItem.children, list[0].children)
         return true
      }
      return false
   })

   if (!tree.length || !hasCommonParent) {
      tree.push(list[0])
   }
}
/**
 * 二位数组转树
 * @param {二维数组} arr
 * @returns
 */
export const arr2Tree = (arr, isSelectAll = true) => {
   const tree = []
   arr.forEach(item => {
      const list = arr2List(item, isSelectAll)
      mergeList(tree, list)
   })
   return tree
}
