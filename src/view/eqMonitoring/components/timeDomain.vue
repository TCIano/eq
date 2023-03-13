<template>
   <a-card style="height: 100%">
      <div slot="title" style="display: flex; align-items: center">
         <a-icon type="pause" style="font-size: 20px" />
         <span>{{ title }}</span>
      </div>

      <a-select style="width: 20%; margin-bottom: 5px" v-model="position_number" placeholder="请选择位号"
         @change="onChangePositionNumber">
         <a-select-option v-for="item in timeDomainList" :key="item.value" :value="item.value">
            {{ item.name }}
         </a-select-option>
      </a-select>
      <e-chart ref="chart" :option="option" theme="dark" height="300px" width="100%" />
      <!-- 计算表格 -->
      <a-table size="middle" :data-source="data" :rowSelection="{
         type: 'radio',
         onChange: onSelectChange,
         selectedRowKeys: selectedRowKeys,
      }" :columns="columns">
         <template slot="value" slot-scope="text, record">
            <a-input-number :style="{ width: inputStyle.width }" v-if="text.key !== 2" :value="text.value"
               :min="inputStyle.min" :max="inputStyle.max" :step="inputStyle.step"
               @change="$event => handleChange($event, record.key)"></a-input-number>
            <a-row :gutter="10" v-else>
               <a-col :span="12">
                  <a-input-number :style="{ width: inputStyle.width }" :min="inputStyle.min" :max="inputStyle.max"
                     :step="inputStyle.step" :value="text.lowValue"
                     @change="$event => handleChangeOther($event, record.key, 'lowValue')"></a-input-number>
               </a-col>
               <a-col :span="12">
                  <a-input-number :style="{ width: inputStyle.width }" :min="inputStyle.min" :max="inputStyle.max"
                     :step="inputStyle.step" :value="text.highValue"
                     @change="$event => handleChangeOther($event, record.key, 'highValue')"></a-input-number>
               </a-col>
            </a-row>
         </template>
         <template slot="action" slot-scope="text">
            <a href="#" v-show="text.select" @click="
               calculate(
                  text.name,
                  text.name !== '带通滤波'
                     ? text.name === '低通滤波'
                        ? [text.value, 0]
                        : [0, text.value]
                     : [text.lowValue, text.highValue]
               )
            ">
               计算
            </a>
         </template>
      </a-table>
   </a-card>
</template>

<script>
import eChart from '@/components/eChart.vue'
import { getTimeDomainAnalysisApi } from '@/api/eqMonitor'
import { chartsMixin } from '@/mixins/chartsMixins'
export default {
   name: 'time-domain',
   components: { eChart },
   mixins: [chartsMixin],
   props: {
      timeDomainList: {
         type: Array,
      },
      equipment_id: {
         type: String,
      },
   },
   data() {
      return {
         title: '时域分析图谱',
         inputStyle: {
            min: 0,
            max: 0.4,
            step: 0.1,
            width: '100%',
         },
         option: {},
         //列表选择
         data: [
            {
               key: 0,
               name: '低通滤波',
               value: 0,
               select: 0,
            },
            {
               key: 1,
               name: '高通滤波',
               value: 0,
               select: 0,
            },
            {
               key: 2,
               name: '带通滤波',
               lowValue: 0,
               highValue: 0,
               select: 0,
            },
         ],
         columns: [
            {
               title: '去噪选择',
               dataIndex: 'name',
               key: 'name',
               width: '10%',
            },
            {
               title: '输入值',
               width: '20%',
               scopedSlots: { customRender: 'value' },
               key: 'value',
               width: '20%',
            },
            {
               title: '操作',
               scopedSlots: { customRender: 'action' },
            },
         ],
         selectedRowKeys: [],
         position_number: this.timeDomainList[0].value,
         type: '', //滤波类型
      }
   },
   methods: {
      handleChange(value, key) {
         const newData = [...this.data]
         const target = newData.find(item => key === item.key)
         if (target) {
            target.value = value / 1
            this.data = newData
         }
      },
      handleChangeOther(value, key, type) {
         const newData = [...this.data]
         const target = newData.find(item => key === item.key)
         if (target) {
            target[type] = value / 1
            this.data = newData
         }
      },
      //获取时域分析数据
      async getTimeDomainAnalysis(type = '', low_value = 0, high_value = 0) {
         const { result } = await getTimeDomainAnalysisApi({
            equipment_id: this.equipment_id,
            position_number: {
               value: this.position_number,
            },
            wave_filter: {
               type,
               low_value,
               high_value,
            },
         })
         if (result) {
            let raw_data = result.raw_data.map(item => {
               return [item.time, item.value]
            })
            let filter_data = result.filter_data?.map(item => {
               return [item.time, item.value]
            })
            this.setOption(raw_data, filter_data)
         }
      },
      onSelectChange(selectedRowKeys) {
         this.selectedRowKeys = selectedRowKeys
         this.data.map(item => {
            item.key === selectedRowKeys[0] ? (item.select = 1) : (item.select = 0)
         })
      },
      calculate(type, value) {
         if (type === '带通滤波' && value[0] >= value[1]) {
            this.data[2].lowValue = 0
            this.data[2].highValue = 0
            return this.$message.warning('输入值大小有问题，请重新输入')
         }
         this.getTimeDomainAnalysis(type, ...value)
      },
      setOption(raw_data, filter_data) {
         this.option = {
            legend: {
               data: ['未滤波', '滤波'],
            },
            tooltip: {
               trigger: 'axis',
               show: true,
               // formatter: '{c}',
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
                  name: '未滤波',
                  type: 'line',
                  data: raw_data,
               },
               {
                  name: '滤波',
                  type: 'line',
                  data: filter_data,
               },
            ],
         }
         this.$refs.chart.getEchartData()
      },
      onChangePositionNumber(position_number) {
         this.position_number = position_number
         this.getTimeDomainAnalysis()
      },
   },

   created() {
      this.getTimeDomainAnalysis()
   },
}
</script>

<style scoped lang="less"></style>
