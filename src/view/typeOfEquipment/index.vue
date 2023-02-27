<template>
   <div>
      <a-row type="flex" justify="space-between" align="middle">
         <a-row>
            <a-space>
               <a-button type="primary" icon="plus" @click="addEqType">新增</a-button>
               <!-- <a-button icon="edit" @click="editEqType">修改</a-button> -->
               <!-- <a-button type="danger" icon="delete" @click="deleteAna">删除</a-button> -->
            </a-space>
         </a-row>
         <a-row>
            <a-space>
               <a-input placeholder="请输入关键字查询" v-model="pagination.filtration"></a-input>
               <a-button icon="search" type="primary" @click="search">搜索</a-button>
               <a-button icon="sync" @click="reset">重置</a-button>
            </a-space>
         </a-row>
      </a-row>
      <a-row>
         <a-table
            style="margin-top: 10px"
            :scroll="{ y: 700 }"
            :columns="columns"
            :data-source="eqData"
            row-key="id"
            bordered
            :pagination="pagination"
            @change="onChangePage"
         >
            <template slot="equipment_type" slot-scope="text">
               <span>{{ text[text.length - 1] }}</span>
            </template>
            <template slot="position_number" slot-scope="text, record">
               <a-space>
                  <span v-for="item in text" :key="item.base_id">{{ item.base_name + ' |' }}</span>
               </a-space>
            </template>
            <template slot="analysis" slot-scope="text, record">
               <a-space>
                  <a href="#" @click="editEqType(record)">编辑</a>
                  <a-popconfirm
                     title="是否删除？"
                     ok-text="确定"
                     cancel-text="取消"
                     @confirm="deleteAna(record.id)"
                  >
                     <a href="#" style="color: red">删除</a>
                  </a-popconfirm>
               </a-space>
            </template>
         </a-table>
      </a-row>
      <eq-modal
         v-if="modalVisible"
         :title="title"
         :attr-form="attrForm"
         :visible.sync="modalVisible"
         @handleEqType="handleEqType"
      />
      <!-- <img src="" alt=""> -->
   </div>
</template>

<script>
import { deepClone } from '@/utils'
import {
   addEqTypeApi,
   deleteEquipmentTypeApi,
   editEqTypeApi,
   getEqTypeListApi,
   getEquipInitMessageApi,
} from '@/api'
import eqModal from './components/eqModal.vue'
let src = ''
export default {
   name: 'eqType',
   components: { eqModal },
   data() {
      return {
         base64QRCode: `data:image/png;base64,${src}`,
         attrForm: {},
         keyName: '',
         modalVisible: false,
         title: '',
         eqMessage: {},
         columns: [
            {
               key: 'equipment_attribute',
               align: 'center',
               title: '设备属性',
               width: '15%',

               dataIndex: 'equipment_attribute',
            },
            {
               key: 'equipment_type',
               align: 'center',
               title: '设备类型',
               width: '15%',

               dataIndex: 'equipment_type',
               scopedSlots: { customRender: 'equipment_type' },
            },
            {
               key: 'position_number',
               align: 'center',
               title: '基础数据',
               dataIndex: 'position_number',
               scopedSlots: { customRender: 'position_number' },
            },
            {
               key: 'analysis',
               align: 'center',
               title: '数据分析类型',
               width: '10%',
               dataIndex: 'analysis',
               scopedSlots: { customRender: 'analysis' },
            },
         ],
         eqData: [],
         pagination: {
            total: 0,
            current: 1,
            defaultCurrent: 1,
            pageSize: 10,
            showSizeChanger: true,
            filtration: '',
         },
      }
   },
   methods: {
      onChangePage(pagination) {
         this.pagination = { ...pagination }
         this.getEqTypeList()
      },
      async getEqTypeList(filtration) {
         let { current, pageSize } = this.pagination
         const {
            result: { datas, total_amount },
         } = await getEqTypeListApi({
            page: current,
            amount: pageSize,
            filtration: this.keyName, //根据关键字搜索之后，并且之后分页也带关键字，
         })
         this.pagination.total = total_amount
         this.eqData = datas
      },
      search() {
         this.keyName = this.pagination.filtration
         this.getEqTypeList(this.pagination.filtration)
      },
      reset() {
         this.pagination.filtration = ''
         this.keyName = ''
         this.getEqTypeList()
      },
      //新增设备类型
      addEqType() {
         this.modalVisible = true
         this.title = '新增'
         //获取设备属性和类型
         let position_number = []
         for (let index = 0; index < 5; index++) {
            position_number.push({
               base_id: index,
               base_name: undefined,
               unit: '',
               wave_spectrum: 0,
               time_domain: 0,
               frequency_domain: 0,
            })
         }
         this.attrForm = {
            equipment_attribute: undefined,
            equipment_type: [],
            position_number,
         }
      },

      async handleEqType(param, title) {
         title === '新增' ? await addEqTypeApi(param) : await editEqTypeApi(param)
         this.$message.success(title + '成功')
         this.modalVisible = false
         this.getEqTypeList()
      },
      editEqType(record) {
         console.log(record)
         this.handleId = record.id
         this.modalVisible = true
         this.title = '修改'
         let param = deepClone(record) //深拷贝一下，防止污染原数据
         param.position_number = param.position_number
         this.attrForm = param
      },
      //编辑数据分析类型
      editAna() {},
      async deleteAna(id) {
         await deleteEquipmentTypeApi(id)
         this.$message.success('删除成功')
         this.getEqTypeList()
      },
   },
   created() {
      this.getEqTypeList()
   },
   mounted() {},
}
</script>

<style scoped></style>
