<template>
   <a-card style="height: 100%">
      <div slot="title" style="display: flex; align-items: center">
         <a-icon type="pause" style="font-size: 20px" />
         <span>{{ title }}</span>
      </div>
      <a-row type="flex" justify="end">
         <span>24小时故障预测:</span>
      </a-row>
      <a-row>
         <e-chart :option="option" :theme="theme" height="350px" />
      </a-row>
      <a-row :gutter="30">
         <a-col :span="12">
            <a-row type="flex" justify="end">
               <a-select placeholder="请选择分析数据" style="width: 40%" v-model="frequency">
                  <a-select-option value="jack">Jack</a-select-option>
               </a-select>
            </a-row>
            <e-chart :option="option" :theme="theme" height="270px" />
         </a-col>
         <a-col :span="12">
            <a-row type="flex" justify="end" align="middle" :gutter="10">
               <a-col :span="6">
                  <a-input v-model="interval" placeholder="输入间隔时间"></a-input>
               </a-col>
               <a-col>
                  <span>：小时</span>
               </a-col>
               <a-col :span="6">
                  <a-select style="width: 100%" v-model="sheath" placeholder="请选择分析数据">
                     <a-select-option value="jack">Jack</a-select-option>
                  </a-select>
               </a-col>
               <a-col :span="8">
                  <a-range-picker
                     :format="dateFormat"
                     allowClear
                     v-model="time"
                     style="width: 100%"
                  >
                     <a-icon slot="suffixIcon" type="calendar" style="color: white" />
                  </a-range-picker>
               </a-col>
            </a-row>
            <e-chart :option="option" :theme="theme" height="270px" />
         </a-col>
      </a-row>
   </a-card>
</template>

<script>
import moment from 'moment'
import eChart from '@/components/eChart.vue'
export default {
   components: { eChart },
   props: {
      theme: {
         type: String,
         default: 'dark',
      },
   },
   data() {
      return {
         title: '故障预测',
         frequency: [], //频域分析下拉框
         sheath: [], //鞘度分析下拉框
         interval: '2', //间隔时间
         dateFormat: 'YYYY-MM-DD',
         currentTime: new Date(),
         //鞘度分析时间
         time: [
            moment(moment(this.currentTime).subtract(2, 'days').format(this.dateFormat)), //moment写法获取前三天
            moment(moment(this.currentTime).subtract(0, 'days').format(this.dateFormat)),
         ],
         option: {
            tooltip: {
               show: true,
            },
            grid: {
               left: '5%',
               right: '3%',
            },
            xAxis: {
               // type: 'category',
               data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            },
            yAxis: {
               type: 'value',
            },
            series: [
               {
                  data: [150, 230, 224, 218, 135, 147, 260],
                  type: 'line',
                  areaStyle: {
                     color: '#9cd9ee',
                  },
               },
            ],
         },
      }
   },
}
</script>

<style scoped lang="less"></style>
