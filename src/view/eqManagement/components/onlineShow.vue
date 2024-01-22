<template>
   <div>
      <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
         <a-form-model-item label="监控数据">
            <a-select mode="multiple" v-model="selectBit" @change="onSelect">
               <a-select-option
                  v-for="item in monitor"
                  :disabled="selectBit.length >= 2 && selectBit.findIndex(o => o === item) === -1"
                  :key="item"
               >
                  {{ item }}
               </a-select-option>
            </a-select>
         </a-form-model-item>
      </a-form-model>
      <a-row
         type="flex"
         align="middle"
         :gutter="[8, 35]"
         v-for="(item, index) in list"
         :key="index"
      >
         <a-col :span="2" :offset="1">{{ item.position_name }} :</a-col>
         <a-col :span="9">
            <a-input v-model="item.position_number" :disabled="true"></a-input>
         </a-col>
         <a-col :span="1">在线展示</a-col>
         <a-col :span="2">
            <a-switch
               :checked="item.online_show ? true : false"
               @change="setSwitch(index, $event)"
               checked-children="展示"
               un-checked-children="隐藏"
            ></a-switch>
         </a-col>
      </a-row>
      <a-row type="flex" align="middle" :gutter="[8, 35]">
         <a-col :span="2" :offset="1">{{ `通知用户工号` }} :</a-col>
         <a-col>
            <template v-for="(tag, index) in tags">
               <a-tag :key="tag" closable @close="() => handleClose(tag)" style="margin-left: 0px">
                  {{ tag }}
               </a-tag>
            </template>
            <a-input
               v-if="inputVisible"
               ref="input"
               type="text"
               size="small"
               :style="{ width: '100px' }"
               :value="inputValue"
               @change="handleInputChange"
               @blur="handleInputConfirm"
               @keyup.enter.stop="$event.target.blur()"
            />
            <a-tag v-else style="background: #fff; borderstyle: dashed" @click="showInput">
               <a-icon type="plus" />
               新增
            </a-tag>
         </a-col>
      </a-row>
   </div>
</template>

<script>
export default {
   name: 'onlineShow',
   data() {
      return {
         labelCol: {
            span: 3,
         },
         wrapperCol: { span: 8 },
         // onlineForm: {},
         selectBit: [],
         list: [true],
         monitor: [],
         tags: [],
         inputVisible: false,
         inputValue: '',
      }
   },
   methods: {
      getBitList(param) {
         this.list = param.filter(item => item.position_name)
         this.selectBit = this.list
            .filter(item => item.comprehensive_show)
            .map(obj => obj.position_name)
         this.monitor = this.list.map(item => {
            return item.position_name
         })
      },
      onSelect(selectList) {
         this.list.forEach(item => {
            let right = selectList.some(bit => bit === item.position_name)
            item.comprehensive_show = right ? 1 : 0
         })
      },
      setSwitch(index, e) {
         this.list[index].online_show = e ? 1 : 0
         //重新更新配置里边的数据
      },
      handleClose(removedTag) {
         const tags = this.tags.filter(tag => tag !== removedTag)
         this.tags = tags
      },
      showInput() {
         this.inputVisible = true
         this.$nextTick(function () {
            this.$refs.input.focus()
         })
      },
      handleInputChange(e) {
         this.inputValue = e.target.value
      },

      handleInputConfirm(e) {
         e.stopPropagation()
         const inputValue = this.inputValue
         let tags = this.tags
         console.log(inputValue.length, inputValue)
         if (inputValue.length !== 8) {
            return this.$message.error('请输入8位数字')
         } else {
            if (inputValue && tags.indexOf(inputValue) === -1) {
               tags = [...tags, inputValue]
            }
            Object.assign(this, {
               tags,
               inputVisible: false,
               inputValue: '',
            })
         }
      },
   },

   created() {},
}
</script>

<style scoped></style>
