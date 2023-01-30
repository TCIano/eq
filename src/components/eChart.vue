<template>
   <div ref="chart" :style="style"></div>
</template>

<script>
import Vue from 'vue'
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts
export default {
   name: 'AnalysisEchars',
   props: {
      option: {
         type: Object,
         default: () => {},
      },
      width: {
         type: String,
         default: '100%',
      },
      height: {
         type: String,
         default: '100%',
      },
      theme: {
         type: String,
         default: '',
      },
   },
   data() {
      return {
         isDisplay: false,
         chart: null,
      }
   },
   methods: {
      getEchartData() {
         let chart = this.$refs.chart
         if (chart) {
            let myChart = echarts.init(chart, this.theme)
            //添加true属性，可以重写渲染

            myChart.setOption(this.option, true)

            window.onresize = function () {
               myChart.resize()
            }
         }
      },
      refresh() {
         this.destory()
         this.getEchartData()
      },
      destory() {
         this.chart.dispose()
         // this.chart.clear()
         this.chart = null
         // console.log(this.chart);
      },
   },
   computed: {
      style() {
         return {
            width: this.width,
            height: this.height,
            margin: '0 auto',
         }
      },
   },

   beforeDestroy() {
      this.destory()
   },
   mounted() {
      this.getEchartData()
   },
   created() {
      // 监听 options 改动，改动后重绘数据
      this.$watch(
         'option',
         () => {
            this.refresh()
         },
         { deep: true }
      )
   },
}
</script>

<style scoped lang="less">
.content {
}
</style>
