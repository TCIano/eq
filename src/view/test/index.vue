<template>
  <a-table
      :columns="columns"
      :data-source="data"
      :pagination="{
            pageSize: 7,
      }"
      rowKey="position_number"
  >
    <template slot="name" slot-scope="text">
      {{ text.name || text.position_name }}
    </template>
    <template slot="action" slot-scope="text">
      <img
          v-if="text.comprehensive_analysis"
          alt=""
          src="@/assets/img/parameAnalysis.svg"
          style="width: 35px; cursor: pointer"
          @click="openModal(text.position_number, text.position_name)"
      />
    </template>
    <template slot="value" slot-scope="text">
      {{ text.value + ' ' + text.unit }}
    </template>
  </a-table>
</template>
<script>
const columns = [
  {
    // dataIndex: 'name',
    key: 'name',
    align: 'center',
    title: '参数',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '状态或位号值',
    align: 'center',
    key: 'value',
    scopedSlots: { customRender: 'value' },
  },
  
  {
    title: '',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];

const data = [
  {
    "comprehensive_analysis": 0,
    "name": "设备状态",
    "number": "",
    "time_domain": 0,
    "unit": "",
    "value": "运行中",
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "吸气温度",
    "position_number": "Yth_COMMUCD10",
    "time_domain": 0,
    "unit": "℃",
    "value": -15.7,
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "排气温度",
    "position_number": "Yth_COMMUCD11",
    "time_domain": 0,
    "unit": "℃",
    "value": 54.4,
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "喷油温度",
    "position_number": "Yth_COMMUCD12",
    "time_domain": 0,
    "unit": "℃",
    "value": 34.7,
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "油分温度",
    "position_number": "Yth_COMMUCD13",
    "time_domain": 0,
    "unit": "℃",
    "value": 47.8,
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "蒸汽器出口温度",
    "position_number": "Yth_COMMUCD14",
    "time_domain": 0,
    "unit": "℃",
    "value": {
      "source": "0.0",
      "parsedValue": 0,
    },
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "经济器补气温度",
    "position_number": "Yth_COMMUCD15",
    "time_domain": 0,
    "unit": "℃",
    "value": 27.6,
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "电机轴伸端轴承温度",
    "position_number": "Yth_COMMUCD16",
    "time_domain": 0,
    "unit": "℃",
    "value": 33.8,
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "电机非轴伸端轴承温度",
    "position_number": "Yth_COMMUCD17",
    "time_domain": 0,
    "unit": "℃",
    "value": 50.3,
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "电机1#绕组温度",
    "position_number": "Yth_COMMUCD18",
    "time_domain": 0,
    "unit": "℃",
    "value": 74.6,
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "电机2#绕组温度",
    "position_number": "Yth_COMMUCD19",
    "time_domain": 0,
    "unit": "℃",
    "value": 74.8,
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "电机3#绕组温度",
    "position_number": "Yth_COMMUCD20",
    "time_domain": 0,
    "unit": "℃",
    "value": 73.4,
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "压缩机1#吸气端轴承温度",
    "position_number": "Yth_COMMUCD21",
    "time_domain": 0,
    "unit": "℃",
    "value": {
      "source": "0.0",
      "parsedValue": 0,
    },
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "压缩机2#吸气端轴承温度",
    "position_number": "Yth_COMMUCD22",
    "time_domain": 0,
    "unit": "℃",
    "value": {
      "source": "0.0",
      "parsedValue": 0,
    },
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "压缩机排气端轴承温度",
    "position_number": "Yth_COMMUCD23",
    "time_domain": 0,
    "unit": "℃",
    "value": {
      "source": "0.0",
      "parsedValue": 0,
    },
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "冷凝温度",
    "position_number": "Yth_COMMUCD25",
    "time_domain": 0,
    "unit": "℃",
    "value": 31.5,
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "吸气过热度",
    "position_number": "Yth_COMMUCD26",
    "time_domain": 0,
    "unit": "℃",
    "value": 1.8,
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "蒸发器进口温度",
    "position_number": "Yth_COMMUCD28",
    "time_domain": 0,
    "unit": "℃",
    "value": {
      "source": "0.0",
      "parsedValue": 0,
    },
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "冷凝器出口温度",
    "position_number": "Yth_COMMUCD29",
    "time_domain": 0,
    "unit": "℃",
    "value": {
      "source": "0.0",
      "parsedValue": 0,
    },
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "冷凝器进口温度",
    "position_number": "Yth_COMMUCD30",
    "time_domain": 0,
    "unit": "℃",
    "value": {
      "source": "0.0",
      "parsedValue": 0,
    },
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "蒸发温度",
    "position_number": "Yth_COMMUCD24",
    "time_domain": 0,
    "unit": "℃",
    "value": -17.5,
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "吸气压力",
    "position_number": "Yth_COMMUCD01",
    "time_domain": 0,
    "unit": "bar",
    "value": 1.72,
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "排气压力",
    "position_number": "Yth_COMMUCD02",
    "time_domain": 0,
    "unit": "bar",
    "value": 11.41,
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "喷油压力",
    "position_number": "Yth_COMMUCD03",
    "time_domain": 0,
    "unit": "bar",
    "value": 10.98,
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "精过滤器前压力",
    "position_number": "Yth_COMMUCD04",
    "time_domain": 0,
    "unit": "bar",
    "value": 11.05,
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "经济器补气压力",
    "position_number": "Yth_COMMUCD05",
    "time_domain": 0,
    "unit": "bar",
    "value": 3.02,
  },
  {
    "comprehensive_analysis": 1,
    "position_name": "电机电流",
    "position_number": "Yth_S12_B0493",
    "time_domain": 0,
    "unit": "A",
    "value": {
      "source": "24.0",
      "parsedValue": 24,
    },
  },
];

export default {
  name: 'index00',
  data() {
    return {
      data,
      columns,
    };
  },
};
</script>
