<template>
   <div>
      <a-row type="flex" justify="space-between" align="middle">
         <a-tabs default-active-key="1" style="width: 40%" size="large">
            <a-tab-pane key="1" tab="全部（233）"></a-tab-pane>
            <a-tab-pane key="2" tab="待处理（200）"></a-tab-pane>
            <a-tab-pane key="3" tab="已处理（33）"></a-tab-pane>
         </a-tabs>
         <a-col>
            <a-row type="flex" justify="end" align="middle">
               <a-col>
                  <a-form layout="inline" style="width: 550px">
                     <a-form-item label="组织节点">
                        <a-tree-select
                           v-model="equipment_node"
                           style="width: 200px"
                           :replaceFields="replaceFields"
                           :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                           :tree-data="treeData"
                           @select="getEqByTree"
                           placeholder="请选择设备组织节点"
                        ></a-tree-select>
                     </a-form-item>
                     <a-form-item>
                        <a-input v-model="eq" placeholder="请选择设备名称"></a-input>
                     </a-form-item>
                  </a-form>
               </a-col>
               <a-col>
                  <a-space>
                     <a-button type="primary" icon="search" @click="reSearch">查询</a-button>
                     <a-button type="primary" icon="sync" @click="reset">重置</a-button>
                  </a-space>
               </a-col>
            </a-row>
         </a-col>
      </a-row>
      <div class="grid grid-cols-3 gap-1">
         <div class="h-1/3" v-for="item in 9" :key="item">
            <a-card hoverable style="height: 100%">
               <template slot="actions">
                  <div style="height: 0.5rem; line-height: 0.5rem">
                     <a href="#" @click.prevent="getDetail">
                        <a-icon key="edit" type="search" />
                        查看详情
                     </a>
                  </div>
               </template>
               <a-icon
                  type="close-circle"
                  style="float: right; font-size: 16px"
                  @click="deleteEq(item.equipment_id)"
               />
               <a-card-meta :title="56565" class="cardMeta">
                  <a-avatar slot="avatar" src="" />
                  <template slot="description">
                     <div class="MetaCon">
                        <div>推送报警时间：</div>
                        <div>可能故障位号：</div>
                     </div>
                  </template>
               </a-card-meta>
            </a-card>
         </div>
      </div>
   </div>
</template>

<script>
import { arr2Tree } from '@/utils'
export default {
   data() {
      return {
         equipment_id: '',
         equipment_node: undefined,
         treeData: [],
         replaceFields: {
            children: 'children',
            title: 'title',
            key: 'key',
            value: 'key',
         },
         eq: undefined,
         eqList: [],
      }
   },
   methods: {
      async getOrigination() {
         const { result } = await getOriginationApi()
         this.treeData = arr2Tree(result)
         // generateList(this.treeData)
      },
      async getEqByTree(value) {
         this.eq = undefined
         const { result } = await getEquipmentListApi(
            Array.isArray(value) ? value : value.split(',')
         )
         if (result) {
            this.eqList = result
         }
      },
      getDetail() {
         this.$router.push({
            path: '/equipmentMaintenanceDetail',
            query: {
               id: 1,
            },
         })
      },
      reSearch() {},
      reset() {},
   },
}
</script>

<style scoped lang="less">
.cardMeta {
   height: 1.9rem;
   line-height: 0.5rem;
   margin: 0 auto;
   .MetaCon {
      line-height: 0.6rem;
   }
}
</style>
