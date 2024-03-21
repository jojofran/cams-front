<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="props.title" v-model="isShowDialog" width="769px">
			<el-form ref="roleDialogFormRef" :model="ruleForm" size="default" label-width="150px" :rules="rules">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="时间字段" prop="timeField">
							<el-select v-model="ruleForm.timeField" placeholder="请选择时间字段" clearable class="w100">
								<el-option v-for="(item, index) in timeFieldList" :key="index" :value="item.value" :label="item.label" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="开始时间" prop="beginTime">
							<el-date-picker
								v-model="ruleForm.beginTime"
								type="date"
								placeholder="选择开始时间"
								:size="size"
							/>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="结束时间" prop="endTime">
							<el-date-picker
								v-model="ruleForm.endTime"
								type="date"
								placeholder="选择结束时间"
								:size="size"
							/>
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
import { Clear } from '/@/api/view/index';

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



//自行添加其他规则
const rules = ref<FormRules>({
	beginTime: [{required: true, message: '请选择开始时间', trigger: 'blur',},],
	endTime: [{required: true, message: '请选择结束时间', trigger: 'blur',},],
	timeField: [{required: true, message: '请选择时间字段', trigger: 'blur',},],
});

const timeFieldList = ref<any>([
	{ label: '样本采集日期', value: 'SPECIMEN_COLLECTION_DATE' },
	{ label: '样本核收日期', value: 'SPECIMEN_CHECKIN_DATE' },
	{ label: '记录创建时间', value: 'CREATE_TIME' }
]);

// 打开弹窗
const openWindow = () => {
	ruleForm.value = {};
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
	alert(1111)
  roleDialogFormRef.value.validate(async (isValid: boolean, fields?: any) => {
    if (isValid) {
      let values = ruleForm.value;
      Clear(values);
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
	openWindow,
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
