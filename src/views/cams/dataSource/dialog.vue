<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="props.title" v-model="isShowDialog" width="769px">
			<el-form ref="roleDialogFormRef" :model="ruleForm" size="default" label-width="120px" :rules="rules">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="数据源编码" prop="code">
							<el-input v-model="ruleForm.code" placeholder="请输入数据源编码" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="数据源名称" prop="name">
							<el-input v-model="ruleForm.name" placeholder="请输入数据源名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="数据库类型" prop="dataType">
							<el-select v-model="ruleForm.db_type" placeholder="请选择数据库类型" clearable class="w100">
								<el-option v-for="(item, index) in dataTypeList" :key="index" :value="item.value" :label="item.label" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="实验室" prop="lab_name">
							<el-input v-model="ruleForm.lab_name" placeholder="请输入实验室名称" clearable></el-input>
							<!-- <el-select v-model="ruleForm.lab_name" placeholder="请选择实验室" clearable class="w100">
								<el-option v-for="(item, index) in labList" :key="index" :value="item.value" :label="item.label" />
							</el-select> -->
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="连接字符串" prop="connect_str">
							<el-input v-model="ruleForm.connect_str" placeholder="请输入连接字符串" clearable></el-input>
						</el-form-item>
					</el-col>
					<!-- <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="表名称">
							<el-input v-model="ruleForm.tableName" placeholder="表名称" clearable></el-input>
						</el-form-item>
					</el-col> -->
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onTest" size="default">测试连接</el-button>
					<el-button type="primary" @click="onSubmit" size="default">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage,FormRules } from "element-plus";
import { manage,dbTest } from '/@/api/dataSource/index';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

//父级传递来的参数
var props = defineProps({
	title: {
		type: String,
		default: "",
	},
});

// 定义变量内容
const roleDialogFormRef = ref();
const isShowDialog = ref(false);
const ruleForm = ref<any>({});

const dataTypeList = ref<any>([
	{ label: 'SQLServer', value: 'sqlserver' },
	{ label: 'MySql', value: 'mysql' }
]);

// const labList = ref<any>([
// 	{ label: '神经科', value: '神经科' },
// 	{ label: '外科', value: '外科' }
// ]);

//自行添加其他规则
const rules = ref<FormRules>({
	code: [{required: true, message: '请输入数据源编码', trigger: 'blur',},],
	name: [{required: true, message: '请输入数据源名称', trigger: 'blur',},],
	db_type: [{required: true, message: '请选择数据库类型', trigger: 'blur',},],
	connect_str: [{required: true, message: '请输入连接字符串', trigger: 'blur',},],
	lab_name: [{required: true, message: '请输入实验室名称', trigger: 'blur',},],
});


// 打开弹窗
const openDialog = (row: any) => {
	if(row != undefined){
		ruleForm.value = JSON.parse(JSON.stringify(row));
	}
  	isShowDialog.value = true;
};
// 关闭弹窗
const closeDialog = () => {
	emit("refresh");
	isShowDialog.value = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};

// 测试连接
const onTest = async () => {
	let values = ruleForm.value;
	values.create_time = null;
	var res = await dbTest(values);
	if(res.data){
		ElMessage({
			message: `连接成功`,
			type: "success",
		});
	}
	else{
		ElMessage({
			message: `连接失败：${res.message}`,
			type: "error",
		});
	}
};


// 提交
const onSubmit = () => {
  roleDialogFormRef.value.validate(async (isValid: boolean, fields?: any) => {
    if (isValid) {
      let values = ruleForm.value;
	  values.create_time = null;
      manage(values);
	  emit('refresh');
      closeDialog();
    } else {
      ElMessage({
        message: `表单有${Object.keys(fields).length}处验证失败，请修改后再提交`,
        type: "error",
      });
    }
  });
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
