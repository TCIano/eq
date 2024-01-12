<template>
   <a-spin tip="加载中....." :spinning="spinning">
      <!-- <a-icon slot="indicator" type="loading" style="font-size: 24px" spin /> -->
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
      showLoading: {
         type: Boolean,
         default: true,
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
            this.chart = echarts.init(this.$refs.chart, this.theme)
         }
         if (this.showLoading) {
            this.spinning = true
         }
         // this.chart.showLoading()
         this.chart.on('finished', () => {
            //setoption结束后中断加载动画
            // this.spinning = false
            // this.chart.hideLoading()
         })
         // 在调用 setOption 前注册相关事件，否则在动画被禁用时，注册的事件回调可能因时序问题而不被执行。
         //添加true属性，可以重写渲染
         this.chart.resize() //初始化的时候对容器进行适应
         this.chart.setOption(this.option, true)

         window.addEventListener('resize', () => {
            this.chart.resize()
         })
         //监听渲染结束
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
            this.spinning = false
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
