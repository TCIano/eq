<script>
import DrawerDialog from '@/components/DrawerDialog.vue'
import { createOrgApi, deleteOrgApi, editOrgApi, getOrgApi } from '@/api/org'

export default {
  name: "Organization-com",
  components: { DrawerDialog },
  data() {
    return {
      tableHeight: `calc(100vh - 20px - 24px - 10px - (21 + 16 * 2)px - 20px)`,
      tableData: [],
      title: '',
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      options: [],
      fieldNames: {
        label: 'name',
        value: 'id',
        children: 'children',
      },
      formData: {
        name: '',
        parentId: '',
        sortNumber: 0,
        parentNodePath: [],
      },
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
      this.title = '增加'
    },
    //根据根节点获取树型数据中某个节点的路径
    getNodePath(node, isIncludeCurrentNode = false) {
      const pathList = this.getPathList(node)
      //在节点路径数组中重新查找当前节点所在的路径
      const currentPath = pathList.find(path => path.find(item => item === node))
      //去掉数组中的最后一个元素
      console.log(currentPath)
      return isIncludeCurrentNode ? currentPath : currentPath.slice(0, -1)
      
    },
    getPathList(currentNodeId) {
      const pathList = []
      const traverse = (node, path = []) => {
        path.push(node.id)
        if (node.id === currentNodeId) {
          return [...path]
        }
        if (node.children && node.children.length > 0) {
          for (const child of node.children) {
            const result = traverse(child, [...path])
            if (result) return result
          }
        }
        return null
      }
      this.tableData.forEach((item) => {
        pathList.push(traverse(item))
      })
      return pathList
    },
    async getOrg() {
      const { result } = await getOrgApi()
      this.tableData = [result]
      this.options = [result]
    },
    onEdit(record) {
      this.title = '修改'
      this.$refs.dialog.show()
      this.formData = {
        id: record.id,
        name: record.name,
        parentId: record.parentNode || '',
        sortNumber: record.sortNumber,
        parentNodePath: this.getNodePath(record.id),
      }
      
    },
    onAdd(record) {
      this.title = '增加'
      this.$refs.dialog.show()
      this.formData.parentNodePath = this.getNodePath(record.id, true)
    },
    reset() {
      this.formData = {
        id: '',
        name: '',
        parentId: '',
        sortNumber: 0,
        parentNodePath: [],
      }
    },
    async onConfirm() {
      if (this.title === '增加') {
        console.log(this.formData.parentNodePath)
        await createOrgApi({
          name: this.formData.name,
          fatherId: this.formData.parentNodePath.length
              ? this.formData.parentNodePath[this.formData.parentNodePath.length - 1]
              : '',
          sortNumber: this.formData.sortNumber,
        })
      } else {
        await editOrgApi({
          id: this.formData.id,
          name: this.formData.name,
          fatherId: this.formData.parentNodePath.length
              ? this.formData.parentNodePath[this.formData.parentNodePath.length - 1]
              : '',
          sortNumber: this.formData.sortNumber,
        })
        
      }
      await this.getOrg()
      this.reset()
      await this.$refs.dialog?.close()
    },
    async onDelete(record) {
      await deleteOrgApi(record.id)
      this.$message.success('删除成功')
      await this.getOrg()
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
          v-if="tableData && tableData.length > 0"
          :columns="columns"
          :dataSource="tableData"
          :defaultExpandAllRows="true"
          :pagination="false"
          :scroll="{ y: tableHeight }"
          bordered
          row-key="id"
      >
        <template slot="action" slot-scope="record">
          <a-space>
            <a-button
                ghost
                icon="edit"
                size="small"
                type="primary"
                @click="onEdit(record)"
            >
              修改
            </a-button>
            <a-button
                icon="plus"
                size="small"
                @click="onAdd(record)"
            >添加
            </a-button>
            
            <a-popconfirm title="是否删除？" @confirm="onDelete(record)">
              <a-button icon="delete" size="small" type="danger">删除</a-button>
            </a-popconfirm>
          </a-space>
        
        </template>
      
      </a-table>
    </div>
    <drawer-dialog ref="dialog" :title="title" :width="500" @cancel="reset" @confirm="onConfirm">
      <template #content>
        <a-form
            ref="facForm"
            :label-col="labelCol"
            :model="formData"
            :wrapper-col="wrapperCol"
        >
          <a-form-item label="父节点">
            <a-cascader
                v-model="formData.parentNodePath"
                :fieldNames="fieldNames"
                :options="options"
                change-on-select
                placeholder="请选择父节点"
            >
            </a-cascader>
          </a-form-item>
          <a-form-item
              :rules="[{ required: true, trigger: 'blur' }]"
              label="工厂节点名称"
              name="name"
          >
            <a-input v-model="formData.name" placeholder="请输入工厂节点名称"></a-input>
          </a-form-item>
          
          
          <a-form-item label="排序">
            <a-input-number
                v-model.number="formData.sortNumber"
                :min="0"
                placeholder="请输入节点排序"
                style="width: 100%"
            ></a-input-number>
          </a-form-item>
        </a-form>
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