<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="props.title" v-model="isShowDialog" width="769px">
			<el-form ref="roleDialogFormRef" :model="ruleForm" size="default" label-width="120px" :rules="rules">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="showColumn(0)">
						<el-form-item :label="getHeadLabel(0)" prop="attr_1">
							<el-input v-model="ruleForm.attr_1" :placeholder="getPlaceholder(0)" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="showColumn(1)">
						<el-form-item :label="getHeadLabel(1)" prop="attr_2">
							<el-input v-model="ruleForm.attr_2" :placeholder="getPlaceholder(1)" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="showColumn(2)">
						<el-form-item :label="getHeadLabel(2)" prop="attr_3">
							<el-input v-model="ruleForm.attr_3" :placeholder="getPlaceholder(2)" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="showColumn(3)">
						<el-form-item :label="getHeadLabel(3)" prop="attr_4">
							<el-input v-model="ruleForm.attr_4" :placeholder="getPlaceholder(3)" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="showColumn(4)">
						<el-form-item :label="getHeadLabel(4)" prop="attr_5">
							<el-input v-model="ruleForm.attr_5" :placeholder="getPlaceholder(4)" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="showColumn(5)">
						<el-form-item :label="getHeadLabel(5)" prop="attr_6">
							<el-input v-model="ruleForm.attr_6" :placeholder="getPlaceholder(5)" clearable></el-input>
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
import { modifymapValue} from '/@/api/dictionary/index';

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
const tableheHead = ref<any>([]);
const mapCode = ref('');

//自行添加其他规则
const rules = ref<FormRules>({
	attr_1: [{required: true, message: '此项不能为空', trigger: 'blur',},],
	attr_2: [{required: true, message: '此项不能为空', trigger: 'blur',},],
	attr_3: [{required: true, message: '此项不能为空', trigger: 'blur',},],
	attr_4: [{required: true, message: '此项不能为空', trigger: 'blur',},],
	attr_5: [{required: true, message: '此项不能为空', trigger: 'blur',},],
	attr_6: [{required: true, message: '此项不能为空', trigger: 'blur',},],
});

// 打开弹窗
const openDialog = (head:any,code:any,row: any) => {
	tableheHead.value = head.value;

	debugger
	mapCode.value = code;
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

const getHeadLabel = (index:any)=>{
	if(index > tableheHead.value.length-1)
	{
		return "";
	}
	else{
		return tableheHead.value[index].code;
	}
}

const getPlaceholder = (index:any)=>{
	if(index > tableheHead.value.length-1)
	{
		return "";
	}
	else{
		return '请输入'+tableheHead.value[index].code;
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


// 提交
const onSubmit = () => {
  roleDialogFormRef.value.validate(async (isValid: boolean, fields?: any) => {
    if (isValid) {
      let values = ruleForm.value;
	  var param = {adds:[values],deletes:[values.id]};
      modifymapValue(mapCode.value,param);
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
