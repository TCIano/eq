<template>
   <div class="eq-detail">
      <a-tabs default-active-key="1" v-model="currentPage" tabPosition="left">
         <a-tab-pane key="1" tab="设备参数">
            <eq-param></eq-param>
         </a-tab-pane>
         <a-tab-pane key="2" tab="时域分析"><time-domain /></a-tab-pane>
         <a-tab-pane key="3" tab="故障诊断">
            <fault-diagnosis />
         </a-tab-pane>
         <a-tab-pane key="4" tab="趋势分析"></a-tab-pane>
      </a-tabs>
   </div>
</template>

<script>
import eqParam from './components/eqParam.vue'
import FaultDiagnosis from './components/faultDiagnosis.vue'
import TimeDomain from './components/timeDomain.vue'
export default {
   data() {
      return {
         currentPage: '1',
      }
   },
   components: {
      eqParam,
      TimeDomain,
      FaultDiagnosis,
   },
}
</script>

<style scoped lang="less">
@import './card.less';

.eq-detail {
   padding: 130px 20px;
   width: 100%;
   height: 100%;
   background: url('@/assets/img/eqdetail.jpg') no-repeat;
   background-size: cover;
   .ant-tabs {
      color: white;
      background: transparent;
      border: none;
   }
}
</style>
