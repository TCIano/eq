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
               <a-input placeholder="请输入关键字查询" v-model="searchForm.keyName"></a-input>
               <a-button icon="search" type="primary">搜索</a-button>
               <a-button icon="sync" @click="reset">重置</a-button>
            </a-space>
         </a-row>
      </a-row>
      <a-row>
         <a-table
            style="margin-top: 10px"
            :columns="columns"
            :data-source="eqData"
            row-key="id"
            bordered
         >
            <template slot="equipment_type" slot-scope="text">
               <span>{{ text[2] }}</span>
            </template>
            <template slot="position_number" slot-scope="text">
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
import { addEqTypeApi, editEqTypeApi, getEqTypeListApi } from '@/api'
import eqModal from './components/eqModal.vue'
let src = ''
export default {
   components: { eqModal },
   data() {
      return {
         base64QRCode: `data:image/png;base64,${src}`,
         attrForm: {},
         searchForm: {
            keyName: '',
         },
         modalVisible: false,
         title: '',
         columns: [
            {
               key: 'equipment_attribute',
               align: 'center',
               title: '设备属性',
               dataIndex: 'equipment_attribute',
            },
            {
               key: 'equipment_type',
               align: 'center',
               title: '设备类型',
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
               dataIndex: 'analysis',
               scopedSlots: { customRender: 'analysis' },
            },
         ],
         eqData: [],
      }
   },
   methods: {
      async getEqTypeList() {
         const result = await getEqTypeListApi()
         this.eqData = result
      },
      reset() {
         this.searchForm.keyName = ''
         this.getEqTypeList()
      },
      //新增设备类型
      addEqType() {
         this.modalVisible = true
         this.title = '新增'
         this.attrForm = {
            equipment_attribute: undefined,
            equipment_type: undefined,
            position_number: [
               {
                  base_id: 0,
                  base_name: undefined,
                  unit: '',
                  wave_spectrum: 0,
                  time_domain: 0,
                  frequency_domain: 0,
               },
            ],
         }
      },
      async handleEqType(param, title) {
         title === '新增' ? await addEqTypeApi(param) : await editEqTypeApi(param)
      },
      editEqType(record) {
         this.handleId = record.id
         this.modalVisible = true
         this.title = '修改'
         let param = deepClone(record) //深拷贝一下，防止污染原数据
         param.position_number = param.position_number.slice(0, 5)
         this.attrForm = param
      },
      //编辑数据分析类型
      editAna() {},
      deleteAna(id) {
         console.log(id)
         this.handleId = id
      },
   },
   created() {
      this.getEqTypeList()
   },
   mounted() {},
}
</script>

<style scoped></style>
