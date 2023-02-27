<template>
   <div class="eq-detail">
      <div
         class="bgPicture"
         :style="{
            background: `url(${$route.query.equipment_picture}) no-repeat 50% 60%`,
            backgroundSize: '500px 500px',
         }"
      >
         <div class="text-center bg-transparent text-white font-mono" style="font-size: 0.5rem">
            {{ equipment_name }}综合监视
         </div>
         <a-tabs
            default-active-key="1"
            v-model="currentPage"
            tabPosition="left"
            @change="onChangeTabs"
         >
            <a-tab-pane key="1" tab="设备参数">
               <eq-param :equipment_id="equipment_id" :data="tableData"></eq-param>
            </a-tab-pane>
            <a-tab-pane key="2" tab="时域分析">
               <time-domain :equipment_id="equipment_id" :timeDomainList="mapList[0].list" />
            </a-tab-pane>
            <a-tab-pane key="3" tab="故障预测">
               <fault-prediction
                  ref="faultPre"
                  :equipment_id="equipment_id"
                  :frePositionNumber="mapList[1].list"
                  :kurPositionNumber="mapList[2].list"
               />
            </a-tab-pane>
            <a-tab-pane key="4" tab="故障诊断">
               <fault-diagnosis ref="faultDia" :equipment_id="equipment_id" />
            </a-tab-pane>
         </a-tabs>
      </div>
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
         equipment_name: '',
         currentPage: '1',
         equipment_id: '',
         tableData: [],
         timeDomainList: [],
         kurPositionNumber: [],
         frePositionNumber: [],
         mapList: [
            {
               key: 'time_domain',
               list: [],
            },

            {
               key: 'frequency_analysis',
               list: [],
            },
            {
               key: 'kurtosis_analysis',
               list: [],
            },
         ],
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
            for (let index = 0; index < this.mapList.length; index++) {
               this.mapList[index].list = result
                  .filter(item => item[this.mapList[index].key])
                  .map(pn => {
                     return pn.name
                  })
            }
         }
      },
      onChangeTabs(activeKey) {
         //两个方法是请求异步方法，用nexttick包装一下
         this.$nextTick(() => {
            switch (activeKey) {
               case '3':
                  this.$refs.faultPre.getFaultPredict()
                  break
               case '4':
                  this.$refs.faultDia.getFaultDiagnosis()
                  break
               default:
                  break
            }
         })
      },
   },
   created() {
      this.equipment_id = this.$route.query.equipment_id
      this.equipment_name = this.$route.query.equipment_name
      this.getComprehensiveMonitor()
   },
}
</script>

<style scoped lang="less">
@import './card.less';

.eq-detail {
   padding: 10px 20px;
   // width: 100%;
   min-height: 100vh - 10px;
   // height: 100%;
   background: url('@/assets/img/eqdetail.png') no-repeat;
   background-size: cover;
   // background: url('http://dummyimage.com/200x100/894FC4/FFF.png&text=!') no-repeat 50% 60%;
   .ant-tabs {
      width: 100%;
      color: white;
      background: transparent;
      border: none;
   }
}
</style>
