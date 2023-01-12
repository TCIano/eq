<template>
   <div>
      <a-button type="primary" icon="calculator">分析</a-button>
      <a-button type="primary" icon="search" size="large">Search</a-button>
      <a-range-picker allowClear>
         <a-icon slot="suffixIcon" type="calendar" style="color: white" />
      </a-range-picker>
   </div>
</template>

<script>
export default {
   data() {
      return {}
   },
}
</script>

<style scoped></style>
