import request from '@/utils/request'
/**
 * 设备故障预测
 * @param {String} equipment_id 设备ID
 * @returns Promise
 */
export const getFaultPredictApi = equipment_id => {
   return request({
      method: 'POST',
      // url:"/faultPredict"
      url: 'http://127.0.0.1:4523/m1/2242345-0-default/faultPredict',
      data: {
         equipment_id,
      },
   })
}
/**
 * 频域分析
 * @param {Object} data
 * 设备ID	equipment_id	String
 * 位号	position_number	String
 * @returns
 */
export const getFrequencyDomainAnalysisApi = data => {
   return request({
      method: 'POST',
      // url: '/frequencyDomainAnalysis',
      url: 'http://127.0.0.1:4523/m1/2242345-0-default/frequencyDomainAnalysis',
      data,
   })
}
/**
 * 峭度分析
 * @param {Object} data 
 * 设备ID	equipment_id	String
   位号	position_number	String
   开始时间	start_time	String
   结束时间	end_time	String
   分析时间间隔	span	Float
 * @returns
 */
export const getKurtosisAnalysisApi = data => {
   return request({
      method: 'POST',
      url: 'http://127.0.0.1:4523/m1/2242345-0-default/kurtosisAnalysis',
      data,
   })
}
