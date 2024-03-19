import request from '/@/utils/request';

// 查询Case列表
export const caseList = (params?: any) => 
	request({
		url: '/api/case/list' +'?timeFiled=&isInvalid=false',
		method: 'post',
		data: params.value,
	});


// 查询药敏数据列表
export const caseResults = (id_num:any,params?: any) => 
request({
	url: '/api/case/results/' + id_num+'?limit='+params.value.limit+'&offset='+params.value.offset,
	method: 'get',
});

// 新增、修改药敏数据
export const modifyResult = (params?: any) =>
	request({
		url: '/api/case/results/modify',
		method: 'post',
		data: params,
	});