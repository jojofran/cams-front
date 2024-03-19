import request from '/@/utils/request';

// // 查询数据源列表
export const sourceList = (params?: any) => 
	request({
		url: '/api/source/list',
		method: 'get',
		data: params,
	});

// export function sourceList(){
// 	return request({
// 		url: '/api/source/list',
// 		method: 'get',
// 	})
// };

// 新增、修改数据源
export const manage = (params?: any) =>
	request({
		url: '/api/source/manage',
		method: 'post',
		data: params,
	});

// 数据源连接测试
export const dbTest = (params?: any) =>
	request({
		url: '/api/source/test',
		method: 'post',
		data: params,
	});


// export function sourceApi() {
// 	return {
// 		sourceList: () => {
// 			return request({
// 				url: '/api/source/list',
// 				method: 'get',
// 			});
// 		},
// 		manage: (data: object) => {
// 			return request({
// 				url: '/api/source/manage',
// 				method: 'post',
// 				data,
// 			});
// 		},
// 	};
// }