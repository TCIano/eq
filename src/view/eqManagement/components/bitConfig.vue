<template>
   <div>
      <a-row
         type="flex"
         justify="center"
         align="middle"
         :gutter="[15, 35]"
         v-for="(item, index) in arrList"
         :key="item.id"
      >
         <a-col :span="1">{{ item.position_type }} :</a-col>
         <a-col :span="4">
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
               <a-col>上下限范围：</a-col>
               <a-col>
                  <a-input
                     type="number"
                     v-model.number="item.upper"
                     placeholder="请输入上限"
                  ></a-input>
               </a-col>
               <a-col>~</a-col>
               <a-col>
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
import { getModeBitApi } from '@/api/eqManage'

export default {
   name: 'bitConfig',
   props: {
      bitList: {
         type: Object,
         default: () => [],
      },
      title: {
         type: String,
      },
   },
   data() {
      return {
         editbitList: [],
      }
   },
   methods: {
      getModeBit() {
         //  let res = await getModeBitApi()
         let otherOption = {
            comprehensive_show: 0,
            online_show: 0,
            base_name: '',
            position_number: '',
            upper: 0,
            lower: 0,
         }
         let res = [
            { position_type: '轴转速', unit: 'um/' },
            { position_type: '轴温度', unit: 'um/p' },
            { position_type: '轴电流', unit: 'u/p' },
            { position_type: '润滑油流量高报', unit: 'um/p' },
            { position_type: '设备启停状态', unit: 'ump' },
         ]
         res.forEach((element, index) => {
            element.id = index
            for (const key in otherOption) {
               element[key] = otherOption[key]
            }
         })
         this.editbitList = res
      },
      copyBit(param, index) {
         let id = this.bitList.length
         this.arrList.splice(index + 1, 0, {
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
         this.arrList = this.arrList.filter(item => item.id !== id)
      },
   },
   computed: {
      arrList() {
         return this.title === '新增' ? this.editbitList : this.bitList.position_number
      },
   },
   created() {
      console.log(this.title)
      if (this.title === '新增') {
         this.getModeBit()
      }
   },
}
</script>

<style scoped></style>
