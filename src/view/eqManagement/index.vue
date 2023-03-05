<template>
   <a-row :gutter="10">
      <a-col :span="4">
         <a-card class="device-scroll-page">
            <a-input-search
               allowClear
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
      <a-col :span="20">
         <a-card class="device-scroll-page">
            <a-row :gutter="10">
               <a-col :span="6">
                  <a-card hoverable style="" @click="addEq">
                     <template slot="actions" class="ant-card-actions">
                        <a-icon key="add" type="plus-circle" />
                     </template>
                     <a-card-meta title="新增基础设备" description="点击按钮添加"></a-card-meta>
                  </a-card>
               </a-col>
               <a-col :span="6" v-for="item in eqList" :key="item.equipment_id">
                  <a-card hoverable style="margin-bottom: 15px">
                     <template slot="actions" class="ant-card-actions">
                        <a href="#" @click.prevent="edit(item.equipment_id, item.isopen)">
                           <a-icon key="edit" type="edit" />
                           编辑
                        </a>
                        <a href="#" @click.prevent="train(item.equipment_id)">
                           <a-icon key="training" type="redo" />
                           训练
                        </a>
                     </template>
                     <a-popconfirm
                        title="确定删除？"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="deleteEq(item.equipment_id)"
                     >
                        <!-- <a href="#">Delete</a> -->
                        <a-icon type="close-circle" style="float: right; font-size: 16px" />
                     </a-popconfirm>

                     <a-card-meta :title="item.equipment_name">
                        <!-- <a-avatar slot="avatar" src="" /> -->
                        <template slot="description">
                           <div @click="handleMonitoring(item)">
                              <a-icon
                                 type="poweroff"
                                 :style="{ color: item.isopen ? 'red' : '#3c94d9' }"
                              ></a-icon>
                              {{ item.isopen ? '关闭' : '开启' }}监控
                           </div>
                        </template>
                     </a-card-meta>
                  </a-card>
               </a-col>
            </a-row>
            <!-- 分页 -->
            <a-pagination
               v-if="eqList.length > 19"
               show-quick-jumper
               :page-size="pageSize"
               :default-current="1"
               :current="currentPage"
               :defaultPageSize="19"
               :total="total"
               @change="pageChange"
               class="item-pagination"
            />
         </a-card>
      </a-col>
      <!-- <eq-manage-modal :title="title" :visible.sync="visible" /> -->
   </a-row>
</template>

<script>
import eqManageModal from './components/eqManageModal.vue'
import {
   deleteEquipmentExampleApi,
   getEquipmentDetailApi,
   getEquipmentListApi,
   updateAlgorithmStatusApi,
} from '@/api/eqManage'
import { oriMixins } from '@/mixins/oriMixins'

export default {
   mixins: [oriMixins],
   components: { eqManageModal },
   name: 'demo1',
   data() {
      return {
         title: '',
         // replaceFields: { children: 'children', title: 'name', key: 'key' },
         listOrignation: [],
         eqList: [],
         visible: false,
         currentPage: 1,
         pageSize: 19,
         total: 0,
         equipment_tree: [],
      }
   },
   methods: {
      selectOri(value, e) {
         this.equipment_tree = value[0]?.split(',')
         this.getEquipmentList()
      },
      pageChange(page) {
         this.pageSize = page === 1 ? 19 : 20
         this.currentPage = page
         this.getEquipmentList()
      },

      //获取设备列表
      async getEquipmentList() {
         const {
            result: { datas, total_amount },
         } = await getEquipmentListApi({
            amount: this.pageSize,
            page: this.currentPage,
            filtration: this.equipment_tree,
         })
         this.total = total_amount
         this.eqList = datas
      },

      //新增设备
      addEq() {
         this.$router.push({
            path: '/equipmentManagementHandle',
            query: {
               title: '新增',
            },
         })
      },
      async edit(id, isopen) {
         this.$router.push({
            path: '/equipmentManagementHandle',
            query: {
               id,
               isopen,
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
         // this.$confirm({
         //    content: '是否要删除',
         //    async onOk() {
         await deleteEquipmentExampleApi(id)
         this.getEquipmentList()
         this.$message.success('删除成功')
         //    },
         //    cancelText: '取消',
         //    onCancel() {},
         // })
      },
      // /跳转模型训练页面
      train(id) {
         this.$router.push({
            path: '/equipmentTrain',
            query: {
               id,
            },
         })
      },
   },
   created() {
      this.getOrigination()
      this.getEquipmentList()
   },
}
</script>
<style scoped></style>
