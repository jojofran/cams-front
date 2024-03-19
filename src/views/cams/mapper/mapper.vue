<template>
	<div>
		<el-card shadow="hover" class="box-card" style="margin-top: 0px; height: 100%; width: 100%">
			<!-- <el-descriptions title="基本信息" class="margin-top" :column="6" :border="false">
			</el-descriptions> -->
			<div class="system-user-search mb15">
				<label>Lis字典：</label>
				<el-input v-model="queryParams.source_code" size="default" placeholder="请输入" disabled style="max-width: 180px"> </el-input>
				<label>Carss字典：</label>
				<el-input v-model="queryParams.target_code" size="default" placeholder="请输入" disabled style="max-width: 180px"> </el-input>
				<label>匹配字段：</label>
				<el-select v-model="selectFields" multiple @change="selectFieldChange" disabled  placeholder="请选择匹配字段" size="default" style="width:300px;">
					<el-option v-for="item in fieldList" :key="item.code" :label="item.code" :value="item.code">
					</el-option>
				</el-select>
				<el-button size="default" type="primary" v-if="showBtn" class="ml10" @click="getTableData()">
					<el-icon>
						<ele-Setting />
					</el-icon>
					一键匹配
				</el-button>
				<el-button size="default" type="warning" v-if="!showBtn" class="ml10" @click="getTableData()">
					<el-icon>
						<ele-Refresh />
					</el-icon>
					重新匹配
				</el-button>
			</div>
			<el-tabs type="border-card">
				<el-tab-pane label="已匹配">
					<el-table :data="tableData_success" v-loading="loading" style="width: 100%;" height="500" stripe :header-cell-style="setTitle">
						<el-table-column :label="tableTitleLeft" align="center">
							<el-table-column prop="source_attr_1" :label="getHeadLabel(0)" width="auto" v-if="showColumn(0)">
								<template #default="scope">
									<span style="color:#004d8c">{{scope.row.source_attr_1}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="source_attr_2" :label="getHeadLabel(1)" width="auto" v-if="showColumn(1)"/>
							<el-table-column prop="source_attr_3" :label="getHeadLabel(2)" width="auto" v-if="showColumn(2)"/>
							<el-table-column prop="source_attr_4" :label="getHeadLabel(3)" width="auto" v-if="showColumn(3)"/>
							<el-table-column prop="source_attr_5" :label="getHeadLabel(4)" width="auto" v-if="showColumn(4)"/>
							<el-table-column prop="source_attr_6" :label="getHeadLabel(5)" width="auto" v-if="showColumn(5)"/>
						</el-table-column>
						<el-table-column :label="tableTitleRight" align="center">
							<el-table-column prop="target_attr_1" :label="getHeadLabel(0)" width="auto" v-if="showColumn(0)">
								<template #default="scope">
									<span style="color:#fc5531">{{scope.row.target_attr_1}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="target_attr_2" :label="getHeadLabel(1)" width="auto" v-if="showColumn(1)"/>
							<el-table-column prop="target_attr_3" :label="getHeadLabel(2)" width="auto" v-if="showColumn(2)"/>
							<el-table-column prop="target_attr_4" :label="getHeadLabel(3)" width="auto" v-if="showColumn(3)"/>
							<el-table-column prop="source_attr_5" :label="getHeadLabel(4)" width="auto" v-if="showColumn(4)"/>
							<el-table-column prop="source_attr_6" :label="getHeadLabel(5)" width="auto" v-if="showColumn(5)"/>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label="未匹配">
					<el-table :data="tableData_fail" v-loading="loading" stripe style="width: 100%;" height="500" :header-cell-style="setTitle">
						<el-table-column :label="tableTitleLeft" align="center">
							<el-table-column prop="attr_1" :label="getHeadLabel(0)" width="auto" v-if="showColumn(0)">
								<template #default="scope">
									<span style="color:#004d8c">{{scope.row.attr_1}}</span>
								</template>
							</el-table-column>
							<el-table-column prop="attr_2" :label="getHeadLabel(1)" width="auto" v-if="showColumn(1)"/>
							<el-table-column prop="attr_3" :label="getHeadLabel(2)" width="auto" v-if="showColumn(2)"/>
							<el-table-column prop="attr_4" :label="getHeadLabel(3)" width="auto" v-if="showColumn(3)"/>
							<el-table-column prop="attr_5" :label="getHeadLabel(4)" width="auto" v-if="showColumn(4)"/>
							<el-table-column prop="attr_6" :label="getHeadLabel(5)" width="auto" v-if="showColumn(5)"/>
						</el-table-column>
						<el-table-column :label="tableTitleRight" align="center">
							<el-table-column prop="target_attr_1" :label="getHeadLabel(0)" width="auto" align="center" v-if="showColumn(0)">
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
							<el-table-column prop="target_attr_2" :label="getHeadLabel(1)" width="auto" v-if="showColumn(1)"/>
							<el-table-column prop="target_attr_3" :label="getHeadLabel(2)" width="auto" v-if="showColumn(2)"/>
							<el-table-column prop="target_attr_4" :label="getHeadLabel(3)" width="auto" v-if="showColumn(3)"/>
							<el-table-column prop="target_attr_5" :label="getHeadLabel(4)" width="auto" v-if="showColumn(4)"/>
							<el-table-column prop="target_attr_6" :label="getHeadLabel(5)" width="auto" v-if="showColumn(5)"/>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
			<div style="text-align:left;margin-left:-10px;">
				<el-button size="default" type="primary" class="ml10" @click="handelSaveData()" style="margin-top:10px;">
					<el-icon>
						<ele-Checked />
					</el-icon>
					保存数据
				</el-button>
			</div>
			
		</el-card>
	</div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { mapList,mappingMatch,mapValueList,modifyMappingConcepts,overwriteMappingConcepts,mappingConceptList,mappingList,mappingInfo } from '/@/api/dictionary/index';
import { fa } from 'element-plus/es/locale';

const router = useRouter();
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
const tableTitleLeft = ref('');
const tableTitleRight = ref('');

const showBtn = ref(true);

//选中字段
const selectFields = ref<any>([]);
const carssDicList = ref<any>([]);
const fieldList = ref<any>([]);
const mappingResInfo = ref<any>({});

// 初始化数据
const initData = async() => {
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
	var resInfo = await mappingInfo(queryParams);
	var dataInfo = resInfo.data;
	mappingResInfo.value = dataInfo;
	var properties = JSON.parse(dataInfo.properties);
	fieldList.value = properties;
	for(var j=0;j<properties.length;j++){
		if(properties[j].compare){
			selectFields.value.push(properties[j].code);
		}
	}
	// getTableData();
	queryMappingConceptParams.value.sourceCode = queryParams.value.source_code;
	queryMappingConceptParams.value.targetCode = queryParams.value.target_code;
	queryMappingConceptParams.value.limit = 100000;
	queryMappingConceptParams.value.offset = 0;
	getMappingConceptList(queryMappingConceptParams);
	getMappingValueList();

};

//获取匹配字段
const getMappingConceptList = async (queryMappingConceptParams:any) => {
	var res = await mappingConceptList(queryMappingConceptParams);
	var data = res.data;
	if(data.length){
		showBtn.value = false;
	}
	tableData_success.value = data;
	for(var i=0;i<lisValueList.value.length;i++){
		var bl = false;
		for(var j=0;j<tableData_success.value.length;j++){
			if(lisValueList.value[i].attr_1 == tableData_success.value[j].source_attr_1
			&&lisValueList.value[i].attr_2 == tableData_success.value[j].source_attr_2
			&&lisValueList.value[i].attr_3 == tableData_success.value[j].source_attr_3
			&&lisValueList.value[i].attr_4 == tableData_success.value[j].source_attr_4
			&&lisValueList.value[i].attr_5 == tableData_success.value[j].source_attr_5
			&&lisValueList.value[i].attr_6 == tableData_success.value[j].source_attr_6
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

const getHeadLabel = (index:any)=>{
	if(index > fieldList.value.length-1)
	{
		return "";
	}
	else{
		return fieldList.value[index].code;
	}
}

const showColumn = (index:any)=>{
	if(index > fieldList.value.length-1)
	{
		return false;
	}
	else{
		return true;
	}
}

const carssValueList = ref<any>([]);
const lisValueList = ref<any>([]);

const mappingList = ref<any>([]); //Mapping Data in memory
const unMappingList = ref<any>([]); //UnMapping Data in memory

const uPageParams = <any>({
	pageSize: 20,
	currentPage: 1,
	loading: true,
	nomore: false,
})
;

const pageParams = <any>({
	pageSize: 20,
	currentPage: 1,
	loading: true,
	nomore: false,
});


const loadMoreUnMapping = () => {
	if (tableData_fail.value.length >= unMappingList.value.length) {
		//当前页码数等于总页数的时候,提示没有更多数据了
		uPageParams.loading = false;
		uPageParams.nomore = true;
	} else {
		//当数据没有加载完的时候,继续加载数据
		uPageParams.loading = true;
		uPageParams.currentPage++; //当前页数字加一
		tableData_fail.value.addList(page<any>(unMappingList.value, uPageParams.value.pageSize, (uPageParams.value.currentPage - 1) * uPageParams.value.pageSize));
	}
};

const loadMoreMapping = () => {
	
	if (tableData_success.value.length >= mappingList.value.length) {
		//当前页码数等于总页数的时候,提示没有更多数据了
		pageParams.loading = false;
		pageParams.nomore = true;
	} else {
		//当数据没有加载完的时候,继续加载数据
		pageParams.loading = true;
		pageParams.currentPage++; //当前页数字加一
		tableData_success.value.addList(page<any>(unMappingList.value, uPageParams.value.pageSize, (uPageParams.value.currentPage - 1) * uPageParams.value.pageSize));
	}
};

function page<T>(array: T[], limit: number, offset: number): T[] {
	return take<T>(skip<T>(array, offset), limit);
}

function take<T>(array: T[], n: number): T[] {
	return array.slice(0, n);
}

function skip<T>(array: T[], n: number): T[] {
	return array.slice(n);
}

// 初始化表格数据
const getTableData =async () => {
	loading.value = true;
	queryParams.value.properties = fieldList.value;
	var res = await mappingMatch(queryParams.value);
	tableData_success.value = res.data.mapping_concepts;
	tableData_fail.value = res.data.unmapping_concepts;
	setTimeout(() => {
		loading.value = false;
	}, 500);
};

// 获取表格中下拉框的值
const getMappingValueList = async () => {
	queryMappingValueParams.value.limit = 10000;
	queryMappingValueParams.value.offset = 0;
	queryMappingValueParams.value.code = queryParams.value.target_code;
	var res = await mapValueList(queryMappingValueParams);
	carssValueList.value = res.data;
}

//保存数据
const handelSaveData = async () => {
	debugger
	if(showBtn.value){
		saveData();
	}else
	{
		overWriteData();
	}
}

//保存数据
const saveData = async () => {
	var addList = tableData_success.value;
	for(var i=0;i<tableData_fail.value.length;i++){
		var obj = {
			// id: 0,
			source_attr_1: tableData_fail.value[i].attr_1,
			source_attr_2: tableData_fail.value[i].attr_2,
			source_attr_3: tableData_fail.value[i].attr_3,
			source_attr_4: tableData_fail.value[i].attr_4,
			source_attr_5: tableData_fail.value[i].attr_5,
			source_attr_6: tableData_fail.value[i].attr_6,
			source_code:queryParams.value.source_code,
			target_attr_1: tableData_fail.value[i].target_attr_1,
			target_attr_2: tableData_fail.value[i].target_attr_2,
			target_attr_3: tableData_fail.value[i].target_attr_3,
			target_attr_4: tableData_fail.value[i].target_attr_4,
			target_attr_5: tableData_fail.value[i].target_attr_5,
			target_attr_6: tableData_fail.value[i].target_attr_6,
			target_code: queryParams.value.target_code,
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
		sourceCode:queryParams.value.source_code,
		targetCode:queryParams.value.target_code,
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
	tableData_success.value = [];
	tableData_fail.value = [];
	getMappingConceptList(queryMappingConceptParams);
}

//覆盖数据
const overWriteData = async () => {
	var addList = tableData_success.value;
	for(var i=0;i<tableData_fail.value.length;i++){
		var obj = {
			// id: 0,
			source_attr_1: tableData_fail.value[i].attr_1,
			source_attr_2: tableData_fail.value[i].attr_2,
			source_attr_3: tableData_fail.value[i].attr_3,
			source_attr_4: tableData_fail.value[i].attr_4,
			source_attr_5: tableData_fail.value[i].attr_5,
			source_attr_6: tableData_fail.value[i].attr_6,
			source_code:queryParams.value.source_code,
			target_attr_1: tableData_fail.value[i].target_attr_1,
			target_attr_2: tableData_fail.value[i].target_attr_2,
			target_attr_3: tableData_fail.value[i].target_attr_3,
			target_attr_4: tableData_fail.value[i].target_attr_4,
			target_attr_5: tableData_fail.value[i].target_attr_5,
			target_attr_6: tableData_fail.value[i].target_attr_6,
			target_code: queryParams.value.target_code,
		}
		if(obj.target_attr_1 != undefined){
			addList.push(obj);
		}
	}
	var parmObj = {
		mappingConcepts:addList,
		mappingInfo:{
			id:mappingResInfo.value.id,
			properties:mappingResInfo.value.properties,
			source_code:mappingResInfo.value.source_code,
			target_code:mappingResInfo.value.target_code
		}
	}
    var res = await overwriteMappingConcepts(parmObj);
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
	tableData_success.value = [];
	tableData_fail.value = [];
	getMappingConceptList(queryMappingConceptParams);
}

// 表格中下拉框事件
const handleSelectChange = (val:any,row:any) => {
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
	debugger
	var columnCount = fieldList.value.length;
	if (row.columnIndex < columnCount && len == columnCount * 2) {
		return {'background':'#004d8c','color':'#FFFFFF'};
	}
	if (row.columnIndex >= columnCount && len == columnCount * 2) {
		return {'background':'#fc5531','color':'#FFFFFF'};
	}
}

// 页面加载时
onMounted(async() => {
	queryParams.value.source_code = router.currentRoute.value.query.sourceCode;
	queryParams.value.target_code = router.currentRoute.value.query.targetCode;
	tableTitleLeft.value = router.currentRoute.value.query.sourceCode;
	tableTitleRight.value = router.currentRoute.value.query.targetCode;

	initData();
	queryMappingValueParams.value.limit = 10000;
	queryMappingValueParams.value.offset = 0;
	queryMappingValueParams.value.code = queryParams.value.source_code;
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
