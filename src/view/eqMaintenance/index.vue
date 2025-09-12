<template>
  <div>
    <a-row align="middle" justify="space-between" type="flex">
      <a-tabs default-active-key="3" size="large" style="width: 40%" @change="getFaultByStatus">
        <a-tab-pane key="null" tab="全部"></a-tab-pane>
        <a-tab-pane key="1" tab="已处理"></a-tab-pane>
        <a-tab-pane key="0" tab="待处理"></a-tab-pane>
      </a-tabs>
      <a-col>
        <a-row align="middle" justify="end" type="flex">
          <a-col>
            <a-form layout="inline" style="width: 550px">
              <a-form-item label="组织节点">
                <a-tree-select
                    v-model="equipment_node"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    :replaceFields="replaceFields"
                    :tree-data="treeData"
                    placeholder="请选择设备组织节点"
                    style="width: 200px"
                    @select="getEqByTree"
                ></a-tree-select>
              </a-form-item>
              <a-form-item label="设备">
                <a-select v-model="eq" placeholder="请选择设备" style="width: 200px">
                  <a-select-option
                      v-for="item in eqList"
                      :key="item.equipment_id"
                      :value="item.equipment_id"
                  >
                    {{ item.equipment_name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-form>
          </a-col>
          <a-col>
            <a-space>
              <a-button icon="search" type="primary" @click="reSearch">查询</a-button>
              <a-button icon="sync" type="primary" @click="reset">重置</a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-empty v-if="!faultList?.length" style="position: absolute; top: 50%; left: 50%"></a-empty>
    <div class="grid grid-cols-3 gap-1">
      <div v-for="item in faultList" :key="item.fault_id">
        <a-skeleton :loading="loading" :paragraph="{ rows: 5 }" active avatar>
          <a-card hoverable style="height: 100%">
            <template slot="actions">
              <div style="height: 0.3rem; line-height: 0.3rem">
                <a href="#" @click.prevent="getDetail(item.fault_id)">
                  <a-icon key="edit" type="search" />
                  查看详情
                </a>
              </div>
            </template>
            <a-card-meta
                :title="`${item.equipment_name}${item.equipment_id}`"
                class="cardMeta"
            >
              <a-avatar
                  slot="avatar"
                  :icon="item.processed ? 'check' : 'info'"
                  :style="{ backgroundColor: item.processed ? '#608eef' : '#e68086' }"
              />
              <template slot="description">
                <div class="MetaCon">
                  <div>推送报警开始时间：{{ item.start_time }}</div>
                  <div>推送报警结束时间：{{ item.end_time }}</div>
                  <!--                           <div>可能故障位号：{{ item.fault_position.value }}</div>-->
                </div>
              </template>
            </a-card-meta>
          </a-card>
        </a-skeleton>
      </div>
    </div>
    <a-row>
      <a-pagination
          v-if="faultList.length"
          :current="currentPage"
          :default-current="1"
          :defaultPageSize="pageSize"
          :total="total"
          show-quick-jumper
          style="float: right; margin-top: 10px"
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
      this.reSetTreeNode()
    },
  },
  created() {
    this.getWarningList()
  },
}
</script>

<style lang="less" scoped>
.cardMeta {
  height: 1.5rem;
  line-height: 0.5rem;
  margin: 0 auto;
  
  .MetaCon {
    line-height: 0.6rem;
  }
}
</style>
