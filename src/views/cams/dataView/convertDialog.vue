<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="props.title" v-model="isShowDialog" width="400px">
			<el-form ref="roleDialogFormRef" :model="ruleForm" size="default" label-width="100px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="字段名称">
							<el-input v-model="ruleForm.property_code" disabled style="width:200px;"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="转换类型">
							<el-select v-model="ruleForm.mapper_type" placeholder="转换类型" @change="mapperTypeChanged" clearable style="width:200px;">
								<el-option v-for="(item, index) in operationList" :key="index" :value="item.value" :label="item.label" />
							</el-select>
						</el-form-item>
						<!-- <el-select v-model="ruleForm.mapper_code" placeholder="选择字典" @change="selectCarssChange" clearable style="width:200px;">
							<el-option v-for="(item, index) in carssDicList" :key="index" :value="item.value" :label="item.label" />
						</el-select>
						<el-select v-model="ruleForm.compare_code" placeholder="源字段" clearable style="width:200px;">
							<el-option v-for="(item, index) in fieldList" :key="index" :value="item.value" :label="item.label" />
						</el-select>
						<el-select v-model="ruleForm.target_code" placeholder="目标字段" clearable style="width:200px;">
							<el-option v-for="(item, index) in fieldList" :key="index" :value="item.value" :label="item.label" />
						</el-select> -->
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="字典或映射">
							<el-select v-model="ruleForm.mapper_code" placeholder="选择字典或映射" @change="selectCarssChange" filterable clearable style="width:200px;">
								<el-option v-for="(item, index) in carssDicList" :key="index" :value="item.value" :label="item.label" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="源字段">
							<el-select v-model="ruleForm.s_compare_code" placeholder="源字段" clearable style="width:200px;">
								<el-option v-for="(item, index) in select_data" :key="index" :value="item.value" :label="item.label" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="比对字段">
							<el-select v-model="ruleForm.compare_code" placeholder="源字段" clearable style="width:200px;">
								<el-option v-for="(item, index) in fieldList" :key="index" :value="item.value" :label="item.label" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="目标字段">
							<el-select v-model="ruleForm.target_code" placeholder="目标字段" clearable style="width:200px;">
								<el-option v-for="(item, index) in fieldList" :key="index" :value="item.value" :label="item.label" />
							</el-select>
						</el-form-item>
					</el-col>
					

					<!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-button icon="ele-Plus" type="primary" plain @click="addDataTypeRow">增加</el-button>
						<span style="font-size: 12px; color: gray; padding-left: 5px"> 数据转换规则 </span>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<template v-if="ruleForm.rulelist != undefined && ruleForm.rulelist.length > 0">
							<el-row :gutter="35" v-for="(v, k) in ruleForm.rulelist" :key="k">
								<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
									<el-form-item label="操作符" :prop="`rulelist[${k}].column1`">
										<template #label>
											<el-button icon="ele-Delete" type="danger" circle plain size="small" @click="deleteDataTypeRow(k)" />
										</template>
										<el-input v-model="ruleForm.rulelist[k].column1" placeholder="原始值" clearable style="width:200px;"></el-input>
										<el-select v-model="ruleForm.rulelist[k].column2" placeholder="操作符" clearable style="width:100px;">
											<el-option v-for="(item, index) in operationList" :key="index" :value="item.value" :label="item.label" />
										</el-select>
										<el-input v-model="ruleForm.rulelist[k].column3" placeholder="预期值" clearable style="width:300px;"></el-input>
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
					<el-button type="danger" @click="onDelete" size="default">删 除</el-button>
					<el-button type="primary" @click="onSubmit" size="default">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemRoleDialog">
import { reactive, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { mapList,mappingList } from '/@/api/dictionary/index';
import { converterCreate,converterUpdate,getConverter,deleteConverter } from '/@/api/view/index';

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
	convert_type:'string'
});
const tableData = ref<any>([]);
const loading = ref(false);

const operationList = ref<any>([
	{ label: '映射', value: 'mapping' },
	{ label: '字典', value: 'dic' },
]);
const carssDicList = ref<any>([]);
const fieldList = ref<any>([]);

const querySelectParams = ref<any>({
	keyword:'',
	type:''
});

// ruleForm.value.rulelist = [];

//选择字段改变
const mapperTypeChanged = async (val:any) => {
	ruleForm.value.mapper_code = '';
	ruleForm.value.compare_code = '';
	ruleForm.value.target_code = '';
	fieldList.value = [];
	if(val == 'mapping'){//映射
		getMappingList();
	}
	else if(val == 'dic'){// 字典
		getCarssDic();
	}
}

const selectCarssChange = async (val:any) => {
	fieldList.value = [];
	for(var i = 0;i<carssDicList.value.length;i++)
	{
		if(carssDicList.value[i].value == val)
		{
			var data = carssDicList.value[i].properties;
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
}

const getCarssDic = async() => {
	carssDicList.value = [];
	querySelectParams.value.limit = 100000;
	querySelectParams.value.offset = 0;
	querySelectParams.value.type = '';
	var res =await mapList(querySelectParams);
	// carssDicList.value = res.data;
	var data = res.data;
	for(var i = 0;i<data.length;i++){
		var obj = {
			label:data[i].name,
			value:data[i].code,
			properties:JSON.parse(data[i].properties)
		};
		carssDicList.value.push(obj);
	}
};

const getMappingList = async() =>{
	carssDicList.value = [];
	var res = await mappingList(10000,0);
	var data = res.data;
	debugger
	for(var i = 0;i<data.length;i++){
		var obj = {
			label:data[i].name,
			value:data[i].source_code+'|'+data[i].target_code,
			properties:JSON.parse(data[i].properties)
		};
		carssDicList.value.push(obj);
	}
}

const select_data = ref<any>([])



const case_select_data = ref<any>([
	{ label: "分院代码", value: "InstituteCode" },
	{ label: "病历号", value: "PatientID" },
	{ label: "病人姓名", value: "Name" },
	{ label: "性别", value: "Sex" },
	{ label: "年龄", value: "Age" },
	{ label: "本院科室代码", value: "WardCode" },
	{ label: "本院科室名称", value: "WardName" },
	{ label: "CARSS 专业类别", value: "CarssDepartmentCode" },
	{ label: "CHIFUNGI 专业类别", value: "ChifungiDepartmentCode" },
	{ label: "样本号", value: "SpecimenNum" },
	{ label: "样本类型", value: "SpecimenType" },
	{ label: "样本名称", value: "SpecimenName" },
	{ label: "菌种代码", value: "OrganismCode" },
	{ label: "菌种名称", value: "OrganismName" },
	{ label: "菌种类型", value: "OrganismType" },
	{ label: "碳青霉烯酶基因类型", value: "Carbgene" }
]);

const result_select_data = ref<any>(  [
	{ label: "样本号", value: "SpecimenNum" },
	{ label: "药物代码", value: "AntibioticCode" },
	{ label: "药物中文名称", value: "AntibioticCNName" },
	{ label: "药敏方法", value: "Method" },
	{ label: "药敏字段代码", value: "FieldCode" },
	{ label: "药敏结果值", value: "TestValue" },
	{ label: "药敏判定结果", value: "TestResult" },
	{ label: "药敏仪器名称", value: "Instrument" },
	{ label: "板卡型号", value: "CardMode" }
]);




// 打开弹窗
const openRuleDialog = async (row: any,code:any) => {
	debugger
	ruleForm.value.mapper_type = '';
	ruleForm.value.mapper_code = '';
	ruleForm.value.compare_code = '';
	ruleForm.value.target_code = '';
	if(row != undefined){
		var model = JSON.parse(JSON.stringify(row));
	
		ruleForm.value.property_code = model.code;
		ruleForm.value.s_compare_code = model.code;
		ruleForm.value.code = code;
		var res = await getConverter(ruleForm.value.code,ruleForm.value.property_code);
		if(res.data.code != undefined){
			ruleForm.value = res.data;
			if(res.data.mapper_type == 'mapping'){//映射
				getMappingList();
			}
			else if(res.data.mapper_type == 'dic'){// 字典
				getCarssDic();
			}
			setTimeout(() => {
				selectCarssChange(res.data.mapper_code);
			}, 500);
		}

		if (ruleForm.value.code=="T_CASE"){
			select_data.value=case_select_data.value
		}else{
			select_data.value=result_select_data.value
		}


	
	}
  	isShowDialog.value = true;
};
// 关闭弹窗
const closeDialog = () => {
	emit("refresh");
	isShowDialog.value = false;
};
// 删除
const onDelete = () => {
	ElMessageBox.confirm(`此操作将永久删除该规则，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			deleteConverter(ruleForm.value.code,ruleForm.value.property_code);
			ruleForm.value.mapper_type = '';
			ruleForm.value.mapper_code = '';
			ruleForm.value.compare_code = '';
			ruleForm.value.target_code = '';
			ElMessage.success('删除成功');
		})
		.catch(() => {});
};
// 提交
const onSubmit = async () => {
	if(ruleForm.value.id != undefined){
		var res = await converterUpdate(ruleForm.value);
		if(res.data && res.message =='success'){
			ElMessage({
					message: `修改成功`,
					type: "success",
			});
		}else{
			ElMessage({
					message: `修改失败`,
					type: "error",
			});
		}
	}
	else{
		var res = await converterCreate(ruleForm.value);
		if(res.data && res.message =='success'){
			ElMessage({
					message: `保存成功`,
					type: "success",
			});
		}else{
			ElMessage({
					message: `保存失败`,
					type: "error",
			});
		}
	}
	closeDialog();
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
