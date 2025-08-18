<template>
  <div>
    
    <a-layout style="height: calc(100vh - 20px); background-color: #f0f2f5">
      <!-- 左侧导航菜单 -->
      <a-layout-sider style="background: #fff;" width="250px">
        <a-menu mode="inline" style="border-right: 0;height: 100%;overflow: auto">
          <a-sub-menu
              v-for="menu in menuConfig"
              :key="menu.id"
              style="background-color: #f9fafb; margin: 8px; border-radius: 6px"
          >
               <span slot="title">
<!--                  <a-icon :type="menu.icon" />-->
                  <span style="font-size:15px">{{ menu.type_name }}</span>
               </span>
            
            <a-menu-item
                v-for="item in menu.items"
                :key="item.message_id"
                style="height: auto; padding: 12px 24px"
                @click="onMenuClick(item)"
            >
              <div style="display: flex; flex-direction: column">
                <div style="font-weight: 500; color: #262626; margin-bottom: 4px">
                  {{ item.position_name }}
                </div>
                <div v-if="item.train_message" style="margin-top: 8px">
                  <span style="color: #595959">阈值1 ：</span>
                  <span style="color: #1890ff; font-weight: 500">
                           {{ item.train_message?.threshold1 }}
                        </span>
                </div>
                <div v-if="item.train_message" style="margin-top: 8px">
                  <span style="color: #595959">阈值1 ：</span>
                  <span style="color: #1890ff; font-weight: 500">
                           {{ item.train_message?.threshold2 }}
                        </span>
                </div>
                <div v-if="item.train_message" style="margin-top: 8px">
                  <span style="color: #595959">数据长度 ：</span>
                  <span style="color: #1890ff; font-weight: 500">
                           {{ item.train_message?.size }}
                        </span>
                </div>
              </div>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      
      <!-- 右侧内容区域 -->
      <a-layout>
        <a-layout-content style="background: #fff; border-radius: 6px; flex: 1">
          <!-- 图表展示区域 -->
          <div style="padding: 24px">
            <a-row :gutter="16" style="width: 100%;">
              <a-col :span="24">
                <a-card :bordered="false" style="width: 100%">
                  <template #title>
                    <div style="display: flex; justify-content: space-between">
                      <div>训练数据趋势</div>
                      <div>
                        <a-space>
                          <a-range-picker
                              v-model="rangerTime"
                              :format="format"
                              :valueFormat="format"
                              show-time>
                          </a-range-picker>
                          <a-button type="primary" @click="onGetChart">查询</a-button>
                        </a-space>
                      </div>
                    </div>
                  </template>
                  <e-chart
                      ref="chartRef"
                      :option="chartOption"
                      :show-loading="false"
                      height="5rem"
                      width="100%"
                  />
                </a-card>
              </a-col>
            </a-row>
          </div>
          
          <!-- 训练参数设置区域 -->
          <div style="padding: 24px; border-top: 1px solid #f0f0f0">
            <div style="margin-bottom: 24px">
              <h3 style="margin-bottom: 16px; font-size: 16px; font-weight: 500">
                训练参数设置
              </h3>
              <a-form-model ref="formRef" :label-col="{ span: 6 }" :model="currentNode.train_message"
                            :wrapper-col="{ span:12 }">
                <a-form-model-item label="阈值1" prop="threshold1" required>
                  <a-input-number v-model="currentNode.train_message .threshold1" placeholder="请输入阈值1"
                                  style="width: 100%"></a-input-number>
                </a-form-model-item>
                <a-form-model-item label="阈值2" prop="threshold2" required>
                  <a-input-number v-model="currentNode.train_message.threshold2" placeholder="请输入阈值2"
                                  style="width: 100%"></a-input-number>
                </a-form-model-item>
                <a-form-model-item label="训练数据长度" prop="size">
                  <a-input-number v-model.number="currentNode.train_message.size" style="width: 100%"></a-input-number>
                </a-form-model-item>
              </a-form-model>
              <div style="text-align: right">
                <a-space>
                  <a-button @click="cancelTraining">取消</a-button>
                  <a-button :loading="isTraining" type="primary" @click="startTraining">
                    训练
                  </a-button>
                  <a-button type="primary" @click="onSaveTrain">
                    保存
                  </a-button>
                </a-space>
              </div>
            </div>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import eChart from '@/components/eChart.vue'
import { getEquipmentDetailApi, getHistoryDataApi, saveTrainResult, trainModelApi } from '@/api/eqManage'
import { useRoute } from 'vue-router/composables'
import moment from 'moment'
import cloneDeep from 'lodash.clonedeep'
import { message } from 'ant-design-vue'

const route = useRoute()
const formRef = ref()
// 响应式数据
const isTraining = ref(false)
const chartLoading = ref(false)
const chartRef = ref(null)

// 训练参数表单
const trainForm = ref({
  threshold1: '',
  threshold2: '',
  size: 0,
})
const format = 'YYYY-MM-DD HH:mm:ss'
const rangerTime = ref(['', ''])
const currentChartInfo = ref({})
const chartOption = ref({})
const currentNode = ref({
  comprehensive_show: 0,
  lower: null,
  message_id: "",
  online_show: 0,
  position_name: "",
  position_number: "",
  position_type: "",
  train_message: {
    size: 0,
    threshold1: '0',
    threshold2: '0',
  },
  unit: '',
  upper: null,
})
// 训练参数
const trainParams = reactive({
  modelName: '',
  trainingDataset: '',
})

// 动态菜单配置数据
const menuConfig = ref([])

// 从后端加载菜单配置的方法
const loadMenuConfig = async () => {
  try {
    // 这里可以调用后端接口获取菜单配置
    const { result } = await getEquipmentDetailApi(route.query.id)
    menuConfig.value = result.position_number
    
  } catch (error) {
    console.error('加载菜单配置失败：', error)
  }
}

const onMenuClick = (item) => {
  chartRef.value.resize()
  currentNode.value = cloneDeep(item)
  // 获取当前节点的趋势
  
  rangerTime.value = [moment().subtract(1, 'h').format(format), moment().format(format)]
  getCurrentChart()
}
const onGetChart = () => {
  getCurrentChart()
}
const getCurrentChart = async () => {
  
  const { result } = await getHistoryDataApi({
    position_number: currentNode.value.position_number,
    start_time: rangerTime.value[0],
    end_time: rangerTime.value[1],
  })
  currentChartInfo.value = result
  chartOption.value = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: currentChartInfo.value.values.map(item => item.timestamp),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: currentChartInfo.value.position_number,
        type: 'line',
        smooth: true,
        data: currentChartInfo.value.values.map(item => item.value),
      },
    
    ],
  }
}
const setCurrentChart = (res) => {
  chartOption.value = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: currentChartInfo.value.values.map(item => item.timestamp),
    },
    yAxis: [
      {
        type: 'value',
      },
      {
        type: 'value',
        // position: 'right',
        // axisLabel: {
        //   formatter: '{value} %',
        // },
      },
    ],
    series: [
      {
        name: currentChartInfo.value.position_number,
        type: 'line',
        smooth: true,
        data: currentChartInfo.value.values.map(item => item.value),
      },
      {
        name: '训练结果',
        yAxisIndex: 1,
        type: 'bar',
        smooth: true,
        data: res.map(item => ({
          value: item.diff,
          itemStyle: {
            color: item.warning ? 'red' : '#1890ff',
          },
        })),
        
      },
    
    ],
  }
}
// 图表配置

// 方法定义
const startTraining = async () => {
  try {
    isTraining.value = true
    const { result } = await trainModelApi({
      record_id: currentChartInfo.value.record_id,
      size: currentNode.value.train_message.size || 0,
      threshold1: currentNode.value.train_message.threshold1 || 0,
      threshold2: currentNode.value.train_message.threshold2 || 0,
    })
    
    setCurrentChart(result)
    // 模拟训练过程
    isTraining.value = false
  } catch (error) {
    isTraining.value = false
    console.error('训练失败：', error)
  }
}
const onSaveTrain = () => {
  formRef.value.validate().then(async () => {
    await saveTrainResult({
      message_id: currentNode.value.message_id,
      threshold1: currentNode.value.train_message.threshold1,
      threshold2: currentNode.value.train_message.threshold2,
      size: currentNode.value.train_message.size,
    })
    message.success('训练参数保存成功')
    await loadMenuConfig()
    
  })
  
}
// const state = reactive({
//   count: 0,
// })
//
// function f1() {
//   console.log(1)
//   return state.count
// }
//
// function f2() {
//   console.log(2)
// }
//
// watch(f1, f2)
// state.count++
const cancelTraining = () => {
  trainParams.modelName = ''
  trainParams.trainingDataset = ''
  console.log('取消训练')
}

// 生命周期
onMounted(() => {
  
  loadMenuConfig()
  nextTick(() => {
    setTimeout(() => {
      chartRef.value.resize()
    })
  })
})
</script>

<style lang="less" scoped>
.ant-layout {
  background: #f0f2f5;
}

.ant-menu-item {
  &:hover {
    background-color: #e6f7ff !important;
  }
}

.ant-card {
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12),
  0 5px 12px 4px rgba(0, 0, 0, 0.09);
}
</style>
