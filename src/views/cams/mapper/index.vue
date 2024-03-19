<template>
	<div class="system-role-container layout-padding">
		<div class="system-role-padding layout-padding-auto layout-padding-view">
			<div class="system-user-search mb15">
				<el-input v-model="queryParams.keyword" size="default" placeholder="请输入关键字" clearable style="max-width: 180px"> </el-input>
				<el-button size="default" type="primary" @click="getTableData" class="ml10">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAdd">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增
				</el-button>
			</div>
			<el-table :data="tableData" v-loading="loading" style="width: 100%">
				<el-table-column type="index" label="序号" width="100" />
				<el-table-column prop="name" label="映射名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="source_code" label="Lis字典" show-overflow-tooltip></el-table-column>
				<el-table-column prop="target_code" label="Carss字典" show-overflow-tooltip></el-table-column>
				<el-table-column prop="properties" label="描述信息" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="200" align="center">
					<template #default="scope">
						<el-button  size="small" text type="primary" @click="onOpenMapper(scope.row)">映射</el-button>
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
		<Dialog ref="dialogRef" :title="dialogTitle" @refresh="getTableData" />
		<!-- <FileDialog ref="fileDialogRef" :title="fileDialogTitle" @refresh="getTableData" /> -->
	</div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { mapList,deleteMap } from '/@/api/dictionary/index';
import Dialog from '/@/views/cams/mapper/dialog.vue';
import { mappingList,deleteMapping } from '/@/api/dictionary/index';

const router = useRouter();

// 定义变量内容
const dialogTitle = ref('');
const dialogRef = ref();
// const fileDialogTitle = ref('');
// const fileDialogRef = ref();

const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({
	// keyword:'',
	// type:'lis_dic'
});
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});

// 初始化表格数据
const getTableData = async () => {
	loading.value = true;
	queryParams.value.limit = tableParams.value.pageSize;
	queryParams.value.offset = tableParams.value.pageSize * (tableParams.value.page-1);

	var res = await mappingList(queryParams.value.limit,queryParams.value.offset);
	var data = res.data;
	tableData.value = data;
	tableParams.value.total = res.total;
	setTimeout(() => {
		loading.value = false;
	}, 500);
};

// // 打开上传文件页面
// const onOpeFileUpload = () => {
// 	fileDialogTitle.value = '字典导入';
// 	fileDialogRef.value.openDialog();
// };

// 打开映射页面
const onOpenMapper = (row: any) => {
	router.push({
		path: '/lab/mapper',
		query: {
			sourceCode: row.source_code,
			targetCode: row.target_code,
		},
	});
};

// 打开新增弹窗
const onOpenAdd = () => {
	dialogTitle.value = '添加映射';
	dialogRef.value.openDialog();
};

// 删除
const onRowDel = (row: any) => {
	ElMessageBox.confirm(`此操作将永久删除映射：“${row.name}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			deleteMapping(row.source_code,row.target_code);
			ElMessage.success('删除成功');
			getTableData();
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
