<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="props.title" v-model="isShowDialog" width="769px">
			<el-form ref="dialogFormRef" :model="ruleForm" size="default" label-width="120px" :rules="rules">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="药物代码" prop="antibiotic_code">
							<el-input v-model="ruleForm.antibiotic_code" placeholder="请输入药物代码" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="药物中文名称" prop="antibiotic_cn_name">
							<el-input v-model="ruleForm.antibiotic_cn_name" placeholder="请输入药物中文名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="药敏方法" prop="method">
							<el-input v-model="ruleForm.method" placeholder="请输入药敏字段代码" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="药敏字段代码" prop="field_code">
							<el-input v-model="ruleForm.field_code" placeholder="请输入药敏字段代码" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="药敏结果值" prop="test_value">
							<el-input v-model="ruleForm.test_value" placeholder="请输入药敏结果值" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="药敏判定结果" prop="test_result">
							<el-input v-model="ruleForm.test_result" placeholder="请输入药敏判定结果" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="药敏仪器名称" prop="instrument">
							<el-input v-model="ruleForm.instrument" placeholder="请输入药敏仪器名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="板卡型号" prop="card_mode">
							<el-input v-model="ruleForm.card_mode" placeholder="请输入板卡型号" clearable></el-input>
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
import { modifyResult } from '/@/api/case/index';

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
	antibiotic_code: [{required: true, message: '请输入药物代码', trigger: 'blur',},],
	antibiotic_cn_name: [{required: true, message: '请输入药物中文名称', trigger: 'blur',},],
	method: [{required: true, message: '请输入药敏方法', trigger: 'blur',},],
	field_code: [{required: true, message: '请输入药敏字段代码', trigger: 'blur',},],
	test_value: [{required: true, message: '请输入药敏结果值', trigger: 'blur',},],
	test_result: [{required: true, message: '请输入药敏判定结果', trigger: 'blur',},],
	instrument: [{required: true, message: '请输入药敏仪器名称', trigger: 'blur',},],
	card_mode: [{required: true, message: '请输入板卡型号', trigger: 'blur',},],
});


// 打开弹窗
const openDialog = (row: any) => {
	ruleForm.value = {};
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
	  var model = {};
	  if(values.id!=undefined){
		model = {
			adds:[values],
			deletes:[values.id]
		};
	  }
	  else{
		model = {
			adds:[values],
			deletes:[]
		};
	  }
      modifyResult(model);
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
