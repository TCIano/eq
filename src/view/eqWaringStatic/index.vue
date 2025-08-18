<template>
  <div>
    <a-row align="middle" justify="end" type="flex">
      <a-col>
        <a-form layout="inline">
          <a-form-item label="组织节点">
            <a-tree-select
                v-model="equipment_node"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :replaceFields="replaceFields"
                :tree-data="treeData"
                placeholder="请选择设备组织节点"
                style="width: 200px"
                @select="getEqByTree"
            ></a-tree-select>
          </a-form-item>
          <a-form-item label="时间">
            <a-month-picker
                v-model="month"
                :disabledDate="disabledDate"
                placeholder="请选择月份"
            />
          </a-form-item>
        </a-form>
      </a-col>
      <a-col>
        <a-space>
          <a-button icon="search" type="primary" @click="reSearch">查询</a-button>
          <a-button icon="sync" type="primary" @click="reset">重置</a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-row :gutter="gutter">
      <a-col>
        <a-card class="indicator">
          <template slot="title">
            <a-space>
              <a-icon style="color: red" type="team" />
              <span>重要指标情况分析</span>
            </a-space>
          </template>
          <a-row>
            <a-spin :spinning="spinning" tip="加载中....">
              <div style="height: 5rem">
                <a-col v-for="(item, index) in optionList" :key="index" :span="8">
                  <e-chart :option="item.option" :show-loading="false" height="5rem" />
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
              <a-icon style="color: red" type="team" />
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
          key: 'name',
          dataIndex: 'name',
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
          key: 'alarm_number',
          dataIndex: 'alarm_number',
          title: '报警次数',
        },
        {
          align: 'center',
          key: 'processed_number',
          dataIndex: 'processed_number',
          title: '已处理报警数量',
        },
        {
          align: 'center',
          key: 'unprocessed_number',
          dataIndex: 'unprocessed_number',
          title: '未处理报警数量',
        },
        
        {
          align: 'center',
          key: 'running_number',
          dataIndex: 'running_number',
          title: '运行设备数量',
        },
        {
          align: 'center',
          key: 'alarm_equipment_number',
          dataIndex: 'alarm_equipment_number',
          title: '故障设备数量',
        },
        {
          align: 'center',
          key: 'stopping_number',
          dataIndex: 'stopping_number',
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
    generateDate(data) {
      data.forEach(item => {
        item.children = item.child
        if (item.child && item.child.length) {
          this.generateDate(item.child)
        }
      })
    },
    async getWarningStatistics() {
      this.spinning = true
      const {
        result: { table, dashboard, current_query },
      } = await getWarningStatisticsApi({
        org_id: this.equipment_node,
        month: moment(this.month).format('YYYY-MM'),
      })
      this.month = current_query.month
      this.equipment_node = current_query.org_id
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
      if (table && dashboard) {
        this.generateDate([table])
        this.data = [table]
        this.optionList = []
        //格式化日期 日期参数格式为**时**分钟
        // 转换为 数字，单位是小时
        // 0小时30分钟  转为 0.5小时
        // eslint-disable-next-line no-inner-declarations
        function timeToHours(timeStr) {
          console.log(timeStr)
          // 匹配"小时"和"分钟"的数字
          const matches = timeStr.match(/(\d+\.?\d*)小时(\d+\.?\d*)分钟/)
          if (!matches) return 0
          
          // 提取小时和分钟
          const hours = parseInt(matches[1])
          const minutes = parseInt(matches[2])
          
          // 转换为小时数（保留1位小数）
          return Number((hours + minutes / 60).toFixed(2))
        }
        
        dashboard.alarm_duration = timeToHours(dashboard.alarm_duration)
        
        const nameMap = {
          alarm_duration: "故障持续时间(h)",
          avg_score: "设备平均分数",
          unprocessed_number: "未处理故障设备",
        }
        const colorMap = {
          alarm_duration: '#91EEAD',
          avg_score: '#F4C136',
          unprocessed_number: '#f4271c',
        }
        for (const dashboardKey in dashboard) {
          const item = dashboard[dashboardKey]
          this.optionList.push({
            // grade: item.grade,
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
              },
              tooltip: {
                formatter: '{a}{b} : {c}',
              },
              series: [
                {
                  radius: '100%',
                  name: nameMap[dashboardKey],
                  type: 'gauge',
                  startAngle: 180,
                  endAngle: 0,
                  center: ['50%', '65%'],
                  detail: {
                    formatter: '{value}',
                    fontSize: 25,
                    offsetCenter: [0, '20%'],
                  },
                  //隐藏指针
                  pointer: {
                    offsetCenter: [0, -70],
                    length: "15%",
                    width: 3,
                  },
                  axisTick: {
                    distance: 10,
                    length: 10,
                    splitNumber: 5, //刻度数量
                    show: true,
                    lineStyle: {
                      width: 2,
                      color: 'auto',  //设置为auto后颜色跟随轴线
                    },
                  },
                  splitLine: {
                    length: 20,
                    lineStyle: {
                      width: 3,
                      color: 'auto',
                    },
                  },
                  axisLabel: {
                    distance: -50,
                    color: '#999',
                  },
                  // 轴线
                  axisLine: {
                    // roundCap: true,
                    lineStyle: {
                      width: 10,
                      color: [
                        [0, '#eff2ff'],
                        
                        [0.3, '#eff2ff'],
                        
                        [0.7, '#e1e7fe'],
                        
                        [1, colorMap[dashboardKey]],
                      ],
                    },
                  },
                  title: {
                    offsetCenter: [0, 0],
                    fontSize: 16,
                  },
                  
                  data: [
                    {
                      value: item,
                      name: nameMap[dashboardKey],
                      
                    },
                  ],
                },
              ],
            },
          })
        }
        this.spinning = false
      }
    },
  },
  created() {
    this.getWarningStatistics()
  },
}
</script>

<style lang="less" scoped>
.indicator {
  ::v-deep .ant-card-body {
    padding: 0;
  }
}
</style>
