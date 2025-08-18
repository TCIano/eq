import request from '@/utils/request'
import { EQ } from '@/api/index'

/**
 * 获取组织机构
 * @returns Promise
 */
export const getOriginationApi = () => {
  return request({
    url: '/getOrgTree',
    // url: 'http://127.0.0.1:4523/m1/2242345-0-default/getOrganizationTree',
  })
}
/**
 * 获取设备名称
 * @param {Object} data
 "depart":"乙炔车间",          组织
 *  "equipMajorDIC":"动设备",   设备属性
 "equipType": ""           设备类型
 * @returns
 */
export const getEqNameApi = ({
  section = '',
  equipMajorDIC = '',
  depart = '',
  equipType = '',
}) => {
  return request({
    method: 'POST',
    url: '/message/equipMessage',
    data: {
      depart,
      section,
      equipMajorDIC,
      equipType,
    },
  })
}
/**
 * 根据组织机构获取设备列表
 * @param org_id 组织机构ID
 * @param attribute_id 设备属性ID
 * @returns {Promise<axios.AxiosResponse<any>> | *}
 */
export const getExampleListApi = (org_id, attribute_id) => {
  return request({
    method: 'POST',
    url: '/getExampleList',
    data: {
      org_id,
      attribute_id,
    },
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
    // url: '/getPositionList',
    url: '/getBaseTagsByType',
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
    url: EQ + '/updateEquipmentExample',
    data,
  })
}
/**
 * 获取设备实例
 * @param {Object} data
 * page int 当前页
 * amount int 每页多少条
 * equipment_tree list 设备树
 * @returns
 */
export const getEquipmentListApi = ({
  page = 0,
  amount = 0,
  org_id = '',
}) => {
  return request({
    method: 'POST',
    url: EQ + '/getEquipmentList',
    // url: 'http://127.0.0.1:4523/m1/2242345-0-default/getEquipmentList',
    data: {
      amount,
      page,
      org_id,
    },
  })
}
/**
 * 获取组织结构下拉框选中时组织机构下的设备
 * @param org_id
 * @returns {*}
 */
export const getSelectEquipmentByOrg = (org_id) => {
  return request({
    method: 'POST',
    url: EQ + '/getEquipmentByOrg',
    data: {
      org_id,
    },
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
    url: EQ + '/getEquipmentDetail',
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
    url: EQ + '/updateAlgorithmStatus',
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
    url: EQ + '/deleteEquipmentExample',
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
/**
 * 获取历史数据
 * @param {Object} data
 * 数据开始时间	start_time	String
 数据结束时间	end_time	String
 位号	position_number	List
 位号名	name	String
 位号值	value	String
 * @returns
 */
export const getHistoryDataApi = data => {
  return request({
    method: 'POST',
    url: '/getHistoryData',
    data,
  })
}
/**
 * 展示训练数据
 * @param {Object} data
 * equipment_id 设备id
 * @returns promise
 */
export const getHistoryShowApi = data => {
  return request({
    method: 'POST',
    url: '/getHistoryShow',
    data,
  })
}
/**
 * 模型训练
 * @param {Object} data
 *
 *
 * @returns
 */
export const trainModelApi = data => {
  return request({
    method: 'POST',
    url: '/trainModel',
    data,
  })
}
/**
 * 训练进度查询
 * @returns Promise
 */
export const getTrainProgressApi = () => {
  return request({
    method: 'GET',
    url: '/getTrainProgress',
  })
}
/**
 * 删除训练数据
 * @param {Array} record_id 训练记录ID
 * @returns Promise
 */
export const deleteHistoryDataApi = record_id => {
  return request({
    method: 'POST',
    url: '/deleteHistoryData',
    data: {
      record_id,
    },
  })
}
/**
 * 保存训练结果
 * @param data
 * @returns {*}
 */
export const saveTrainResult = (data) => {
  return request({
    method: 'POST',
    url: '/saveTrainTag',
    data,
  })
}
/**
 * 获取设备详情用于修改
 * @returns {Promise<axios.AxiosResponse<any>> | *}
 */
export const getEquipmentDetailForModifyApi = (equipment_id) => {
  return request({
    method: "POST",
    url: '/getEquipmentDetailForModify',
    data: { equipment_id },
  })

}

