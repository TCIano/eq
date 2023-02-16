<template>
   <div>
      <a-row>
         <a-col :span="6" v-for="item in eqInfo" :key="item.equipment_id">
            <a-card
               class="eq-list"
               style="width: 300px; margin-bottom: 15px"
               :headStyle="{ border: 'none' }"
               @click="getEqDetail(item.equipment_id)"
            >
               <div
                  slot="title"
                  style="display: flex; justify-content: center; align-items: center"
               >
                  <div
                     :id="
                        item.equipment_status === '0'
                           ? 'error'
                           : item.equipment_status === '1'
                           ? 'success'
                           : 'waring'
                     "
                  ></div>
                  <span class="eq-title">{{ item.equipment_name }}</span>
               </div>
               <img
                  slot="cover"
                  alt="example"
                  :src="item.equipment_picture"
                  style="width: 150px; height: 150px; margin: 0 auto"
               />
               <a-card-meta>
                  <template slot="description">
                     <a-row
                        :gutter="20"
                        type="flex"
                        align="middle"
                        justify="center"
                        class="row"
                        v-for="bit in item.equipment_message"
                        :key="bit.name"
                     >
                        <a-col>
                           <span>{{ bit.name }}</span>
                        </a-col>
                        <a-col>
                           <span>{{ bit.value }}{{ bit.unit }}</span>
                        </a-col>
                     </a-row>
                  </template>
               </a-card-meta>
            </a-card>
         </a-col>
      </a-row>
      <!-- 分页 -->
      <a-pagination :default-current="1" :total="500" class="item-pagination" />
   </div>
</template>

<script>
import { getEquipmentMonitorApi } from '@/api/eqMonitor'

export default {
   name: 'eqInfo',
   data() {
      return {
         eqInfo: [],
         map: [
            { status: '0', id: 'error' },
            {
               status: '1',
               id: 'success',
            },
            { status: '2', id: 'waring' },
         ],
      }
   },
   methods: {
      async getEquipmentMonitor() {
         const {
            result: { equipment, warning_message },
         } = await getEquipmentMonitorApi()
         this.eqInfo = equipment
      },
      getEqDetail(equipment_id) {
         this.$router.push({
            path: '/equipmentMonitoringData',
            query: {
               equipment_id,
            },
         })
      },
   },

   created() {
      this.getEquipmentMonitor()
   },
}
</script>

<style scoped lang="less">
.eq-list {
   cursor: pointer;
   .eq-title {
      font-size: 25px;
      margin-left: 10px;
      font-weight: 700;
   }
   .row {
      background: url('@/assets/img/attribute.svg') no-repeat center;
      background-size: contain;
      padding-bottom: 5px;
      span {
         font-size: 16px;
      }
      .ant-col {
         margin: 7px;
      }
   }
   span {
      font-weight: 700;
      font-size: 20px;
   }
}
</style>
