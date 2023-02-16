<template>
   <div>
      <a-row
         type="flex"
         justify="center"
         align="middle"
         :gutter="[15, 35]"
         v-for="(item, index) in bitList.position_number"
         :key="item.id"
      >
         <a-col :span="3">{{ item.position_type }} :</a-col>
         <a-col :span="5">
            <a-input v-model="item.base_name" placeholder="请输入对应名称"></a-input>
         </a-col>
         <a-col :span="2">
            <a-input v-model="item.unit" placeholder="请输入单位"></a-input>
         </a-col>
         <a-col :span="4">
            <a-input v-model="item.position_number" placeholder="请输入对应位号名"></a-input>
         </a-col>
         <a-col :span="8">
            <a-row type="flex" justify="center" align="middle" :gutter="10">
               <a-col :span="6">上下限范围：</a-col>
               <a-col :span="8">
                  <a-input
                     type="number"
                     v-model.number="item.upper"
                     placeholder="请输入上限"
                  ></a-input>
               </a-col>
               <a-col :span="1">~</a-col>
               <a-col :span="8">
                  <a-input
                     type="number"
                     v-model.number="item.lower"
                     placeholder="请输入下限"
                  ></a-input>
               </a-col>
            </a-row>
         </a-col>
         <a-space>
            <a-icon
               type="copy"
               theme="twoTone"
               style="font-size: 25px"
               @click="copyBit(item, index)"
            />
            <a-icon
               type="delete"
               theme="twoTone"
               style="font-size: 25px"
               @click="deleteBit(item.id)"
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
      return {}
   },
   methods: {
      copyBit(param, index) {
         let id = this.bitList.length
         this.bitList.position_number.splice(index + 1, 0, {
            id,
            position_type: param.position_type,
            unit: param.unit,
            base_name: param.base_name,
            online_show: param.online_show,
            comprehensive_show: param.comprehensive_show,
            position_number: param.position_number,
            upper: param.upper,
            lower: param.lower,
         })
      },
      deleteBit(id) {
         this.bitList.position_number = this.bitList.position_number.filter(item => item.id !== id)
      },
   },

   created() {},
}
</script>

<style scoped></style>
