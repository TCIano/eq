<template>
  <div>
    <a-modal v-show="showVisible" :title="title" :visible="visible" @cancel="cancel">
      <a-form-model ref="attrForm" :model="attrForm" :rules="rules">
        <a-form-model-item
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 19 }"
            label="设备属性"
            prop="equipment_attribute"
        >
          <a-select
              v-model="attrForm.equipment_attribute"
              :disabled="disabled"
              placeholder="请选择设备属性"
          >
            <a-select-option
                v-for="item in eqMessage.equipMajor"
                :key="item.id"
                :value="item.name"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 19 }"
            label="设备类型"
            prop="equipment_type"
        >
          <a-input v-model="attrForm.equipment_type" :disabled="disabled" placeholder="请输入设备类型" />
          <!-- <a-tree-select
             v-model="attrForm.equipment_type"
             :tree-data="eqMessage.equipTypes"
             :replaceFields="replaceFields"
             @change="getBitName"
             placeholder="请选择设备类型"
          ></a-tree-select> -->
          <!--          <a-cascader-->
          <!--              v-model="attrForm.equipment_type"-->
          <!--              :disabled="disabled"-->
          <!--              :fieldNames="fieldNames"-->
          <!--              :options="eqMessage.equipTypes"-->
          <!--              :show-search="{ filter }"-->
          <!--              placeholder="请选择设备类型"-->
          <!--          />-->
        </a-form-model-item>
        <a-form-model-item
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 19 }"
            label="设备类型图片"
        >
          <a-select v-model="attrForm.equipment_picture" placeholder="请选择设备类型图片">
            <a-select-option v-for="item in imgList" :key="item" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <div v-if="attrForm.equipment_picture" class="pictureShow">
          <img
              :src="
                     require('../../../assets/equipment/' +
                        this.attrForm.equipment_picture.replace('./', ''))
                  "
              alt="avatar"
              style="width: 150px; height: 150px; border: 1px dashed #ccc"
              @click="previewVisible = true"
          />
          <a-modal :footer="null" :visible="previewVisible" @cancel="previewVisible = false">
            <img
                :src="
                        require('../../../assets/equipment/' +
                           this.attrForm.equipment_picture.replace('./', ''))
                     "
                alt="example"
                style="width: 100%"
            />
          </a-modal>
        </div>
        <a-form-model-item label="基础信息" required>
          <div class="scroll-container">
            <a-row
                v-for="(item, index) in attrForm.position_number"
                :key="item.id"
                :gutter="[10]"
                style="width: 100%;height: 100%"
                type="flex"
            >
              <a-col :span="2">
                <a-icon
                    style="font-size: 25px"
                    type="delete"
                    @click="deleteAttr(item.id)"
                />
              </a-col>
              <a-col :span="13">
                <a-select
                    v-model="item.base_name"
                    placeholder="基础信息名称"
                    @change="getDisableBit(index, item.base_name)"
                    @focus="dropDown"
                >
                  <a-select-option
                      v-for="value in bitList"
                      :key="value.id"
                      :disabled="value.disabled"
                      :value="value.name"
                  >
                    {{ value.name }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :span="8">
                <a-input v-model="item.unit" @change="(e)=>onUnitChange(e,item)"></a-input>
              </a-col>
              <a-col v-if="!item.save && title==='修改'" :span="1">
                <a-icon :style="{fontSize: '20px',color:item.save?'':'#438EFC'}" class="checkIcon" title="保存"
                        type="check-circle"
                        @click="onSaveBit(item)"></a-icon>
              </a-col>
            </a-row>
          </div>
        </a-form-model-item>
        
        <a-form-model-item style="text-align: center">
          <a-button style="width: 100%" type="dashed" @click="addAttr">
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
        @cancel="typeVisibleCancel"
        @ok="setTypeVisible"
    >
      <a-tabs v-model="dataAttr" default-active-key="wave_spectrum" type="card">
        <a-tab-pane v-for="item in bit" :key="item.key" :tab="item.tab">
          <bit-table :bitData="bitData" :tab="item.key" @getbitDataValue="getbitDataValue" />
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>

<script>
import { addEquipmentBaseApi, deleteEquipmentBaseApi, getBaseNameApi } from '@/api'
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
        // {
        //    key: 'time_domain',
        //    tab: '时域分析',
        // },
        // {
        //    key: 'frequency_domain',
        //    tab: '频域分析',
        // },
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
    // 单位改变
    onUnitChange(e, item) {
      // item.save = false
    },
    // 确认保存位号
    async onSaveBit(item) {
      // 先确定当前位号是为有名称和单位
      if (!item.base_name || !item.unit) {
        return this.$message.warn('请先选择位号名称和单位')
      }
      await addEquipmentBaseApi(
          {
            type_fid: this.attrForm.id,
            base_name: item.base_name,
            unit: item.unit,
          },
      )
      // 修改选中的颜色
      this.attrForm.position_number = this.attrForm.position_number.map(
          bit => {
            if (bit.id === item.id) {
              return {
                ...bit,
                save: true,
              }
            }
            return bit
          },
      )
      this.$message.success('保存成功')
      this.$emit('reGetEqTypeList', this.attrForm.id)
      console.log(this.attrForm)
    },
    setModal1Visible(modal1Visible) {
      this.$emit('update:visible', modal1Visible)
    },
    
    //添加属性行
    addAttr() {
      this.attrForm.position_number.push({
        id: '-' + this.attrForm.position_number.length + 1,
        base_name: undefined,
        unit: '',
        wave_spectrum: 0,
        time_domain: 0,
        frequency_domain: 0,
      })
    },
    //删除属性
    async deleteAttr(id) {
      let delItem = this.attrForm.position_number.find(item => item.id === id)
      // 判断是否为新添加的位号
      if (!id.startsWith('-')) {
        await deleteEquipmentBaseApi(id)
      }
      this.attrForm.position_number = [...this.attrForm.position_number].filter(
          item => item.id !== id,
      )
      //改变选择状态
      this.bitList.forEach((item, index) => {
        if (item.name === delItem.base_name) {
          this.bitList[index].disabled = false
        }
      })
      // 重新获取设备列表
      this.$emit('reGetEqTypeList')
    },
    nextStep() {
      this.$refs.attrForm.validate(valid => {
        if (valid) {
          if (this.attrForm.position_number.some(item => !item.save) && this.title === '修改') {
            return this.$message.warning('请先保存新增的基础信息')
          }
          this.attrForm.position_number = this.attrForm.position_number.filter(
              item => item.base_name,
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
        if (id == item.id) return (item[this.dataAttr] = checkedValue)
      })
    },
    
    //获取位号内容
    async getBitName() {
      const { result } = await getBaseNameApi()
      this.bitList = result.map(item => {
        return {
          ...item,
          disabled: this.attrForm.position_number.some(
              bit => bit.base_name === item.name,
          ),
        }
      })
    },
    dropDown() {
      if (!this.attrForm.equipment_attribute || !this.attrForm.equipment_type.length)
        return this.$message.warning('请选择设备属性和类型')
    },
    getDisableBit(index, value) {
      const listIndex = this.bitList.findIndex(item => item.name === value)
      //同步单位
      this.attrForm.position_number[index].unit = this.bitList[listIndex].unit
      this.attrForm.position_number[index].save = false
      this.bitList[listIndex].disabled = true
      // 更新disabled，更新在同一个下拉框中切换，导致每选择一个位号，被切换走的那个位号被设置未disabled = true
      // 在选择完成之后，根据当前已选位号，和位号下拉框列表重新比较，多余的位号设置为未disabled = false
      this.bitList.forEach(item => {
        if (!this.attrForm.position_number.find(n => n.base_name === item.name)) {
          item.disabled = false
        }
      })
    },
  },
  
  created() {
    this.title === '修改' && this.getBitName()
    this.getEquipInitMessage()
    this.getBitName()
  },
  mounted() {
    this.imgList = require.context('@/assets/equipment', true, /\.(png|jpg|gif|jpeg|webp|ico)$/).
        keys().
        map(item => item.replace('./', ''))
  },
}
</script>

<style lang="less" scoped>
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
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  display: block;
  max-height: 205px;
  
  .checkIcon {
    cursor: pointer;
    
    &:hover {
      color: #1890ff;
    }
  }
}
</style>
