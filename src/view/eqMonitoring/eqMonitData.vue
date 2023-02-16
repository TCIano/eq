<template>
   <div class="eq-detail">
      <div class="text-center bg-transparent text-4xl text-white font-mono">
         {{ eqName }}综合监视
      </div>
      <a-tabs default-active-key="1" v-model="currentPage" tabPosition="left">
         <a-tab-pane key="1" tab="设备参数">
            <eq-param :equipment_id="equipment_id" :data="tableData"></eq-param>
         </a-tab-pane>
         <a-tab-pane key="2" tab="时域分析">
            <time-domain :equipment_id="equipment_id" :timeDomainList="timeDomainList" />
         </a-tab-pane>
         <a-tab-pane key="3" tab="故障预测">
            <fault-prediction :equipment_id="equipment_id" :positionNumber="timeDomainList" />
         </a-tab-pane>
         <a-tab-pane key="4" tab="故障诊断">
            <fault-diagnosis :timeDomainList="timeDomainList" />
         </a-tab-pane>
         <!-- <a-tab-pane key="5" tab="趋势分析"></a-tab-pane> -->
      </a-tabs>
   </div>
</template>

<script>
import { getComprehensiveMonitorApi } from '@/api/eqMonitor'
import eqParam from './components/eqParam.vue'
import FaultDiagnosis from './components/faultDiagnosis.vue'
import FaultPrediction from './components/faultPrediction.vue'
import TimeDomain from './components/timeDomain.vue'
export default {
   data() {
      return {
         eqName: '鼓风机',
         currentPage: '1',
         equipment_id: '',
         tableData: [],
         timeDomainList: [],
      }
   },
   components: {
      eqParam,
      TimeDomain,
      FaultPrediction,
      FaultDiagnosis,
   },
   methods: {
      async getComprehensiveMonitor() {
         const { result } = await getComprehensiveMonitorApi(this.equipment_id)
         if (result) {
            this.tableData = result
            this.timeDomainList = result
               .filter(item => item.wave_analysis)
               .map(pn => {
                  return pn.position_number
               })
         }
      },
   },
   created() {
      this.equipment_id = this.$route.query.equipment_id
      this.getComprehensiveMonitor()
   },
}
</script>

<style scoped lang="less">
@import './card.less';

.eq-detail {
   padding: 10px 20px;
   width: 100%;
   min-height: 100vh - 10px;
   // height: 100%;
   background: url('@/assets/img/eqdetail.png') no-repeat;
   background-size: cover;
   .ant-tabs {
      width: 100%;
      color: white;
      background: transparent;
      border: none;
   }
}
</style>
