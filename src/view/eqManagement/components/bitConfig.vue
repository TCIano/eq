<template>
  <div>
    <a-row :gutter="[15, 35]"
           align="middle"
           justify="start"
           type="flex">
      <a-col :span="3">
        <h3>监控数据 :</h3>
      </a-col>
      <a-col :span="5">
        <a-select v-model="selectBit" mode="multiple" placeholder="请选择监控数据"
                  style="width:100%;"
                  @change="onSelect">
          <a-select-option
              v-for="item in bitList.position_number"
              :key="item.message_id"
              :disabled="selectBit.length >= 2 && selectBit.findIndex(o => o === item.message_id) === -1"
          >
            {{ item.position_name }}
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row
        v-for="(item, index) in bitList.position_number"
        :key="item.id"
        :gutter="[15, 35]"
        align="middle"
        justify="start"
        type="flex"
    >
      <a-col :span="3">
        <h3>{{ item.position_type }} :</h3>
      </a-col>
      <a-col :span="5">
        <a-input v-model.trim="item.position_name" placeholder="请输入对应名称" @change="onNameChange"></a-input>
      </a-col>
      <a-col :span="2">
        <a-input v-model.trim="item.unit" placeholder="请输入单位"></a-input>
      </a-col>
      <a-col :span="4">
        <a-input v-model.trim="item.position_number" placeholder="请输入对应位号名"></a-input>
      </a-col>
      <a-col :span="8">
        <a-row :gutter="10" align="middle" justify="center" type="flex">
          <a-col :span="6">上下限范围：</a-col>
          <a-col :span="8">
            <a-input
                v-model.number="item.lower"
                placeholder="请输入上限"
                type="number"
            ></a-input>
          </a-col>
          <a-col :span="1">~</a-col>
          <a-col :span="8">
            <a-input
                v-model.number="item.upper"
                placeholder="请输入下限"
                type="number"
            ></a-input>
          </a-col>
        </a-row>
      </a-col>
      <a-space>
        <a-icon
            style="font-size: 25px"
            theme="twoTone"
            type="copy"
            @click="copyBit(item, index)"
        />
        <a-icon
            style="font-size: 25px"
            theme="twoTone"
            type="delete"
            @click="deleteBit(item.message_id)"
        />
      </a-space>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'bitConfig',
  props: {
    bitList: {
      type: Object,
    },
    title: {
      type: String,
    },
  },
  data() {
    return {
      selectBit: [],
      list: [],
    }
  },
  methods: {
    onNameChange() {
    
    },
    getBitList() {
      this.list = this.bitList.position_number.filter(item => item.message_id)
      this.selectBit = this.list.filter(item => item.comprehensive_show).map(obj => obj.message_id)
    },
    onSelect() {
      this.bitList.position_number.forEach(item => {
        item.comprehensive_show = this.selectBit.includes(item.message_id) ? 1 : 0
      })
    },
    copyBit(param, index) {
      let message_id = -this.bitList.position_number.length
      this.bitList.position_number.splice(index + 1, 0, {
        message_id,
        position_type: param.position_type,
        unit: param.unit,
        position_name: param.position_name,
        // online_show: 0,
        // comprehensive_show: 0,
        position_number: param.position_number,
        // upper: param.upper,
        // lower: param.lower,
      })
    },
    deleteBit(id) {
      if (this.bitList.position_number.length === 1) return
      this.bitList.position_number = this.bitList.position_number.filter(
          item => item.message_id !== id,
      )
    },
  },
  
  created() {},
}
</script>

<style scoped></style>
