<template>
   <div>
      <a-modal :title="title" :visible="visible" @cancel="cancel" v-show="showVisible">
         <a-form-model :model="attrForm" :rules="rules" ref="attrForm">
            <a-form-model-item
               label="设备属性"
               prop="equipment_attribute"
               :labelCol="{ span: 5 }"
               :wrapperCol="{ span: 19 }"
            >
               <a-select
                  v-model="attrForm.equipment_attribute"
                  placeholder="请选择设备属性"
                  :disabled="disabled"
               >
                  <a-select-option
                     :value="item.name"
                     v-for="item in eqMessage.equipMajor"
                     :key="item.code"
                  >
                     {{ item.name }}
                  </a-select-option>
               </a-select>
            </a-form-model-item>
            <a-form-model-item
               label="设备类型"
               prop="equipment_type"
               :labelCol="{ span: 5 }"
               :wrapperCol="{ span: 19 }"
            >
               <!-- <a-tree-select
                  v-model="attrForm.equipment_type"
                  :tree-data="eqMessage.equipTypes"
                  :replaceFields="replaceFields"
                  @change="getBitName"
                  placeholder="请选择设备类型"
               ></a-tree-select> -->
               <a-cascader
                  v-model="attrForm.equipment_type"
                  :options="eqMessage.equipTypes"
                  placeholder="请选择设备类型"
                  :show-search="{ filter }"
                  :fieldNames="fieldNames"
                  :disabled="disabled"
               />
            </a-form-model-item>
            <a-form-model-item
               label="设备类型图片"
               :labelCol="{ span: 5 }"
               :wrapperCol="{ span: 19 }"
            >
               <a-select v-model="attrForm.equipment_picture" placeholder="请选择设备类型图片">
                  <a-select-option :value="item" v-for="item in imgList" :key="item">
                     {{ item }}
                  </a-select-option>
               </a-select>
            </a-form-model-item>
            <div class="pictureShow" v-if="attrForm.equipment_picture">
               <img
                  @click="previewVisible = true"
                  :src="
                     require('../../../assets/equipment/' +
                        this.attrForm.equipment_picture.replace('./', ''))
                  "
                  alt="avatar"
                  style="width: 150px; height: 150px; border: 1px dashed #ccc"
               />
               <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
                  <img
                     alt="example"
                     style="width: 100%"
                     :src="
                        require('../../../assets/equipment/' +
                           this.attrForm.equipment_picture.replace('./', ''))
                     "
                  />
               </a-modal>
            </div>
            <a-form-model-item label="基础信息">
               <div class="scroll-container">
                  <a-row
                     :gutter="[10, 2]"
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
                           @focus="dropDown"
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
               </div>
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
         @cancel="typeVisibleCancel"
      >
         <a-tabs type="card" default-active-key="wave_spectrum" v-model="dataAttr">
            <a-tab-pane :key="item.key" :tab="item.tab" v-for="item in bit">
               <bit-table :bitData="bitData" :tab="item.key" @getbitDataValue="getbitDataValue" />
            </a-tab-pane>
         </a-tabs>
      </a-modal>
   </div>
</template>

<script>
import { getBaseNameApi } from '@/api'
import { eqTypeMixin } from '@/mixins/eqTypeMixins'
import BitTable from './bitTable.vue'
export default {
   mixins: [eqTypeMixin],
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
         showVisible: true,
         disabled: this.title === '修改' ? true : false,
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
         imgList: [],
         treeData: [], //树形设备类型
         bitList: [], //位号列表
         //校验规则
         rules: {
            equipment_attribute: [{ required: true, message: '请选择设备属性', trigger: 'blur' }],
            equipment_type: [{ required: true, message: '请选择设备类型', trigger: 'blur' }],
         },

         dataAttr: 'wave_spectrum', //当前所选栏
         previewVisible: false,
      }
   },
   methods: {
      setModal1Visible(modal1Visible) {
         this.$emit('update:visible', modal1Visible)
      },

      //添加属性行
      addAttr() {
         this.attrForm.position_number.push({
            base_id: '-' + this.attrForm.position_number.length + 1,
            base_name: undefined,
            unit: '',
            wave_spectrum: 0,
            time_domain: 0,
            frequency_domain: 0,
         })
      },
      //删除属性
      deleteAttr(id) {
         let delItem = this.attrForm.position_number.find(item => item.base_id === id)
         this.attrForm.position_number = [...this.attrForm.position_number].filter(
            item => item.base_id !== id
         )
         //改变选择状态
         console.log(delItem)
         this.bitList.forEach((item, index) => {
            if (item.base_name === delItem.base_name) {
               this.bitList[index].disabled = false
            }
         })
      },
      nextStep() {
         this.$refs.attrForm.validate(valid => {
            if (valid) {
               this.attrForm.position_number = this.attrForm.position_number.filter(
                  item => item.base_name
               )
               this.bitData = this.attrForm.position_number
               this.showVisible = false
               this.typeVisible = true
            }
         })
      },
      cancel() {
         this.$refs.attrForm.resetFields()
         this.$refs.attrForm.clearValidate()
         this.setModal1Visible(false)
      },
      typeVisibleCancel() {
         this.setModal1Visible(false)
         this.typeVisible = false
      },
      // 属性模态框
      setTypeVisible() {
         //新增设备类型
         this.$emit('handleEqType', this.attrForm, this.title)
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
      async getBitName() {
         const { result } = await getBaseNameApi()
         this.bitList = result.map(item => {
            return {
               ...item,
               disabled: this.attrForm.position_number.some(
                  bit => bit.base_name === item.base_name
               ),
            }
         })
      },
      dropDown() {
         if (!this.attrForm.equipment_attribute || !this.attrForm.equipment_type.length)
            return this.$message.warning('请选择设备属性和类型')
      },
      //得到
      getDisableBit(index, value) {
         console.log(index, value)
         const listIndex = this.bitList.findIndex(item => item.base_name === value)
         //同步单位
         this.attrForm.position_number[index].unit = this.bitList[listIndex].unit
         this.bitList[listIndex].disabled = true
      },
   },

   created() {
      this.title === '修改' && this.getBitName()
      this.getEquipInitMessage()
      this.getBitName()
   },
   mounted() {
      this.imgList = require
         .context('@/assets/equipment', true, /\.(png|jpg|gif|jpeg|webp|ico)$/)
         .keys()
         .map(item => item.replace('./', ''))
   },
}
</script>

<style scoped lang="less">
.pictureShow {
   text-align: center;
   img {
      cursor: pointer;
   }
   img:hover {
      z-index: 99;
      background-color: #3d3634;
   }
}

.scroll-container {
   overflow-y: scroll;
   overflow-x: hidden;
   scroll-behavior: smooth;
   display: block;
   height: 205px;
}
</style>
