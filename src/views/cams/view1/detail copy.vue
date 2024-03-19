<template>
	<div>
		<el-card style="height: 65px">
			<div>
				<el-tag style="cursor: pointer" type="danger" @click="() => $router.go(-1)">后退</el-tag>
				<el-divider direction="vertical" />
				<span style="color:blue">{{ router.currentRoute.value.query.no }}</span>
				<span>【姓名：</span>
				<span>张三</span>
				<span>】</span>
			</div>
		</el-card>
		<el-card shadow="hover" style="margin-top: -5px; height: 91%; width: 100%">
			<div style="width: 95%; float: left">
				<el-descriptions class="margin-top" :column="4" border>
					<el-descriptions-item label="充电桩编号" label-align="center" width="500">
						111
					</el-descriptions-item>
					<el-descriptions-item label="设备型号" label-align="center" width="500">
						111
					</el-descriptions-item>
					<el-descriptions-item label="所属站点" label-align="center" width="500">
						111
					</el-descriptions-item>
					<el-descriptions-item label="回路数量" label-align="center" width="500">
						111
					</el-descriptions-item>

					<!-- <el-descriptions-item label="充电方式" label-align="center">
						{{ chargingTypeName(cstationInfo.chargingType) }}
					</el-descriptions-item>
					<el-descriptions-item label="是否私桩" label-align="center">
						{{ cstationInfo.isPrivate?'是':'否' }}
					</el-descriptions-item>
					<el-descriptions-item label="地址：" span="2" label-align="center">
						{{ cstationInfo.address }}
					</el-descriptions-item> -->

					<el-descriptions-item label="采集时间" label-align="center">
						111
					</el-descriptions-item>
					<el-descriptions-item label="今日电量(KWH)" label-align="center">
						111
					</el-descriptions-item>
					<el-descriptions-item label="今日次数(次)" label-align="center">
						111
					</el-descriptions-item>
					<el-descriptions-item label="今日时长(分钟)" label-align="center">
						111
					</el-descriptions-item>

					<el-descriptions-item label="采集时间" label-align="center">
						111
					</el-descriptions-item>
					<el-descriptions-item label="今日电量(KWH)" label-align="center">
						111
					</el-descriptions-item>
					<el-descriptions-item label="今日次数(次)" label-align="center">
						111
					</el-descriptions-item>
					<el-descriptions-item label="今日时长(分钟)" label-align="center">
						111
					</el-descriptions-item>
				</el-descriptions>
			</div>
			<!-- <el-divider></el-divider> -->
			<div style="margin-top:20px;width:50%;float:left">
				<el-table :data="tableData" v-loading="loading" style="width: 100%">
					<el-table-column type="index" label="序号" width="60" />
					<el-table-column prop="column9" label="标本号" width="100"></el-table-column>
					<el-table-column prop="column12" label="标本采集日期" width="100"></el-table-column>
					<el-table-column prop="column14" label="菌种类型" width="100"></el-table-column>
					<el-table-column prop="column15" label="菌种代码" width="100"></el-table-column>
					<el-table-column prop="column15" label="菌种代码" width="100"></el-table-column>
					<el-table-column prop="column16" label="菌种名称" width="150"></el-table-column>
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
			<div style="margin-top:20px;width:50%;float:left">
				<el-table :data="tableData" v-loading="loading" style="width: 100%">
					<el-table-column type="index" label="序号" width="60" />
					<el-table-column prop="column9" label="标本号" width="100"></el-table-column>
					<el-table-column prop="column12" label="标本采集日期" width="100"></el-table-column>
					<el-table-column prop="column14" label="菌种类型" width="100"></el-table-column>
					<el-table-column prop="column15" label="菌种代码" width="100"></el-table-column>
					<el-table-column prop="column15" label="菌种代码" width="100"></el-table-column>
					<el-table-column prop="column16" label="菌种名称" width="150"></el-table-column>
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
		</el-card>
	</div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
// import LisDialog from '/@/views/cams/dataSource/dialog.vue';

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
	for (let i = 0; i < 10; i++) {
		data.push({
			column1:'20210000130130',
			column2:'郗娟坚',
			column3:'女',
			column4:'1964-01-10',
			column5:'60',
			column6:'岁',
			column7:'B001',
			column8:'门诊妇科(3楼B区)	',
			column9:'230820101',
			column10:'',
			column11:'',
			column12:'2023-05-09',
			column13:'2023-08-09',
			column14:'沙雷菌属',
			column15:'se-',
			column16:'沙雷菌属(Serratia sp.)'
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
	lisDialogTitle.value = '添加数据源';
	lisDialogRef.value.openDialog();
};
// 打开修改弹窗
const onOpenDetail = (row: any) => {
	router.push({
		path: '/view1/detail',
		query: {
			no: row.column1,
		},
	});
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
