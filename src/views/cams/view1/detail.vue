<template>
	<div>
		<el-card style="height: 65px">
			<div>
				<el-tag style="cursor: pointer" type="danger" @click="() => $router.go(-1)">后退</el-tag>
				<el-divider direction="vertical" />
				<span style="color:blue">{{ router.currentRoute.value.query.id_num }}</span>
				<span>【姓名：</span>
				<span>{{ruleForm.name}}</span>
				<span>】</span>
			</div>
		</el-card>
		<el-card shadow="hover" class="box-card" style="margin-top: 0px; height: 180px; width: 100%">
			<el-descriptions title="基本信息" class="margin-top" :column="6" :border="false">
				<el-descriptions-item label="病人姓名" label-align="center" width="500">
					<span style="color:blue">{{ruleForm.name}}</span>
				</el-descriptions-item>
				<el-descriptions-item label="性别" label-align="center" width="500">
					<span style="color:blue">{{ruleForm.sex}}</span>
				</el-descriptions-item>
				<el-descriptions-item label="出生日期" label-align="center" width="500">
					<span style="color:blue">{{ruleForm.date_of_birth}}</span>
				</el-descriptions-item>
				<el-descriptions-item label="流水号" label-align="center" width="500">
					<span style="color:blue">{{ruleForm.id_num}}</span>
				</el-descriptions-item>
				<el-descriptions-item label="分院代码" label-align="center" width="500">
					<span style="color:blue">{{ruleForm.institute_code}}</span>
				</el-descriptions-item>
				<el-descriptions-item label="病历号" label-align="center" width="500">
					<span style="color:blue">{{ruleForm.patient_id}}</span>
				</el-descriptions-item>

				<el-descriptions-item label="就诊日期" label-align="center">
					<span style="color:blue">{{ruleForm.date_of_visit}}</span>
				</el-descriptions-item>
				<el-descriptions-item label="年龄" label-align="center">
					<span style="color:blue">{{ruleForm.age}}</span>
				</el-descriptions-item>
				<el-descriptions-item label="科室代码" label-align="center">
					<span style="color:blue">{{ruleForm.ward_code}}</span>
				</el-descriptions-item>
				<el-descriptions-item label="科室名称" label-align="center">
					<span style="color:blue">{{ruleForm.ward_name}}</span>
				</el-descriptions-item>
				<!-- <el-descriptions-item label="CARSS专业类别" label-align="center">
					<span style="color:blue">{{ruleForm.carss_department_code}}</span>
				</el-descriptions-item>
				<el-descriptions-item label="CHIFUNGI专业类别" label-align="center">
					<span style="color:blue">{{ruleForm.chifungi_department_code}}</span>
				</el-descriptions-item> -->

				<el-descriptions-item label="样本号" label-align="center">
					<span style="color:blue">{{ruleForm.specimen_num}}</span>
				</el-descriptions-item>
				<el-descriptions-item label="样本类别" label-align="center">
					<span style="color:blue">{{ruleForm.specimen_type}}</span>
				</el-descriptions-item>
				<el-descriptions-item label="样本名称" label-align="center">
					<span style="color:blue">{{ruleForm.specimen_name}}</span>
				</el-descriptions-item>
				<el-descriptions-item label="样本采集日期" label-align="center">
					<span style="color:blue">{{ruleForm.specimen_collection_date}}</span>
				</el-descriptions-item>
				<el-descriptions-item label="样本核收日期" label-align="center">
					<span style="color:blue">{{ruleForm.specimen_checkin_date}}</span>
				</el-descriptions-item>
				<el-descriptions-item label="报告日期" label-align="center">
					<span style="color:blue">{{ruleForm.report_date}}</span>
				</el-descriptions-item>

				<el-descriptions-item label="菌种代码" label-align="center">
					<span style="color:red">{{ruleForm.organism_code}}</span>
				</el-descriptions-item>
				<el-descriptions-item label="菌种名称" label-align="center">
					<span style="color:red">{{ruleForm.organism_name}}</span>
				</el-descriptions-item>
				<el-descriptions-item label="菌种类型" label-align="center">
					<span style="color:red">{{ruleForm.organism_type}}</span>
				</el-descriptions-item>
				<el-descriptions-item label="诊断" label-align="center">
					<span style="color:red">{{ruleForm.diagnosis}}</span>
				</el-descriptions-item>
				<el-descriptions-item label="碳青霉烯酶基因类型" label-align="center">
					<span style="color:red">{{ruleForm.carbgene}}</span>
				</el-descriptions-item>
			</el-descriptions>
		</el-card>
		<el-card shadow="hover" class="box-card" style="margin-top: 2px; height: 500px; width: 100%;float:left;">
			<el-descriptions title="药敏结果" class="margin-top" :column="6" :border="false">
				<template #extra>
					<el-button type="success" @click="onOpenAdd()">
						<el-icon>
							<ele-FolderAdd />
						</el-icon>
						新增
					</el-button>
				</template>
			
			</el-descriptions>
			<el-table :data="tableData" v-loading="loading" style="width: 100%;">
    			<el-table-column type="index" label="序号" width="60" />
   				<el-table-column prop="antibiotic_code" label="药物代码" width="100"></el-table-column>
    			<el-table-column prop="antibiotic_cn_name" label="药物中文名称" width="150"></el-table-column>
    			<el-table-column prop="method" label="药敏方法" width="150"></el-table-column>
    			<el-table-column prop="field_code" label="药敏字段代码" width="auto"></el-table-column>
    			<el-table-column prop="test_value" label="药敏结果值" width="auto"></el-table-column>
    			<el-table-column prop="test_result" label="药敏判定结果" width="auto"></el-table-column>
    			<el-table-column prop="instrument" label="药敏仪器名称" width="150"></el-table-column>
    			<el-table-column prop="card_mode" label="板卡型号" width="100"></el-table-column>
    			<el-table-column label="操作" width="200" align="center" fixed="right" show-overflow-tooltip="">
        <template #default="scope">
            <el-button size="small" text type="primary" @click="onOpenEdit(scope.row)">修改</el-button>
            <el-button size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
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
		</el-card>
		<EditDialog ref="dialogRef" :title="dialogTitle" @refresh="getTableData" />
	</div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import moment from 'moment';
import { caseList,caseResults,modifyResult } from '/@/api/case/index';
import EditDialog from '/@/views/cams/view1/dialog.vue';

const router = useRouter();

// 定义变量内容
const loading = ref(false);
const tableData = ref<any>([]);
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});
const queryParams = ref<any>({});
const queryResultParams = ref<any>({});
const ruleForm = ref<any>({});

const dialogTitle = ref('');
const dialogRef = ref();

// 初始化页面数据
const initData = async () => {
	queryParams.value.id_num = router.currentRoute.value.query.id_num;
	queryParams.value.limit = 1;
	queryParams.value.offset = 0;

	var res = await caseList(queryParams);
	var data = res.data;
	for(var i=0;i<data.length;i++){
		data[i].date_of_birth = utcToLocalDate(data[i].date_of_birth);
		data[i].date_of_visit = utcToLocalDate(data[i].date_of_visit);
		data[i].specimen_collection_date = utcToLocalTime(data[i].specimen_collection_date);
		data[i].specimen_checkin_date = utcToLocalTime(data[i].specimen_checkin_date);
		data[i].report_date = utcToLocalTime(data[i].report_date);
	}
	ruleForm.value = res.data[0];
	getTableData();
}

// 查询药敏数据列表
const getTableData = async () => {
	loading.value = true;
	queryResultParams.value.limit = tableParams.value.pageSize;
	queryResultParams.value.offset = tableParams.value.pageSize * (tableParams.value.page-1);

	var id_num = router.currentRoute.value.query.id_num;
	var res = await caseResults(id_num,queryResultParams);
	tableData.value = res.data;
	tableParams.value.total = tableData.value.length;
	setTimeout(() => {
		loading.value = false;
	}, 500);
};

// 打开修改弹窗
const onOpenEdit = (row: any) => {
	dialogTitle.value = '修改数据';
	dialogRef.value.openDialog(row);
};


// 打开新增弹窗
const onOpenAdd = () => {
	dialogTitle.value = '新增数据';
	dialogRef.value.openDialog();
};

// 删除
const onRowDel = (row: any) => {
	ElMessageBox.confirm(`此操作将永久删除数据：“${row.antibiotic_cn_name}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
	.then(() => {
		var model = {
			deletes:[row.id]
		};
		modifyResult(model);
		ElMessage.success('删除成功');
		getTableData();
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
	initData();
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
