<template>
   <a-card style="width: 100%">
      <div slot="title" style="display: flex; align-items: center">
         <a-icon type="pause" style="font-size: 20px" />
         <span>{{ title }}</span>
      </div>
      <div style="width: 100%">
         <a-row>
            <e-chart :option="option" :theme="theme" height="4.3rem" />
         </a-row>
         <a-row :gutter="10" type="flex" align="middle">
            <!-- 标准情况 -->
            <a-col :span="7">
               <e-chart :option="standardRelateOption" :theme="theme" height="4rem" width="100%" />
            </a-col>
            <!-- 当前情况 -->
            <a-col :span="7">
               <e-chart
                  ref="currentRelate"
                  :option="currentRelateOption"
                  :theme="theme"
                  height="4rem"
               />
            </a-col>
            <a-col :span="2">
               <div style="text-align: center">
                  <a-icon type="swap" class="swap" />
               </div>
            </a-col>
            <a-col :span="8">
               <e-chart :option="bitRelateOption" :theme="theme" height="4rem" width="100%" />
            </a-col>
         </a-row>
         <!-- 警告提示 -->
         <a-row>
            <a-alert :message="description" banner />
         </a-row>
      </div>
   </a-card>
</template>

<script>
import eChart from '@/components/eChart.vue'
import { getFaultDiagnosisApi } from '@/api/eqDiagnosis'
import { chartsMixin } from '@/mixins/chartsMixins'
const generateRandomInteger = (min = 1, max = 10) => {
   return Math.random() * (max - min + 1) + min
}
export default {
   components: { eChart },
   mixins: [chartsMixin],
   props: {
      theme: {
         type: String,
         default: 'dark',
      },
      equipment_id: {
         type: String,
      },
   },
   data() {
      return {
         title: '故障诊断',
         equipment_name: '',
         description: '',
         ralationMap: ['standard_graph', 'current_graph'],

         option: {},
         //关系图
         standardRelateOption: {
            tooltip: {},
            title: {
               show: true,
               text: '标准图',
            },
            grid: {
               top: '15%',
               bottom: '15%',
               left: '6%',
               right: '3%',
            },

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

                  data: [],
                  links: [],
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
         currentRelateOption: {
            tooltip: {},
            title: {
               show: true,
               text: '当前图',
            },
            grid: {
               top: '1%',
               bottom: '1%',
               left: '1%',
               right: '1%',
            },
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

                  data: [],
                  links: [],
                  itemStyle: {
                     color: 'red',
                  },
                  lineStyle: {
                     color: 'orangered',
                     width: 3,
                  },
               },
            ],
         },
         bitRelateOption: {
            tooltip: {
               formatter: params => {
                  return params.name
               },
            },
            grid: {
               bottom: '1%',
               top: '1%',
               right: '5%',
               left: '1%',
            },
            xAxis: {
               axisTick: {
                  show: false,
               },
               axisLabel: {
                  show: false,
               },
            },
            yAxis: {
               axisTick: {
                  show: false,
               },
               axisLabel: {
                  show: false,
               },
            },
            series: [
               {
                  data: [],
                  type: 'scatter',
               },
            ],
         },
         time: {},
      }
   },
   methods: {
      async getFaultDiagnosis() {
         const res = await getFaultDiagnosisApi(this.equipment_id)
         if (res.result) {
            this.handleOption(res.result)
         }
      },
      handleOption(result) {
         //故障信息
         this.description = result.description
         this.equipment_name = result.equipment_name
         let faultPosition = result.fault_position.name
         //位号图
         this.bitRelateOption.series[0].data = result.position_list.map(item => {
            return {
               name: item,
               label: {
                  show: item === faultPosition ? true : false,
                  formatter: params => {
                     return params.name
                  },
               },
               value: [generateRandomInteger(), generateRandomInteger()],
               symbolSize: item === faultPosition ? 70 : 50,
               itemStyle: {
                  color: item === faultPosition ? '#a32f2d' : '#313269',
               },
            }
         })
         //预测数据
         let threshold = result.fault_predict.threshold
         let predict_result = result.fault_predict.data.map(item => {
            return [item.time, item.predict_number]
         })
         //折线图
         this.option = {
            tooltip: {
               trigger: 'axis',
               formatter: param => {
                  let tip = ''
                  if (param != null && param.length > 0) {
                     tip +=
                        param[0].data[0] +
                        '<br/>' +
                        '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:red;"></span>' +
                        '阈值 : ' +
                        threshold +
                        '<br/>'
                     for (var i = 0; i < param.length; i++) {
                        tip += param[i].marker + '当前值 : ' + param[i].data[1] + '<br/>'
                     }
                  }
                  return tip
               },
            },
            grid: {
               top: '15%',
               bottom: '15%',
               left: '5%',
               right: '3%',
            },
            xAxis: {
               type: 'time',
            },
            yAxis: {
               type: 'value',
            },
            dataZoom: this.dataZoom,
            series: [
               {
                  data: predict_result,
                  type: 'line',
                  areaStyle: {
                     color: '#9cd9ee',
                  },
                  markLine: {
                     symbol: 'none',
                     lineStyle: {
                        color: 'red',
                        width: 3,
                     },
                     data: [
                        {
                           name: '阈值',
                           yAxis: threshold,
                        },
                     ],
                  },
               },
            ],
         }
         //关系图列表
         this.handleRelationPoint(result.fault_diagnosis)
         //关系link
         this.handleRelationLink(result.fault_diagnosis)
         //实现故障点闪烁
         let count = 0
         this.time = setInterval(() => {
            if (count % 2 == 0) {
               this.currentRelateOption.series[0].links.forEach(item => {
                  if (item.highlight)
                     return (item.lineStyle = {
                        color: 'blue',
                     })
               })
            } else {
               this.currentRelateOption.series[0].links.forEach(item => {
                  if (item.highlight)
                     return (item.lineStyle = {
                        color: 'orangered',
                     })
               })
            }
            count += 1
         }, 1000)
      },
      handleRelationPoint(data) {
         for (let index = 0; index < this.ralationMap.length; index++) {
            let pointList = []
            data[this.ralationMap[index]].forEach(element => {
               pointList.push(element.position_number1, element.position_number2)
            })
            //把关系列表中的两个关系节点集合并且去重，形成新的关系节点列表
            let grapData = [...new Set(pointList)].map(item => {
               return {
                  name: item,
               }
            })
            index === 0
               ? (this.standardRelateOption.series[0].data = grapData)
               : (this.currentRelateOption.series[0].data = grapData)
         }
      },
      handleRelationLink(data) {
         for (let index = 0; index < this.ralationMap.length; index++) {
            let links = data[this.ralationMap[index]].map(item => {
               return {
                  source: item.position_number1,
                  target: item.position_number2,
                  highlight: item.highlight,
                  lineStyle: {
                     opacity: item.value,
                  },
               }
            })
            index === 0
               ? (this.standardRelateOption.series[0].links = links)
               : (this.currentRelateOption.series[0].links = links)
         }
      },
   },
   created() {},
   beforeDestroy() {
      clearInterval(this.time)
   },
}
</script>

<style scoped lang="less">
.swap {
   font-size: 1.5rem;
}
</style>
