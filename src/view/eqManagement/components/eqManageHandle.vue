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
               @getType="getType"
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
   getModeBitApi,
   updateEquipmentExampleApi,
} from '@/api/eqManage'
import basicInfo from './basicInfo.vue'
import bitConfig from './bitConfig.vue'
import onlineShow from './onlineShow.vue'
import { deepClone, isObjectEqual } from '@/utils'
import { storageStore } from '@/store/local'
export default {
   name: 'eqManageHandle',
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
         currentEqType: [],
         bitConfigForm: {},
         basicInfoForm: {},
      }
   },
   methods: {
      back() {
         this.$router.go(-1)
      },
      async next() {
         if (this.current === 0) {
            this.$refs.basicInfo.$refs.form.validate(async valid => {
               if (valid) {
                  this.current++
                  if (this.title === '新增' && storageStore.get('isTypeChange')) {
                     let list = await this.getBitByType()
                     this.bitConfigForm = {
                        position_number: list,
                     }
                  }
               }
            })
         } else {
            this.current++
            console.log(this.current)
         }

         if (this.current === 2) {
            let bitList = this.$refs.bitConfig.bitList.position_number
            this.$refs.onlineShow.getBitList(bitList)
         }
      },
      prev() {
         this.current--
         storageStore.set('isTypeChange', false)
      },

      async submit() {
         let basicInfo = this.$refs.basicInfo.form
         let onlineShow = this.$refs.onlineShow.list
         let option = {
            ...basicInfo,
            position_number: [...onlineShow],
         }
         if (this.title === '新增') {
            await addEquipmentExampleApi(option)
            this.$message.success('新增成功')
         } else {
            await updateEquipmentExampleApi(option)
            this.$message.success('修改成功')
         }
         this.$router.go(-1)
      },
      getType(param) {
         this.currentEqType = param
      },
      //根据设备类型获取模位号
      async getBitByType() {
         let otherOption = {
            comprehensive_show: 0,
            online_show: 0,
            base_name: '',
            position_number: '',
            upper: 0,
            lower: 0,
         }
         let { result } = await getModeBitApi({
            equipment_type: this.$refs.basicInfo.form.equipment_type,
         })

         result.forEach((element, index) => {
            element.id = index
            for (const key in otherOption) {
               element[key] = otherOption[key]
            }
         })
         return result
      },
      async getDetail() {
         this.title = this.$route.query.title
         if (this.title === '修改') {
            let id = this.$route.query.id
            let { result } = await getEquipmentDetailApi(id)
            let {
               equipment_attribute,
               equipment_id,
               equipment_name,
               equipment_status,
               equipment_tree,
               equipment_type,
               position_number,
               message_id,
               isopen,
            } = deepClone(result)
            console.log(result)
            this.bitConfigForm = {
               position_number,
            }
            this.basicInfoForm = {
               equipment_attribute,
               equipment_id,
               message_id,
               equipment_name,
               isopen,
               equipment_status,
               equipment_tree,
               equipment_type,
            }
         } else {
            this.basicInfoForm = {
               isopen: 1,
               equipment_attribute: undefined,
               equipment_name: undefined,
               equipment_status: '',
               equipment_id: '',
               equipment_tree: undefined,
               equipment_type: undefined,
            }
         }
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
