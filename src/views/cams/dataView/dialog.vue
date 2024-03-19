<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="props.title" v-model="isShowDialog" width="769px" :fullscreen="true">
			<el-form ref="roleDialogFormRef" :model="ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="名称">
							<el-input v-model="ruleForm.name" placeholder="名称" disabled></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="编码">
							<el-input v-model="ruleForm.code" placeholder="编码" disabled></el-input>
							<!-- <el-select v-model="ruleForm.code" placeholder="编码" disabled class="w100">
								<el-option v-for="(item, index) in dataSourceList" :key="index" :value="item.value" :label="item.label" />
							</el-select> -->
						</el-form-item>
					</el-col>
					<!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="视图规则">
							 <el-input v-model="ruleForm.viewDefine" :rows="6" type="textarea" placeholder="通过自定义SQL语句生成视图"></el-input>
						</el-form-item>
					</el-col> -->
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-table :data="tableData" v-loading="loading" style="width: 100%">
							<!-- <el-table-column type="index" label="序号" width="60" /> -->
							<el-table-column prop="code" label="字段编码" show-overflow-tooltip></el-table-column>
							<el-table-column prop="name" label="字段描述" show-overflow-tooltip></el-table-column>
							<el-table-column prop="type" label="字段类型" show-overflow-tooltip></el-table-column>
							<el-table-column label="操作" width="300">
								<template #default="scope">
									<!-- <el-button  size="small" text type="primary" @click="onOpenRule(scope.row)">校验规则</el-button> -->
									<el-button  size="small" text type="primary" @click="onOpenConvert(scope.row)">转换规则</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-col>
					<!-- <el-divider border-style="dashed" content-position="center">
						<div style="color: #b1b3b8">转换器</div>
					</el-divider> -->
					<!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-button icon="ele-Plus" type="primary" plain @click="addDataTypeRow">增加转换器</el-button>
						<span style="font-size: 12px; color: gray; padding-left: 5px"> 数据转换校验规则 </span>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<template v-if="ruleForm.datatypelist != undefined && ruleForm.datatypelist.length > 0">
							<el-row :gutter="35" v-for="(v, k) in ruleForm.datatypelist" :key="k">
								<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
									<el-form-item label="类型" :prop="`datatypelist[${k}].DataTypeId`" :rules="[{ required: true, message: `数据类型不能为空`, trigger: 'blur' }]">
										<template #label>
											<el-button icon="ele-Delete" type="danger" circle plain size="small" @click="deleteDataTypeRow(k)" />
											<span class="ml5">类型</span>
										</template>
										<el-input v-model="ruleForm.viewName" placeholder="视图名称" clearable></el-input>
									</el-form-item>
								</el-col>
								<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
									<el-form-item label="存储字段" :prop="`datatypelist[${k}].StoredFields`" :rules="[{ required: true, message: `存储字段不能为空`, trigger: 'blur' }]">
										<el-input v-model="ruleForm.viewName" placeholder="视图名称" clearable></el-input>
									</el-form-item>
								</el-col>
							</el-row>
						</template>
						<el-empty description="空" v-else></el-empty>
					</el-col> -->
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">确 定</el-button>
				</span>
			</template>
		</el-dialog>
		<RuleDialog ref="ruleDialogRef" :title="ruleDialogTitle" />
		<ConvertDialog ref="convertDialogRef" :title="convertDialogTitle" />
	</div>
</template>

<script setup lang="ts" name="systemRoleDialog">
import { reactive, ref } from 'vue';
import RuleDialog from '/@/views/cams/dataView/ruleDialog.vue';
import ConvertDialog from '/@/views/cams/dataView/convertDialog.vue';
import { getTableFields } from '/@/api/view/index';

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

const ruleDialogTitle = ref('');
const ruleDialogRef = ref();

const convertDialogTitle = ref('');
const convertDialogRef = ref();

const dataSourceList = ref<any>([
	{ label: '药敏数据A1', value: '药敏数据A1' },
	{ label: '药敏数据A2', value: '药敏数据A2' }
]);

ruleForm.value.datatypelist = []

// 初始化表格数据
const getTableData =async () => {
	loading.value = true;
	var res = await getTableFields(ruleForm.value.code);
	tableData.value = res.data;
	// const data = [];
	// for (let i = 0; i < 20; i++) {
	// 	data.push({
	// 		column1:'CARBGENE'+(i+1),
	// 		column2:'string',
	// 	});
	// }
	// tableData.value = data;
	setTimeout(() => {
		loading.value = false;
	}, 500);
}

// 增加数据类型行
const addDataTypeRow = () => {
	if (ruleForm.value.datatypelist == undefined) ruleForm.value.datatypelist = [];
	ruleForm.value.datatypelist?.push({});
};

// 删除数据类型行
const deleteDataTypeRow = (k: number) => {
	ruleForm.value.datatypelist?.splice(k, 1);
};

// 打开弹窗
const openDialog = (row: any) => {
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

// 打开添加校验规则
const onOpenRule = (row:any) => {
	ruleDialogTitle.value = '校验规则';
	ruleDialogRef.value.openRuleDialog(row);
};

// 打开添加转换规则
const onOpenConvert = (row:any) => {
	convertDialogTitle.value = '转换规则';
	convertDialogRef.value.openRuleDialog(row,ruleForm.value.code);
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
