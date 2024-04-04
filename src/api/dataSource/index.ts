import request from '/@/utils/request';

export const getDbList = (params?: any) =>
    request({
        url: '/api/config/db/list',
        method: 'get',
        data: params,
    });

// 新增、修改数据源
export const setDb = (params?: any) =>
    request({
        url: '/api/config/db/' + params.code,
        method: 'post',
        data: params,
    });

// 数据源连接测试
export const dbTest = (params?: any) =>
    request({
        url: '/api/config/dbTest',
        method: 'post',
        data: params,
    });

