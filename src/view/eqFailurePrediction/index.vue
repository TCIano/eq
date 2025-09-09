<template>
  <div>
    <a-row align="middle" justify="end" type="flex">
      <a-col>
        <a-form layout="inline" style="width: 550px">
          <a-form-item label="设备节点">
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
    <fault-prediction ref="faultPre" :equipment_id="eq" theme="" />
  </div>
</template>

<script>
import faultPrediction from '../eqMonitoring/components/faultPrediction.vue'
import { getExternalFaultPredictApi } from '@/api/eqPredict'
import { mixin } from '@/mixins/mixins'

export default {
  name: 'eqFailurePre',
  mixins: [mixin],
  components: { faultPrediction },
  data() {
    return {
      frePositionNumber: [],
      kurPositionNumber: [],
    }
  },
  methods: {
    //获取外部设备预测
    async getExternalFaultPredict() {
      const { result } = await getExternalFaultPredictApi()
      if (result) {
        this.handleTreeNode(result)
        this.$refs.faultPre.handleOption(result)
      }
    },
    async reSearch() {
      this.$refs.faultPre.getFaultPredict()
      // this.$refs.faultPre.reGetKurtosis()
    },
    reset() {
      this.reSetTreeNode()
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.faultPre.getFaultPredict()
    })
    // this.getExternalFaultPredict()
  },
}
</script>

<style scoped></style>
