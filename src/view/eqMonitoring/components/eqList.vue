<template>
   <div>
      <a-row :gutter="[10, 10]">
         <a-col :span="6" v-for="item in eqInfo" :key="item.equipment_id">
            <a-card
               class="eq-list"
               :headStyle="{ border: 'none' }"
               @click="getEqDetail(item.equipment_id, item.equipment_name, item.equipment_picture)"
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
                  :src="require('../../../assets/equipment/' + item.equipment_picture)"
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
   </div>
</template>

<script>
export default {
   name: 'eqInfo',
   props: {
      eqInfo: {
         type: Array,
      },
   },
   data() {
      return {
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
      getEqDetail(equipment_id, equipment_name, equipment_picture) {
         this.$router.push({
            path: '/equipmentMonitoringData',
            query: {
               equipment_id,
               equipment_name,
               equipment_picture,
            },
         })
      },
   },

   created() {},
}
</script>

<style scoped lang="less">
.eq-list {
   cursor: pointer;

   ::v-deep .ant-card {
      box-shadow: 1px 1px 1px 1px;
   }
   .eq-title {
      font-size: 25px;
      margin-left: 10px;
      font-weight: 700;
   }
   .row {
      background: url('@/assets/img/attribute.svg') no-repeat center;
      background-size: 100% 100%;
      padding-bottom: 10px;
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
