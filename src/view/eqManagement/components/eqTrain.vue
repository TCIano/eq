<template>
   <div>
      <a-row type="flex" justify="space-between" :gutter="[16, 16]">
         <a-col>
            <a-button type="primary" @click="modeTraining">
               {{ storageStore.get('isTrain') ? '上一条数据训练中...' : '模型训练' }}
            </a-button>
         </a-col>
         <a-col>
            <a-button type="primary" icon="rollback" @click="exit">返回</a-button>
         </a-col>
      </a-row>
      <a-row :gutter="[10, 10]">
         <a-col :span="11">
            <a-card class="device-scroll-page" style="height: 6.3rem">
               <a-row :gutter="[5, 10]">
                  <a-col>训练测点：</a-col>
                  <a-col v-for="(item, index) in trainList" :key="index">
                     <a-space size="middle">
                        <a-space :size="1">
                           <span>类型：</span>
                           <a-input disabled v-model="item.position_type"></a-input>
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
                              :checked="item.used ? true : false"
                              @change="changeIsTrain(index, $event)"
                           ></a-switch>
                        </a-space>
                     </a-space>
                  </a-col>
                  <a-col>
                     合计训练测点
                     <span class="font-bold text-red-600">{{ totalPoint }}</span>
                     ,参与模型训练测点
                     <span class="font-bold text-red-600">{{ trainPoint }}</span>
                  </a-col>
               </a-row>
            </a-card>
         </a-col>
         <a-col :span="13">
            <a-card style="height: 6.3rem">
               <a-space>
                  选择日期:
                  <a-range-picker
                     :disabledDate="disabledDate"
                     v-model="trainTime"
                     showTime
                     :format="timeFormat"
                  ></a-range-picker>
                  <a-button type="primary" icon="check-square" @click="getChartData">提交</a-button>
               </a-space>
               <e-chart :option="option" height="5.625rem" width="90%" />
            </a-card>
         </a-col>
      </a-row>
      <a-row :gutter="[10, 10]">
         <a-col>
            <a-table
               :columns="columns"
               :data-source="trainHistory"
               :scroll="{ y: 240 }"
               :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
               row-key="record_id"
               bordered
               :pagination="false"
            >
               <template slot="time" slot-scope="text">
                  <span>{{ text.start_time }} ~ {{ text.end_time }}</span>
               </template>
               <template slot="option" slot-scope="text, record">
                  <a-popconfirm
                     title="是否删除？"
                     ok-text="确定"
                     cancel-text="取消"
                     @confirm="deleteRecord(record.record_id)"
                  >
                     <a href="#">删除</a>
                  </a-popconfirm>
               </template>
               <template slot="position_name" slot-scope="text">
                  {{ text.position_name.join(' | ') }}
               </template>
               <template slot="result" slot-scope="text, record">
                  <h3 style="color: red">
                     {{ record.used ? '训练成功' : '未参与训练' }}
                  </h3>
               </template>
            </a-table>
         </a-col>
      </a-row>
      <a-modal title="提示" :visible="trainModal" :footer="null" @cancel="closeTrainProgress">
         {{ '训练进度' }}
         <a-progress :percent="progress" />
      </a-modal>
   </div>
</template>

<script>
import eChart from '@/components/eChart.vue'
import moment from 'moment'
import {
   getEquipmentDetailApi,
   getHistoryDataApi,
   getHistoryShowApi,
   getTrainProgressApi,
   trainModelApi,
   deleteHistoryDataApi,
} from '@/api/eqManage'
import { storageStore } from '@/store/local'
import { mapActions } from 'vuex'
export default {
   components: { eChart },
   name: 'eqTrain',
   data() {
      return {
         storageStore,
         timeFormat: 'YYYY-MM-DD HH:mm',
         trainTime: [moment(new Date()), moment(new Date())],
         columns: [
            {
               key: 'start_time',
               align: 'center',
               title: '数据时间段',
               scopedSlots: { customRender: 'time' },
            },
            {
               key: 'position_name',
               align: 'center',
               title: '参与训练测点',
               scopedSlots: { customRender: 'position_name' },
            },
            {
               key: 'result',
               align: 'center',
               title: '训练结果',
               width: 200,
               scopedSlots: { customRender: 'result' },
               dataIndex: 'result',
            },
            {
               key: 'option',
               align: 'center',
               title: '操作',
               width: 200,
               scopedSlots: { customRender: 'option' },
               dataIndex: 'option',
            },
         ],
         selectedRowKeys: [],
         trainHistory: [],
         option: {},
         trainList: [],
         trainModal: false,
         progress: 0,
         timer: null,
      }
   },

   methods: {
      // ...mapActions('train', ['setTimerAc', 'clearTimerAc']),
      disabledDate(current) {
         return current && current > moment().endOf('day')
      },
      exit() {
         this.$router.go(-1)
      },
      onSelectChange(selectedRowKeys) {
         this.selectedRowKeys = selectedRowKeys
      },
      //改变状态
      changeIsTrain(index, e) {
         this.trainList[index].used = e
      },
      async modeTraining() {
         if (!this.selectedRowKeys.length && !storageStore.get('isTrain'))
            return this.$message.warning('最少选择一项训练测点')
         this.trainModal = true
         //1.先进行训练进度查询
         this.getIsTrain()
         if (!storageStore.get('isTrain')) {
            //新的模型训练
            await trainModelApi({
               equipment_id: this.$route.query.id,
               record_id: this.selectedRowKeys,
            })
         }
         //每隔一秒进行一次调用

         if (!this.timer) {
            // this.setTimerAc(setInterval(() => {
            //    this.getTrainProgress()
            // }, 1000))
            this.timer = setInterval(() => {
               this.getTrainProgress()
            }, 1000)
         }
      },
      async getTrainProgress() {
         const {
            result: { istrain, progress },
         } = await getTrainProgressApi()
         storageStore.set('isTrain', istrain)
         //2.若无在训练中的模型则可进行训练，若有则展示进度
         this.progress = Number((progress * 100).toFixed(2))
         if (istrain === 0) {
            clearInterval(this.timer)
            this.closeTrainProgress(true)
            // this.clearTimerAc()
            this.timer = null
            this.$message.success('训练成功')
            //延迟两秒拿结果
            setTimeout(() => {
               this.historyShow()
            }, 2000)
         }
      },
      closeTrainProgress(state) {
         this.trainModal = false
         // this.historyShow()
         if (state) return (this.progress = 0)
      },
      async getChartData() {
         if (!this.trainList.some(item => item.used))
            return this.$message.warning('最少选择三项训练测点')

         let start = moment(this.trainTime[0]).format(this.timeFormat) + ':00'
         let end = moment(this.trainTime[1]).format(this.timeFormat) + ':00'
         const { result } = await getHistoryDataApi({
            equipment_id: this.$route.query.id,
            start_time: start,
            end_time: end,
            position_number: this.trainList
               .filter(ele => ele.used)
               .map(item => {
                  return {
                     name: item.position_type,
                     value: item.position_number,
                  }
               }),
         })
         if (result) {
            this.historyShow()
            this.option = {
               tooltip: {
                  trigger: 'axis',
               },
               legend: {
                  type: 'scroll',
               },
               grid: {
                  left: '6%',
                  right: '3%',
               },
               xAxis: {
                  type: 'time',
               },
               yAxis: {
                  scale: true,
                  type: 'value',
               },
               series: [],
            }
            this.option.series = result.datas.map(item => {
               return {
                  name: item.position_name.name,
                  data: item.values.map(valueOption => {
                     return [valueOption.time, valueOption.value]
                  }),
                  type: 'line',
               }
            })
         }
      },
      async getEquipmentDetail() {
         const { result } = await getEquipmentDetailApi(this.$route.query.id)
         if (result) {
            this.trainList = result.position_number.map(item => {
               return {
                  ...item,
                  used: 1,
               }
            })
         }
      },
      //展示训练数据
      async historyShow() {
         this.trainHistory = []
         const { result } = await getHistoryShowApi({
            equipment_id: this.$route.query.id,
         })
         if (result) {
            // console.log(result);
            this.selectedRowKeys = []
            this.trainHistory = result.reverse()
         }
      },
      async deleteRecord(record_id) {
         await deleteHistoryDataApi([record_id])
         this.$message.success('删除成功')
         this.historyShow()
      },
      async getIsTrain() {
         const {
            result: { istrain },
         } = await getTrainProgressApi()
         storageStore.set('isTrain', istrain)
      },
   },

   computed: {
      totalPoint() {
         return this.trainList.length
      },
      trainPoint() {
         return this.trainList.filter(item => item.used).length
      },
   },
   // created() {
   //    this.getEquipmentDetail()
   //    this.historyShow()
   //    this.getIsTrain()
   // },
   activated() {
      this.option = {}
      this.getEquipmentDetail()
      this.historyShow()
      this.getIsTrain()
   },
}
</script>

<style scoped></style>
