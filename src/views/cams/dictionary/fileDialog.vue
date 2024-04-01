<template>
  <div class="system-role-dialog-container">
    <el-dialog :title="props.title" v-model="isShowDialog" width="769px">
      <el-form ref="dialogFormRef" :model="ruleForm" size="default" label-width="120px" :rules="rules">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="系统厂商" prop="code">
              <!-- <el-input v-model="ruleForm.code" placeholder="请输入字典编码" clearable></el-input> -->
              <el-select v-model="sysVendorSelectValue" placeholder="请选择系统厂商" filterable clearable
                         size="default">
                <el-option v-for="(item, index) in sysVendorList" :key="index" :value="item.attr_1"
                           :label="item.attr_2"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="字典类型" prop="code">
              <!-- <el-input v-model="ruleForm.code" placeholder="请输入字典编码" clearable></el-input> -->
              <el-select v-model="sysDicSelectValue" placeholder="请选择字典类型" filterable clearable size="default">
                <el-option v-for="(item, index) in dicTypeList" :key="index" :value="item.attr_1" :label="item.attr_2"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="字典名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入字典名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="字典导入">
              <el-upload
                  ref="upload"
                  class="upload-demo"
                  :action="actionStr"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :auto-upload="false"
              >
                <template #trigger>
                  <el-button type="primary">选择文件</el-button>
                </template>
                <!-- <el-button class="ml-3" type="success" @click="submitUpload" style="margin-left:20px;">
                上传文件
                </el-button> -->
                <template #tip>
                  <div class="el-upload__tip text-red">
                    只能上传一个文件，新文件将覆盖旧文件
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="submitUpload" size="default">确 定</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue';
import {ElMessage, FormRules, ElMessageBox, genFileId} from "element-plus";
import type {UploadInstance, UploadProps, UploadRawFile} from 'element-plus'
// import type { UploadProps, UploadUserFile } from 'element-plus'
import {importDic} from '/@/api/excel/index';
import {mapValueList} from '/@/api/dictionary/index';

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
const actionStr = ref('');
const queryParams = ref<any>({});
const dicTypeList = ref<any>([]);
const sysVendorList = ref<any>([]);
const sysDicSelectValue = ref('');
const sysVendorSelectValue = ref('');
const dictype = ref('');

//自行添加其他规则
const rules = ref<FormRules>({
  code: [{required: true, message: '字典编码不能为空', trigger: 'blur',},],
  name: [{required: true, message: '字典名称不能为空', trigger: 'blur',},],
});

const upload = ref<UploadInstance>();

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const submitUpload = () => {
//   var type = 'lis_dic';
  ruleForm.value.code = sysVendorSelectValue.value + '_' + sysDicSelectValue.value;
  actionStr.value = import.meta.env.VITE_API_URL+'api/excel/import/' + dictype.value + '/' + ruleForm.value.code + '?name=' + ruleForm.value.name;

  upload.value!.submit()
}


// 打开弹窗
const openDialog = async (type: any) => {
  queryParams.value.limit = 100000;
  queryParams.value.offset = 0;
  queryParams.value.code = 'sys_dicType';
  var res = await mapValueList(queryParams);
  dicTypeList.value = res.data
  queryParams.value.code = 'sys_vendor';
  var res1 = await mapValueList(queryParams);
  sysVendorList.value = res1.data
  dictype.value = type;

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
      var param = {adds: [values], deletes: [values.id]};
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
