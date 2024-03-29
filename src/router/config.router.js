export default [
   {
      name: '设备类型',
      path: 'typeOfEquipment',
      keepAlive: false,
      component: () => import('@/view/typeOfEquipment/index.vue'),
   },
   {
      name: '设备管理',
      path: 'equipmentManagement',
      keepAlive: false,
      icon: 'message',
      component: () => import('@/view/eqManagement/index.vue'),
   },
   {
      name: '设备监控',
      keepAlive: false,
      path: 'equipmentMonitoring',
      component: () => import('@/view/eqMonitoring/index.vue'),
   },
   {
      name: '详细设备监控数据',
      keepAlive: false,
      //     display: false },
      display: false,
      path: '/equipmentMonitoringData',
      component: () => import('@/view/eqMonitoring/eqMonitData.vue'),
   },
   {
      name: '设备故障预测',
      path: '/equipmentFailurePrediction',
      keepAlive: false,
      component: () => import('@/view/eqFailurePrediction/index.vue'),
   },
   {
      name: '设备故障诊断',
      path: '/equipmentFailureDiagnosis',
      keepAlive: false,
      component: () => import('@/view/eqFailureDiagnosis/index.vue'),
   },
   {
      display: false,
      name: '设备管理增加修改',
      path: '/equipmentManagementHandle',
      keepAlive: false,
      component: () => import('@/view/eqManagement/components/eqManageHandle.vue'),
   },
   {
      display: false,
      name: '设备训练',
      path: '/equipmentTrain',
      keepAlive: true,
      component: () => import('@/view/eqManagement/components/eqTrain.vue'),
   },
   {
      name: '设备维修预警',
      path: '/equipmentMaintenance',
      keepAlive: false,
      component: () => import('@/view/eqMaintenance'),
   },
   {
      display: false,
      name: '设备维修预警详情',
      path: '/equipmentMaintenanceDetail',
      keepAlive: false,
      component: () => import('@/view/eqMaintenance/eqMaintenanceDetail'),
   },
   {
      name: '设备故障预测统计',
      path: '/equipmentWaringStatic',
      keepAlive: false,
      component: () => import('@/view/eqWaringStatic'),
   },
]
