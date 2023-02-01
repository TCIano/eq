<template>
   <a-card>
      <div slot="title" style="display: flex; align-items: center">
         <a-icon type="pause" style="font-size: 20px" />
         <span>{{ title }}</span>
      </div>
      <e-chart :option="option" theme="dark" height="300px" width="100%" />
      <!-- 计算表格 -->
      <a-table size="middle" :data-source="data" :rowSelection="rowSelection" :columns="columns">
         <template slot="value" slot-scope="text, record">
            <a-input
               :value="text.value"
               @change="e => handleChange(e.target.value, record.key)"
            ></a-input>
         </template>

         <template slot="action"><a href="#">计算</a></template>
      </a-table>
   </a-card>
</template>

<script>
import eChart from '@/components/eChart.vue'
export default {
   components: { eChart },
   data() {
      return {
         title: '时域分析图谱',
         option: {
            xAxis: {
               type: 'category',
               data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            },
            yAxis: {
               type: 'value',
            },
            series: [
               {
                  data: [150, 230, 224, 218, 135, 147, 260],
                  type: 'line',
               },
            ],
         },
         //列表选择
         rowSelection: {
            type: 'radio',
         },
         data: [
            {
               key: 0,
               select: 'John Brown',
               value: 32,
               option: 'New York No. 1 Lake Park',
            },
         ],
         columns: [
            {
               title: '去噪选择',
               dataIndex: 'select',
               key: 'select',
               width: 300,
            },
            {
               title: '输入值',
               width: 300,
               scopedSlots: { customRender: 'value' },
               key: 'value',
            },
            {
               title: '操作',
               scopedSlots: { customRender: 'action' },
               key: 'option',
               width: 700,
            },
         ],
      }
   },
   methods: {
      handleChange(value, key) {
         const newData = [...this.data]
         const target = newData.find(item => key === item.key)
         if (target) {
            target.value = value
            this.data = newData
         }
      },
   },
   created() {
      console.log('222')
   },
}
</script>

<style scoped lang="less"></style>
