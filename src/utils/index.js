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
 * isSelectAll 每个节点是否可选
 * cascader 是否为级联数据
 * @returns
 */
function arr2List(arr, isSelectAll, cascader) {
   const list = []
   let head = {}
   let key = arr[0]
   //解决当只能选中子节点且当前元素只有一层时，不能被选中的问题
   head =
      arr.length > 1
         ? {
              title: arr[0],
              key: arr[0],
              children: [],
              selectable: isSelectAll ? true : false,
           }
         : {
              title: arr[0],
              key: arr[0],
              children: [],
              selectable: true,
           }
   let prev = head
   list.push(prev)
   for (let i = 1; i < arr.length; i++) {
      !cascader ? (key += ',' + arr[i]) : (key = arr[i])

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
export const arr2Tree = (arr, isSelectAll = true, cascader = false) => {
   const tree = []
   arr.forEach(item => {
      const list = arr2List(item, isSelectAll, cascader)
      mergeList(tree, list)
   })
   return tree
}
