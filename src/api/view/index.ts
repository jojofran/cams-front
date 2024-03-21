import { access } from 'fs';
import request from '/@/utils/request';

// 根据表名称查询表字段
export const getTableFields = (code?: any) => 
	request({
		url: '/api/converter/' + code  +'/property',
		method: 'get',
	});

// 根据表名称查询表字段
export const getConverter = (code: any,pCode:any) => 
	request({
		url: '/api/converter/'+code+'/'+ pCode,
		method: 'get',
	});


// 新增字段转换
export const converterCreate = (params?: any) =>
	request({
		url: '/api/converter/create',
		method: 'post',
		data: params,
	});

// 新增字段转换
export const converterUpdate = (params?: any) =>
	request({
		url: '/api/converter/update',
		method: 'post',
		data: params,
	});

// 删除字段转换
export const deleteConverter = (code?: any,pCode?: any) =>
request({
	url: '/api/converter/'+ code+'/'+pCode,
	method: 'delete',
});

// 查询数据同步列表
export const taskList = (params?: any) => 
	request({
		url: '/api/sync/task/list',
		method: 'post',
		data: params,
	});

// 数据同步
export const syncCreate = (params?: any) =>
	request({
		url: '/api/sync',
		method: 'post',
		data: params,
	});

// 查询数据同步日志
export const gettaskLogs = (task_id?: any) => 
	request({
		url: '/api/sync/task/' + task_id  +'/logs',
		method: 'get',
	});


// 数据清除
export const Clear = (params?: any) =>
request({
	url: '/api/sync/clear',
	method: 'post',
	data: params,
});