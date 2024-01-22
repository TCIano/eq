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
         <a-col :span="3">
            <h3>{{ item.position_type }} :</h3>
         </a-col>
         <a-col :span="5">
            <a-input v-model.trim="item.position_name" placeholder="请输入对应名称"></a-input>
         </a-col>
         <a-col :span="2">
            <a-input v-model.trim="item.unit" placeholder="请输入单位"></a-input>
         </a-col>
         <a-col :span="4">
            <a-input v-model.trim="item.position_number" placeholder="请输入对应位号名"></a-input>
         </a-col>
         <a-col :span="8">
            <a-row type="flex" justify="center" align="middle" :gutter="10">
               <a-col :span="6">上下限范围：</a-col>
               <a-col :span="8">
                  <a-input
                     type="number"
                     v-model.number="item.lower"
                     placeholder="请输入上限"
                  ></a-input>
               </a-col>
               <a-col :span="1">~</a-col>
               <a-col :span="8">
                  <a-input
                     type="number"
                     v-model.number="item.upper"
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
      return {}
   },
   methods: {
      copyBit(param, index) {
         let message_id = -this.bitList.position_number.length
         this.bitList.position_number.splice(index + 1, 0, {
            message_id,
            position_type: param.position_type,
            unit: param.unit,
            position_name: param.position_name,
            online_show: 0,
            comprehensive_show: 0,
            position_number: param.position_number,
            upper: param.upper,
            lower: param.lower,
         })
      },
      deleteBit(id) {
         if (this.bitList.position_number.length === 1) return
         this.bitList.position_number = this.bitList.position_number.filter(
            item => item.message_id !== id
         )
      },
   },

   created() {},
}
</script>

<style scoped></style>
