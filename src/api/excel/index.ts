import request from '/@/utils/request';

// 字典文件上传
export const importDic = (type: any,code:any) => 
	request({
		url: '/api/excel/import/'+ type + '/' + code,
		method: 'get'
	});


// 导出数据
export const exportData = (type: any,code:any) =>
	request({
		url: '/api/excel/export/'+ type + '/' + code,
		method: 'get',
		responseType: 'blob'
	});