<template>
   <div>
      <a-row :gutter="[10, 10]" type="flex">
         <a-col
            :span="8"
            :md="8"
            :sm="8"
            :lg="8"
            :xl="8"
            :xxl="6"
            v-for="item in eqInfo"
            :key="item.equipment_id"
         >
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
                        item.equipment_status === '故障'
                           ? 'error'
                           : item.equipment_status === '正常'
                           ? 'success'
                           : 'waring'
                     "
                  ></div>
                  <span
                     :title="item.equipment_name + item.equipment_id"
                     class="truncate ... eq-title"
                  >
                     {{ item.equipment_name + item.equipment_id }}
                  </span>
               </div>
               <img
                  slot="cover"
                  alt="example"
                  :class="item.equipment_status === '1' ? 'img' : ''"
                  :src="require('../../../assets/equipment/' + item.equipment_picture)"
                  style="width: 200px; height: 150px; margin: 0 auto"
               />
               <a-card-meta>
                  <template slot="description">
                     <a-row
                        :gutter="[10]"
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
   mounted() {
      console.log(this.eqInfo)
   },
}
</script>

<style scoped lang="less">
.eq-list {
   cursor: pointer;
   height: 360px;
   // overflow-y: scroll;
   scroll-behavior: smooth;

   &::-webkit-scrollbar {
      width: 1px;
   }

   ::v-deep .ant-card {
      box-shadow: 1px 1px 1px 1px;
   }
   .img {
      transform: rotateY(20deg);
      animation: img-anim 5s ease-in-out infinite;
   }
   //图片动画
   @keyframes img-anim {
      0% {
         transform: rotate(-5deg);
      }
      50% {
         transform: rotate(5deg);
      }
      100% {
         transform: rotate(-5deg);
      }
   }
   .eq-title {
      font-size: 0.32rem;
      margin-left: 0.125rem;
      font-weight: 700;
   }

   .row {
      background: url('@/assets/img/attribute.svg') no-repeat center;
      background-size: 100% 100%;
      padding-bottom: 0.125rem;

      span {
         font-size: 18px;
      }

      .ant-col {
         margin: 0.0875rem;
      }
   }

   span {
      font-weight: 700;
      font-size: 0.25rem;
   }
}
</style>
