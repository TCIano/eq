<template>
   <a-card>
      <div slot="title" style="display: flex; align-items: center">
         <a-icon type="pause" style="font-size: 20px" />
         <span>故障诊断</span>
      </div>
      <e-chart :option="option" theme="dark" height="300px" />
   </a-card>
</template>

<script>
import eChart from '@/components/eChart.vue'
export default {
   components: { eChart },
   data() {
      return {
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
      }
   },
}
</script>

<style scoped></style>
