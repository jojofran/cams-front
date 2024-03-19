<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="props.title" v-model="isShowDialog" width="769px">
			<el-form ref="roleDialogFormRef" :model="ruleForm" size="default" label-width="150px" :rules="rules">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="同步策略" prop="syncStrategy">
							<!-- <el-select v-model="ruleForm.syncStrategy" placeholder="请选择同步策略" clearable class="w100">
								<el-option v-for="(item, index) in strategyList" :key="index" :value="item.value" :label="item.label" />
							</el-select> -->
							<el-radio-group v-model="ruleForm.syncStrategy">
								<el-radio label="overwrite">覆盖</el-radio>
								<el-radio label="increment">增量</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
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
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="时间字段" prop="timeField">
							<el-select v-model="ruleForm.timeField" placeholder="请选择时间字段" clearable class="w100">
								<el-option v-for="(item, index) in timeFieldList" :key="index" :value="item.value" :label="item.label" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="错误数据处理" prop="errorDataStrategy">
							<!-- <el-select v-model="ruleForm.errorDataStrategy" placeholder="请选择错误数据处理策略" clearable class="w100">
								<el-option v-for="(item, index) in errorDataStrategyList" :key="index" :value="item.value" :label="item.label" />
							</el-select> -->
							<el-radio-group v-model="ruleForm.errorDataStrategy">
								<el-radio label="mark">标记</el-radio>
								<el-radio label="ignore">忽略</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="是否包含检验结果">
							<el-radio-group v-model="ruleForm.includeResult">
								<el-radio :label="true">是</el-radio>
								<el-radio :label="false">否</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="是否转换数据">
							<el-radio-group v-model="ruleForm.isConvert">
								<el-radio :label="true">是</el-radio>
								<el-radio :label="false">否</el-radio>
							</el-radio-group>
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
import { syncCreate } from '/@/api/view/index';

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

const strategyList = ref<any>([
	{ label: '覆盖', value: 'overwrite' },
	{ label: '增量', value: 'increment' }
]);

const timeFieldList = ref<any>([
	{ label: '样本采集日期', value: 'SPECIMEN_COLLECTION_DATE' },
	{ label: '样本核收日期', value: 'SPECIMEN_CHECKIN_DATE' },
	{ label: '记录创建时间', value: 'CREATE_TIME' }
]);

const errorDataStrategyList = ref<any>([
	{ label: '标记', value: 'mark' },
	{ label: '忽略', value: 'ignore' }
]);

//自行添加其他规则
const rules = ref<FormRules>({
	syncStrategy: [{required: true, message: '请选择同步策略', trigger: 'blur',},],
	beginTime: [{required: true, message: '请选择开始时间', trigger: 'blur',},],
	endTime: [{required: true, message: '请选择结束时间', trigger: 'blur',},],
	errorDataStrategy: [{required: true, message: '请选择错误数据处理策略', trigger: 'blur',},],
	timeField: [{required: true, message: '请选择时间字段', trigger: 'blur',},],
});

// 打开弹窗
const openDialog = () => {
	ruleForm.value = {};
	ruleForm.value.syncStrategy = 'overwrite';
	ruleForm.value.errorDataStrategy = 'mark';
	ruleForm.value.includeResult = true;
	ruleForm.value.isConvert = true;
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
  roleDialogFormRef.value.validate(async (isValid: boolean, fields?: any) => {
    if (isValid) {
      let values = ruleForm.value;
      syncCreate(values);
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
