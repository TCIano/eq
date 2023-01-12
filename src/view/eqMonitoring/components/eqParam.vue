<template>
   <a-card>
      <div slot="title" style="display: flex; align-items: center">
         <a-icon type="pause" style="font-size: 20px" />
         <span>设备参数</span>
      </div>
      <a-table :columns="columns" :data-source="data" :pagination="false">
         <template slot="action">
            <img
               src="@/assets/img/parameAnalysis.svg"
               alt=""
               style="width: 35px; cursor: pointer"
               @click="openModal"
            />
         </template>
      </a-table>
      <!-- 参数分析弹窗 -->
      <a-modal
         title="title"
         :visible="visible"
         centered
         @cancel="closeModal"
         @ok="getAnaData"
         v-if="visible"
      >
         <!-- 表单 -->
         <a-form-model ref="form" :model="form">
            <a-form-model-item label="分析时间" :label-col="labelCol" :wrapper-col="wrapperCol">
               <a-range-picker :format="dateFormat" allowClear v-model="time" show-time>
                  <a-icon slot="suffixIcon" type="calendar" style="color: white" />
               </a-range-picker>
            </a-form-model-item>
         </a-form-model>
         <a-form :layout="form.layout" :model="form">
            <a-row :gutter="24">
               <a-col :span="12" v-for="item in form.result" :key="item.key">
                  <a-form-item :label="item.key">
                     <a-input placeholder="请输入" v-model="item.value"></a-input>
                  </a-form-item>
               </a-col>
            </a-row>
         </a-form>
         <template slot="footer">
            <a-button type="primary" icon="calculator">分析</a-button>
         </template>
      </a-modal>
   </a-card>
</template>

<script>
import moment from 'moment'

const columns = [
   {
      dataIndex: 'name',
      key: 'name',
      title: 'Name',
   },
   {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
   },
   {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
   },
   {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
   },
   {
      title: 'Action',
      key: 'action',
      scopedSlots: { customRender: 'action' },
   },
]

const data = [
   {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
   },
   {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
   },
   {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
   },
]
export default {
   data() {
      return {
         columns,
         data,
         visible: false,
         labelCol: { span: 4 },
         wrapperCol: {
            span: 20,
         },
         form: {
            layout: 'inline',
            result: [
               { key: '峰值', value: 120 },
               { key: '峰值1', value: 120 },
               { key: '峰值2', value: 120 },
            ],
         },
         dateFormat: 'YYYY-MM-DD HH:mm:ss',
         currentTime: new Date(),
         // wrapperCol: { span: 14 },
      }
   },
   computed: {
      formItemLayout() {
         return {}
      },
      time() {
         return [
            moment(moment(this.currentTime).subtract(3, 'hours').format(this.dateFormat)), //moment写法获取前三个小时
            moment(moment(this.currentTime).subtract(0, 'hours').format(this.dateFormat)),
         ]
      },
   },
   methods: {
      moment,
      openModal() {
         this.visible = true
         this.currentTime = new Date()
         this.getAnaData()
      },
      closeModal() {
         this.visible = false
      },
      //获取波形参数分析分析结果
      getAnaData() {
         console.log('get')
      },
   },
}
</script>

<style scoped lang="less">
// @import 'ant-design-vue/dist/antd.dark.less';
.ant-card {
   opacity: 0.9;
   color: white;
   background: #081d3d;
   //    border: none;
   border: 2px solid #386b8a;

   ::v-deep .ant-card-head {
      border-bottom: 2px solid #386b8a;
      .ant-card-head-title {
         color: white;
      }
   }
   ::v-deep .ant-card-body {
      .ant-table-content {
         .ant-table-thead,
         .ant-table-tbody {
            background: #081d3d;
         }
         .ant-table-thead > tr > th,
         .ant-table-tbody > tr > td {
            background: transparent;
            color: white;
            border-bottom: 2px solid #386b8a;
         }
         .ant-table-tbody > tr:hover {
            background: rgb(131, 129, 129);
            opacity: 0.5;
         }
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
         color: white;
      }
   }
}
/deep/.ant-modal {
   background: transparent;
   .ant-modal-content {
      background: rgba(41, 44, 52, 0.9);
      color: white;
      .ant-modal-close {
         color: white;
      }
      .ant-modal-footer {
         border-top: none;
      }
      .ant-modal-body {
         label {
            color: white;
         }
         .ant-calendar-picker-input.ant-input {
            background: transparent;
            border: 1px solid #47d6d7;
            color: white;
         }
         .ant-calendar {
            color: white;
            background-color: #141414 !important;
            border: 1px solid #141414;
            // -webkit-box-shadow: 0 2px 8px rgb(255 255 255 / 15%);
            // box-shadow: 0 2px 8px rgb(255 255 255 / 15%);
         }
         .ant-input {
            border: 1px solid #47d6d7;
            color: white;
            background: transparent;
         }
         .ant-input:hover {
            border: 1px solid #386b8a;
         }
      }
      .ant-modal-header {
         border-bottom: none;
         //  background: #323335;
         background: rgba(50, 51, 53, 0.9);
         .ant-modal-title {
            color: white;
         }
      }
   }
}
</style>
