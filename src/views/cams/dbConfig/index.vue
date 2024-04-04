<template>
  <div class="system-role-container layout-padding">
    <div class="system-role-padding layout-padding-auto layout-padding-view">
      <div class="system-user-search mb15" >
        <el-button size="default" type="primary" class="ml10" @click="getTableData()">

          <el-icon>
            <ele-Search/>
          </el-icon>
          查询
        </el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column type="index" label="序号" width="60"/>
        <el-table-column prop="code" label="数据库编码" width="150"></el-table-column>
        <el-table-column prop="name" label="数据库名称" width="250"></el-table-column>
        <el-table-column prop="db_type" label="数据库类型" width="200"></el-table-column>
        <el-table-column prop="ip_address" label="ip地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="port" label="端口号" width="100"></el-table-column>
        <el-table-column prop="db_name" label="数据库名称" width="250"></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="onOpenEdit(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="onHandleSizeChange"
          @current-change="onHandleCurrentChange"
          class="mt15"
          :pager-count="5"
          :page-sizes="[10, 20, 30]"
          v-model:current-page="tableParams.page"
          background
          v-model:page-size="tableParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableParams.total"
      >
      </el-pagination>
    </div>
    <LisDialog ref="lisDialogRef" :title="lisDialogTitle" @refresh="getTableData"/>
  </div>
</template>

<script setup lang="ts">
import {  onMounted, ref} from 'vue';
import LisDialog from '/@/views/cams/dbConfig/dialog.vue';
import {getDbList} from '/@/api/dataSource/index';


// 定义变量内容
const lisDialogTitle = ref('');
const lisDialogRef = ref();
const loading = ref(false);
const tableData = ref<any>([]);
const tableParams = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});


// 初始化表格数据
const getTableData = async () => {

  loading.value = true;

  setTimeout(() => {
    getDbList().then(res => {
      var data = res.data;

      tableData.value = data;
      tableParams.value.total = tableData.value.length;
    });

    loading.value = false;
  }, 500);
};

// 打开修改弹窗
const onOpenEdit = (row: any) => {
  lisDialogTitle.value = '编辑数据源';
  lisDialogRef.value.openDialog(row);
};


// 分页改变
const onHandleSizeChange = (val: number) => {
  tableParams.value.pageSize = val;
  getTableData();
};
// 分页改变
const onHandleCurrentChange = (val: number) => {
  tableParams.value.page = val;
  getTableData();
};
// 页面加载时
onMounted(() => {
  getTableData();
});
</script>

<style scoped lang="scss">
.system-role-container {
  .system-role-padding {
    padding: 15px;

    .el-table {
      flex: 1;
    }
  }
}

</style>
