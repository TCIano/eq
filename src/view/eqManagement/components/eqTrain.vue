<template>
   <div>
      <a-row type="flex" justify="space-between" :gutter="[16, 16]">
         <a-col>
            <a-button type="primary" @click="modeTraining">模型训练</a-button>
         </a-col>
         <a-col>
            <a-button type="primary" icon="rollback" @click="exit">返回</a-button>
         </a-col>
      </a-row>
      <a-row :gutter="[10, 10]">
         <a-col :span="10">
            <a-card class="device-scroll-page" style="height: 500px">
               <a-row :gutter="[10, 10]">
                  <a-col>训练测点：</a-col>
                  <a-col v-for="(item, index) in trainList" :key="index">
                     <a-space size="middle">
                        <a-space :size="1">
                           <span>类型：</span>
                           <a-input disabled v-model="item.equipment_type"></a-input>
                        </a-space>
                        <a-space :size="1">
                           位号：
                           <a-input disabled v-model="item.position_number"></a-input>
                        </a-space>
                        <a-space :size="1">
                           参与训练：
                           <a-switch
                              checked-children="是"
                              un-checked-children="否"
                              :checked="item.isTrain ? true : false"
                              @change="changeIsTrain(index, $event)"
                           ></a-switch>
                        </a-space>
                     </a-space>
                  </a-col>
                  <a-col>
                     合计训练测点
                     <span class="text-red-600 font-bold">{{ totalPoint }}</span>
                     ,参与模型训练测点
                     <span class="text-red-600 font-bold">{{ trainPoint }}</span>
                  </a-col>
               </a-row>
            </a-card>
         </a-col>
         <a-col :span="14">
            <a-card style="height: 500px">
               <a-space>
                  选择日期:
                  <a-range-picker
                     v-model="trainTime"
                     showTime
                     :format="timeFormat"
                  ></a-range-picker>
                  <a-button type="primary" icon="check-square" @click="getChartData">提交</a-button>
               </a-space>
               <e-chart :option="option" height="450px" />
            </a-card>
         </a-col>
      </a-row>
      <a-row :gutter="[10, 16]">
         <a-col>
            <a-table :columns="columns" :data-source="trainHistory">
               <template slot="option">
                  <a href="#">删除</a>
               </template>
            </a-table>
         </a-col>
      </a-row>
      <a-modal title="提示" :visible="trainModal" :footer="null" @cancel="trainModal = false">
         <a-progress :percent="progress" />
      </a-modal>
   </div>
</template>

<script>
import eChart from '@/components/eChart.vue'
import moment from 'moment'
export default {
   components: { eChart },
   name: 'eqTrain',
   data() {
      return {
         timeFormat: 'YYYY-MM-DD HH:mm',
         trainTime: [moment(new Date()), moment(new Date())],
         columns: [
            {
               key: 'time',
               align: 'center',
               title: '数据时间段',
               dataIndex: 'time',
            },
            {
               key: 'point',
               align: 'center',
               title: '参与训练测点',
               dataIndex: 'point',
            },
            {
               key: 'result',
               align: 'center',
               title: '训练结果',
               dataIndex: 'result',
            },
            {
               key: 'option',
               align: 'center',
               title: '操作',
               scopedSlots: { customRender: 'option' },
               dataIndex: 'option',
            },
         ],
         trainHistory: [],
         option: {
            xAxis: {
               type: 'category',
               data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            },
            yAxis: {
               type: 'value',
            },
            series: [
               {
                  data: [150, 230, 224, 218, 135, 147, 260],
                  type: 'line',
               },
            ],
         },
         totalPoint: 1,
         trainPoint: 2,
         trainList: [
            {
               equipment_type: '55463',
               position_number: '2222',
               isTrain: 0,
            },
            {
               equipment_type: '5dsafa5463',
               position_number: '2dd222',
               isTrain: 1,
            },
         ],
         trainModal: false,
         progress: 30,
      }
   },

   methods: {
      exit() {
         this.$router.go(-1)
      },
      //改变状态
      changeIsTrain(index, e) {
         this.trainList[index].isTrain = e
      },
      modeTraining() {
         this.trainModal = true
      },
      getChartData() {
         console.log(this.trainTime)
         let start = moment(this.trainTime[0]).format(this.timeFormat) + ':00'
         let end = moment(this.trainTime[1]).format(this.timeFormat) + ':00'
         console.log(start, end)
      },
   },
}
</script>

<style scoped></style>
