<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="props.title" v-model="isShowDialog" width="300">
			<el-form ref="dialogFormRef" :model="ruleForm" size="default" label-width="120px" :rules="rules">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="字典编码" prop="code">
							<el-input v-model="ruleForm.code" placeholder="请输入字典编码" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="字典名称" prop="name">
							<el-input v-model="ruleForm.name" placeholder="请输入字典名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="描述信息" prop="connect_str">
							<el-input v-model="ruleForm.desc" placeholder="请输入连接字符串" clearable></el-input>
						</el-form-item>
					</el-col>
					
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage,FormRules } from "element-plus";
import { createMap } from '/@/api/dictionary/index';

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
const dialogFormRef = ref();
const isShowDialog = ref(false);
const ruleForm = ref<any>({});


//自行添加其他规则
const rules = ref<FormRules>({
	code: [{required: true, message: '请输入字典编码', trigger: 'blur',},],
	name: [{required: true, message: '请输入字典名称', trigger: 'blur',},],
	desc: [{required: true, message: '请输入描述信息', trigger: 'blur',},],
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

// 提交
const onSubmit = () => {
  dialogFormRef.value.validate(async (isValid: boolean, fields?: any) => {
    if (isValid) {
      let values = ruleForm.value;
      createMap(values);
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
