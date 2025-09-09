import request from '@/utils/request'

/**
 * 获取基础数据列表
 * @param {Object} params 查询参数
 * @param {Number} params.current 当前页码
 * @param {Number} params.pageSize 每页数量
 * @param {String} params.filtration 过滤关键字
 * @returns {Promise} 返回基础数据列表
 */
export const getBaseNameListApi = (params) => {
  return request({
    url: '/api/baseName/list',
    method: 'get',
    params
  })
}

/**
 * 新增基础数据
 * @param {Object} data 基础数据信息
 * @param {String} data.name 基础数据名称
 * @param {String} data.type 数据类型
 * @param {String} data.description 描述
 * @param {String} data.status 状态
 * @returns {Promise} 返回新增结果
 */
export const addBaseNameApi = (data) => {
  return request({
    url: '/api/baseName/add',
    method: 'post',
    data
  })
}

/**
 * 编辑基础数据
 * @param {Object} data 基础数据信息
 * @param {Number} data.id 数据ID
 * @param {String} data.name 基础数据名称
 * @param {String} data.type 数据类型
 * @param {String} data.description 描述
 * @param {String} data.status 状态
 * @returns {Promise} 返回编辑结果
 */
export const editBaseNameApi = (data) => {
  return request({
    url: '/api/baseName/edit',
    method: 'put',
    data
  })
}

/**
 * 删除基础数据
 * @param {Number} id 数据ID
 * @returns {Promise} 返回删除结果
 */
export const deleteBaseNameApi = (id) => {
  return request({
    url: `/api/baseName/delete/${id}`,
    method: 'delete'
  })
}

/**
 * 获取基础数据详情
 * @param {Number} id 数据ID
 * @returns {Promise} 返回基础数据详情
 */
export const getBaseNameDetailApi = (id) => {
  return request({
    url: `/api/baseName/detail/${id}`,
    method: 'get'
  })
}