<template>
	<div class="system-role-container layout-padding">
		<div class="system-role-padding layout-padding-auto layout-padding-view">
			<div class="system-user-search mb15">
				<el-date-picker start-placeholder="开始日期" end-placeholder="结束日期"
				 v-model="dateRange"  value-format="YYYY/MM/DD" type="daterange" style="height:32px;" />
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
					同步数据
				</el-button>
			</div>
			<el-table :data="tableData" v-loading="loading" style="width: 100%">
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="task_id" label="任务编号" width="150"></el-table-column>
				<el-table-column prop="params" label="参数" width="auto"></el-table-column>
				<el-table-column prop="status" label="状态" width="100"></el-table-column>
				<el-table-column prop="update_time" label="更新时间" width="150" show-overflow-tooltip></el-table-column>
				<el-table-column prop="create_time" label="创建时间" width="150"></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button  size="small" text type="primary" @click="onOpenDetail(scope.row)">详情</el-button>
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
		<SyncDialog ref="syncDialogRef" :title="syncDialogTitle" @refresh="getTableData" />
		<LogDialog ref="logDialogRef" title="日志记录详情"/>
	</div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import moment from 'moment';
import SyncDialog from '/@/views/cams/dataSync/syncDialog.vue';
import LogDialog from '/@/views/cams/dataSync/logDialog.vue';
import { taskList,syncCreate,gettaskLogs } from '/@/api/view/index';

// const useSourceApi = sourceApi();

// 引入组件
// const LisDialog = defineAsyncComponent(() => import('/@/views/cams/lis/dialog.vue'));

// 定义变量内容
const syncDialogTitle = ref('');
const syncDialogRef = ref();
const logDialogRef = ref();

const loading = ref(false);
const tableData = ref<any>([]);
const queryParams = ref<any>({});
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});
const dateRange = ref<any>([]);

// 初始化表格数据
const getTableData = async () => {
	loading.value = true;
	queryParams.value.begin_time = dateRange.value[0];
	queryParams.value.end_time = dateRange.value[1];
	queryParams.value.limit = tableParams.value.pageSize;
	queryParams.value.offset = tableParams.value.pageSize * (tableParams.value.page-1);

	var res = await taskList(queryParams.value);
	var data = res.data;
	for(var i=0;i<data.length;i++){
		data[i].create_time = utcToLocalTime(data[i].create_time);
		data[i].update_time = utcToLocalTime(data[i].update_time);
	}
	tableData.value = data;
	tableParams.value.total = tableData.value.length;
	setTimeout(() => {
		loading.value = false;
	}, 500);
};

// 打开新增弹窗
const onOpenAdd = () => {
	syncDialogTitle.value = '数据同步';
	syncDialogRef.value.openDialog();
};

// 打开详情
const onOpenDetail = (row:any) => {
	logDialogRef.value.openDialog(row);
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
