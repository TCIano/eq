<template>
  <a-card style="height: 100%">
    <div slot="title" style="display: flex; align-items: center">
      <a-icon style="font-size: 20px" type="pause" />
      <span>{{ title }}</span>
    </div>
    <a-row justify="end" type="flex">
      <!--         <span class="title">-->
      <!--            24小时故障预测:-->
      <!--            <span-->
      <!--                :class="-->
      <!--                  parseFloat(isnormal.replace('%', '')) < 100-->
      <!--                     ? 'text-green-600 font-bold'-->
      <!--                     : 'text-red-600 font-bold'-->
      <!--               "-->
      <!--            >-->
      <!--               {{ isnormal }}-->
      <!--            </span>-->
      <!--         </span>-->
    </a-row>
    <a-row>
      <e-chart
          ref="preChart"
          :option="predictOption"
          :theme="theme"
          height="8rem"
          width="100%"
      />
    </a-row>
    <a-row :gutter="20">
      <!--      <a-col :span="12">-->
      <!--        <a-row justify="end" type="flex">-->
      <!--          <a-select-->
      <!--              :value="frequency"-->
      <!--              placeholder="请选择分析数据"-->
      <!--              style="width: 40%"-->
      <!--              @change="onChangeFre"-->
      <!--          >-->
      <!--            <a-select-option-->
      <!--                v-for="item in frePositionNumber"-->
      <!--                :key="item.value"-->
      <!--                :value="item.value"-->
      <!--            >-->
      <!--              {{ item.name }}-->
      <!--            </a-select-option>-->
      <!--          </a-select>-->
      <!--        </a-row>-->
      <!--        &lt;!&ndash;        <e-chart&ndash;&gt;-->
      <!--        &lt;!&ndash;            ref="freChart"&ndash;&gt;-->
      <!--        &lt;!&ndash;            :option="frequencyOption"&ndash;&gt;-->
      <!--        &lt;!&ndash;            :theme="theme"&ndash;&gt;-->
      <!--        &lt;!&ndash;            height="3.5rem"&ndash;&gt;-->
      <!--        &lt;!&ndash;            width="100%"&ndash;&gt;-->
      <!--        &lt;!&ndash;        />&ndash;&gt;-->
      <!--      </a-col>-->
      <a-col :span="12">
        <!--        <a-row :gutter="5" align="middle" justify="end" type="flex">-->
        <!--          <a-col :span="2">-->
        <!--            <a-input v-model.number="interval" placeholder="间隔"></a-input>-->
        <!--          </a-col>-->
        <!--          <a-col>-->
        <!--            <span>：小时</span>-->
        <!--          </a-col>-->
        <!--          <a-col :span="6">-->
        <!--            <a-select v-model="kurtosis" placeholder="请选择分析数据" style="width: 100%">-->
        <!--              <a-select-option-->
        <!--                  v-for="item in kurPositionNumber"-->
        <!--                  :key="item.value"-->
        <!--                  :value="item.value"-->
        <!--              >-->
        <!--                {{ item.name }}-->
        <!--              </a-select-option>-->
        <!--            </a-select>-->
        <!--          </a-col>-->
        <!--          <a-col :span="11">-->
        <!--            <a-range-picker-->
        <!--                v-model="time"-->
        <!--                :disabledDate="disabledDate"-->
        <!--                :format="dateFormat"-->
        <!--                allowClear-->
        <!--                show-time-->
        <!--                style="width: 100%"-->
        <!--            >-->
        <!--              <a-icon slot="suffixIcon" style="color: white" type="calendar" />-->
        <!--            </a-range-picker>-->
        <!--          </a-col>-->
        <!--          <a-col>-->
        <!--            <a-button icon="undo" @click="reGetKurtosis"></a-button>-->
        <!--          </a-col>-->
        <!--        </a-row>-->
        <!--        <e-chart ref="kurChart" :option="kurtosisOption" :theme="theme" height="3.5rem" />-->
      </a-col>
    </a-row>
    
    <a-row class="mt-1" style="width: 100%;display: flex;justify-content: space-between;align-items: center">
      <!--    提示信息-->
      <a-alert v-if="info" :message="info" style="min-width: 150px" type="info" />
      <a-pagination v-if="info" v-model="currentPage" :defaultPageSize="1" :total="totalPage" @change="onPageChange" />
    </a-row>
  </a-card>
</template>

<script>
import { getFaultPredictApi, getFrequencyDomainAnalysisApi } from '@/api/eqPredict'
import moment from 'moment'
import eChart from '@/components/eChart.vue'
import { chartsMixin } from '@/mixins/chartsMixins'

export default {
  components: { eChart },
  mixins: [chartsMixin],
  props: {
    equipment_id: {
      type: String,
    },
    theme: {
      type: String,
      default: 'dark',
    },
  },
  data() {
    return {
      title: '故障预测',
      infoMessage: '',
      info: '',
      currentPage: 1,
      totalPage: 0,
      frequency: '', //频域分析下拉框
      kurtosis: '', //鞘度分析下拉框
      kurPositionNumber: [],
      frePositionNumber: [],
      interval: 2, //间隔时间
      dateFormat: 'YYYY-MM-DD HH:mm',
      currentTime: new Date(),
      isnormal: '0%',
      //鞘度分析时间
      time: [
        moment(moment(this.currentTime).subtract(2, 'days').format(this.dateFormat)), //moment写法获取前三天
        moment(moment(this.currentTime).subtract(0, 'days').format(this.dateFormat)),
      ],
      predictOption: {}, //预测
      //频域
      frequencyOption: {
        legend: {
          data: ['正常', '实时'],
        },
        tooltip: {
          show: true,
          trigger: 'axis',
        },
        grid: {
          top: '15%',
          bottom: '15%',
          left: '6%',
          right: '3%',
        },
        xAxis: {},
        yAxis: {
          type: 'value',
        },
        
        series: [
          {
            name: '正常',
            data: [],
            type: 'line',
          },
          {
            name: '实时',
            data: [],
            type: 'line',
          },
        ],
      },
      //鞘度
      kurtosisOption: {
        tooltip: {
          show: true,
          trigger: 'axis',
        },
        grid: {
          top: '15%',
          bottom: '15%',
          left: '6%',
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
            name: '峭度',
            data: [],
            type: 'line',
          },
        ],
      },
    }
  },
  methods: {
    onPageChange(page) {
      this.currentPage = page
      this.info = this.infoMessage[page - 1] || ''
    },
    disabledDate(current) {
      return current && current > moment().endOf('day')
    },
    handleOption(result) {
      // this.kurPositionNumber = result.kurtosis_analysis.position_list
      // this.frePositionNumber = result.frequency_analysis.position_list
      // this.frequency = result.frequency_analysis.position_number.value
      // this.kurtosis = result.kurtosis_analysis.position_number.value
      this.totalPage = result.alarm.record.length
      this.infoMessage = result?.alarm?.record.map(
          item => (`开始时间：${ item.start_time }，结束时间：${ item.end_time }，  ${ item.message }`))
      this.info = this.infoMessage[0] || ''
      let threshold = result.threshold
      // this.isnormal = result.prediction.flag
      let predictData = result.data.map(item => {
        return [item.time, item.predict_number]
      })
      // let frequencyNormalData = result.frequency_analysis.normal_frequency.map(item => {
      //   return [item.freq, item.amp]
      // })
      // let frequencyCurrentData = result.frequency_analysis.current_frequency.map(item => {
      //   return [item.freq, item.amp]
      // })
      //
      // this.frequencyOption.series[0].data = frequencyNormalData
      // this.frequencyOption.series[1].data = frequencyCurrentData
      // this.frequencyOption.dataZoom = this.dataZoom
      // let kurtosisData = result.kurtosis_analysis.result.map(item => {
      //   return [item.time, item.value]
      // })
      // this.kurtosisOption.dataZoom = this.dataZoom
      // this.kurtosisOption.series[0].data = kurtosisData
      this.predictOption = {
        tooltip: {
          trigger: 'axis',
          formatter: param => {
            let tip = ''
            if (param != null && param.length > 0) {
              tip += param[0].data[0] + '<br/>'
              for (var i = 0; i < param.length; i++) {
                tip +=
                    '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:red;"></span>' +
                    '阈值 :' +
                    threshold +
                    '<br/>' +
                    param[i].marker +
                    '当前值 :' +
                    param[i].data[1]
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
            data: predictData,
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
    },
    async getFaultPredict() {
      this.$refs.preChart.spinning = true
      // this.$refs.freChart.spinning = true
      // this.$refs.kurChart.spinning = true
      const { result } = await getFaultPredictApi(this.equipment_id || '')
      
      if (result) {
        this.handleOption(result)
      }
    },
    //频域分析内容
    async onChangeFre(position_number) {
      this.$refs.freChart.spinning = true
      this.frequency = position_number
      const { result } = await getFrequencyDomainAnalysisApi({
        equipment_id: this.equipment_id,
        position_number: {
          value: position_number,
        },
      })
      if (result) {
        this.frequencyOption.series[0].data = result.normal_frequency.map(item => {
          return [item.freq, item.amp]
        })
        this.frequencyOption.series[1].data = result.current_frequency.map(item => {
          return [item.freq, item.amp]
        })
      }
    },
    //h获取峭度
    async reGetKurtosis() {
      // this.$refs.kurChart.spinning = true
      // const {
      //   result: { result },
      // } = await getKurtosisAnalysisApi({
      //   equipment_id: this.equipment_id,
      //   position_number: {
      //     value: this.kurtosis,
      //   },
      //   start_time: moment(this.time[0]).format(this.dateFormat) + ':00',
      //   end_time: moment(this.time[1]).format(this.dateFormat) + ':00',
      //   span: this.interval / 1,
      // })
      //
      // if (result) {
      //   this.kurtosisOption.series[0].data = result.map(item => {
      //     return [item.time, item.value]
      //   })
      // }
    },
  },
  created() {},
}
</script>

<style lang="less" scoped>
.title {
  font-size: 0.3rem;
}
</style>
