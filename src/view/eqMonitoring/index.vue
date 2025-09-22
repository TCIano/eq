<template>
  <div class="eq-monit">
    <div class="topColumn">
      <a-row justify="space-between" style="padding: 5px" type="flex">
        <a-col>
          <a-space>
            <a-space v-for="item in warning" :key="item.name">
              <span>{{ item.name }}</span>
              <span
                  :id="
                           item.name === '正常'
                              ? 'successLabel'
                              : item.name === '报警'
                              ? 'errorLabel'
                              : 'waringLabel'
                        "
              >
                        {{ item.count || 0 }}
                     </span>
              <a-divider id="divider" type="vertical" />
            </a-space>
          </a-space>
        </a-col>
        <a-col>
          <a-space>
            <a-space>
              <span>当日报警</span>
              <span id="errorLabel">{{ warning_message?.today || 0 }}</span>
              <a-divider id="divider" type="vertical" />
            </a-space>
            <a-space>
              <span>未处理</span>
              <span id="waringLabel">{{ warning_message?.unprocessed || 0 }}</span>
            </a-space>
          </a-space>
        </a-col>
      </a-row>
    </div>
    <div class="eqMain">
      <a-row>
        <a-col :span="5">
          <a-card :bordered="false" class="eq-device-scroll-page">
            <a-input-search
                allowClear
                placeholder="请输入组织机构名称"
                style="margin-bottom: 8px"
                @change="onChange"
            />
            <a-tree
                :auto-expand-parent="autoExpandParent"
                :expanded-keys="expandedKeys"
                :replaceFields="{ children: 'children', title: 'name', key: 'id' }" :tree-data="gData"
                @expand="onExpand"
                @select="select"
            >
              <template slot="title" slot-scope="{ name }">
                        <span v-if="name.indexOf(searchValue) > -1">
                           {{ name.substr(0, name.indexOf(searchValue)) }}
                           <span style="color: red">{{ searchValue }}</span>
                           {{ name.substr(name.indexOf(searchValue) + searchValue.length) }}
                        </span>
                <span v-else>{{ name }}</span>
              </template>
            </a-tree>
          </a-card>
        </a-col>
        <a-col :span="19">
          <a-card :bordered="false" class="eq-device-scroll-page">
            <!-- <a-row :gutter="15"> -->
            <!-- 设备监控列表 -->
            <eq-list ref="eqInfo" :eqInfo="eqInfo" />
            <!-- 分页 -->
            <!-- </a-row> -->
            <a-pagination
                v-if="eqInfo.length > 0"
                :current="currentPage"
                :default-current="1"
                :defaultPageSize="8"
                :page-size="pageSize"
                :total="total_amount"
                class="item-pagination"
                show-quick-jumper
                @change="pageChange"
            />
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import eqList from './components/eqList.vue'
import { getEquipmentMonitorApi } from '@/api/eqMonitor'
import { oriMixins } from '@/mixins/oriMixins'

export default {
  mixins: [oriMixins],
  components: { eqList },
  name: 'demo1',
  data() {
    return {
      total_amount: 0,
      currentPage: 1,
      pageSize: 8,
      eqInfo: [],
      warning_message: {},
      equipment_tree: '',
      warning: [], //报警信息
    }
  },
  methods: {
    async getEquipmentMonitor() {
      const {
        result: {
          equipment: { datas, total_amount },
          warning,
          warning_message,
        },
      } = await getEquipmentMonitorApi({
        page: this.currentPage,
        org_id: this.equipment_tree,
      })
      this.total_amount = total_amount
      this.eqInfo = datas
      // this.eqInfo = equipment
      this.warning_message = warning_message
      this.warning = warning
    },
    
    pageChange(page) {
      this.currentPage = page
      this.getEquipmentMonitor()
    },
    //给数据添加属性
    filterTreeData(arr) {
      arr.forEach(element => {
        element.scopedSlots = { title: 'title' }
        element.title = element.name
        element.key = element.id
        if (element.children) {
          this.filterTreeData(element.children)
        }
      })
      return arr
    },
    //获取设备详情
    getEqDetail(item) {
      console.log(item)
    },
    select(key, e) {
      this.equipment_tree = key[0]
      this.getEquipmentMonitor()
    },
  },
  
  created() {
    this.getOrigination()
    this.getEquipmentMonitor()
  },
}
</script>
<style lang="less" scoped>
.eq-monit {
  z-index: 999;
  background-image: url('@/assets/img/eqbg.jpg');
  
  .topColumn {
    border-bottom: 1px solid #30917f;
    padding: 0px 15px;
    // border-bottom: 1px solid #30917f;
    span {
      color: white;
      font-size: 0.4rem;
      font-weight: 600;
    }
    
    #divider {
      width: 2px;
      height: 20px;
    }
  }
  
  .eqMain {
    ::v-deep .ant-card {
      color: white;
      background: transparent;
      border-color: #30917f;
      
      .ant-input {
        color: white;
        background: transparent;
      }
      
      .ant-card-body {
        .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
          background: #326986;
        }
        
        .ant-card-actions {
          background: transparent;
        }
        
        .ant-card-meta-detail {
          .ant-card-meta-title {
            color: white;
          }
          
          .ant-card-meta-description {
            color: white;
          }
        }
        
        span {
          background: transparent;
          color: white;
        }
      }
    }
  }
  
  ::v-deep .ant-pagination-options-quick-jumper {
    color: white;
  }
}
</style>
