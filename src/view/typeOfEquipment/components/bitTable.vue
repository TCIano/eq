<template>
   <div>
      <a-table
         :columns="columns"
         :data-source="bitData"
         row-key="base_id"
         :scroll="{ y: 320 }"
         :pagination="false"
      >
         <template slot="analysis" slot-scope="text, record">
            <a-checkbox
               :checked="record[tab] ? true : false"
               @change="onChange(record.base_id, $event)"
            ></a-checkbox>
         </template>
      </a-table>
   </div>
</template>

<script>
export default {
   name: 'BitTable',
   props: {
      bitData: {
         type: Array,
         default: () => [],
      },
      tab: {
         type: String,
      },
   },
   data() {
      return {
         columns: [
            {
               key: 'base_name',
               align: 'center',
               title: '数据类型',
               dataIndex: 'base_name',
            },
            {
               key: 'analysis',
               align: 'center',
               title: '分析',
               dataIndex: 'analysis',
               scopedSlots: { customRender: 'analysis' },
            },
         ],
      }
   },
   methods: {
      onChange(id, e) {
         console.log(id, e.target.checked)
         let bool = e.target.checked
         this.$emit('getbitDataValue', id, bool)
      },
   },

   mounted() {},
}
</script>

<style lang="scss" scoped></style>
