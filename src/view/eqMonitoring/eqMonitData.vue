<template>
   <div class="eq-detail">
      <div class="text-center bg-transparent text-4xl text-white font-mono">
         {{ eqName }}综合监视
      </div>
      <a-tabs default-active-key="1" v-model="currentPage" tabPosition="left">
         <a-tab-pane key="1" tab="设备参数">
            <eq-param></eq-param>
         </a-tab-pane>
         <a-tab-pane key="2" tab="时域分析"><time-domain /></a-tab-pane>
         <a-tab-pane key="3" tab="故障预测"><fault-prediction /></a-tab-pane>
         <a-tab-pane key="4" tab="故障诊断">
            <fault-diagnosis />
         </a-tab-pane>
         <!-- <a-tab-pane key="5" tab="趋势分析"></a-tab-pane> -->
      </a-tabs>
   </div>
</template>

<script>
import eqParam from './components/eqParam.vue'
import FaultDiagnosis from './components/faultDiagnosis.vue'
import FaultPrediction from './components/faultPrediction.vue'
import TimeDomain from './components/timeDomain.vue'
export default {
   data() {
      return {
         eqName: '鼓风机',
         currentPage: '1',
      }
   },
   components: {
      eqParam,
      TimeDomain,
      FaultPrediction,
      FaultDiagnosis,
   },
}
</script>

<style scoped lang="less">
@import './card.less';

.eq-detail {
   padding: 0 20px;
   padding-top: 10px;
   width: 100%;
   height: 100%;
   background: url('@/assets/img/eqdetail.png') no-repeat;
   background-size: cover;
   .ant-tabs {
      color: white;
      background: transparent;
      border: none;
   }
}
</style>
