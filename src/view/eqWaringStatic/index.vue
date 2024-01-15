<template>
   <div>
      <a-row type="flex" justify="end" align="middle">
         <a-col>
            <a-form layout="inline">
               <a-form-item label="组织节点">
                  <a-tree-select
                     v-model="equipment_node"
                     style="width: 200px"
                     :replaceFields="replaceFields"
                     :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                     :tree-data="treeData"
                     @select="getEqByTree"
                     placeholder="请选择设备组织节点"
                  ></a-tree-select>
               </a-form-item>
               <a-form-item label="时间">
                  <a-month-picker
                     v-model="month"
                     placeholder="请选择月份"
                     :disabledDate="disabledDate"
                  />
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
                  <a-spin tip="加载中...." :spinning="spinning">
                     <div style="height: 4rem">
                        <a-col :span="6" v-for="(item, index) in optionList" :key="index">
                           <e-chart height="4rem" :option="item.option" :show-loading="false" />
                        </a-col>
                     </div>
                  </a-spin>
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
         spinning: true,
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
         this.spinning = true
         const {
            result: { table, graph },
         } = await getWarningStatisticsApi({
            equipment_tree: this.equipment_node && this.equipment_node.split(','),
            month: moment(this.month).format('YYYY-MM'),
         })
         //测试数据
         // const { table, graph } = {
         //    graph: [
         //       {
         //          count: 14,
         //          grade: '\u4e00\u822c',
         //          ratio: 100.0,
         //       },
         //       {
         //          count: 0,
         //          grade: '\u91cd\u5927',
         //          ratio: 0.0,
         //       },
         //       {
         //          count: 0,
         //          grade: '\u7279\u5927',
         //          ratio: 0.0,
         //       },
         //       {
         //          count: 4,
         //          grade: '\u6545\u969c\u8bbe\u5907',
         //          ratio: 50.0,
         //       },
         //    ],
         //    table: [
         //       {
         //          count: 14,
         //          department: [
         //             '\u5929\u4f1f\u5316\u5de5\u6709\u9650\u516c\u53f8\u5316\u5de5\u5382',
         //             '\u805a\u5408\u8f66\u95f4',
         //             '\u805a\u5408\u5e72\u71e5\u5de5\u6bb5',
         //          ],
         //          especially: 0,
         //          fault_count: 2,
         //          general: 14,
         //          month: '2024-01',
         //          normal_count: 2,
         //          shutdown_count: 2,
         //          significant: 0,
         //       },
         //    ],
         // }
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
                        itemGap: -40,
                        top: '89%',
                        left: '49%',
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
                              offsetCenter: [0, '85%'],
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
                                    [0, '#6aa0fd'],
                                    [0.125, '#6aa0fd'],
                                    [0.25, '#6aa0fd'],
                                    [0.375, '#f8c126'],
                                    [0.5, '#f8c126'],
                                    [0.625, '#f8c126'],
                                    [0.75, '#f8c126'],
                                    [0.875, '#f4271c'],
                                    [1, '#f4271c'],
                                 ],
                              },
                           },
                           title: {
                              offsetCenter: [0, '109%'],
                           },

                           data: [
                              {
                                 value: item.ratio,
                                 name: item.grade + '报警',
                                 title: {
                                    fontWeight: 900,
                                    fontSize: 18,
                                 },
                              },
                           ],
                        },
                     ],
                  },
               }
            })
            this.spinning = false
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
