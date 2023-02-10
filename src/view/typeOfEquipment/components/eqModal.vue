<template>
   <div>
      <a-modal :title="title" :visible="visible" @cancel="cancel">
         <a-form-model :model="attrForm" :rules="rules" ref="attrForm">
            <a-form-model-item
               label="设备属性"
               prop="equipment_attribute"
               :labelCol="{ span: 4 }"
               :wrapperCol="{ span: 20 }"
            >
               <a-select v-model="attrForm.equipment_attribute" placeholder="请选择设备属性">
                  <a-select-option value="动设备">动设备</a-select-option>
                  <a-select-option value="静设备">静设备</a-select-option>
               </a-select>
            </a-form-model-item>
            <a-form-model-item
               label="设备类型"
               prop="equipment_type"
               :labelCol="{ span: 4 }"
               :wrapperCol="{ span: 20 }"
            >
               <a-tree-select
                  v-model="attrForm.equipment_type"
                  :tree-data="treeData"
                  :replaceFields="replaceFields"
                  @change="getBitName"
                  placeholder="请选择设备类型"
               ></a-tree-select>
            </a-form-model-item>
            <a-form-model-item label="基础信息">
               <a-row
                  :gutter="15"
                  type="flex"
                  v-for="(item, index) in attrForm.position_number"
                  :key="item.base_id"
               >
                  <a-col :span="2">
                     <a-icon
                        type="delete"
                        style="font-size: 25px"
                        @click="deleteAttr(item.base_id)"
                     />
                  </a-col>
                  <a-col :span="14">
                     <a-select
                        v-model="item.base_name"
                        @change="getDisableBit(index, item.base_name)"
                        placeholder="基础信息名称"
                     >
                        <a-select-option
                           v-for="value in bitList"
                           :value="value.base_name"
                           :key="value.base_id"
                           :disabled="value.disabled"
                        >
                           {{ value.base_name }}
                        </a-select-option>
                     </a-select>
                  </a-col>
                  <a-col :span="8"><a-input v-model="item.unit"></a-input></a-col>
               </a-row>
            </a-form-model-item>
            <a-form-model-item style="text-align: center">
               <a-button type="dashed" style="width: 100%" @click="addAttr">
                  <a-icon type="plus" />
                  添加
               </a-button>
            </a-form-model-item>
         </a-form-model>
         <template slot="footer">
            <a-button key="back" @click="cancel">取消</a-button>
            <a-button key="submit" type="primary" @click="nextStep">下一步</a-button>
         </template>
      </a-modal>
      <!-- 下一步的对话框内容 -->
      <a-modal
         :title="attrForm.equipment_type ? attrForm.equipment_type + '数据属性' : ''"
         :visible="typeVisible"
         @ok="setTypeVisible"
         @cancel="typeVisible = false"
      >
         <a-tabs type="card" default-active-key="wave_spectrum" v-model="dataAttr">
            <a-tab-pane :key="item.key" :tab="item.tab" v-for="item in bit">
               <bit-table :bitData="bitData" @getbitDataValue="getbitDataValue" />
            </a-tab-pane>
         </a-tabs>
      </a-modal>
   </div>
</template>

<script>
import BitTable from './bitTable.vue'
export default {
   props: {
      title: {
         type: String,
      },
      visible: {
         type: Boolean,
      },
      attrForm: {
         type: Object,
         default: () => {},
      },
   },
   components: {
      BitTable,
   },
   data() {
      return {
         bit: [
            {
               key: 'wave_spectrum',
               tab: '波谱参数分析',
            },
            {
               key: 'time_domain',
               tab: '时域分析',
            },
            {
               key: 'frequency_domain',
               tab: '频域分析',
            },
         ],
         treeData: [],
         replaceFields: {
            children: 'children',
            title: 'name',
            key: 'name',
            value: 'id',
         },
         typeVisible: false,
         bitData: [],
         formLayout: {
            labelCol: {
               span: 4,
            },
            wrapperCol: {
               span: 19,
            },
         },
         treeData: [], //树形设备类型
         bitList: [], //位号列表
         //校验规则
         rules: {
            equipment_attribute: [{ required: true, message: '请选择设备属性', trigger: 'blur' }],
            equipment_type: [{ required: true, message: '请选择设备类型', trigger: 'blur' }],
         },

         dataAttr: 'wave_spectrum', //当前所选栏
      }
   },
   methods: {
      setModal1Visible(modal1Visible) {
         this.$emit('update:visible', modal1Visible)
      },
      //添加属性行
      addAttr() {
         this.attrForm.position_number.push({
            base_id: this.attrForm.position_number.length
               ? this.attrForm.position_number[this.attrForm.position_number.length - 1].base_id + 1
               : 0,
            base_name: undefined,
            unit: '',
            wave_spectrum: 0,
            time_domain: 0,
            frequency_domain: 0,
         })
      },
      //删除属性
      deleteAttr(id) {
         this.attrForm.position_number = [...this.attrForm.position_number].filter(
            item => item.base_id !== id
         )
      },
      nextStep() {
         console.log(this.attrForm)
         this.bitData = this.attrForm.position_number
         this.setModal1Visible(false)
         this.typeVisible = true
      },
      cancel() {
         this.setModal1Visible(false)
         this.$refs.attrForm.resetFields()
      },
      // 属性模态框
      setTypeVisible() {
         //新增设备类型
         this.$emit('handleEqType', this.attrForm, this.title)
         this.typeVisible = false
      },
      //获取位号是否选择
      getbitDataValue(id, checked) {
         let checkedValue = checked ? 1 : 0
         this.bitData.map(item => {
            if (id == item.base_id) return (item[this.dataAttr] = checkedValue)
         })
         console.log(this.bitData)
      },
      //获取位号内容
      getBitName() {
         if (this.attrForm.equipment_attribute && this.attrForm.equipment_type) {
            this.bitList = [
               { base_id: 1, base_name: '轴转速', unit: 'RPM' },
               { base_id: 2, base_name: '轴温度', unit: '℃' },
               { base_id: 3, base_name: '轴振动', unit: 'mm/s' },
               { base_id: 4, base_name: '轴电流', unit: 'A' },
               { base_id: 5, base_name: '润滑油流量高报', unit: '' },
               { base_id: 8, base_name: '设备启停状态', unit: '' },
               { base_id: 9, base_name: '进料管压力', unit: 'MPa' },
               { base_id: 10, base_name: '进料流量', unit: 'm3/h' },
            ]
            this.bitList.forEach(item => {
               if (this.attrForm.position_number.some(bit => bit.base_name === item.base_name))
                  item.disabled = true
            })
         }
      },
      //得到
      getDisableBit(index, value) {
         //同步单位
         this.attrForm.position_number[index].unit = this.bitList[index].unit
      },
   },
   watch: {
      attrForm: {
         handler(newValue) {
            console.log(newValue)
            this.attrForm = newValue
            this.getBitName()
         },
         deep: true,
      },
   },

   created() {
      // this.treeData = {'炉类':[{'管式加热炉':['厢式加热炉','圆筒式加热炉']},{'焚烧炉':[]}],'塔类':['板式塔','填料塔']}}
      this.treeData = [{}]
      // this.getBitName()
   },
}
</script>

<style scoped></style>
