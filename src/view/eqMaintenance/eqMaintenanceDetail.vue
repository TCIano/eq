<template>
   <div>
      <a-row>
         <a-col>
            111
            <e-chart theme="" height="1rem" />
         </a-col>
         <a-col>
            <e-chart height="1rem" />
         </a-col>
      </a-row>
      <a-row>
         <a-col></a-col>
      </a-row>
   </div>
</template>

<script>
import eChart from '@/components/eChart.vue'
export default {
   components: { eChart },
   data() {
      return {}
   },
}
</script>

<style scoped></style>
