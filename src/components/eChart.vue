<template>
   <a-spin tip="渲染中....." :spinning="spinning">
      <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
      <div ref="chart" class="echart" :style="style"></div>
   </a-spin>
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
         chart: null,
         spinning: false,
      }
   },
   methods: {
      getEchartData() {
         this.chart = echarts.init(this.$refs.chart, this.theme)
         //添加true属性，可以重写渲染
         this.spinning = true
         this.option && this.chart.setOption(this.option, true)
         window.onresize = () => {
            console.log('resize')
            this.chart.resize()
         }
         //监听渲染结束
         this.chart.on('finished', () => {
            this.spinning = false
         })
      },
      refresh() {
         this.destory()
         this.getEchartData()
      },
      destory() {
         this.chart && this.$echarts.dispose(this.chart)
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
.echart {
   margin-bottom: 5px !important;
   background: transparent;
}
</style>
