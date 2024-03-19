<template>
	<div>
		<el-card shadow="hover" class="box-card" style="margin-top: 0px; height: 100%; width: 100%">
			<!-- <el-descriptions title="基本信息" class="margin-top" :column="6" :border="false">
			</el-descriptions> -->
			<div class="system-user-search mb15">
				<el-input v-model="queryParams.sourceCode" size="default" placeholder="请输入" disabled style="max-width: 180px"> </el-input>
				<el-select v-model="queryParams.targetCode" placeholder="请选择CARSS字典" @change="selectCarssChange" filterable clearable size="default">
					<el-option v-for="(item, index) in carssDicList" :key="index" :value="item.value" :label="item.label" />
				</el-select>
				<el-select v-model="selectFields" multiple @change="selectFieldChange" collapse-tags placeholder="请选择匹配字段" size="default" clearable>
					<el-option v-for="item in fieldList" :key="item.value" :label="item.label" :value="item.value">
						<!-- <span style="float: right;">{{ item.label }}</span>
						<span style="float: left;color: var(--el-text-color-secondary);font-size: 13px;">{{ item.value }}</span> -->
					</el-option>
				</el-select>
				<el-button size="default" type="primary" class="ml10" @click="getTableData()">
					<el-icon>
						<ele-Switch />
					</el-icon>
					自动匹配
				</el-button>
			</div>
			<el-tabs type="border-card">
				<el-tab-pane label="匹配成功">
					<el-table :data="tableData_success" v-loading="loading" style="width: 100%;" height="500" stripe :header-cell-style="setTitle">
						<el-table-column label="LIS字典" align="center">
							<el-table-column prop="source_attr_1" label="中文名称" width="auto">
								<template #default="scope">
									<span style="color:#004d8c">{{scope.row.source_attr_1}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="source_attr_2" label="数字代码" width="200" />
							<el-table-column prop="source_attr_3" label="英文代码" width="auto" />
							<el-table-column prop="source_attr_4" label="英文名称" width="200" />
						</el-table-column>
						<el-table-column label="CARSS字典" align="center">
							<el-table-column prop="target_attr_1" label="中文名称" width="auto">
								<template #default="scope">
									<span style="color:#fc5531">{{scope.row.target_attr_1}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="target_attr_2" label="数字代码" width="200" />
							<el-table-column prop="target_attr_3" label="英文代码" width="auto" />
							<el-table-column prop="target_attr_4" label="英文名称" width="200" />
						</el-table-column>
					</el-table>
					<!-- <el-pagination
						@size-change="onHandleSizeChange"
						@current-change="onHandleCurrentChange"
						class="mt15"
						:pager-count="5"
						:page-sizes="[10, 20, 30]"
						v-model:current-page="tableParams.page"
						background
						v-model:page-size="tableParams.pageSize"
						layout="total, sizes, prev, pager, next, jumper"
						:total="tableParams.total"
					></el-pagination> -->
				</el-tab-pane>
				<el-tab-pane label="匹配失败">
					<el-table :data="tableData_fail" v-loading="loading" stripe style="width: 100%;" height="500" :header-cell-style="setTitle">
						<el-table-column label="LIS字典" align="center">
							<el-table-column prop="attr_1" label="中文名称" width="auto">
								<template #default="scope">
									<span style="color:#004d8c">{{scope.row.attr_1}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="attr_2" label="数字代码" width="200" />
							<el-table-column prop="attr_3" label="英文代码" width="auto" />
							<el-table-column prop="attr_4" label="英文名称" width="200" />
						</el-table-column>
						<el-table-column label="CARSS字典" align="center">
							<el-table-column prop="target_attr_1" label="中文名称" width="auto" align="center">
								<template #default="scope">
									<el-select v-model="scope.row.target_attr_1" @change="(val)=> handleSelectChange(val,scope.row)" placeholder="请选择CARSS字典值" filterable clearable  style="width:100%;height:24px;text-align: center;">
										<el-option v-for="(item, index) in carssValueList" :key="index" :label="item.attr_1" :value="item.attr_1">
											<span style="float: left;color: #fc5531;font-size: 13px;">{{ item.attr_1 }}</span>
											<span style="float: right;color:#fc5531;">{{ item.attr_2 }}</span>
											<span style="float: left;color: #fc5531;font-size: 13px;">{{ item.attr_3 }}</span>
											<span style="float: right;color:#fc5531;">{{ item.attr_4 }}</span>
										</el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column prop="target_attr_2" label="数字代码" width="200" />
							<el-table-column prop="target_attr_3" label="英文代码" width="auto" />
							<el-table-column prop="target_attr_4" label="英文名称" width="200" />
						</el-table-column>
					</el-table>
					<!-- <el-pagination
						@size-change="onHandleSizeChange"
						@current-change="onHandleCurrentChange"
						class="mt15"
						:pager-count="5"
						:page-sizes="[10, 20, 30]"
						v-model:current-page="tableParams.page"
						background
						v-model:page-size="tableParams.pageSize"
						layout="total, sizes, prev, pager, next, jumper"
						:total="tableParams.total"
					>
					</el-pagination> -->
				</el-tab-pane>
			</el-tabs>
			<div style="text-align:left;margin-left:-10px;">
				<el-button size="default" type="primary" class="ml10" @click="saveData()" style="margin-top:10px;">
					<el-icon>
						<ele-Checked />
					</el-icon>
					保存数据
				</el-button>
			</div>
			
		</el-card>
		<!-- <el-card shadow="hover" class="box-card" style="margin-top: 0px; height: 600px; width: 100%;">
			
			<el-button size="default" type="primary" class="ml10" @click="getTableData()">
					<el-icon>
						<ele-Search />
					</el-icon>
					保存数据
				</el-button>
		</el-card> -->
	</div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { mapList,mappingMatch,mapValueList,modifyMappingConcepts,mappingConceptList,mappingList } from '/@/api/dictionary/index';
import { fa } from 'element-plus/es/locale';

const router = useRouter();
// import LisDialog from '/@/views/cams/dataSource/dialog.vue';

// 引入组件
// const LisDialog = defineAsyncComponent(() => import('/@/views/cams/lis/dialog.vue'));

// 定义变量内容
const lisDialogTitle = ref('');
const lisDialogRef = ref();
const loading = ref(false);
const tableData_success = ref<any>([]);
const tableData_fail = ref<any>([]);
const queryParams = ref<any>({
	properties:[]
});
//查询字典值列表参数
const queryMappingValueParams = ref<any>({});
//查询映射数据列表参数
const queryMappingConceptParams = ref<any>({});

const querySelectParams = ref<any>({
	keyword:'',
	type:''
});
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});

//选中字段
const selectFields = ref<any>([]);


const carssDicList = ref<any>([
	// { label: 'CARSS菌种字典', value: 'jz_carss' },
	// { label: 'CARSS标本字典', value: 'bb_carss' }
]);

const fieldList = ref<any>([
	// { label: '数字代码', value: 'num' },
	// { label: '英文代码', value: 'code' },
	// { label: '中文名称', value: 'nameCn' },
	// { label: '英文名称', value: 'nameEn' }
]);

const getCarssDic = async() => {
	querySelectParams.value.limit = 100000;
	querySelectParams.value.offset = 0;
	querySelectParams.value.type = 'std_dic';
	var res =await mapList(querySelectParams);
	var data = res.data;
	for(var i = 0;i<data.length;i++){
		var obj = {
			label:data[i].name,
			value:data[i].code,
			properties:data[i].properties
		};
		carssDicList.value.push(obj);
	}
};

//选择字段改变
const selectFieldChange = async (val:any) => {
	debugger
	for(var i=0;i<val.length;i++){

	}
}

const selectCarssChange = async (val:any) => {
	fieldList.value = [];
	for(var i = 0;i<carssDicList.value.length;i++)
	{
		if(carssDicList.value[i].value == val)
		{
			var data = JSON.parse(carssDicList.value[i].properties);
			for(var j=0;j<data.length;j++){
				var obj = {
					label:data[j].code,
					value:data[j].code,
					num:data[j].num
				};
				fieldList.value.push(obj);
			}
		}
	}

	selectFields.value = [];
	//带出匹配字段
	var res0 = await mappingList(10000,0);
	var data0 = res0.data;
	for(var i = 0;i<data0.length;i++)
	{
		if(data0[i].source_code == queryParams.value.sourceCode && data0[i].target_code == queryParams.value.targetCode){
			var propertyList = JSON.parse(data0[i].properties);
			for(var j=0;j<propertyList.length;j++){
				selectFields.value.push(propertyList[j].code);
			}
		}
	}

	tableData_success.value = [];
	tableData_fail.value = [];
	//带出已经匹配过的数据
	queryMappingConceptParams.value.sourceCode = queryParams.value.sourceCode;
	queryMappingConceptParams.value.targetCode = queryParams.value.targetCode;
	queryMappingConceptParams.value.limit = 100000;
	queryMappingConceptParams.value.offset = 0;
	// var res = await mappingConceptList(queryMappingConceptParams);
	// var data = res.data;
	// tableData_success.value = data;
	// for(var i=0;i<lisValueList.value.length;i++){
	// 	var bl = false;
	// 	for(var j=0;j<tableData_success.value.length;j++){
	// 		if(lisValueList.value[i].attr_1 == tableData_success.value[j].target_attr_1
	// 		&&lisValueList.value[i].attr_2 == tableData_success.value[j].target_attr_2
	// 		&&lisValueList.value[i].attr_3 == tableData_success.value[j].target_attr_3
	// 		&&lisValueList.value[i].attr_4 == tableData_success.value[j].target_attr_4
	// 		&&lisValueList.value[i].attr_5 == tableData_success.value[j].target_attr_5
	// 		&&lisValueList.value[i].attr_6 == tableData_success.value[j].target_attr_6
	// 		){
	// 			bl = true;
	// 			break;
	// 		}
	// 	}
	// 	if(!bl){
	// 		tableData_fail.value.push(lisValueList.value[i]);
	// 	}
	// }
	getMappingConceptList(queryMappingConceptParams);
	getMappingValueList();
};

const getMappingConceptList = async (queryMappingConceptParams:any) => {
	var res = await mappingConceptList(queryMappingConceptParams);
	var data = res.data;
	tableData_success.value = data;
	for(var i=0;i<lisValueList.value.length;i++){
		var bl = false;
		for(var j=0;j<tableData_success.value.length;j++){
			if(lisValueList.value[i].attr_1 == tableData_success.value[j].target_attr_1
			&&lisValueList.value[i].attr_2 == tableData_success.value[j].target_attr_2
			&&lisValueList.value[i].attr_3 == tableData_success.value[j].target_attr_3
			&&lisValueList.value[i].attr_4 == tableData_success.value[j].target_attr_4
			&&lisValueList.value[i].attr_5 == tableData_success.value[j].target_attr_5
			&&lisValueList.value[i].attr_6 == tableData_success.value[j].target_attr_6
			){
				bl = true;
				break;
			}
		}
		if(!bl){
			tableData_fail.value.push(lisValueList.value[i]);
		}
	}
}

const carssValueList = ref<any>([]);
const lisValueList = ref<any>([]);

// 初始化表格数据
const getTableData =async () => {
	debugger
	loading.value = true;
	queryParams.value.sourceCode = router.currentRoute.value.query.code;
	var fields = selectFields.value;
	for(var i = 0;i<fields.length;i++){
		for(var j=0;j<fieldList.value.length;j++){
			if(fields[i] == fieldList.value[j].value){
				var obj = {
					code:fieldList.value[j].value,
					num:fieldList.value[j].num,
					compare:true
				};
				queryParams.value.properties.push(obj);
			}
		}
	}
	var res = await mappingMatch(queryParams.value);
	tableData_success.value = res.data.mapping_concepts;
	tableParams.value.total = tableData_success.value.length;

	tableData_fail.value = res.data.unmapping_concepts;
	tableParams.value.total = tableData_success.value.length;


	setTimeout(() => {
		loading.value = false;
	}, 500);
};

const getMappingValueList = async () => {
	queryMappingValueParams.value.limit = 10000;
	queryMappingValueParams.value.offset = 0;
	queryMappingValueParams.value.code = queryParams.value.targetCode;
	var res = await mapValueList(queryMappingValueParams);
	carssValueList.value = res.data;
}

//保存数据
const saveData = async () => {
	var addList = tableData_success.value;
	debugger
	for(var i=0;i<tableData_fail.value.length;i++){
		var obj = {
			// id: 0,
			source_attr_1: tableData_fail.value[i].attr_1,
			source_attr_2: tableData_fail.value[i].attr_2,
			source_attr_3: tableData_fail.value[i].attr_3,
			source_attr_4: tableData_fail.value[i].attr_4,
			source_attr_5: tableData_fail.value[i].attr_5,
			source_attr_6: tableData_fail.value[i].attr_6,
			source_code:queryParams.value.sourceCode,
			target_attr_1: tableData_fail.value[i].target_attr_1,
			target_attr_2: tableData_fail.value[i].target_attr_2,
			target_attr_3: tableData_fail.value[i].target_attr_3,
			target_attr_4: tableData_fail.value[i].target_attr_4,
			target_attr_5: tableData_fail.value[i].target_attr_5,
			target_attr_6: tableData_fail.value[i].target_attr_6,
			target_code: queryParams.value.targetCode,
		}
		if(obj.target_attr_1 != undefined){
			addList.push(obj);
		}
	}
	var deleteList = [];
	for(var i=0;i<addList.length;i++){
		if(addList[i].id != undefined){
			deleteList.push(addList[i].id);
		}
	}

	var parmObj = {
		sourceCode:queryParams.value.sourceCode,
		targetCode:queryParams.value.targetCode,
		adds:addList,
		deletes:deleteList
	}
    var res = await modifyMappingConcepts(parmObj);
	if(res.data && res.message =='success'){
		ElMessage({
				message: `保存成功`,
				type: "success",
      	});
	}else{
		ElMessage({
				message: `失败成功`,
				type: "error",
      	});
	}
	getMappingConceptList(queryMappingConceptParams);
}


const handleSelectChange = (val:any,row:any) => {
	debugger
	var index = tableData_fail.value.indexOf(row);
	for(var i=0;i<carssValueList.value.length;i++)
	{
		if(carssValueList.value[i].attr_1 == val){
			tableData_fail.value[index].target_attr_1 = carssValueList.value[i].attr_1;
			tableData_fail.value[index].target_attr_2 = carssValueList.value[i].attr_2;
			tableData_fail.value[index].target_attr_3 = carssValueList.value[i].attr_3;
			tableData_fail.value[index].target_attr_4 = carssValueList.value[i].attr_4;
		}
	}
};

/**设置表头背景颜色 */
const setTitle = (row:any) => {
	var len = row.row.length;
	if (row.columnIndex == 0 && len == 2) {
		return {'background':'#004d8c','color':'#FFFFFF'};
	} 
	if (row.columnIndex == 1 && len == 2){
		return {'background':'#fc5531','color':'#FFFFFF'};
	}
	if ((row.columnIndex == 0 || row.columnIndex == 1 || row.columnIndex == 2|| row.columnIndex == 3)&& len == 8) {
		return {'background':'#004d8c','color':'#FFFFFF'};
	}
	if ((row.columnIndex == 4 || row.columnIndex == 5 || row.columnIndex == 6|| row.columnIndex == 7)&& len == 8) {
		return {'background':'#fc5531','color':'#FFFFFF'};
	}
}

// 分页改变
const onHandleSizeChange = (val: number) => {
	tableParams.value.pageSize = val;
	getTableData();
};
// 分页改变
const onHandleCurrentChange = (val: number) => {
	tableParams.value.page = val;
	getTableData();
};
// 页面加载时
onMounted(async() => {
	queryParams.value.sourceCode = router.currentRoute.value.query.code;
	getCarssDic();
	queryMappingValueParams.value.limit = 10000;
	queryMappingValueParams.value.offset = 0;
	queryMappingValueParams.value.code = queryParams.value.sourceCode;
	var res = await mapValueList(queryMappingValueParams);
	lisValueList.value = res.data;

	// getTableData();
});
</script>

<style scoped lang="scss">
.system-role-container {
	.system-role-padding {
		padding: 15px;
		.el-table {
			flex: 1;
		}
	}
}

.el-select {
  width: 220px;
  height: 32px;
  .el-input__inner {
    height: 32px;
  }

  .el-input__prefix, .el-input__suffix {
    height: 32px;
  }

  /* 下面设置右侧按钮居中 */
  .el-input__suffix {
    top: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
    align-content: flex-start;
  }
  /* 输入框加上上下边是 32px + 2px =34px */
  .el-input__icon {
    line-height: 32px;
  }
}
</style>
