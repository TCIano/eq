<template>
  <div>
    <!-- 顶部操作栏 -->
    <a-row align="middle" justify="space-between" type="flex">
      <a-row>
        <a-space>
          <a-button icon="plus" type="primary" @click="addBaseName">新增</a-button>
        </a-space>
      </a-row>
      <a-row>
        <a-space>
          <a-input v-model="pagination.filtration" placeholder="请输入关键字查询"></a-input>
          <a-button icon="search" type="primary" @click="search">搜索</a-button>
          <a-button icon="sync" @click="reset">重置</a-button>
        </a-space>
      </a-row>
    </a-row>
    
    <!-- 数据表格 -->
    <a-row>
      <a-table 
        :columns="columns" 
        :data-source="baseNameData" 
        :pagination="pagination" 
        bordered 
        row-key="id"
        style="margin-top: 10px" 
        @change="onChangePage"
      >
        <template slot="name" slot-scope="text">
          <span>{{ text }}</span>
        </template>
        <template slot="type" slot-scope="text">
          <span>{{ text }}</span>
        </template>
        <template slot="description" slot-scope="text">
          <span>{{ text || '-' }}</span>
        </template>
        <template slot="status" slot-scope="text">
          <a-tag :color="text === '启用' ? 'green' : 'red'">
            {{ text }}
          </a-tag>
        </template>
        <template slot="action" slot-scope="text, record">
          <a-space>
            <a href="#" @click="editBaseName(record)">编辑</a>
            <a-popconfirm 
              cancel-text="取消" 
              ok-text="确定" 
              title="是否删除？" 
              @confirm="deleteBaseName(record.id)"
            >
              <a href="#" style="color: red">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-row>
    
    <!-- 新增/编辑弹窗 -->
    <base-name-modal 
      v-if="modalVisible" 
      :form-data="formData" 
      :title="title" 
      :visible.sync="modalVisible"
      @handleBaseName="handleBaseName" 
      @reGetBaseNameList="reGetBaseNameList" 
    />
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import BaseNameModal from './components/baseNameModal.vue'
import { 
  getBaseNameListApi, 
  addBaseNameApi, 
  editBaseNameApi, 
  deleteBaseNameApi 
} from '@/api/baseName'

export default {
  name: 'BaseName',
  components: { BaseNameModal },
  data() {
    return {
      formData: {},
      keyName: '',
      modalVisible: false,
      title: '',
      columns: [
        {
          key: 'name',
          align: 'center',
          title: '基础数据名称',
          width: '20%',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          key: 'type',
          align: 'center',
          title: '数据类型',
          width: '15%',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },
        },
        {
          key: 'description',
          align: 'center',
          title: '描述',
          width: '35%',
          dataIndex: 'description',
          scopedSlots: { customRender: 'description' },
        },
        {
          key: 'status',
          align: 'center',
          title: '状态',
          width: '15%',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          key: 'action',
          align: 'center',
          title: '操作',
          width: '15%',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],
      baseNameData: [],
      pagination: {
        total: 0,
        current: 1,
        defaultCurrent: 1,
        pageSize: 10,
        showSizeChanger: true,
        filtration: '',
      },
    }
  },
  methods: {
    /**
     * 分页变化处理
     * @param {Object} pagination 分页信息
     */
    onChangePage(pagination) {
      this.pagination = { ...pagination }
      this.getBaseNameList()
    },
    
    /**
     * 获取基础数据列表
     * @param {String} filtration 过滤关键字
     */
    async getBaseNameList(filtration) {
      try {
        let { current, pageSize } = this.pagination
        const params = {
          current,
          pageSize,
          filtration: filtration || this.keyName
        }
        
        const response = await getBaseNameListApi(params)
        
        if (response && response.result) {
          this.pagination.total = response.result.total_amount || 0
          this.baseNameData = response.result.datas || []
        } else {
          // 如果API未实现，使用模拟数据
          const mockData = {
            result: {
              datas: [
                {
                  id: 1,
                  name: '温度传感器',
                  type: '传感器',
                  description: '用于监测设备温度的传感器',
                  status: '启用',
                  createTime: '2024-01-15 10:30:00'
                },
                {
                  id: 2,
                  name: '压力传感器',
                  type: '传感器',
                  description: '用于监测设备压力的传感器',
                  status: '启用',
                  createTime: '2024-01-16 14:20:00'
                },
                {
                  id: 3,
                  name: '振动传感器',
                  type: '传感器',
                  description: '用于监测设备振动的传感器',
                  status: '禁用',
                  createTime: '2024-01-17 09:15:00'
                }
              ],
              total_amount: 3
            }
          }
          this.pagination.total = mockData.result.total_amount
          this.baseNameData = mockData.result.datas
        }
      } catch (error) {
        this.$message.error('获取数据失败')
        console.error('获取基础数据列表失败:', error)
        
        // 错误时使用模拟数据
        const mockData = {
          result: {
            datas: [
              {
                id: 1,
                name: '温度传感器',
                type: '传感器',
                description: '用于监测设备温度的传感器',
                status: '启用',
                createTime: '2024-01-15 10:30:00'
              }
            ],
            total_amount: 1
          }
        }
        this.pagination.total = mockData.result.total_amount
        this.baseNameData = mockData.result.datas
      }
    },
    
    /**
     * 搜索功能
     */
    search() {
      this.keyName = this.pagination.filtration
      this.getBaseNameList(this.pagination.filtration)
    },
    
    /**
     * 重置搜索
     */
    reset() {
      this.pagination.filtration = ''
      this.keyName = ''
      this.getBaseNameList()
    },
    
    /**
     * 新增基础数据
     */
    addBaseName() {
      this.title = '新增'
      this.modalVisible = true
      this.formData = {
        name: '',
        type: '',
        description: '',
        status: '启用'
      }
    },
    
    /**
     * 处理新增/编辑基础数据
     * @param {Object} param 表单数据
     * @param {String} title 操作类型
     */
    async handleBaseName(param, title) {
      try {
        if (title === '新增') {
          await addBaseNameApi(param)
        } else {
          await editBaseNameApi(param)
        }
        this.$message.success(title + '成功')
        this.modalVisible = false
        this.getBaseNameList()
      } catch (error) {
        this.$message.error(title + '失败')
        console.error('处理基础数据失败:', error)
      }
    },
    
    /**
     * 编辑基础数据
     * @param {Object} record 记录数据
     */
    editBaseName(record) {
      this.title = '修改'
      this.modalVisible = true
      this.formData = deepClone(record)
    },
    
    /**
     * 删除基础数据
     * @param {Number} id 数据ID
     */
    async deleteBaseName(id) {
      try {
        await deleteBaseNameApi(id)
        this.$message.success('删除成功')
        this.getBaseNameList()
      } catch (error) {
        this.$message.error('删除失败')
        console.error('删除基础数据失败:', error)
      }
    },
    
    /**
     * 重新获取基础数据列表
     */
    reGetBaseNameList() {
      this.getBaseNameList()
    }
  },
  
  created() {
    this.getBaseNameList()
  }
}
</script>

<style lang="less" scoped>
// 可以根据需要添加样式
</style>