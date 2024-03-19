<template>
	<div>
		<el-card shadow="hover" class="box-card" style="margin-top: 0px; height: 100px; width: 100%">
			<el-descriptions title="基本信息" class="margin-top" :column="6" :border="false">
			</el-descriptions>
			<div class="system-user-search mb15">
				<el-input v-model="queryParams.name" size="default" placeholder="请输入" disabled style="max-width: 180px"> </el-input>
				<el-select v-model="queryParams.db_type" placeholder="请选择标准字典" clearable size="default">
					<el-option v-for="(item, index) in dataTypeList" :key="index" :value="item.value" :label="item.label" />
				</el-select>
				<el-select v-model="queryParams.db_type" placeholder="请选择匹配字段" clearable size="default">
					<el-option v-for="(item, index) in dataTypeList" :key="index" :value="item.value" :label="item.label" />
				</el-select>
				<el-button size="default" type="primary" class="ml10" @click="getTableData()">
					<el-icon>
						<ele-Search />
					</el-icon>
					一键匹配
				</el-button>
			</div>
		</el-card>
		<el-card shadow="hover" class="box-card" style="margin-top: 2px; height: 500px; width: 50%;float:left;">
			<el-tabs type="border-card">
				<el-tab-pane label="匹配失败">

				</el-tab-pane>
				<el-tab-pane label="匹配成功">
					<el-table :data="tableData" v-loading="loading" style="width: 100%;">
						<el-table-column label="LiS字典" align="center">
							<el-table-column prop="column9" label="Name1" width="80" />
							<el-table-column prop="column12" label="Name2" width="80" />
							<el-table-column prop="column14" label="Name3" width="80" />
							<el-table-column prop="column15" label="Name4" width="80" />
						</el-table-column>
						<el-table-column label="标准字典" align="center">
							<el-table-column prop="column14" label="State" width="80" />
							<el-table-column prop="column15" label="City" width="80" />
							<el-table-column prop="column12" label="Address" width="80" />
							<el-table-column prop="column16" label="Zip" width="150" />
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
					></el-pagination>
				</el-tab-pane>
			</el-tabs>
			<!-- <el-descriptions title="匹配成功" class="margin-top" :column="6" :border="true"></el-descriptions> -->
		</el-card>
		<el-card shadow="hover" class="box-card" style="margin-top: 2px; height: 500px; width: 50%;float:left;">
			<el-descriptions title="匹配失败" class="margin-top" :column="6" :border="false">
			</el-descriptions>
			<el-table :data="tableData" v-loading="loading" style="width: 100%;">
				<el-table-column label="LiS字典" align="center">
					<el-table-column prop="column9" label="Name1" width="80" />
					<el-table-column prop="column12" label="Name2" width="80" />
					<el-table-column prop="column14" label="Name3" width="80" />
					<el-table-column prop="column15" label="Name4" width="80" />
				</el-table-column>
				<el-table-column label="标准字典" align="center">
					<!-- <el-table-column prop="column14" label="State" width="80" /> -->
					<el-table-column prop="column14" label="菌种类型" width="80" align="center">
						<template #default="scope">
							<el-select v-model="scope.row.column14" placeholder="请选择字典" clearable  style="width:100%;text-align: center;">
								<el-option v-for="(item, index) in dataTypeList" :key="index" :value="item.value" :label="item.label" />
							</el-select>
						</template>
					</el-table-column>
					<el-table-column prop="column15" label="City" width="80" />
					<el-table-column prop="column12" label="Address" width="80" />
					<el-table-column prop="column16" label="Zip" width="150" />
				</el-table-column>
				<!-- <el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="column9" label="标本号" width="100"></el-table-column>
				<el-table-column prop="column12" label="标本采集日期" width="100"></el-table-column>

				<el-table-column prop="column14" label="菌种类型" width="150" align="center">
					<template #default="scope">
						<el-select v-model="scope.row.name" placeholder="请选择字典" clearable  style="width:100%;text-align: center;">
							<el-option v-for="(item, index) in dataTypeList" :key="index" :value="item.value" :label="item.label" />
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="column15" label="菌种代码" width="100"></el-table-column>
				<el-table-column prop="column16" label="菌种名称" width="150"></el-table-column>
				<el-table-column label="操作" width="100" fixed="right">
					<template #default="scope">
						<el-button  size="small" text type="primary" @click="onOpenDetail(scope.row)">手动匹配</el-button>
					</template>
				</el-table-column> -->
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

.el-select {
  width: 180px;
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
