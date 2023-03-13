<template>
   <div>
      <a-row type="flex" justify="end" align="middle">
         <a-col>
            <a-form layout="inline">
               <a-form-item label="组织节点">
                  <a-tree-select v-model="equipment_node" style="width: 200px" :replaceFields="replaceFields"
                     :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :tree-data="treeData" @select="getEqByTree"
                     placeholder="请选择设备组织节点"></a-tree-select>
               </a-form-item>
               <a-form-item label="时间">
                  <a-month-picker v-model="month" placeholder="请选择月份" :disabledDate="disabledDate" />
               </a-form-item>
            </a-form>
         </a-col>
         <a-col>
            <a-space>
               <a-button type="primary" icon="search" @click="reSearch">查询</a-button>
               <a-button type="primary" icon="sync" @click="reset">重置</a-button>
            </a-space>
         </a-col>
      </a-row>
      <a-row :gutter="gutter">
         <a-col>
            <a-card class="indicator">
               <template slot="title">
                  <a-space>
                     <a-icon type="team" style="color: red" />
                     <span>重要指标情况分析</span>
                  </a-space>
               </template>
               <a-row>
                  <a-col :span="6" v-for="(item, index) in optionList" :key="index">
                     <e-chart height="4rem" :option="item.option" />
                  </a-col>
               </a-row>
            </a-card>
         </a-col>
      </a-row>
      <a-row :gutter="gutter">
         <a-col>
            <a-card>
               <template slot="title">
                  <a-space>
                     <a-icon type="team" style="color: red" />
                     <span>设备故障预测统计表</span>
                  </a-space>
               </template>
               <a-table :columns="columns" :data-source="data" :scroll="{ y: 200 }" row-key="month">
                  <template slot="month" slot-scope="text, record">
                     <span>{{ moment(record.month).format('YYYY-MM') }}</span>
                  </template>
               </a-table>
            </a-card>
         </a-col>
      </a-row>
   </div>
</template>

<script>
import { mixin } from '@/mixins/mixins'
import moment from 'moment'
import eChart from '@/components/eChart.vue'
import { getWarningStatisticsApi } from '@/api/eqWaring'

export default {
   components: { eChart },
   name: 'eqWaringStatic',
   mixins: [mixin],
   data() {
      return {
         moment,
         gutter: [10, 10],
         month: undefined,
         optionList: [],
         columns: [
            {
               key: 'department',
               dataIndex: 'department',
               align: 'center',
               title: '所属部门',
            },
            {
               align: 'center',
               key: 'month',
               // dataIndex: 'month',
               title: '月份',
               scopedSlots: { customRender: 'month' },
            },
            {
               align: 'center',
               key: 'count',
               dataIndex: 'count',
               title: '报警次数',
            },
            {
               align: 'center',
               key: 'general',
               dataIndex: 'general',
               title: '一般报警',
            },
            {
               align: 'center',
               key: 'significant',
               dataIndex: 'significant',
               title: '重大报警',
            },
            {
               align: 'center',
               key: 'especially',
               dataIndex: 'especially',
               title: '特大报警',
            },
            {
               align: 'center',
               key: 'normal_count',
               dataIndex: 'normal_count',
               title: '运行设备数量',
            },
            {
               align: 'center',
               key: 'fault_count',
               dataIndex: 'fault_count',
               title: '故障设备数量',
            },
            {
               align: 'center',
               key: 'shutdown_count',
               dataIndex: 'shutdown_count',
               title: '停机设备数量',
            },
         ],
         data: [],
      }
   },
   methods: {
      disabledDate(current) {
         return current && current > moment().endOf('month')
      },
      reSearch() {
         // this.equipment_node = undefined
         this.getWarningStatistics()
      },
      reset() {
         this.equipment_node = undefined
         this.month = undefined
      },
      async getWarningStatistics() {
         const {
            result: { table, graph },
         } = await getWarningStatisticsApi({
            equipment_tree: this.equipment_node && this.equipment_node.split(','),
            month: moment(this.month).format('YYYY-MM'),
         })
         if (table && graph) {
            this.data = table
            this.optionList = graph.map((item, index) => {
               return {
                  grade: item.grade,
                  option: {
                     title: {
                        show: true,
                        subtextStyle: {
                           color: '#f662a2',
                           height: 20,
                        },

                        textAlign: 'middle',
                        textVerticalAlign: 'middle',
                        text: item.grade + '报警',
                        itemGap: -40,
                        top: '90%',
                        left: 'middle',
                        subtext: item.count + `${index === 3 ? ' 台' : ' 次'} `,
                     },
                     tooltip: {
                        formatter: '{a}{b} : {c}%',
                     },
                     series: [
                        {
                           name: item.grade,
                           type: 'gauge',
                           // startAngle: 200,
                           // endAngle: -50,
                           detail: {
                              formatter: '{value}%',
                              fontSize: 20,
                              offsetCenter: [0, '60%'],
                           },
                           splitNumber: 8,
                           axisTick: {
                              show: true,
                              distance: -15,
                              lineStyle: {
                                 color: '#fff',
                              },
                              // length: 5,
                           },
                           splitLine: {
                              distance: -15,
                              length: 20,
                              lineStyle: {
                                 color: '#fff',
                                 width: 2,
                              },
                           },
                           axisLine: {
                              lineStyle: {
                                 width: 15,
                                 color: [
                                    [0, '#f4271c'],
                                    [0.125, '#f4271c'],
                                    [0.25, '#f4271c'],
                                    [0.375, '#f8c126'],
                                    [0.5, '#f8c126'],
                                    [0.625, '#f8c126'],
                                    [0.75, '#f8c126'],
                                    [0.875, '#6aa0fd'],
                                    [1, '#6aa0fd'],
                                 ],
                              },
                           },
                           data: [
                              {
                                 value: item.ratio,
                                 //  name: '百分比',
                              },
                           ],
                        },
                     ],
                  },
               }
            })
         }
      },
   },
   created() {
      this.getWarningStatistics()
   },
}
</script>

<style scoped lang="less">
.indicator {
   ::v-deep .ant-card-body {
      padding: 0;
   }
}
</style>
