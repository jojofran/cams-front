<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="props.title" v-model="isShowDialog" width="900px">
			<el-form ref="roleDialogFormRef" :model="ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="字段名称">
							<el-input v-model="ruleForm.column1" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-button icon="ele-Plus" type="primary" plain @click="addDataTypeRow">增加</el-button>
						<span style="font-size: 12px; color: gray; padding-left: 5px"> 数据校验规则 </span>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<template v-if="ruleForm.rulelist != undefined && ruleForm.rulelist.length > 0">
							<el-row :gutter="35" v-for="(v, k) in ruleForm.rulelist" :key="k">
								<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
									<el-form-item label="操作符" :prop="`rulelist[${k}].column1`">
										<template #label>
											<el-button icon="ele-Delete" type="danger" circle plain size="small" @click="deleteDataTypeRow(k)" />
											<!-- <span class="m20">操作符</span> -->
										</template>
										<el-select v-model="ruleForm.rulelist[k].column1" placeholder="操作符" @change="column1SelectChange(ruleForm.rulelist[k].column1,k)" clearable style="width:100px;">
											<el-option v-for="(item, index) in operationList" :key="index" :value="item.value" :label="item.label" />
										</el-select>

										<el-cascader v-if="ruleForm.rulelist[k].showCascader" v-model="ruleForm.rulelist[k].column2" :options="dicOptions" :props="props" @change="handleChange" style="width:300px;"/>
										<el-input v-if="!ruleForm.rulelist[k].showCascader" v-model="ruleForm.rulelist[k].column2" placeholder="数据值" clearable style="width:300px;"></el-input>
										
										<el-select v-model="ruleForm.rulelist[k].column3" placeholder="逻辑运算" clearable style="width:100px;">
											<el-option v-for="(item, index) in logicalOperatorList" :key="index" :value="item.value" :label="item.label" />
										</el-select>
									</el-form-item>
								</el-col>
							</el-row>
						</template>
						<el-empty description="空" v-else></el-empty>
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

<script setup lang="ts" name="systemRoleDialog">
import { reactive, ref } from 'vue';

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
const tableData = ref<any>([]);
const loading = ref(false);

const dataSourceList = ref<any>([
	{ label: '药敏数据A1', value: '药敏数据A1' },
	{ label: '药敏数据A2', value: '药敏数据A2' }
]);

const operationList = ref<any>([
	{ label: '包含', value: 'include' },
	{ label: '等于', value: 'equal' },
	{ label: '不等于', value: 'notEqual' },
	{ label: '大于', value: 'gt' },
	{ label: '小于', value: 'lt' },
	{ label: '大于等于', value: 'ge' },
	{ label: '小于等于', value: 'le' },
]);

const logicalOperatorList = ref<any>([
	{ label: '且', value: 'and' },
	{ label: '或', value: 'or' },
	{ label: '空', value: 'null' },
]);


const dicOptions = [
	{
    	value: '标本字典',
		label: '标本字典',
		children: [
			{
				value: '数字',
				label: '数字',
			},
			{
				value: '代码',
				label: '代码',
			},
			{
				value: '名称',
				label: '名称',
			}
		]
	},
	{
    	value: '菌种字典',
		label: '菌种字典',
		children: [
			{
				value: '数字',
				label: '数字',
			},
			{
				value: '代码',
				label: '代码',
			},
			{
				value: '名称',
				label: '名称',
			}
		]
	}
];


ruleForm.value.rulelist = []

// 初始化表格数据
const getTableData = () => {
	loading.value = true;
	const data = [];
	for (let i = 0; i < 20; i++) {
		data.push({
			column1:'CARBGENE'+(i+1),
			column2:'string',
		});
	}
	tableData.value = data;
	setTimeout(() => {
		loading.value = false;
	}, 500);
}

// const showCascader = ref(false);
const column1SelectChange = (value: any,key:any) => {
	if(value == 'include'){
		ruleForm.value.rulelist[key].showCascader = true;
	}
	else{
		ruleForm.value.rulelist[key].showCascader = false;
	}
};

// 增加数据类型行
const addDataTypeRow = () => {
	if (ruleForm.value.rulelist == undefined) ruleForm.value.rulelist = [];
	ruleForm.value.rulelist?.push({});
};

// 删除数据类型行
const deleteDataTypeRow = (k: number) => {
	ruleForm.value.rulelist?.splice(k, 1);
};

// 打开弹窗
const openRuleDialog = (row: any) => {
	if(row != undefined){
		ruleForm.value = JSON.parse(JSON.stringify(row));
	}
  	isShowDialog.value = true;
	getTableData();
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
	closeDialog();
	emit('refresh');
	// if (state.dialog.type === 'add') { }
};

// 暴露变量
defineExpose({
	openRuleDialog,
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
