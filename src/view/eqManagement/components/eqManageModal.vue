<template>
   <a-modal title="123" :visible="visible" @ok="submit" @cancel="cancel" width="500px"></a-modal>
</template>

<script>
export default {
   props: {
      title: {
         type: String,
      },
      visible: {
         type: Boolean,
      },
   },
   data() {
      return {}
   },
   methods: {
      setVisible(modalVisible) {
         this.$emit('update:visible', modalVisible)
      },
      submit() {
         this.setVisible(false)
      },
      cancel() {
         this.setVisible(false)
      },
   },
}
</script>

<style scoped></style>
