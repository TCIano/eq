<template>
  <div>
    <!-- 顶部趋势图区域 -->
    <a-row style="width: 100%">
      <a-col :span="24">
        <a-card style="width: 100%">
          <!--          <template slot="title">-->
          <!--            <a-space>-->
          <!--              <a-icon style="color: #1890ff" type="line-chart" />-->
          <!--              <span>设备运行趋势</span>-->
          <!--            </a-space>-->
          <!--          </template>-->
          <div style="height: 5rem">
            <e-chart :option="trendChartOption" :show-loading="true" height="5rem" />
          </div>
        </a-card>
      </a-col>
    </a-row>
    
    <!-- 主要内容区域 -->
    <a-row :gutter="[10,10]" style="width: 100%;height: 100%">
      <!-- 左侧监测点信息区域 -->
      <a-col :span="15">
        <a-card :body-style="{ padding: '17px',height:'9.2rem',overflow:'auto' }">
          <template slot="title">
            <div style="display: flex;
            justify-content: space-between">
              <a-space>
                <a-icon style="color: #52c41a" type="radar-chart" />
                <span>监测点信息</span>
              </a-space>
              <a-space>
                <a-select v-model="currentType" placeholder="选择位号类型" style="width: 100px;"
                          @change="onChangeType">
                  <a-select-option v-for="item in currentTypes" :key="item.id">{{
                      item.position_type
                    }}
                  </a-select-option>
                </a-select>
              </a-space>
            </div>
          </template>
          <a-row :gutter="[5, 5]" style="margin: 0">
            <!--            name 需要唯一的key，不然会导致每次切换选择的内容时候，布局内元素的高度混乱（vue会复用 DOM）-->
            <a-col v-for="(item) in monitoringPoints" :key="item.name"
                   :span="monitoringPoints.length >= 2 ? 12 : 24">
              <a-card :body-style="{ padding: '0px' }" class="monitoring-point-card"
                      size="small">
                <template slot="title">
                  <span>{{ item.name }}</span>
                </template>
                <e-chart ref="currentChart" :height="monitoringPoints.length > 2 ? '2.7rem':'7rem'"
                         :option="item.chartOption"
                         :show-loading="false" />
              </a-card>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      
      <!-- 右侧信息面板 -->
      <a-col :span="9">
        <a-card :body-style="{ padding: '17px', }">
          <template slot="title">
            <a-space>
              <a-icon style="color: #fa8c16" type="info-circle" />
              <span>故障详情</span>
            </a-space>
          </template>
          <!-- 设备信息卡片 -->
          <div>
            <a-descriptions :colon="false" :column="1" bordered size="middle">
              <a-descriptions-item label="设备名称">
                <a-tag color="blue">{{ equipmentInfo.equipment_name }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="故障信息">
                <!--                增加超出隐藏-->
                <!--                <div :title="equipmentInfo.alarm_message" style="width: 100%;white-space: nowrap;overflow: hidden">-->
                <span style="font-size: 12px"> {{ equipmentInfo.alarm_message }}</span>
                <!--                </div>-->
              </a-descriptions-item>
              <a-descriptions-item label="触发时间">
                {{ equipmentInfo.start_time }}
              </a-descriptions-item>
              <a-descriptions-item label="结束时间">
                {{ equipmentInfo.end_time }}
              </a-descriptions-item>
              <a-descriptions-item label="持续时间">
                {{ equipmentInfo.duration }}
              </a-descriptions-item>
              <a-descriptions-item label="处理状态">
                <a-tag :color="getStatusColor(equipmentInfo.processed)"
                       @click="onOpenDialog()">
                  <!--                  误报：2（橙色）-->
                  {{ getStatusName(equipmentInfo.processed) }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="处理信息">
                {{ equipmentInfo.process_message }}
              </a-descriptions-item>
            </a-descriptions>
          </div>
          <a-drawer :visible="drawerVisible" title="清理信息" width="400" @close="onCancel">
            <a-form-item label="处理信息">
              <a-textarea v-model="processMessage" />
            </a-form-item>
            <div
                :style="{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px',
        }"
            >
              <a-button style="marginRight: 8px" @click="onCancel">
                取消
              </a-button>
              <a-button type="primary" @click="onHandleStatus">
                确认
              </a-button>
            </div>
          </a-drawer>
        
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import eChart from '@/components/eChart.vue'
import { getWarningDetailApi, getWarningDetailTagApi, setWarningStatusApi } from '@/api/eqWaring'

export default {
  name: 'EquipmentDetail',
  components: {
    eChart,
  },
  data() {
    return {
      drawerVisible: false,
      currentType: '',
      currentTypes: [],
      selectedPrediction: 'result1',
      predictionOptions: [
        { value: 'result1', label: '监测结果1' },
        { value: 'result2', label: '监测结果2' },
        { value: 'result3', label: '监测结果3' },
      ],
      equipmentInfo: {
        equipment_name: '',
        process_message: '',
        start_time: '',
        end_time: '',
        duration: '',
        processed: 0,
        alarm_message: '',
      },
      monitoringPoints: [],
      trendChartOption: {},
      processMessage: '',
    }
  },
  methods: {
    onOpenDialog() {
      if (!this.equipmentInfo.processed) {
        
        this.drawerVisible = true
        this.processMessage = this.equipmentInfo.process_message || ''
      }
    },
    onCancel() {
      this.drawerVisible = false
      this.processMessage = ''
    },
    async onHandleStatus() {
      await setWarningStatusApi({
        fault_id: this.$route.query.fault_id,
        processed: 1, // 切换状态：未处理 -> 已处理 或 已处理 -> 误报
        process_message: this.processMessage,
      })
      this.equipmentInfo.processed = 1
      this.equipmentInfo.process_message = this.processMessage
      this.drawerVisible = false
    },
    createBarChartOption(categories, series1Data, series2Data, markLineValue) {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {},
        grid: {
          left: '15%',
          right: '15%',
          bottom: '15%',
          top: '17%',
        },
        xAxis: {
          type: 'category',
          data: categories,
        },
        yAxis: [
          {
            type: 'value',
          },
          {
            type: 'value',
            position: 'right',
          },
        ],
        series: [
          {
            name: '一阶导',
            type: 'bar',
            data: series1Data,
            
            // 阈值线
            markLine: {
              lineStyle: {
                color: 'red',
                type: 'dashed',
              },
              data: [
                {
                  
                  name: '阈值',
                  yAxis: markLineValue, // 阈值线位置
                  
                },
              ],
            },
          },
          {
            yAxisIndex: 1,
            name: '实际值',
            type: 'line',
            data: series2Data,
            itemStyle: {
              color: '#52c41a',
            },
          },
        ],
      }
    },
    getStatusColor(status) {
      const statusColors = {
        0: '#e68086',
        1: '#608eef',
        2: '#fa8c16', // 误报
      }
      return statusColors[status]
    },
    
    getStatusName(status) {
      const statusNames = {
        0: '未处理',
        1: '已处理',
        2: '误报',
      }
      return statusNames[status]
    },
    async onChangeType(value) {
      
      const currentType = this.currentTypes.find(item => item.id === value);
      const { result } = await getWarningDetailTagApi(currentType.id, currentType.position_type,
          this.$route.query.fault_id)
      this.changeTagChart(result.current_curve)
      
    },
    
    async initChartData() {
      const { result } = await getWarningDetailApi(this.$route.query.fault_id);
      this.currentTypes = result.tag_curve.position_types
      
      this.currentType = result.tag_curve.current_type.id
      this.equipmentInfo = result.warning_message
      
      // 初始化位号图表数据
      this.changeTagChart(result.tag_curve.current_curve)
      
      // 初始化趋势图数据
      this.trendChartOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true,
        },
        xAxis: {
          type: 'time',
          boundaryGap: false,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            // name: '设备运行趋势',
            type: 'line',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(138, 150, 250, 0.8)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(138, 150, 250, 0.1)',
                  },
                ],
              },
            },
            data: result.record_curve.map(item => [item.time, item.value]),
            
          },
        ],
      }
    },
    changeTagChart(list) {
      this.monitoringPoints = list.map(item => {
        return {
          name: item.name,
          chartOption: this.createBarChartOption(
              item.curve_list.map(t => t.time),
              item.curve_list.map(t => ({
                value: t.diff,
                itemStyle: {
                  color: t.warning ? 'red' : '#1890ff',
                },
              })),
              item.curve_list.map(t => t.value),
              item.threshold.threshold1,
          ),
        }
      })
    },
  },
  mounted() {
    this.initChartData()
    
    // 确保图表正确渲染
    this.$nextTick(() => {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 500)
    })
  },
}
</script>

<style lang="less" scoped>
//.ant-descriptions-row {
//
//  .ant-descriptions-item-label {
//    width: 200px;
//  }
//}

.equipment-detail-container {
  background: #f0f2f5;
  height: calc(100vh - 20px);
  width: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  
  
  * {
    box-sizing: border-box;
  }
  
  .ant-row {
    width: 100%;
  }
  
  .ant-col {
    max-width: 100%;
  }
  
  .mb-3 {
    margin-bottom: 8px;
  }
  
  .mb-4 {
    margin-bottom: 8px;
  }
  
  .mt-3 {
    margin-top: 8px;
  }
  
  .trend-chart-card {
    width: 100%;
    
    .ant-card-head {
      border-bottom: 2px solid #1890ff;
    }
    
    .ant-card-body {
      padding: 12px;
      overflow: hidden;
    }
    
    .echart {
      width: 100% !important;
      max-width: 100% !important;
    }
  }
  
  .monitoring-point-card {
    height: 100%;
    
    .ant-card-head {
      padding: 6px 12px;
      min-height: auto;
    }
    
    .ant-card-body {
      width: 100%;
      overflow: hidden;
      padding: 8px;
    }
    
    .monitoring-point-title {
      font-weight: 600;
      color: #1890ff;
      font-size: 14px;
    }
    
    .echart {
      width: 100% !important;
      max-width: 100% !important;
    }
  }
  
  .info-panel {
    height: fit-content;
    
    .ant-card-head {
    }
    
    .ant-card-body {
    }
    
    .status-indicators {
      .status-item {
        padding: 2px 0;
      }
    }
    
    .equipment-info {
      .equipment-descriptions {
        ::v-deep .ant-descriptions-item-label {
          font-weight: 600;
          width: 80px;
        }
        
        ::v-deep .ant-descriptions-item {
        }
      }
    }
    
    .equipment-description {
      h4 {
        margin-bottom: 6px;
        color: #262626;
        font-weight: 600;
        font-size: 14px;
      }
      
      .description-text {
        color: #595959;
        line-height: 1.4;
        margin: 0;
        font-size: 12px;
      }
    }
  }
}
</style>
