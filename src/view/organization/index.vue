<script>
import DrawerDialog from '@/components/DrawerDialog.vue'
import { getOrgApi } from '@/api/org'

export default {
  name: "Organization-com",
  components: { DrawerDialog },
  data() {
    return {
      tableHeight: `calc(100vh - 20px - 24px - 10px - (21 + 16 * 2)px - 20px)`,
      tableData: [],
      columns: [
        {
          title: '名称',
          key: 'name',
          dataIndex: 'name',
        },
        
        {
          title: '排序',
          key: 'sortNumber',
          dataIndex: 'sortNumber',
        },
        {
          title: '操作',
          width: 350,
          key: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
    }
  },
  methods: {
    onOpenDia() {
      this.$refs.dialog.show()
    },
    async getOrg() {
      this.tableData = [await getOrgApi().data]
    },
  },
  mounted() {
    this.getOrg()
    
  },
  created() {
  
  },
}

</script>

<template>
  <div class="equipmentOrg_wrapper">
    <div class="toolbar_wrapper">
      <a-space>
        <a-button icon="plus" size="small" type="primary" @click="onOpenDia"
        >新增
        </a-button>
      </a-space>
    </div>
    <div class="table_wrapper">
      <a-table
          :columns="columns"
          :dataSource="tableData"
          :defaultExpandAllRows="true"
          :pagination="false"
          :scroll="{ y: tableHeight }"
          bordered
          row-key="id"
      >
        <template slot="action" slot-scope="{ record }">
          <a-space>
            
            <a-button
                ghost
                icon="edit"
                size="small"
                type="primary"
                @click="onEdit(record)"
            >修改
            </a-button>
            <a-button
                icon="plus"
                size="small"
                @click="onAdd(record)"
            >添加
            </a-button>
            
            <a-popconfirm title="是否删除？" @confirm="onDelete(record)">
              <a-button danger icon="delete" size="small">删除</a-button>
            </a-popconfirm>
          </a-space>
        
        </template>
        <!--        <template #bodyCell="{ record, index, text, column }">-->
        <!--          <template v-if="column.key === 'nodeType'">-->
        <!--            <basic-tag :name="text" />-->
        <!--          </template>-->
        <!--          <template v-if="column.key === 'action'">-->
        <!--            <a-space>-->
        <!--              <a-button-->
        <!--                  :icon="edit"-->
        <!--                  ghost-->
        <!--                  size="small"-->
        <!--                  type="primary"-->
        <!--                  @click="onEdit(record)"-->
        <!--              >修改-->
        <!--              </a-button>-->
        <!--              <a-button-->
        <!--                  :disabled="record.nodeType === NodeType.DEVICE"-->
        <!--                  :icon="plus"-->
        <!--                  size="small"-->
        <!--                  @click="onAdd(record)"-->
        <!--              >添加-->
        <!--              </a-button>-->
        <!--              -->
        <!--              <a-popconfirm title="是否删除？" @confirm="onDelete(record)">-->
        <!--                <a-button :icon="DeleteOutlined" danger size="small">删除</a-button>-->
        <!--              </a-popconfirm>-->
        <!--            </a-space>-->
        <!--          </template>-->
        <!--        </template>-->
      </a-table>
    </div>
    <drawer-dialog ref="dialog">
      <template #content>
        <div>1212</div>
      </template>
    </drawer-dialog>
  </div>
</template>

<style lang="less" scoped>
.equipmentOrg_wrapper {
  .toolbar_wrapper {
    margin: 0 0 10px 0;
  }
  
  //.table_wrapper {
  //  //height: 100%;
  //}
}
</style>