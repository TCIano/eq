<template>
   <a-spin tip="加载中....." :spinning="spinning">
      <!-- <div> -->
      <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
      <div ref="chart" class="echart" :style="style"></div>
      <!-- </div> -->
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
         if (!this.chart) {
            console.log('566')
            this.chart = echarts.init(this.$refs.chart, this.theme)
         }
         this.spinning = true
         //添加true属性，可以重写渲染
         this.option && this.chart.setOption(this.option, true)
         window.addEventListener('resize', () => {
            this.chart.resize()
         })
         //监听渲染结束
         this.chart.on('finished', () => {
            this.spinning = false
         })
      },
      refresh() {
         // this.destory()

         this.getEchartData()
      },
      destory() {
         window.removeEventListener('resize', () => {
            this.chart.resize()
         })
         this.chart && this.chart.clear()
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
