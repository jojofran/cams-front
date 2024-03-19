<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="props.title" v-model="isShowDialog" width="1000px">
			<el-form ref="roleDialogFormRef" :model="ruleForm" size="small" label-width="150px">
				<el-row :gutter="35">
					<el-table :data="tableData" v-loading="loading" style="width: 100%">
						<el-table-column type="index" label="序号" width="60" />
						<el-table-column prop="task_id" label="任务编号" width="200"></el-table-column>
						<el-table-column prop="stage" label="阶段" width="auto"></el-table-column>
						<el-table-column prop="message" label="消息描述" width="auto"></el-table-column>
						<el-table-column prop="create_time" label="创建时间" width="150"></el-table-column>
					</el-table>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onCancel" size="default">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import moment from 'moment';
import { ElMessage,FormRules } from "element-plus";
import { gettaskLogs } from '/@/api/view/index';

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
const tableData = ref<any>([]);
// 定义变量内容
const roleDialogFormRef = ref();
const isShowDialog = ref(false);
const ruleForm = ref<any>({});

// 初始化表格数据
const getTableData =async (task_id:any) => {
	loading.value = true;
	var res = await gettaskLogs(task_id);
	var data = res.data;
	for(var i=0;i<data.length;i++){
		data[i].create_time = utcToLocalTime(data[i].create_time);
	}
	tableData.value = data;
	setTimeout(() => {
		loading.value = false;
	}, 500);
};


// 打开弹窗
const openDialog = (row:any) => {
	ruleForm.value = {};
	if(row != undefined){
		ruleForm.value = JSON.parse(JSON.stringify(row));
	}
	getTableData(ruleForm.value.task_id);
  	isShowDialog.value = true;
};

const utcToLocalTime = (date:any) => {
  const fmt = 'YYYY-MM-DD HH:mm:ss'
  return moment.utc(date).local().format(fmt)
}

// 关闭弹窗
const closeDialog = () => {
	emit("refresh");
	isShowDialog.value = false;
};
// 取消
const onCancel = () => {
	closeDialog();
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
