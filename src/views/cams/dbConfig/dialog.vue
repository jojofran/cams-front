<template>
  <div class="system-role-dialog-container">
    <el-dialog :title="props.title" v-model="isShowDialog" width="769px">
      <el-form ref="roleDialogFormRef" :model="ruleForm" size="default" label-width="120px" :rules="rules">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="数据源编码" prop="code">
              <el-input v-model="ruleForm.code" placeholder="请输入数据源编码" clearable disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="数据源名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入数据源名称" clearable disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="数据库类型" prop="db_type">
              <el-select v-model="ruleForm.db_type" placeholder="请选择数据库类型" clearable class="w100">
                <el-option v-for="(item, index) in dataTypeList" :key="index" :value="item.value" :label="item.label"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="IP地址" prop="ip_address">
              <el-input v-model="ruleForm.ip_address" placeholder="请输入IP地址" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb20">
            <el-form-item label="端口号" prop="port">
              <el-input v-model="ruleForm.port" placeholder="请输入端口号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="用户名" prop="user_name">
              <el-input v-model="ruleForm.user_name" placeholder="请输入用户名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb20">
            <el-form-item label="密码" prop="password">
              <el-input v-model="ruleForm.password" placeholder="请输入密码" show-password clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="mb20">
            <el-form-item label="数据库名称" prop="db_name">
              <el-input v-model="ruleForm.db_name" placeholder="请输入数据库名称" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onTest" size="default">测试连接</el-button>
					<el-button type="primary" @click="onSubmit" size="default">确 定</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue';
import {ElMessage, FormRules} from "element-plus";
import {setDb, dbTest} from '/@/api/dataSource/index';

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

const dataTypeList = ref<any>([
  {label: 'SQLServer', value: 'sqlserver'},
  {label: 'MySql', value: 'mysql'}
]);

//自行添加其他规则
const rules = ref<FormRules>({
  db_type: [{required: true, message: '请选择数据库类型', trigger: 'blur',},],
  ip_address: [{required: true, message: '请输入IP地址', trigger: 'blur',},],
  port: [{required: true, message: '请输入端口号', trigger: 'blur',},],
  db_name: [{required: true, message: '请输入实验室名称', trigger: 'blur',},],
  user_name: [{required: true, message: '请输入用户名称', trigger: 'blur',},],
  password: [{required: true, message: '请输入密码', trigger: 'blur',},],

});


// 打开弹窗
const openDialog = (row: any) => {
  if (row != undefined) {
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

// 测试连接
const onTest = async () => {
  let values = ruleForm.value;
  values.create_time = null;
  var res = await dbTest(values);
  if (res.data) {
    ElMessage({
      message: `连接成功`,
      type: "success",
    });
  } else {
    ElMessage({
      message: `连接失败：${res.message}`,
      type: "error",
    });
  }
};


// 提交
const onSubmit = () => {
  roleDialogFormRef.value.validate(async (isValid: boolean, fields?: any) => {
    if (isValid) {
      let values = ruleForm.value;

      setDb(values);
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
