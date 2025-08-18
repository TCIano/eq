<template>
  <div>
    
    <a-row align="middle" justify="space-between" type="flex">
      <a-row>
        <a-space>
          <a-button icon="plus" type="primary" @click="addEqType">新增</a-button>
          <!-- <a-button icon="edit" @click="editEqType">修改</a-button> -->
          <!-- <a-button type="danger" icon="delete" @click="deleteAna">删除</a-button> -->
        </a-space>
      </a-row>
      <a-row>
        <a-space>
          <a-input v-model="pagination.filtration" placeholder="请输入关键字查询"></a-input>
          <a-button icon="search" type="primary" @click="search">搜索</a-button>
          <a-button icon="sync" @click="reset">重置</a-button>
        </a-space>
      </a-row>
    </a-row>
    <a-row>
      <a-table :columns="columns" :data-source="eqData" :pagination="pagination" bordered row-key="id"
               style="margin-top: 10px" @change="onChangePage">
        <template slot="equipment_type" slot-scope="text">
          <span>{{ text }}</span>
        </template>
        <template slot="position_number" slot-scope="text, record">
          <a-space>
            <span v-for="item in text" :key="item.base_id">{{ item.base_name + ' |' }}</span>
          </a-space>
        </template>
        <template slot="analysis" slot-scope="text, record">
          <a-space>
            <a href="#" @click="editEqType(record)">编辑</a>
            <a-popconfirm cancel-text="取消" ok-text="确定" title="是否删除？" @confirm="deleteAna(record.id)">
              <a href="#" style="color: red">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-row>
    <eq-modal v-if="modalVisible" :attr-form="attrForm" :title="title" :visible.sync="modalVisible"
              @handleEqType="handleEqType" @reGetEqTypeList="reGetEqTypeList" />
    <!-- <img src="" alt=""> -->
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { addEqTypeApi, deleteEquipmentTypeApi, editEqTypeApi, getEqTypeListApi, updateEquipmentBaseApi } from '@/api'
import eqModal from './components/eqModal.vue'

let src = ''
export default {
  name: 'eqType',
  components: { eqModal },
  data() {
    return {
      base64QRCode: `data:image/png;base64,${ src }`,
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
          width: '60%',
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
      this.title = '新增'
      this.modalVisible = true
      //获取设备属性和类型
      let position_number = []
      // for (let index = 0; index < 5; index++) {
      //   position_number.push({
      //     base_id: index,
      //     base_name: undefined,
      //     unit: '',
      //     wave_spectrum: 0,
      //     time_domain: 0,
      //     frequency_domain: 0,
      //   })
      // }
      this.attrForm = {
        equipment_attribute: undefined,
        equipment_type: [],
        position_number,
      }
    },
    
    async handleEqType(param, title) {
      
      if (title === '新增') {
        param.position_number.forEach(item => {
          delete item.id
        })
        await addEqTypeApi(param)
      } else {
        //修改position_number
        await updateEquipmentBaseApi(param.position_number)
        await editEqTypeApi(param)
      }
      this.$message.success(title + '成功')
      this.modalVisible = false
      this.getEqTypeList()
    },
    editEqType(record) {
      this.title = '修改'
      this.modalVisible = true
      //深拷贝
      record.position_number = record.position_number.map(item => {
        return {
          ...item,
          save: true,
        }
      })
      this.attrForm = deepClone(record)
      // for (let index = 0; index < 5; index++) {
      // if (record.position_number[index]) {
      //   this.attrForm.position_number[index] = param.position_number[index]
      // } else {
      //   this.attrForm.position_number[index] = {
      //     base_id: index,
      //     base_name: undefined,
      //     unit: '',
      //     wave_spectrum: 0,
      //     time_domain: 0,
      //     frequency_domain: 0,
      //   }
      // }
      // }
    },
    
    async deleteAna(id) {
      await deleteEquipmentTypeApi(id)
      this.$message.success('删除成功')
      this.getEqTypeList()
    },
    reGetEqTypeList(id) {
      this.getEqTypeList()
      if (id) {
        this.eqData.position_number = this.eqData.position_number.map(item => ({ ...item, save: true }))
        this.attrForm = this.eqData.find(item => item.id === id)
      }
    },
    
  },
  created() {
    this.getEqTypeList()
  },
  mounted() { },
}
</script>

<style lang='less' scoped>
/deep/ .ant-table-pagination {
  position: fixed;
  bottom: 50px;
  right: 10px;
}
</style>
