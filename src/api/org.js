import request from '@/utils/request'

/**
 * 获取组织机构树
 * @description 该接口用于获取组织机构的树形结构数据
 * @example
 * @returns {*}
 */
export const getOrgApi = () => {
  return request({
    url: '/org/getOrgTree',

  })
}