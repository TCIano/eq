<template>
   <div>
      <a-row :gutter="gutter">
         <a-col :span="18">
            <a-card style="height: 5.5rem">
               <e-chart theme="" height="5rem" :option="lineOption" />
            </a-card>
         </a-col>
         <a-col :span="6">
            <a-card style="height: 5.5rem">
               <e-chart theme="" height="5rem" :option="relativeOption" />
            </a-card>
         </a-col>
      </a-row>
      <a-row :gutter="gutter">
         <a-col :span="18">
            <a-row :gutter="gutter">
               <div class="device-scroll-page" style="height: 5.2rem">
                  <a-col :span="6" v-for="(item, index) in positionOption" :key="index">
                     <a-card style="height: 2.45rem" hoverable>
                        <a-statistic
                           :title="item.position_name"
                           :value="item.value"
                           style="height: 0.5rem"
                        />
                        <e-chart theme="" height="2.3rem" :option="item.option" />
                     </a-card>
                  </a-col>
               </div>
            </a-row>
         </a-col>
         <a-col :span="6">
            <div class="device-scroll-page" style="height: 5rem">
               <a-card style="height: 100%">
                  <a-row :gutter="[0, 20]" v-for="item in warningDatail" :key="item.key">
                     <a-col :span="12">
                        <h4>{{ item.key }}</h4>
                     </a-col>
                     <a-col :span="12">
                        <span>{{ item.value }}</span>
                     </a-col>
                  </a-row>
               </a-card>
            </div>
         </a-col>
      </a-row>
   </div>
</template>

<script>
import eChart from '@/components/eChart.vue'
import { getWarningDetailApi } from '@/api/eqWaring'

export default {
   components: { eChart },
   data() {
      return {
         gutter: [20, 10],
         lineOption: {},
         relativeOption: {
            title: {
               show: true,
               text: '???????????????',
            },
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
         positionOption: [],
         warningDatail: [],
         timer: null,
      }
   },
   methods: {
      async getWarningDetail() {
         const { result } = await getWarningDetailApi(this.$route.query.fault_id)
         if (result) {
            this.handleLine(result)
            this.handleRelationPoint(result.fault_diagnosis)
            this.handleRelationLink(result.fault_diagnosis)
            this.handlePositionList(result.position_list)
            //????????????
            this.warningDatail = result.warning_detail
            //?????????????????????
            let count = 0
            this.timer = setInterval(() => {
               if (count % 2 == 0) {
                  this.relativeOption.series[0].links.forEach(item => {
                     if (item.highlight)
                        return (item.lineStyle = {
                           color: 'blue',
                        })
                  })
               } else {
                  this.relativeOption.series[0].links.forEach(item => {
                     if (item.highlight)
                        return (item.lineStyle = {
                           color: 'orangered',
                        })
                  })
               }
               count += 1
            }, 1000)
         }
      },
      handleLine(result) {
         this.lineOption = {
            tooltip: {
               trigger: 'axis',
               formatter: param => {
                  let tip = ''
                  if (param != null && param.length > 0) {
                     tip +=
                        param[0].data[0] +
                        '<br/>' +
                        '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:red;"></span>' +
                        '?????? : ' +
                        result.fault_predict.threshold +
                        '<br/>'
                     for (var i = 0; i < param.length; i++) {
                        tip += param[i].marker + '????????? : ' + param[i].data[1] + '<br/>'
                     }
                  }
                  return tip
               },
            },
            grid: {
               top: '10%',
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
                  data: result.fault_predict.data.map(item => {
                     return [item.time, item.predict_number]
                  }),
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
                           name: '??????',
                           yAxis: result.fault_predict.threshold,
                        },
                     ],
                  },
               },
            ],
         }
      },
      handleRelationPoint(data) {
         let pointList = []
         data.forEach(element => {
            pointList.push(element.position_number1, element.position_number2)
         })
         //??????????????????????????????????????????????????????????????????????????????????????????
         let grapData = [...new Set(pointList)].map(item => {
            return {
               name: item,
               value: item,
            }
         })
         this.relativeOption.series[0].data = grapData
      },
      handleRelationLink(data) {
         let links = data.map(item => {
            return {
               source: item.position_number1,
               target: item.position_number2,
               highlight: item.highlight,
               lineStyle: {
                  opacity: item.value,
               },
            }
         })
         this.relativeOption.series[0].links = links
      },
      handlePositionList(data) {
         this.positionOption = data.map(item => {
            return {
               ...item,
               option: {
                  grid: {
                     // bottom: '15%',
                     left: '1%',
                     right: '1%',
                  },
                  tooltip: {
                     trigger: 'axis',
                     position: function (pos, params, dom, rect, size) {
                        // ?????????????????? tooltip ???????????????????????????????????? tooltip ??????????????????
                        var obj = { top: 10 }
                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5
                        return obj
                     },
                  },
                  xAxis: {
                     // show: false,
                     axisLabel: {
                        show: false,
                     },
                     type: 'time',
                  },
                  yAxis: {
                     show: false,
                     type: 'value',
                  },
                  series: [
                     {
                        type: 'line',
                        data: item.data.map(element => {
                           return [element.time, element.value]
                        }),
                        areaStyle: {
                           color: '#985fe2',
                        },
                        showSymbol: false,
                        smooth: true,
                     },
                  ],
               },
            }
         })
      },
   },
   beforeDestroy() {
      clearInterval(this.time)
   },
   created() {
      this.getWarningDetail()
   },
}
</script>

<style scoped></style>
