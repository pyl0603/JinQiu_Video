import request from '@/utils/request'

/**
 * 我的信息
 * @param {*} params 
 */
export function myInfo(params) {
    return request({
        url: '/client-admin/user/info',
        method: 'get',
        params
    })
}


/**
 * 添加员工
 * @param {*} data 
 */
export function addStaff(data) {
    return request({
        url: '/client-admin/users',
        method: 'post',
        data
    })
}


/**
 * 员工列表
 * @param {*} params 
 */
export function userList(params) {
    return request({
        url: '/client-admin/users',
        method: 'get',
        params
    })
}


/**
 * 更新其他员工信息
 * @param {*} data 
 */
export function changeInfo(id, data) {
    return request({
        url: `/client-admin/users/${id}`,
        method: 'put',
        data
    })
}


/**
 * 部门列表
 * @param {*} params 
 */
export function getDep(params) {
    return request({
        url: '/client-admin/departments',
        method: 'get',
        params
    })
}



/**
 * 我的部门列表
 * @param {*} params 
 */
export function getMyDep(params) {
    return request({
        url: '/client-admin/user/departments',
        method: 'get',
        params
    })
}


/**
 * 部门详情
 * @param {*} params 
 */
export function getDepDet(params) {
    return request({
        url: `/client-admin/departments/${params}`,
        method: 'get'
    })
}


/**
 * 更新部门信息
 * @param {*} data 
 */
export function putDepDet(id, data) {
    return request({
        url: `/client-admin/departments/${id}`,
        method: 'put',
        data
    })
}



/**
 * 部门成员列表
 * @param {*} params 
 */
export function getDepUser(params) {
    return request({
        url: `/client-admin/departments/${params}/members`,
        method: 'get'
    })
}



/**
 * 部门主管权限列表
 * @param {*} params 
 */
export function getDepAut(params) {
    return request({
        url: `/client-admin/departments/${params}/authorities`,
        method: 'get'
    })
}



/**
 * 新增部门
 * @param {*} data 
 */
export function addDep(data) {
    return request({
        url: '/client-admin/departments',
        method: 'post',
        data
    })
}




/**
 * 添加部门角色
 * @param {*} data 
 */
export function addRole(id, data) {
    return request({
        url: `/client-admin/departments/${id}/roles`,
        method: 'post',
        data
    })
}




/**
 * 修改部门角色
 * @param {*} data 
 */
export function putRoleAll(dId, rId, data) {
    return request({
        url: `/client-admin/departments/${dId}/roles/${rId}`,
        method: 'put',
        data
    })
}




/**
 * 部门角色列表
 * @param {*} params 
 */
export function getDepRole(params) {
    return request({
        url: `/client-admin/departments/${params}/roles`,
        method: 'get'
    })
}




/**
 * 添加成员
 * @param {*} data 
 */
export function addUser(id, data) {
    return request({
        url: `/client-admin/departments/${id}/members/${data}/join`,
        method: 'post'
    })
}




/**
 * 移除成员
 * @param {*} data 
 */
export function delUser(id, data) {
    return request({
        url: `/client-admin/departments/${id}/members/${data}/fire`,
        method: 'post'
    })
}



/**
 * 更新角色权限
 * @param {*} data 
 */
export function putRole(id, data) {
    return request({
        url: `/client-admin/roles/${id}/authorities`,
        method: 'put',
        data
    })
}




/**
 * 更新用户角色
 * @param {*} data 
 */
export function putUser(id, data) {
    return request({
        url: `/client-admin/members/${id}/roles`,
        method: 'put',
        data
    })
}




/**
 * 所有权限列表
 * @param {*} params 
 */
export function getAllAut(params) {
    return request({
        url: `/client-admin/authorities`,
        method: 'get'
    })
}




/**
 * 删除部门
 * @param {*} params 
 */
export function delDep(data) {
    return request({
        url: `/client-admin/departments/${data}`,
        method: 'delete'
    })
}


/**
 * 惩罚情况列表
 * @param {*} params 
 */
export function getPun(params) {
    return request({
        url: `/client-admin/punishments`,
        method: 'get',
        params
    })
}


/**
 * 待审核的用户列表
 * @param {*} params 
 */
export function getCheckUser(params) {
    return request({
        url: `/client-admin/check-users`,
        method: 'get',
        params
    })
}




/**
 * 批量审核用户信息
 * @param {*} data 
 */
export function checkedUser(data) {
    return request({
        url: `/client-admin/check-users`,
        method: 'post',
        data
    })
}



/**
 * 封号
 * @param {*} data 
 */
export function disableUser(id, data) {
    return request({
        url: `/client-admin/users/${id}/disable`,
        method: 'patch',
        data
    })
}



/**
 * 解封
 * @param {*} data 
 */
export function enableUser(data) {
    return request({
        url: `/client-admin/users/${data}/enable`,
        method: 'patch'
    })
}