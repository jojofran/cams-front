<template>
	<div class="system-role-container layout-padding">
		<div class="system-role-padding layout-padding-auto layout-padding-view">
			<div class="system-user-search mb15">
				<!-- <el-select v-model="queryParams.dataType" placeholder="请选择数据库类型" clearable style="max-width: 180px;height:32px;">
					<el-option v-for="(item, index) in dataTypeList" :key="index" :value="item.value" :label="item.label" />
				</el-select> -->
				<el-input v-model="queryParams.dataSourceName" size="default" placeholder="请输入数据库名称" style="max-width: 180px"> </el-input>
				<el-button size="default" type="primary" class="ml10">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAdd()">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增实验室
				</el-button>
			</div>
			<el-table :data="tableData" v-loading="loading" style="width: 100%">
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="column1" label="实验室代码" show-overflow-tooltip></el-table-column>
				<el-table-column prop="column2" label="实验室简称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="column3" label="实验室名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="column4" label="所属国家" show-overflow-tooltip></el-table-column>
				<el-table-column prop="column5" label="所在省份" show-overflow-tooltip></el-table-column>
				<el-table-column prop="column6" label="LIS数据交换方式" show-overflow-tooltip></el-table-column>
				<el-table-column prop="column7" label="药敏仪器连接" show-overflow-tooltip></el-table-column>
				<el-table-column prop="column8" label="折点指南" show-overflow-tooltip></el-table-column>
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
		<!-- <LisDialog ref="lisDialogRef" :title="lisDialogTitle" @refresh="getTableData" /> -->
	</div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
// import LisDialog from '/@/views/cams/basicInformation/dialog.vue';

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
const getTableData = () => {
	loading.value = true;
	const data = [];
	for (let i = 0; i < 1; i++) {
		data.push({
			column1:'实验室1',
			column2:'测试实验室1',
			column3:'1号测试实验室',
			column4:'中华人民共和国',
			column5:'北京',
			column6:'SQL Server	',
			column7:'Myla FTP数据连接器',
			column8:'CLSI2020',

			dataType: i < 5 ? 'SQLServer' : 'MySql',
			ip: '127.0.0.1',
			port: i < 5 ? '1433' : '3306',
			dataSourceName: `camsData${i + 1}`,
			userId: 'sa',
			status: true,
			pwd:'123456',
			createTime: new Date().toLocaleString(),
		});
	}
	tableData.value = data;
	tableParams.value.total = tableData.value.length;
	setTimeout(() => {
		loading.value = false;
	}, 500);
};
// 打开新增弹窗
const onOpenAdd = () => {
	lisDialogTitle.value = '添加';
	lisDialogRef.value.openDialog();
};
// 打开修改弹窗
const onOpenEdit = (row: any) => {
	lisDialogTitle.value = '编辑';
	lisDialogRef.value.openDialog(row);
};
// 删除
const onRowDel = (row: any) => {
	ElMessageBox.confirm(`此操作将永久删除：“${row.roleName}”，是否继续?`, '提示', {
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
