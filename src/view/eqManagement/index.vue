<template>
   <a-row :gutter="10">
      <a-col :span="5">
         <a-card class="device-scroll-page">
            <a-input-search
               style="margin-bottom: 8px"
               placeholder="请输入组织机构名称"
               @change="onChange"
            />
            <a-tree
               :expanded-keys="expandedKeys"
               :auto-expand-parent="autoExpandParent"
               :tree-data="gData"
               @expand="onExpand"
               @select="selectOri"
            >
               <template slot="title" slot-scope="{ title }">
                  <span v-if="title.indexOf(searchValue) > -1">
                     {{ title.substr(0, title.indexOf(searchValue)) }}
                     <span style="color: red">{{ searchValue }}</span>
                     {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
                  </span>
                  <span v-else>{{ title }}</span>
               </template>
            </a-tree>
         </a-card>
      </a-col>
      <a-col :span="19">
         <a-card class="device-scroll-page">
            <a-row :gutter="[15]">
               <a-col :span="6">
                  <a-card hoverable style="width: 300px" @click="addEq">
                     <template slot="actions" class="ant-card-actions">
                        <a-icon key="add" type="plus-circle" />
                     </template>
                     <a-card-meta title="新增基础设备" description="点击按钮添加"></a-card-meta>
                  </a-card>
               </a-col>
               <a-col :span="6" v-for="item in eqList" :key="item.equipment_id">
                  <a-card hoverable style="width: 300px; margin-bottom: 15px">
                     <template slot="actions" class="ant-card-actions">
                        <a href="#" @click.prevent="edit(item.equipment_id)">
                           <a-icon key="edit" type="edit" />
                           编辑
                        </a>
                        <a href="#">
                           <a-icon key="training" type="redo" />
                           训练
                        </a>
                     </template>
                     <a-icon
                        type="close-circle"
                        style="float: right; font-size: 16px"
                        @click="deleteEq(item.equipment_id)"
                     />
                     <a-card-meta :title="item.equipment_name">
                        <a-avatar slot="avatar" src="" />
                        <template slot="description">
                           <a-icon
                              type="poweroff"
                              :style="{ color: item.isopen ? '#3c94d9' : 'red' }"
                              @click="handleMonitoring(item)"
                           ></a-icon>
                           {{ item.isopen ? '开启' : '关闭' }}监控
                        </template>
                     </a-card-meta>
                  </a-card>
               </a-col>
            </a-row>

            <!-- 分页 -->
            <a-pagination
               :default-current="1"
               :total="20"
               :defaultPageSize="10"
               class="item-pagination"
            />
         </a-card>
      </a-col>
      <!-- <eq-manage-modal :title="title" :visible.sync="visible" /> -->
   </a-row>
</template>

<script>
import { arr2Tree } from '@/utils'
import eqManageModal from './components/eqManageModal.vue'
import {
   deleteEquipmentExampleApi,
   getEquipmentDetailApi,
   getEquipmentListApi,
   getOriginationApi,
   updateAlgorithmStatusApi,
} from '@/api/eqManage'
import { getEqTypeListApi } from '@/api'
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
export default {
   components: { eqManageModal },
   name: 'demo1',
   data() {
      return {
         title: '',
         // replaceFields: { children: 'children', title: 'name', key: 'key' },
         expandedKeys: [],
         searchValue: '',
         autoExpandParent: true,
         listOrignation: [],
         gData: [],
         eqList: [],
         visible: false,
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
         const result = await getOriginationApi()
         this.gData = arr2Tree(result)
         generateList(this.gData)
      },
      //获取设备列表
      async getEquipmentList() {
         const result = await getEquipmentListApi()
         this.eqList = result
      },
      selectOri(value, e) {
         console.log(value, e)
      },
      //新增设备
      addEq() {
         // this.visible = true
         // this.title = '新增'
         this.$router.push({
            path: '/equipmentManagementHandle',
            query: {
               // origination: arr2Tree(this.listOrignation),
               title: '新增',
            },
         })
      },
      async edit(id) {
         // const result = await getEquipmentDetailApi(id)
         this.$router.push({
            path: '/equipmentManagementHandle',
            query: {
               id,
               title: '修改',
            },
         })
      },
      async handleMonitoring({ equipment_id, isopen }) {
         try {
            await updateAlgorithmStatusApi({
               equipment_id,
               isopen: isopen ? 0 : 1,
            })
            this.$message.success('状态修改成功')
            this.getEquipmentList()
         } catch (error) {}
      },
      async deleteEq(id) {
         await deleteEquipmentExampleApi(id)
         this.getEquipmentList()
      },
   },
   created() {
      this.getOrigination()
      this.getEquipmentList()
   },
}
</script>
<style scoped></style>
