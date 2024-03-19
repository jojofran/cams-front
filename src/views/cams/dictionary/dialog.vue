<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="props.title" v-model="isShowDialog" width="900px" height="500px">
			<el-table :data="tableData" v-loading="loading" style="width: 100%">
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
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">确 定</el-button>
				</span>
			</template>
		</el-dialog>
		<AddOrEditDialog ref="dialogRef" :title="dialogTitle" @refresh="getTableData" />
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { mapValueList,modifymapValue} from '/@/api/dictionary/index';
import AddOrEditDialog from '/@/views/cams/dictionary/addOrEditDialog.vue';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: "",
	},
});

const loading = ref(false);
const tableheHead = ref<any>([]);
const tableData = ref<any>([]);
const queryParams = ref<any>({});
const tableParams = ref({
	page: 1,
	pageSize: 10,
	total: 0,
});
const mapCode = ref('');

// 定义变量内容
const dialogTitle = ref('');
const dialogRef = ref();

const roleDialogFormRef = ref();
const isShowDialog = ref(false);
const ruleForm = ref<any>({});

// 初始化表格数据
const getTableData = async () => {
	loading.value = true;
	queryParams.value.limit = tableParams.value.pageSize;
	queryParams.value.offset = tableParams.value.pageSize * (tableParams.value.page-1);
	queryParams.value.code = mapCode.value;
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

// 打开弹窗
const openDialog = (row: any) => {
	if(row != undefined){
		ruleForm.value = JSON.parse(JSON.stringify(row));
	}
	debugger
	tableheHead.value = JSON.parse(row.properties);
	mapCode.value = row.code;
	getTableData();
  	isShowDialog.value = true;
};
// 关闭弹窗
const closeDialog = () => {
	emit("refresh");
	isShowDialog.value = false;
};

// 打开新增弹窗
const onOpenAdd = () => {
	dialogTitle.value = '添加字典值';
	dialogRef.value.openDialog(tableheHead,ruleForm.value.code);
};

// 打开修改弹窗
const onOpenEdit = (row: any) => {
	dialogTitle.value = '编辑字典值';
	dialogRef.value.openDialog(tableheHead,ruleForm.value.code,row);
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
			modifymapValue(mapCode.value,param);
			getTableData();
			ElMessage.success('删除成功');
		})
		.catch(() => {});
};

// 取消
const onCancel = () => {
	closeDialog();
};
// 提交
const onSubmit = () => {
	closeDialog();
	emit('refresh');
	// if (state.dialog.type === 'add') { }
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.system-role-dialog-container {
	.menu-data-tree {
		width: 100%;
		border: 1px solid var(--el-border-color);
		border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
		padding: 5px;
	}
}
</style>
