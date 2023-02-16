<template>
   <a-card style="height: 100%">
      <div slot="title" style="display: flex; align-items: center">
         <a-icon type="pause" style="font-size: 20px" />
         <span>{{ title }}</span>
      </div>
      <a-row type="flex" justify="end">
         <span class="text-lg">
            24小时故障预测:
            <span class="text-red-600 font-bold">{{ isnormal }}</span>
         </span>
      </a-row>
      <a-row>
         <e-chart :option="predictOption" :theme="theme" height="350px" />
      </a-row>
      <a-row :gutter="20">
         <a-col :span="12">
            <a-row type="flex">
               <a-select
                  placeholder="请选择分析数据"
                  style="width: 40%"
                  v-model="frequency"
                  @change="onChangeFre"
               >
                  <a-select-option v-for="item in positionNumber" :key="item" :value="item">
                     {{ item }}
                  </a-select-option>
               </a-select>
            </a-row>
            <e-chart :option="frequencyOption" :theme="theme" height="270px" />
         </a-col>
         <a-col :span="12">
            <a-row type="flex" justify="end" align="middle" :gutter="10">
               <a-col :span="2">
                  <a-input v-model.number="interval" placeholder="输入间隔时间"></a-input>
               </a-col>
               <a-col>
                  <span>：小时</span>
               </a-col>
               <a-col :span="6">
                  <a-select style="width: 100%" v-model="kurtosis" placeholder="请选择分析数据">
                     <a-select-option v-for="item in positionNumber" :key="item" :value="item">
                        {{ item }}
                     </a-select-option>
                  </a-select>
               </a-col>
               <a-col :span="12">
                  <a-range-picker
                     :format="dateFormat"
                     allowClear
                     v-model="time"
                     show-time
                     style="width: 100%"
                  >
                     <a-icon slot="suffixIcon" type="calendar" style="color: white" />
                  </a-range-picker>
               </a-col>
               <a-col>
                  <a-button icon="undo" @click="reGetKurtosis"></a-button>
               </a-col>
            </a-row>
            <e-chart :option="kurtosisOption" :theme="theme" height="270px" />
         </a-col>
      </a-row>
   </a-card>
</template>

<script>
import {
   getFaultPredictApi,
   getFrequencyDomainAnalysisApi,
   getKurtosisAnalysisApi,
} from '@/api/eqPredict'
import moment from 'moment'
import eChart from '@/components/eChart.vue'
export default {
   components: { eChart },
   props: {
      positionNumber: {
         type: Array,
         default: () => [],
      },
      equipment_id: {
         type: String,
      },
      theme: {
         type: String,
         default: 'dark',
      },
   },
   data() {
      return {
         title: '故障预测',
         frequency: [], //频域分析下拉框
         kurtosis: [], //鞘度分析下拉框
         interval: '2', //间隔时间
         dateFormat: 'YYYY-MM-DD HH:mm',
         currentTime: new Date(),
         isnormal: '',
         //鞘度分析时间
         time: [
            moment(moment(this.currentTime).subtract(2, 'days').format(this.dateFormat)), //moment写法获取前三天
            moment(moment(this.currentTime).subtract(0, 'days').format(this.dateFormat)),
         ],
         predictOption: {}, //预测
         frequencyOption: {
            legend: {
               data: ['正常', '实时'],
            },
            tooltip: {
               show: true,
               trigger: 'axis',
            },
            grid: {
               left: '5%',
               right: '3%',
            },
            xAxis: {},
            yAxis: {
               type: 'value',
            },
            series: [
               {
                  name: '正常',
                  data: [],
                  type: 'line',
               },
               {
                  name: '实时',
                  data: [],
                  type: 'line',
               },
            ],
         }, //频域
         kurtosisOption: {
            tooltip: {
               show: true,
               trigger: 'axis',
            },
            grid: {
               left: '5%',
               right: '3%',
            },
            xAxis: {
               type: 'time',
            },
            yAxis: {
               type: 'value',
            },
            series: [
               {
                  name: '峭度',
                  data: [],
                  type: 'line',
               },
            ],
         }, //鞘度
      }
   },
   methods: {
      async getFaultPredict() {
         const { result } = await getFaultPredictApi({
            equipment_id: this.equipment_id,
         })
         if (result) {
            this.handleOption(result)
         }
      },
      handleOption(result) {
         this.isnormal = result.isnormal
         this.frequency = result.frequency_analysis.position_nunber
         this.kurtosis = result.kurtosis_analysis.position_nunber
         let predictData = result.predict_result.data.map(item => {
            return [item.time, item.predict_number]
         })
         let frequencyNormalData = result.frequency_analysis.normal_frequency.map(item => {
            return [item.freq, item.amp]
         })
         let frequencyCurrentData = result.frequency_analysis.current_frequency.map(item => {
            return [item.freq, item.amp]
         })
         this.frequencyOption.series[0].data = frequencyNormalData
         this.frequencyOption.series[1].data = frequencyCurrentData
         let kurtosisData = result.kurtosis_analysis.result.map(item => {
            return [item.time, item.value]
         })
         this.kurtosisOption.series[0].data = kurtosisData
         this.predictOption = {
            tooltip: {
               show: true,
               trigger: 'axis',
            },
            grid: {
               left: '5%',
               right: '3%',
            },
            xAxis: {
               type: 'time',
            },
            yAxis: {
               type: 'value',
            },
            series: [
               {
                  data: predictData,
                  type: 'line',
                  areaStyle: {
                     color: '#9cd9ee',
                  },
               },
            ],
         }
      },
      //频域分析内容
      async onChangeFre(position_number) {
         const { result } = await getFrequencyDomainAnalysisApi({
            equipment_id: this.equipment_id,
            position_number,
         })
         if (result) {
            this.frequencyOption.series[0].data = result.normal_frequency.map(item => {
               return [item.freq, item.amp]
            })
            this.frequencyOption.series[1].data = result.current_frequency.map(item => {
               return [item.freq, item.amp]
            })
         }
      },
      //h获取峭度
      async reGetKurtosis() {
         const {
            result: { result },
         } = await getKurtosisAnalysisApi({
            equipment_id: this.equipment_id,
            position_number: this.kurtosis,
            start_time: moment(this.time[0]).format(this.dateFormat) + ':00',
            end_time: moment(this.time[1]).format(this.dateFormat) + ':00',
            span: this.interval / 1,
         })
         if (result) {
            this.kurtosisOption.series[0].data = result.map(item => {
               return [item.time, item.value]
            })
         }
      },
   },
   created() {
      this.getFaultPredict()
   },
}
</script>

<style scoped lang="less"></style>
