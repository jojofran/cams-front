<template>
	<div class="system-role-container layout-padding">
		<div class="system-role-padding layout-padding-auto layout-padding-view">
			<div class="system-user-search mb15">
				<el-select v-model="queryParams.timeField" size="default" placeholder="请选择时间字段" style="max-width: 180px">
					<el-option v-for="(item, index) in timeFieldList" :key="index" :value="item.value" :label="item.label" />
				</el-select>
				<el-date-picker start-placeholder="开始日期" end-placeholder="结束日期" v-model="dateRange"  value-format="YYYY/MM/DD" type="daterange" style="height:32px;" />
				<el-input v-model="queryParams.id_num" size="default" placeholder="请输入病例号" style="max-width: 180px"> </el-input>
				<el-input v-model="queryParams.keyword" size="default" placeholder="%姓名，菌种模糊查询%" style="max-width: 180px"> </el-input>
				
				<el-button size="default" type="primary" @click="getTableData()" class="ml10">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="exportDataList()">
					<el-icon>
						<ele-Download />
					</el-icon>
					导出数据
				</el-button>
			</div>
			<el-table :data="tableData" v-loading="loading" style="width: 100%">
				<el-table-column type="index" label="序号" width="60" fixed="left" />
				<el-table-column prop="id_num" label="流水号" width="150" fixed="left" >
					<template #default="scope">
						<span style="color:blue;">{{scope.row.id_num}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="institute_code" label="分院代码" width="100"></el-table-column>
				<el-table-column prop="patient_id" label="病历号" width="100"></el-table-column>
				<el-table-column prop="name" label="病人姓名" width="100"></el-table-column>
				<el-table-column prop="sex" label="性别" width="60"></el-table-column>
				<el-table-column prop="date_of_birth" label="出生日期" width="100"></el-table-column>
				<el-table-column prop="date_of_visit" label="就诊日期" width="100"></el-table-column>
				<el-table-column prop="age" label="年龄" width="150"></el-table-column>
				<el-table-column prop="ward_code" label="科室代码" width="100"></el-table-column>
				<el-table-column prop="ward_name" label="科室名称" width="100"></el-table-column>
				<el-table-column prop="carss_department_code" label="CARSS专业类别" width="150"></el-table-column>
				<el-table-column prop="chifungi_department_code" label="CHIFUNGI专业类别" width="150"></el-table-column>
				<el-table-column prop="specimen_num" label="样本号" width="100"></el-table-column>
				<el-table-column prop="specimen_type" label="样本类别" width="100"></el-table-column>
				<el-table-column prop="specimen_name" label="样本名称" width="100"></el-table-column>
				<el-table-column prop="specimen_collection_date" label="样本采集日期" width="150"></el-table-column>
				<el-table-column prop="specimen_checkin_date" label="样本核收日期" width="150"></el-table-column>
				<el-table-column prop="report_date" label="报告日期" width="150"></el-table-column>
				<el-table-column prop="organism_code" label="菌种代码" width="100"></el-table-column>
				<el-table-column prop="organism_name" label="菌种名称" width="100"></el-table-column>
				<el-table-column prop="organism_type" label="菌种类型" width="100"></el-table-column>
				<el-table-column prop="diagnosis" label="诊断" width="150"></el-table-column>
				<el-table-column prop="carbgene" label="碳青霉烯酶基因类型" width="150"></el-table-column>

				<el-table-column label="操作" width="100" fixed="right">
					<template #default="scope">
						<el-button  size="small" text type="primary" @click="onOpenDetail(scope.row)">详情</el-button>
						<!-- <el-button  size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button> -->
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
	</div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { downloadByData, getFileName } from '/@/utils/download';
import { useRouter } from 'vue-router';
import moment from 'moment';
import { caseList } from '/@/api/case/index';
import { exportData } from '/@/api/excel/index';

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

const dateRange = ref<any>([]);

const timeFieldList = ref<any>([
	{ label: '样本采集日期', value: 'SPECIMEN_COLLECTION_DATE' },
	{ label: '样本核收日期', value: 'SPECIMEN_CHECKIN_DATE' },
	{ label: '记录创建时间', value: 'CREATE_TIME' }
]);

// 初始化表格数据
const getTableData =async () => {
	loading.value = true;
	queryParams.value.begin_time = dateRange.value[0];
	queryParams.value.end_time = dateRange.value[1];
	queryParams.value.limit = tableParams.value.pageSize;
	queryParams.value.offset = tableParams.value.pageSize * (tableParams.value.page-1);
	queryParams.value.isInvalid = false;
	queryParams.value.timeField="";

	var res = await caseList(queryParams);
	var data = res.data;
	for(var i=0;i<data.length;i++){
		data[i].date_of_birth = utcToLocalDate(data[i].date_of_birth);
		data[i].date_of_visit = utcToLocalDate(data[i].date_of_visit);
		data[i].specimen_collection_date = utcToLocalTime(data[i].specimen_collection_date);
		data[i].specimen_checkin_date = utcToLocalTime(data[i].specimen_checkin_date);
		data[i].report_date = utcToLocalTime(data[i].report_date);
	}
	tableData.value = data;
	tableParams.value.total = res.total;
	setTimeout(() => {
		loading.value = false;
	}, 500);
};

// 导出数据
const exportDataList = async () => {
	var type = 'aa';
	var code = 'bb';
	var res = await exportData(type,code);
	downloadByData(res.data as any, '菌株信息.xlsx');
}

// 打开新增弹窗
const onOpenAdd = () => {
	lisDialogTitle.value = '添加数据源';
	lisDialogRef.value.openDialog();
};
// 打开修改弹窗
const onOpenDetail = (row: any) => {
	router.push({
		path: '/viewList/detail',
		query: {
			id_num: row.id_num,
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

// 这里date是后端返回的字符串格式，如：2022-05-13 16:31:53
const utcToLocalDate = (date:any) => {
  const fmt = 'YYYY-MM-DD'
  return moment.utc(date).local().format(fmt)
}

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

