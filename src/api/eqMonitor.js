import request from '@/utils/request'
/**
 * 获取监控列表
 * @param {Object} data
 * @returns
 */
export const getEquipmentMonitorApi = ({ page = 0, amount = 9, filtration = [] }) => {
   return request({
      method: 'POST',
      url: '/getEquipmentMonitor',
      // url: 'http://127.0.0.1:4523/m1/2242345-0-default/getEquipmentMonitor',
      data: {
         amount,
         page,
         filtration,
      },
   })
}
/**
 * 设备综合监控
 * @param {Object} equipment_id 设备ID
 * equipment_id	String
 * @returns Promise
 */
export const getComprehensiveMonitorApi = equipment_id => {
   return request({
      method: 'POST',
      url: '/getComprehensiveMonitor',
      // url: 'http://127.0.0.1:4523/m1/2242345-0-default/getComprehensiveMonitor',
      data: {
         equipment_id,
      },
   })
}

/**
 * 波形参数分析
 * @param {Object} data
 * 设备ID	equipment_id	String
 * 位号	position_number	String
开始时间	start_time	String
结束时间	end_time	String
 * @returns
 */
export const getWaveShapeAnalysisApi = data => {
   return request({
      method: 'POST',
      url: '/waveShapeAnalysis',
      // url: 'http://127.0.0.1:4523/m1/2242345-0-default/waveShapeAnalysis',
      data,
   })
}
/**
 * 时域分析
 * @param {Object} data 
 * 设备ID	equipment_id	String	
   位号	position_number	String	
   滤波信息	wave_filter	Object	
   滤波类型	type	String	带通滤波就是低通滤波加高通滤波
   低通滤波值	low_value	Float	小于0.5
   高通滤波值	high_value	Float	小于0.5
 * @returns
 */
export const getTimeDomainAnalysisApi = data => {
   return request({
      method: 'POST',
      url: '/timeDomainAnalysis',
      // url: 'http://127.0.0.1:4523/m1/2242345-0-default/timeDomainAnalysis',
      data,
   })
}
