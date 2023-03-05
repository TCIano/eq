import request from '@/utils/request'

/**
 * 获取设备类型列表
 * @returns Promise
 */
export const getEqTypeListApi = ({ page = 1, amount = 10, filtration = '' }) => {
   return request({
      method: 'POST',
      url: '/getEquipmentType',
      data: {
         page,
         amount,
         filtration,
      },
   })
}
/**
 * 新增设备类型
 * @param {Object} data
 * equipment_attribute	String
 * equipment_type	List(String)
 * position_number	Object
 * base_name	String
 * unit	String
 * wave_spectrum	Int
 * time_domain	Int
 * frequency_domain	Int
 * @returns Promise
 */
export const addEqTypeApi = data => {
   return request({
      method: 'POST',
      url: '/addEquipmentMessage',
      data,
   })
}
/**
 *
 * @param {Object} data 
 * 模板ID	id	Int
设备属性	equipment_attribute	String
设备类型	equipment_type	List(String)
位号	position_number	Object
位号ID	base_id	Int
位号类型	base_name	String
位号单位	unit	String
波形分析	wave_spectrum	Int
时域分析	time_domain	Int
频域分析	frequency_domain	Int
 * @returns Promise
 */
export const editEqTypeApi = data => {
   return request({
      method: 'POST',
      url: '/updateEquipmentType',
      data,
   })
}
/**
 * 根据设备属性和类型确定位号
 * @param {Object} data
 * equipment_attribute	String
equipment_type	List(String)
 * @returns
 */
export const getEqbitNameApi = data => {
   return request({
      method: 'POST',
      url: '/getEquipmentMessage',
      data,
   })
}
export const deleteEquipmentTypeApi = id => {
   return request({
      method: 'POST',
      url: '/deleteEquipmentType',
      data: {
         id,
      },
   })
}
/**
 * 获取设备属性和设备类型
 * @returns Promise
 */
export const getEquipInitMessageApi = () => {
   return request({
      url: '/message',
   })
}
/**
 * 获取所有的位号
 * @returns Promise
 */
export const getBaseNameApi = () => {
   return request({
      url: '/getBaseName',
   })
}
