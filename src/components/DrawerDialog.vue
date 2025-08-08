<template>
  <a-drawer
      :title="title"
      :visible="showModal"
      :width="width"
      class="drawer-dialog-wrapper"
      @close="onCancel"
  >
    <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
    >
      <a-space>
        <a-button @click="onCancel">取消</a-button>
        <a-button type="primary" @click="onConfirm">确定</a-button>
      </a-space>
    </div>
    <div>
      <slot name="content"></slot>
    </div>
  </a-drawer>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'DrawerDialog',
  props: {
    width: {
      type: Number,
      default: 378,
    },
    title: {
      type: String,
      default: '操作',
    },
    contentHeight: {
      type: String,
      default: '100vh',
    },
  },
  emits: ['confirm', 'cancel'],
  setup(props, { emit }) {
    const showModal = ref(false)
    
    function toggle() {
      showModal.value = !showModal.value
      return Promise.resolve(showModal.value)
    }
    
    function show() {
      showModal.value = true
      return Promise.resolve(true)
    }
    
    function close() {
      showModal.value = false
      return Promise.resolve(false)
    }
    
    function onConfirm() {
      emit('confirm')
    }
    
    function onCancel() {
      showModal.value = false
      emit('cancel')
    }
    
    return {
      showModal,
      toggle,
      show,
      close,
      onConfirm,
      onCancel,
    }
  },
})
</script>

<style lang="less" scoped>
.drawer-dialog-wrapper {
  
  
  scrollbar-width: none;
  -moz-scrollbar: none;
  -ms-overflow-style: none;
}

</style>
