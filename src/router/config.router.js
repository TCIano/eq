export default [
   {
      name: '设备类型',
      path: 'typeOfEquipment',
      component: () => import('@/view/typeOfEquipment/index.vue'),
   },
   {
      name: '设备管理',
      path: 'equipmentManagement',
      component: () => import('@/view/eqManagement/index.vue'),
   },
   {
      name: '设备监控',
      path: 'equipmentMonitoring',
      component: () => import('@/view/eqMonitoring/index.vue'),
   },
   {
      name: '详细设备监控数据',
      // meta: { display: false },
      display: false,
      path: '/equipmentMonitoringData',
      component: () => import('@/view/eqMonitoring/eqMonitData.vue'),
   },
   {
      name: '设备故障预测',
      path: '/equipmentFailurePrediction',
      component: () => import('@/view/eqFailurePrediction/index.vue'),
   },
   {
      name: '设备故障诊断',
      path: '/equipmentFailureDiagnosis',
      component: () => import('@/view/eqFailureDiagnosis/index.vue'),
   },
]
