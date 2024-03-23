import {access} from 'fs';
import request from '/@/utils/request';


/** 获取字典信息*/
export const getMapInfo = (code: string) => request({
    url: '/api/map/' + code,
    method: 'get',
});

// 查询字典列表
export const mapList = (params?: any) =>
    request({
        url: '/api/map/list?keyword=' + params.value.keyword + '&type=' + params.value.type + '&limit=' + params.value.limit + '&offset=' + params.value.offset,
        method: 'get',
    });

// 删除字典
export const deleteMap = (code?: any) =>
    request({
        url: '/api/map/' + code,
        method: 'delete',
    });

// 查询字典值
export const mapValueList = (params?: any) =>
    request({
        url: '/api/map/' + params.value.code + '/concepts?limit=' + params.value.limit + '&offset=' + params.value.offset,
        method: 'get',
    });

// 字典映射
export const mappingMatch = (params?: any) =>
    request({
        url: '/api/mapping/match',
        method: 'post',
        data: params,
    });


// 新增、修改字典值
export const modifymapValue = (mapCode: any, params?: any) =>
    request({
        url: '/api/map/' + mapCode + '/concepts/update',
        method: 'post',
        data: params,
    });

// 查询药敏数据列表
export const caseResults = (id_num: any, params?: any) =>
    request({
        url: '/api/case/results/' + id_num + '?limit=' + params.value.limit + '&offset=' + params.value.offset,
        method: 'get',
    });

// 新增、修改药敏数据
export const createMap = (params?: any) =>
    request({
        url: '/api/map/create',
        method: 'post',
        data: params,
    });

// 保存映射数据
export const modifyMappingConcepts = (params?: any) =>
    request({
        url: '/api/mapping/concepts/update',
        method: 'post',
        data: params,
    });

// 重写映射数据
export const overwriteMappingConcepts = (params?: any) =>
    request({
        url: '/api/mapping/concepts/overwrite',
        method: 'post',
        data: params,
    });

// 新增映射
export const createMapping = (params?: any) =>
    request({
        url: '/api/mapping/create',
        method: 'post',
        data: params,
    });

// 删除映射
export const deleteMapping = (sourceCode?: any, targetCode?: any) =>
    request({
        url: '/api/mapping/' + sourceCode + '/' + targetCode,
        method: 'delete',
    });

// 查询映射字段数据
export const mappingConceptList = (params?: any) =>
    request({
        url: '/api/mapping/' + params.value.sourceCode + '/' + params.value.targetCode + '/concepts?limit=' + params.value.limit + '&offset=' + params.value.offset,
        method: 'get',
    });

// 查询字典列表
export const mappingList = (limit: any, offset: any) =>
    request({
        url: '/api/mapping/list?limit=' + limit + '&offset=' + offset,
        method: 'get',
    });

// 查询映射详情
export const mappingInfo = (params?: any) =>
    request({
        url: '/api/mapping/' + params.value.source_code + '/' + params.value.target_code,
        method: 'get',
    });