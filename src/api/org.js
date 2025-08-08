import request from '@/utils/request'
import { ORG } from '@/api/index'

/**
 * 获取组织机构树
 * @description 该接口用于获取组织机构的树形结构数据
 * @example
 * @returns {*}
 */
export const getOrgApi = () => {
  return request({
    url: ORG + '/getOrgTree',

  })
}
/**
 * 创建组织机构
 * @returns {*}
 */
export const createOrgApi = (data) => {
  return request({
    method: "POST",
    url: ORG + '/addOrg',
    data,
  })
}
/**
 * 修改节点
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>> | *}
 */
export const editOrgApi = (data) => {
  return request({
    method: "POST",
    url: ORG + '/updateOrg',
    data,

  })
}
/**
 * 删除组织机构
 * @param id
 * @returns {*}
 */
export const deleteOrgApi = (id) => {
  return request({
    method: "POST",
    url: ORG + '/deleteOrg',
    data: {
      id,
    },
  })
}