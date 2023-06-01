<template>
   <div>
      <a-row type="flex" justify="space-between" align="middle">
         <a-tabs default-active-key="3" style="width: 40%" size="large" @change="getFaultByStatus">
            <a-tab-pane key="null" tab="全部"></a-tab-pane>
            <a-tab-pane key="1" tab="已处理"></a-tab-pane>
            <a-tab-pane key="0" tab="待处理"></a-tab-pane>
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
                     <a-form-item label="设备">
                        <a-select v-model="eq" placeholder="请选择设备" style="width: 200px">
                           <a-select-option
                              :value="item.equipment_id"
                              v-for="item in eqList"
                              :key="item.equipment_id"
                           >
                              {{ item.equipment_name }}
                           </a-select-option>
                        </a-select>
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
      <a-empty v-if="!faultList?.length" style="position: absolute; top: 50%; left: 50%"></a-empty>
      <div class="grid grid-cols-3 gap-1">
         <div v-for="item in faultList" :key="item.fault_id">
            <a-skeleton avatar :paragraph="{ rows: 5 }" active :loading="loading">
               <a-card hoverable style="height: 100%">
                  <template slot="actions">
                     <div style="height: 0.3rem; line-height: 0.3rem">
                        <a href="#" @click.prevent="getDetail(item.fault_id)">
                           <a-icon key="edit" type="search" />
                           查看详情
                        </a>
                     </div>
                  </template>
                  <a-card-meta :title="item.equipment_name" class="cardMeta">
                     <a-avatar
                        slot="avatar"
                        :style="{ backgroundColor: item.processed ? '#608eef' : '#e68086' }"
                        :icon="item.processed ? 'check' : 'info'"
                     />
                     <template slot="description">
                        <div class="MetaCon">
                           <div>推送报警时间：{{ item.warning_time }}</div>
                           <div>可能故障位号：{{ item.fault_position.value }}</div>
                        </div>
                     </template>
                  </a-card-meta>
               </a-card>
            </a-skeleton>
         </div>
      </div>
      <a-row>
         <a-pagination
            style="float: right; margin-top: 10px"
            v-if="faultList.length"
            show-quick-jumper
            :default-current="1"
            :current="currentPage"
            :defaultPageSize="pageSize"
            :total="total"
            @change="pageChange"
         />
      </a-row>
   </div>
</template>

<script>
import { getWarningListApi } from '@/api/eqWaring'
import { mixin } from '@/mixins/mixins'
export default {
   mixins: [mixin],
   data() {
      return {
         faultList: [],
         defaultCurrentPage: 1,
         currentPage: 1,
         pageSize: 9,
         total: undefined,
         processed: null,
         loading: true,
      }
   },
   methods: {
      async getWarningList() {
         const { result } = await getWarningListApi({
            equipment_id: this.eq,
            page: this.currentPage,
            amount: this.pageSize,
            processed: this.processed,
         })
         if (result) {
            this.faultList = result.fault_list
            this.loading = false
            this.total = result.total_amount
         }
      },
      getFaultByStatus(key) {
         this.processed = key / 1
         this.getWarningList()
      },
      getDetail(fault_id) {
         this.$router.push({
            path: '/equipmentMaintenanceDetail',
            query: {
               fault_id: fault_id,
            },
         })
      },
      pageChange(page) {
         this.currentPage = page
         this.getWarningList()
      },
      reSearch() {
         this.getWarningList()
      },
      reset() {
         this.equipment_node = undefined
         this.eq = undefined
         this.eqList = []
      },
   },
   created() {
      this.getWarningList()
   },
}
</script>

<style scoped lang="less">
.cardMeta {
   height: 1.5rem;
   line-height: 0.5rem;
   margin: 0 auto;

   .MetaCon {
      line-height: 0.6rem;
   }
}
</style>
