<template>
	<div class="system-role-container layout-padding">
		<div class="system-role-padding layout-padding-auto layout-padding-view">
			<div class="system-user-search mb15">
				<el-input v-model="queryParams.name" size="default" placeholder="请输入数据源名称" style="max-width: 180px"> </el-input>
				<el-button size="default" type="primary" class="ml10" @click="getTableData()">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAdd()">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增数据源
				</el-button>
			</div>
			<el-table :data="tableData" v-loading="loading" style="width: 100%">
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="code" label="数据源编码" width="150"></el-table-column>
				<el-table-column prop="name" label="数据源名称" width="150"></el-table-column>
				<el-table-column prop="db_type" label="数据库类型" width="100"></el-table-column>
				<el-table-column prop="connect_str" label="连接字符串" show-overflow-tooltip></el-table-column>
				<!-- <el-table-column prop="tableName" label="表名" width="150"></el-table-column> -->
				<el-table-column prop="lab_name" label="实验室" width="100"></el-table-column>
				<el-table-column prop="create_time" label="创建时间" width="150"></el-table-column>
				<el-table-column label="操作" width="100">
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
		<!-- <LisDialog ref="lisDialogRef" @refresh="getTableData()" /> -->
		<LisDialog ref="lisDialogRef" :title="lisDialogTitle" @refresh="getTableData" />
	</div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import moment from 'moment';
import LisDialog from '/@/views/cams/dataSource/dialog.vue';
import { sourceList } from '/@/api/dataSource/index';

// const useSourceApi = sourceApi();

// 引入组件
// const LisDialog = defineAsyncComponent(() => import('/@/views/cams/lis/dialog.vue'));

// 定义变量内容
const lisDialogTitle = ref('');
const lisDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({});
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});

const dataTypeList = ref<any>([
	{ label: 'SQLServer', value: 'SQLServer' },
	{ label: 'MySql', value: 'MySql' }
]);


// 初始化表格数据
const getTableData = async () => {
	loading.value = true;
	var res = await sourceList();
	var data = res.data;
	for(var i=0;i<data.length;i++){
		data[i].create_time = utcToLocalTime(data[i].create_time);
	}
	tableData.value = data;
	tableParams.value.total = tableData.value.length;
	setTimeout(() => {
		loading.value = false;
	}, 500);
};
// 打开新增弹窗
const onOpenAdd = () => {
	lisDialogTitle.value = '添加数据源';
	lisDialogRef.value.openDialog();
};
// 打开修改弹窗
const onOpenEdit = (row: any) => {
	lisDialogTitle.value = '编辑数据源';
	lisDialogRef.value.openDialog(row);
};
// 删除
const onRowDel = (row: any) => {
	ElMessageBox.confirm(`此操作将永久删除数据源：“${row.roleName}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			getTableData();
			ElMessage.success('删除成功');
		})
		.catch(() => {});
};

const utcToLocalTime = (date:any) => {
  const fmt = 'YYYY-MM-DD HH:mm:ss'
  return moment.utc(date).local().format(fmt)
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
