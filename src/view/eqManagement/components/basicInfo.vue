<template>
  <a-form-model
      ref="form"
      :label-col="labelCol"
      :model="form"
      :rules="rules"
      :wrapper-col="wrapperCol"
  >
    <a-form-model-item label="所属组织" prop="equipment_tree">
      <a-tree-select
          v-model="form.equipment_tree"
          :disabled="disabled"
          :replaceFields="fieldNames"
          :treeData="eqMessage.departs"
          placeholder="请选择组织机构"
      />
      <!--      <a-cascader-->
      <!--          v-model="form.equipment_tree"-->
      <!--          :changeOnSelect="true"-->
      <!--          :disabled="disabled"-->
      <!--          :fieldNames="fieldNames"-->
      <!--          :options="eqMessage.departs"-->
      <!--          :show-search="{ filter }"-->
      <!--          placeholder="请选择组织机构"-->
      <!--          @focus="onList"-->
      <!--      />-->
    </a-form-model-item>
    <a-form-model-item label="设备属性" prop="equipment_attribute">
      <a-tree-select
          v-model="form.equipment_attribute"
          :disabled="disabled"
          :replaceFields="fieldNames"
          :treeData="eqMessage.equipMajor"
          placeholder="请选择设备属性"
      />
      <!--      <a-select-->
      <!--          v-model="form.equipment_attribute"-->
      <!--          :disabled="disabled"-->
      <!--          placeholder="请选择设备属性"-->
      <!--      >-->
      <!--        <a-select-option-->
      <!--            v-for="item in eqMessage.equipMajor"-->
      <!--            :key="item.id"-->
      <!--            :value="item.id"-->
      <!--        >-->
      <!--          {{ item.name }}-->
      <!--        </a-select-option>-->
      <!--      </a-select>-->
    </a-form-model-item>
    <a-form-model-item label="设备类型" prop="equipment_type">
      <!--      <a-input v-model="form.equipment_type" placeholder="请输入设备类型" />-->
      <!--            <a-cascader-->
      <!--                v-model="form.equipment_type"-->
      <!--                :disabled="disabled"-->
      <!--                :fieldNames="fieldNames"-->
      <!--                :options="eqMessage.equipTypes"-->
      <!--                :show-search="{ filter }"-->
      <!--                placeholder="请选择设备类型"-->
      <!--                @change="getBitByType"-->
      <!--            ></a-cascader>-->
      <a-select
          v-model="form.equipment_type"
          :disabled="disabled"
          placeholder="请选择设备类型"
          @change="getBitByType"
      >
        <a-select-option
            v-for="item in eqMessage.equipTypes"
            :key="item.type_id"
            :value="item.type_id"
        >
          {{ item.name }}
        </a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="设备名称" prop="equipment_name">
      <a-select
          :disabled="disabled"
          :value="form.equipment_name"
          placeholder="请选择设备名称"
          @change="nameChange"
          @focus="getEqName"
      >
        <a-select-option v-for="item in equipNameList" :key="item.id" :value="item.id">
          {{ item.name }}
        </a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="状态位号" prop="equipment_status">
      <a-input v-model="form.equipment_status" placeholder="请输入状态位号"></a-input>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { eqTypeMixin } from '@/mixins/eqTypeMixins'
import { getExampleListApi } from '@/api/eqManage'
import { storageStore } from '@/store/local'
import { isObjectEqual } from '@/utils'

export default {
  mixins: [eqTypeMixin],
  name: 'basicInfo',
  props: {
    form: {
      type: Object,
    },
    title: {
      type: String,
    },
  },
  data() {
    return {
      rules: {
        equipment_tree: [{ required: true }],
        equipment_attribute: [{ required: true }],
        equipment_type: [{ required: true }],
      },
      disabled: this.title === '修改' ? true : false,
      labelCol: {
        span: 8,
      },
      wrapperCol: { span: 8 },
      treeData: [],
      equipment_tree: '',
      equipNameList: [],
    }
  },
  methods: {
    onList() {
      console.log(this.eqMessage)
    },
    nameChange(code) {
      console.log(code)
      this.form.equipment_id = code
      this.form.equipment_name = this.equipNameList.find(item => item.id === code).name
      
      storageStore.set('basic-info-addInfo', this.form)
    },
    // selectOri(value, e) {},
    //根据设备类型获取设备位号
    getBitByType(param) {
      storageStore.set('isTypeChange', true)
      this.$emit('getType', param)
    },
    getEqName() {
      this.getNameList(this.form)
    },
    async getNameList(params) {
      //判断设备属性类型组织是否变化，变化则重新获取设备名称
      if (!isObjectEqual(storageStore.get('basic-info-addInfo'), params)) {
        
        // const { data } = await getEqNameApi({
        //   depart: params.equipment_tree[1],
        //   section: params.equipment_tree[2],
        //   equipMajorDIC: params.equipment_attribute,
        //   equipType: params.equipment_type[params.equipment_type.length - 1],
        // })
        const { result } = await getExampleListApi(this.form.equipment_tree,
            this.form.equipment_attribute)
        if (result) {
          this.equipNameList = result
        }
      }
    },
  },
  created() {
    // if (this.title === '修改') {
    //    this.getNameList()
    // }
    this.getEquipInitMessage()
  },
}
</script>

<style scoped></style>
