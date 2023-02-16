import request from '@/utils/request'
/**
 * 获取组织机构
 * @returns Promise
 */
export const getOriginationApi = () => {
   return request({
      // url: '/getOrganizationTree',
      url: 'http://127.0.0.1:4523/m1/2242345-0-default/getOrganizationTree',
   })
}
/**
 * 获取模板位号
 * @param {Object} data
 * name
 * unit
 * @returns
 */
export const getModeBitApi = data => {
   return request({
      method: 'POST',
      url: '/getPositionList',
      data,
   })
}

/**
 * 新增设备实例
 * @param {Object} data 
 * equipment_attribute	String
equipment_type	List
equipment_tree	List
equipment_name	String
equipment_id	String
equipment_status	String
isopen	Int
position_number	Object
base_name	String
position_number	String
unit	String
position_type	String
online_show	Int
comprehensive_show	Int
upper	Float
lower	Float
 * @returns
 */
export const addEquipmentExampleApi = data => {
   return request({
      method: 'POST',
      url: '/addEquipmentExample',
      data,
   })
}
/**
 * 修改设备实例
 * @param {Object} data 
 * equipment_attribute	String
equipment_type	List
equipment_tree	List
equipment_name	String
equipment_id	String
equipment_status	String
isopen	Int
message_id	Int
position_number	List
base_name	String
position_number	String
unit	String
position_type	String
online_show	Int
comprehensive_show	Int
upper	Float
lower	Flaot
 * @returns 
 */
export const updateEquipmentExampleApi = data => {
   return request({
      method: 'POST',
      url: '/updateEquipmentExample',
      data,
   })
}
/**
 * 获取设备列表
 * @returns Promise
 */
export const getEquipmentListApi = data => {
   return request({
      method: 'POST',
      // url: '/getEquipmentList',
      url: 'http://127.0.0.1:4523/m1/2242345-0-default/getEquipmentList',
      data,
   })
}
/**
 * 获取设备实例
 * @param {String} equipment_id
 * @returns
 */
export const getEquipmentDetailApi = equipment_id => {
   return request({
      method: 'POST',
      // url: '/getEquipmentDetail',
      url: 'http://127.0.0.1:4523/m1/2242345-0-default/getEquipmentDetailApi',
      data: {
         equipment_id,
      },
   })
}
/**
 * 更改状态
 * @param {Object} data
 * {"equipment_id": "E101A", "isopen": 1}
 * @returns
 */
export const updateAlgorithmStatusApi = data => {
   return request({
      method: 'POST',
      url: '/updateAlgorithmStatus',
      data,
   })
}
/**
 * 删除设备实例
 * @param {String} equipment_id 设备id
 * @returns
 */
export const deleteEquipmentExampleApi = equipment_id => {
   return request({
      method: 'POST',
      url: '/deleteEquipmentExample',
      data: {
         equipment_id,
      },
   })
}
/**
 *
 * @returns
 */
export const getEquipmentType = () => {
   return request({})
}
