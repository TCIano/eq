<template>
   <a-card>
      <div slot="title" style="display: flex; align-items: center">
         <a-icon type="pause" style="font-size: 20px" />
         <span>{{ title }}</span>
      </div>
      <div>
         <a-row>
            <e-chart :option="option" :theme="theme" height="300px" />
         </a-row>
         <a-row :gutter="10" type="flex" align="middle">
            <!-- 标准情况 -->
            <a-col :span="7">
               <e-chart :option="relateOption" :theme="theme" height="300px" />
            </a-col>
            <!-- 当前情况 -->
            <a-col :span="7">
               <e-chart :option="relateOption" :theme="theme" height="300px" />
            </a-col>
            <a-col :span="2">
               <div style="text-align: center">
                  <a-icon type="swap" style="font-size: 100px" />
               </div>
            </a-col>
            <a-col :span="8">
               <e-chart :option="relateOption" :theme="theme" height="300px" />
            </a-col>
         </a-row>
         <!-- 警告提示 -->
         <a-row>
            <a-alert
               message="请注意！通过高斯图方法训练对比发现:预测推断离心泵可能发生故障发生参考点:2021/11/25 18:40:00    故障位号:温度Reactor.Inlet.TotalFlow"
               banner
            />
         </a-row>
      </div>
   </a-card>
</template>

<script>
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
         title: '故障诊断',
         option: {
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
               },
            ],
         },
         //关系图
         relateOption: {
            tooltip: {},
            series: [
               {
                  type: 'graph',
                  layout: 'circular',
                  symbolSize: 10,
                  label: {
                     show: true,
                     position: 'top',
                     distance: 5,
                  },
                  edgeSymbolSize: [4, 10],

                  data: [
                     {
                        name: 'Node 1',
                        value: 10,
                     },
                     {
                        name: 'Node 2',
                     },
                     {
                        name: 'Node 3',
                     },
                     {
                        name: 'Node 4',
                     },
                     {
                        name: 'Node 5',
                     },
                     {
                        name: 'Node 6',
                     },
                     {
                        name: 'Node 7',
                     },
                     {
                        name: 'Node 8',
                     },
                  ],
                  links: [
                     {
                        source: 0,
                        target: 1,

                        lineStyle: {
                           color: 'rgb(253, 150, 10)',
                        },
                     },
                     {
                        source: 'Node 2',
                        target: 'Node 1',
                        lineStyle: {
                           opacity: 0.35,
                        },
                     },
                     {
                        source: 'Node 1',
                        target: 'Node 3',
                     },
                     {
                        source: 'Node 2',
                        target: 'Node 3',
                        lineStyle: {
                           opacity: 0.35,
                        },
                     },
                     {
                        source: 'Node 2',
                        target: 'Node 4',
                     },
                     {
                        source: 'Node 1',
                        target: 'Node 4',
                     },
                     {
                        source: 'Node 6',
                        target: 'Node 7',
                        lineStyle: {
                           opacity: 0.15,
                        },
                     },
                  ],
                  itemStyle: {
                     color: 'red',
                  },
                  lineStyle: {
                     color: 'orangered',
                     opacity: 1,
                     width: 2,
                  },
               },
            ],
         },
      }
   },
}
</script>

<style scoped></style>
