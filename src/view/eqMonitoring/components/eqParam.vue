<template>
   <a-card>
      <div slot="title" style="display: flex; align-items: center">
         <a-icon type="pause" style="font-size: 20px" />
         <span>{{ title }}</span>
      </div>
      <a-table
         :columns="columns"
         :data-source="data"
         rowKey="unit"
         :pagination="{
            pageSize: 7,
         }"
      >
         <template slot="name" slot-scope="text">
            {{ text.name || text.position_name }}
         </template>
         <template slot="action" slot-scope="text">
            <img
               v-if="text.comprehensive_analysis"
               src="@/assets/img/parameAnalysis.svg"
               alt=""
               style="width: 35px; cursor: pointer"
               @click="openModal(text.position_number, text.name)"
            />
         </template>
         <template slot="value" slot-scope="text">
            {{ text.value + '  ' + text.unit }}
         </template>
      </a-table>
      <!-- 参数分析弹窗 -->
      <a-modal
         :title="title"
         :visible="visible"
         centered
         @cancel="closeModal"
         @ok="getAnaData"
         v-if="visible"
      >
         <!-- 表单 -->
         <a-form-model ref="form" :model="form">
            <a-form-model-item label="分析时间" :label-col="labelCol" :wrapper-col="wrapperCol">
               <a-range-picker :format="dateFormat" allowClear v-model="time" show-time>
                  <a-icon slot="suffixIcon" type="calendar" style="color: white" />
               </a-range-picker>
            </a-form-model-item>
         </a-form-model>
         <a-form :layout="form.layout" :model="form">
            <a-row :gutter="24">
               <a-col :span="12" v-for="(value, key) in form.waveParam" :key="key">
                  <a-form-item :label="form.map[key]">
                     <a-input
                        placeholder="请输入"
                        disabled
                        v-model.number="form.waveParam[key]"
                     ></a-input>
                  </a-form-item>
               </a-col>
            </a-row>
         </a-form>
         <template slot="footer">
            <a-button type="primary" icon="calculator" @click="getAnaData(position_number)">
               分析
            </a-button>
         </template>
      </a-modal>
   </a-card>
</template>

<script>
import moment from 'moment'
import { getWaveShapeAnalysisApi } from '@/api/eqMonitor'

const columns = [
   {
      // dataIndex: 'name',
      key: 'name',
      align: 'center',
      title: '参数',
      scopedSlots: { customRender: 'name' },
   },
   {
      title: '状态或位号值',
      align: 'center',
      key: 'value',
      scopedSlots: { customRender: 'value' },
   },

   {
      title: '',
      key: 'action',
      scopedSlots: { customRender: 'action' },
   },
]

export default {
   props: {
      equipment_id: {
         type: String,
      },
      data: {
         type: Array,
      },
   },
   data() {
      return {
         title: '设备参数',
         columns,
         // data: [],
         visible: false,
         labelCol: { span: 4 },
         wrapperCol: {
            span: 20,
         },
         form: {
            layout: 'inline',
            waveParam: {}, //波形参数
            map: {
               peak: '峰值',
               mean: '平均值',
               rms: '有效值',
               peak_value: '峰值指标',
               waveform: '波形指标',
               pulse: '脉冲指标',
               margin: '裕度指标',
               kurtosis: '峭度指标',
            },
         },
         dateFormat: 'YYYY-MM-DD HH:mm:ss',
         time: [
            moment(moment(this.currentTime).subtract(3, 'hours').format(this.dateFormat)), //moment写法获取前三个小时
            moment(moment(this.currentTime).subtract(0, 'hours').format(this.dateFormat)),
         ],
         currentTime: new Date(),
         position_number: '',
         // wrapperCol: { span: 14 },
      }
   },
   computed: {
      formItemLayout() {
         return {}
      },
   },
   watch: {
      currentTime: {
         handler(newVal, oldVal) {
            //重新给time赋值
            this.reSetTime()
         },
      },
   },
   methods: {
      moment,
      openModal(position_number, name) {
         this.position_number = position_number
         this.visible = true
         this.title = name + '参数分析'
         this.currentTime = new Date()
         this.getAnaData(position_number)
      },
      closeModal() {
         this.visible = false
      },
      //获取波形参数分析分析结果
      async getAnaData(position_number) {
         console.log(this.time)
         const {
            result: { data },
         } = await getWaveShapeAnalysisApi({
            equipment_id: this.equipment_id,
            position_number,
            start_time: moment(this.time[0]).format(this.dateFormat),
            end_time: moment(this.time[1]).format(this.dateFormat),
         })
         this.form.waveParam = data
      },
      reSetTime() {
         this.time = [
            moment(moment(this.currentTime).subtract(3, 'hours').format(this.dateFormat)), //moment写法获取前三个小时
            moment(moment(this.currentTime).subtract(0, 'hours').format(this.dateFormat)),
         ]
      },
   },
   created() {
      console.log('created')
   },
}
</script>

<style scoped lang="less">
/deep/.ant-modal {
   background: transparent;
   .ant-modal-content {
      background: rgba(41, 44, 52, 0.9);
      color: white;
      .ant-modal-close {
         color: white;
      }
      .ant-modal-footer {
         border-top: none;
      }
      .ant-modal-body {
         label {
            color: white;
         }
         .ant-calendar-picker-input.ant-input {
            background: transparent;
            border: 1px solid #47d6d7;
            color: white;
         }
         .ant-calendar {
            color: white;
            background-color: #141414 !important;
            border: 1px solid #141414;
            // -webkit-box-shadow: 0 2px 8px rgb(255 255 255 / 15%);
            // box-shadow: 0 2px 8px rgb(255 255 255 / 15%);
         }
         .ant-input {
            border: 1px solid #47d6d7;
            color: white;
            background: transparent;
         }
         .ant-input:hover {
            border: 1px solid #386b8a;
         }
      }
      .ant-modal-header {
         border-bottom: none;
         //  background: #323335;
         background: rgba(50, 51, 53, 0.9);
         .ant-modal-title {
            color: white;
         }
      }
   }
}
</style>
