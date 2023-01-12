<template>
   <div>
      <a-col :span="6" v-for="(item, index) in eqInfo.length ? eqInfo : 20" :key="item">
         <a-card
            class="eq-list"
            style="width: 300px; margin-bottom: 15px"
            :headStyle="{ border: 'none' }"
            @click="getEqDetail(index)"
         >
            <div slot="title" style="display: flex; justify-content: center; align-items: center">
               <div id="success"></div>
               <span class="eq-title">鼓风机</span>
            </div>
            <img
               slot="cover"
               alt="example"
               src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
               style="width: 150px; height: 150px; margin: 0 auto"
            />
            <a-card-meta>
               <template slot="description">
                  <a-row :gutter="50" type="flex" align="middle" justify="center" class="row">
                     <a-col><span>温度</span></a-col>
                     <a-col><span>56摄氏度</span></a-col>
                  </a-row>
               </template>
            </a-card-meta>
         </a-card>
      </a-col>
      <!-- 分页 -->
      <a-pagination :default-current="1" :total="500" class="item-pagination" />
   </div>
</template>

<script>
export default {
   props: {
      eqInfo: {
         type: Array,
      },
   },
   data() {
      return {}
   },
   methods: {
      getEqDetail(id) {
         this.$router.push({
            path: '/equipmentMonitoringData',
            query: {
               id,
            },
         })
      },
   },
   created() {},
}
</script>

<style scoped lang="less">
.eq-list {
   cursor: pointer;
   .eq-title {
      font-size: 25px;
      margin-left: 10px;
      font-weight: 700;
   }
   .row {
      background: url('@/assets/img/attribute.svg') no-repeat center;
      background-size: contain;
      padding-bottom: 5px;
      .ant-col {
         margin: 7px;
      }
   }
   span {
      font-weight: 700;
      font-size: 20px;
   }
}
</style>
