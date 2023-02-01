<template>
   <div>
      <a-row type="flex" justify="space-between" align="middle">
         <a-row>
            <a-space>
               <a-button type="primary" icon="plus">新增</a-button>
               <a-button icon="edit">修改</a-button>
               <a-button type="danger" icon="delete">删除</a-button>
            </a-space>
         </a-row>
         <a-row>
            <a-space>
               <a-input placeholder="请输入关键字查询" v-model="searchForm.keyName"></a-input>
               <a-button icon="search" type="primary">搜索</a-button>
               <a-button icon="sync">重置</a-button>
            </a-space>
         </a-row>
      </a-row>
      <a-row>
         <a-table style="margin-top: 10px" :columns="columns" :data-source="eqData"></a-table>
      </a-row>
   </div>
</template>

<script>
export default {
   data() {
      return {
         searchForm: {
            keyName: '',
         },
         columns: [
            {
               align: 'center',
               title: '设备属性',
               dataIndex: 'attr',
            },
            {
               align: 'center',
               title: '设备类型',
               dataIndex: 'categort',
            },
            {
               align: 'center',
               title: '基础数据',
               dataIndex: 'basic',
            },
            {
               align: 'center',
               title: '数据分析类型',
               dataIndex: 'analysis',
            },
         ],
         eqData: [],
      }
   },
}
</script>

<style scoped></style>
