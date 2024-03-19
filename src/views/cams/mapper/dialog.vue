<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="props.title" v-model="isShowDialog" width="769px">
			<el-form ref="roleDialogFormRef" :model="ruleForm" size="default" label-width="120px" :rules="rules">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="映射名称" prop="name">
							<el-input v-model="ruleForm.name" size="default" placeholder="请输入映射名称" style="width: 225px"> </el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="LIS字典" prop="source_code">
							<!-- <el-input v-model="ruleForm.sourceCode" placeholder="请输入数据源编码" clearable></el-input> -->
							<el-select v-model="ruleForm.source_code" placeholder="请选择LIS字典" filterable clearable size="default">
								<el-option v-for="(item, index) in lisDicList" :key="index" :value="item.value" :label="item.label" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="Carss字典" prop="target_code">
							<!-- <el-input v-model="ruleForm.name" placeholder="请输入数据源名称" clearable></el-input> -->
							<el-select v-model="ruleForm.target_code" placeholder="请选择CARSS字典" @change="selectCarssChange" filterable clearable size="default">
								<el-option v-for="(item, index) in carssDicList" :key="index" :value="item.value" :label="item.label" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="匹配字段">
							<el-select v-model="selectFields" multiple @change="selectFieldChange"  placeholder="请选择匹配字段" size="default" clearable>
								<el-option v-for="item in fieldList" :key="item.value" :label="item.label" :value="item.value">
									<!-- <span style="float: right;">{{ item.label }}</span>
									<span style="float: left;color: var(--el-text-color-secondary);font-size: 13px;">{{ item.value }}</span> -->
								</el-option>
							</el-select>
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
import { reactive, ref,onMounted } from 'vue';
import { ElMessage,FormRules } from "element-plus";
import { mapList,mappingList,createMapping } from '/@/api/dictionary/index';


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
const ruleForm = ref<any>({
	properties:[]
});
//选中字段
const selectFields = ref<any>([]);
const fieldList = ref<any>([]);

const carssDicList = ref<any>([]);
const lisDicList = ref<any>([]);
const querySelectParams = ref<any>({
	keyword:'',
	type:''
});

//自行添加其他规则
const rules = ref<FormRules>({
	name: [{required: true, message: '请输入映射名称', trigger: 'blur',},],
	source_code: [{required: true, message: '请选择LIS字典', trigger: 'blur',},],
	target_code: [{required: true, message: '请选择CARSS字典', trigger: 'blur',},],
});

//选择字段改变
const selectFieldChange = async (val:any) => {
	ruleForm.value.properties = [];
	for(var j=0;j<fieldList.value.length;j++){
		var obj = {
			code:fieldList.value[j].value,
			compare:false,
			num:j
		};
		for(var i=0;i<val.length;i++){
			if(fieldList.value[j].value == val[i]){
				obj.compare = true;
			}
		}
		ruleForm.value.properties.push(obj);

	}
}

const selectCarssChange = async (val:any) => {
	fieldList.value = [];
	for(var i = 0;i<carssDicList.value.length;i++)
	{
		if(carssDicList.value[i].value == val)
		{
			var data = JSON.parse(carssDicList.value[i].properties);
			for(var j=0;j<data.length;j++){
				var obj = {
					label:data[j].code,
					value:data[j].code,
					num:data[j].num
				};
				fieldList.value.push(obj);
			}
		}
	}
	selectFields.value = [];
	// //带出匹配字段
	// var res0 = await mappingList(10000,0);
	// var data0 = res0.data;
	// for(var i = 0;i<data0.length;i++)
	// {
	// 	if(data0[i].source_code == queryParams.value.sourceCode && data0[i].target_code == queryParams.value.targetCode){
	// 		var propertyList = JSON.parse(data0[i].properties);
	// 		for(var j=0;j<propertyList.length;j++){
	// 			selectFields.value.push(propertyList[j].code);
	// 		}
	// 	}
	// }

	// tableData_success.value = [];
	// tableData_fail.value = [];
	// //带出已经匹配过的数据
	// queryMappingConceptParams.value.sourceCode = queryParams.value.sourceCode;
	// queryMappingConceptParams.value.targetCode = queryParams.value.targetCode;
	// queryMappingConceptParams.value.limit = 100000;
	// queryMappingConceptParams.value.offset = 0;
	
	// getMappingConceptList(queryMappingConceptParams);
	// getMappingValueList();
};

const getCarssDic = async() => {
	querySelectParams.value.limit = 100000;
	querySelectParams.value.offset = 0;
	querySelectParams.value.type = 'std_dic';
	var res =await mapList(querySelectParams);
	var data = res.data;
	for(var i = 0;i<data.length;i++){
		var obj = {
			label:data[i].name,
			value:data[i].code,
			properties:data[i].properties
		};
		carssDicList.value.push(obj);
	}
};

const getLisDic = async() => {
	querySelectParams.value.limit = 100000;
	querySelectParams.value.offset = 0;
	querySelectParams.value.type = 'lis_dic';
	var res =await mapList(querySelectParams);
	var data = res.data;
	for(var i = 0;i<data.length;i++){
		var obj = {
			label:data[i].name,
			value:data[i].code,
			properties:data[i].properties
		};
		lisDicList.value.push(obj);
	}
};

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
  roleDialogFormRef.value.validate(async (isValid: boolean, fields?: any) => {
    if (isValid) {
      let values = ruleForm.value;
	  debugger
	  if(values.properties.length == 0){
		ElMessage({
			message: `匹配字段不能为空，请选择后再提交`,
			type: "error",
		});
		return;
	  }
      createMapping(values);
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
// 页面加载时
onMounted(() => {
	getLisDic();
	getCarssDic();
});

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
