import request from '@/utils/request'
/**
 *  设备诊断数据
 * @param {String} equipment_id 设备ID
 * @returns
 */
export const getFaultDiagnosisApi = equipment_id => {
   return request({
      method: 'POST',
      url: '/faultDiagnosis',
      // url: 'http://127.0.0.1:4523/m1/2242345-0-default/faultDiagnosis',
      data: {
         equipment_id,
      },
   })
}
/**
 * 设备诊断外部接口
 * @returns Promise
 */
export const getExternalFaultDiagnosisApi = () => {
   return request({
      method: 'GET',
      url: '/getFaultDiagnosis',
      // url: 'http://127.0.0.1:4523/m1/2242345-0-default/getFaultDiagnosis',
   })
}
