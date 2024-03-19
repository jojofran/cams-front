<template>
	<div class="system-role-container layout-padding">
		<div class="system-role-padding layout-padding-auto layout-padding-view">
			<div class="system-user-search mb15">
				<!-- <el-select v-model="queryParams.dataType" placeholder="请选择数据库类型" clearable style="max-width: 180px;height:32px;">
					<el-option v-for="(item, index) in dataTypeList" :key="index" :value="item.value" :label="item.label" />
				</el-select> -->
				<el-input v-model="queryParams.dataSourceName" size="default" placeholder="请输入关键字" style="max-width: 180px"> </el-input>
				<el-button size="default" type="primary" class="ml10" @click="getTableData">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAdd()">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增
				</el-button>
			</div>
			<el-table :data="tableData" v-loading="loading" style="width: 100%">
				<el-table-column type="index" label="序号" width="100" />
				<el-table-column prop="attr_1" :label="getHeadLabel(0)" v-if="showColumn(0)" show-overflow-tooltip></el-table-column>
				<el-table-column prop="attr_2" :label="getHeadLabel(1)" v-if="showColumn(1)" show-overflow-tooltip></el-table-column>
				<el-table-column prop="attr_3" :label="getHeadLabel(2)" v-if="showColumn(2)" show-overflow-tooltip></el-table-column>
				<el-table-column prop="attr_4" :label="getHeadLabel(3)" v-if="showColumn(3)" show-overflow-tooltip></el-table-column>
				<el-table-column prop="attr_5" :label="getHeadLabel(4)" v-if="showColumn(4)" show-overflow-tooltip></el-table-column>
				<el-table-column prop="attr_6" :label="getHeadLabel(5)" v-if="showColumn(5)" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="150">
					<template #default="scope">
						<el-button  size="small" text type="primary" @click="onOpenEdit(scope.row)">修改</el-button>
						<el-button  size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
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
			</el-pagination>
		</div>
		<AddOrEditDialog ref="dialogRef" :title="dialogTitle" @refresh="getTableData" />
	</div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { mapValueList,modifymapValue} from '/@/api/dictionary/index';
import { mapList } from '/@/api/dictionary/index';
import AddOrEditDialog from '/@/views/cams/dicType/addOrEditDialog.vue';
// import LisDialog from '/@/views/cams/section/dialog.vue';

// 引入组件
// const LisDialog = defineAsyncComponent(() => import('/@/views/cams/lis/dialog.vue'));

// 定义变量内容
const lisDialogTitle = ref('');
const lisDialogRef = ref();
const loading = ref(false);
//查询表头
const tableheHead = ref<any>([]);
const tableheHeadParams = ref<any>({});

const tableData = ref<any>([]);
const queryParams = ref<any>({});
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});
const dialogTitle = ref('');
const dialogRef = ref();

// 初始化表格数据
const getTableData = async () => {
	loading.value = true;
	
	tableheHeadParams.value.limit = 10;
	tableheHeadParams.value.offset = 0;
	tableheHeadParams.value.keyword = 'sys_dicType';
	tableheHeadParams.value.type = 'sys_dic';
	var resHead = await mapList(tableheHeadParams);
	var dataHead = resHead.data;
	tableheHead.value = JSON.parse(dataHead[0].properties);

	queryParams.value.limit = tableParams.value.pageSize;
	queryParams.value.offset = tableParams.value.pageSize * (tableParams.value.page-1);
	queryParams.value.code = 'sys_dicType';
	var res = await mapValueList(queryParams);
	var data = res.data;

	tableData.value = data;
	tableParams.value.total = res.total;
	setTimeout(() => {
		loading.value = false;
	}, 500);
};

const getHeadLabel = (index:any)=>{
	if(index > tableheHead.value.length-1)
	{
		return "";
	}
	else{
		return tableheHead.value[index].code;
	}
}

const showColumn = (index:any)=>{
	if(index > tableheHead.value.length-1)
	{
		return false;
	}
	else{
		return true;
	}
}

// 打开新增弹窗
const onOpenAdd = () => {
	dialogTitle.value = '添加字典值';
	debugger
	dialogRef.value.openDialog(tableheHead,queryParams.value.code);
};

// 打开修改弹窗
const onOpenEdit = (row: any) => {
	dialogTitle.value = '编辑字典值';
	dialogRef.value.openDialog(tableheHead,queryParams.value.code,row);
};

// 删除
const onRowDel = (row: any) => {
	ElMessageBox.confirm(`此操作将永久删除字典值，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			var param = {adds:[],deletes:[row.id]};
			modifymapValue(queryParams.value.code,param);
			getTableData();
			ElMessage.success('删除成功');
		})
		.catch(() => {});
};

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
onMounted(() => {
	getTableData();
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

</style>
