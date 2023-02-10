<template>
   <div>
      <a-row type="flex" justify="end">
         <a-button type="primary" icon="rollback" @click="back">返回</a-button>
      </a-row>
      <div class="steps">
         <a-steps :current="current">
            <a-step v-for="item in steps" :key="item.title" :title="item.title" />
         </a-steps>
         <div class="steps-content">
            <basic-info
               v-show="current === 0"
               ref="basicInfo"
               :title="title"
               :form="basicInfoForm"
            />
            <bit-config
               v-show="current === 1"
               ref="bitConfig"
               :bitList="bitConfigForm"
               :title="title"
            />
            <online-show v-show="current === 2" ref="onlineShow" />
         </div>
         <div class="steps-action">
            <a-button v-if="current > 0" @click="prev" style="margin-right: 8px">上一步</a-button>
            <a-button v-if="current == steps.length - 1" type="primary" @click="submit">
               提交
            </a-button>
            <a-button v-if="current < steps.length - 1" type="primary" @click="next">
               下一步
            </a-button>
         </div>
      </div>
   </div>
</template>

<script>
import {
   addEquipmentExampleApi,
   getEquipmentDetailApi,
   updateEquipmentExampleApi,
} from '@/api/eqManage'
import basicInfo from './basicInfo.vue'
import bitConfig from './bitConfig.vue'
import onlineShow from './onlineShow.vue'
import { deepClone } from '@/utils'
export default {
   components: { basicInfo, bitConfig, onlineShow },
   data() {
      return {
         title: '',
         current: 0,
         steps: [
            {
               title: '基础信息',
            },
            {
               title: '位号配置',
            },
            {
               title: '在线展示',
            },
         ],
         bitConfigForm: {},
         basicInfoForm: {},
      }
   },
   methods: {
      back() {
         this.$router.go(-1)
      },
      next() {
         this.current++
         if (this.current === 2) {
            console.log(this.$refs.bitConfig)
            let bitList = this.$refs.bitConfig.arrList
            this.$refs.onlineShow.getBitList(bitList)
         }
      },
      prev() {
         this.current--
      },
      onChange(current) {
         console.log(current)
      },
      async submit() {
         let basicInfo = this.$refs.basicInfo.form
         // let bitConfig = this.$refs.bitConfig.bitList
         let onlineShow = this.$refs.onlineShow.list
         let option = {
            ...basicInfo,
            position_number: [...onlineShow],
         }
         if (this.title === '新增') {
            await addEquipmentExampleApi(option)
         } else {
            await updateEquipmentExampleApi(option)
         }
         console.log(option)
      },
      async getDetail() {
         let id = this.$route.query.id
         this.title = this.$route.query.title
         let result = await getEquipmentDetailApi(id)
         let detail = deepClone(result)
         console.log(result)
         this.bitConfigForm = detail
         this.basicInfoForm = detail
      },
   },
   created() {
      this.getDetail()
   },
}
</script>

<style scoped lang="less">
.steps {
   margin-top: 10px;
   .steps-content {
      margin-top: 20px;
      border: 1px dashed #e9e9e9;
      border-radius: 6px;
      background-color: #fafafa;
      //   min-height: 450px;
      text-align: center;
      padding-top: 50px;
      padding-bottom: 50px;
   }

   .steps-action {
      margin-top: 24px;
   }
}
</style>
