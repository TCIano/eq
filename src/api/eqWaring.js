import request from '@/utils/request'
/**
 * 获取设备维修列表
 * @param {Object} data
 * page int 页数
 * status int 状态
 * @returns
 */
export const getWarningListApi = ({
   equipment_id = '',
   page = 0,
   amount = 9,
   processed = null,
   equipment_tree = [],
   filtration = '',
}) => {
   return request({
      method: 'POST',
      url: '/getWarningList',
      // url: 'http://127.0.0.1:4523/m1/2242345-0-default/getWarningList',
      data: {
         equipment_id,
         page,
         processed,
         amount,
         filtration,
      },
   })
}
/**
 * 设备维修详情
 * @param {Number} fault_id  设备维修ID
 * @returns
 */
export const getWarningDetailApi = fault_id => {
   return request({
      method: 'POST',
      url: '/warningDetail',
      // url: 'http://127.0.0.1:4523/m1/2242345-0-default/warningDetail',
      data: {
         fault_id,
      },
   })
}
/**
 * 设备故障预测统计
 * @param {Object} data
 * 组织机构	equipment_tree	List(String)
 * 月份	month	String
 * @returns Promise
 */
export const getWarningStatisticsApi = ({ month = '', equipment_tree = [], filtration = '' }) => {
   return request({
      method: 'POST',
      url: '/warningStatistics',
      // url: 'http://127.0.0.1:4523/m1/2242345-0-default/warningStatistics',
      data: {
         month,
         equipment_tree,
         filtration,
      },
   })
}
