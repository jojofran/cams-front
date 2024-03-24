<template>
  <div>
    <el-card shadow="hover" class="box-card" style="margin-top: 0; height: 100%; width: 100%">
      <div class="system-user-search mb15">
        <label >Lis字典：</label>
        <el-input v-model="sourceMapName" size="default" disabled style="max-width: 170px"></el-input>
        <label style="margin-left: 10px">Carss字典：</label>
        <el-input v-model="targetMapName" size="default" disabled style="max-width: 170px"></el-input>
        <label style="margin-left: 10px">匹配字段：</label>
        <el-select
            v-model="selectFields"
            multiple
            disabled
            size="default"
            style="width: 300px"
        >
          <el-option v-for="item in fieldList" :key="item.code" :label="item.code" :value="item.code"></el-option>
        </el-select>
        <el-button size="default" type="primary" v-if="showBtn" class="ml10" @click="match()"
                   :disabled="pageParams.loading">
          <el-icon>
            <ele-Setting/>
          </el-icon>
          一键匹配
        </el-button>
        <el-button size="default" type="warning" v-if="!showBtn" class="ml10" @click="match()"
                   :disabled="pageParams.loading">
          <el-icon>
            <ele-Refresh/>
          </el-icon>
          重新匹配
        </el-button>
        <el-button size="default" type="success" v-if="!showBtn" class="ml10" @click="refresh()"
                   :disabled="pageParams.loading">
          <el-icon>
            <ele-Refresh/>
          </el-icon>
          刷新
        </el-button>
      </div>
      <el-tabs type="border-card">
        <el-tab-pane label="已匹配">
          <el-table
              :data="tableData_success"
              v-loading="pageParams.loading"
              v-el-table-infinite-scroll="loadMoreMapping"
              scrollbar-always-on="true"
              infinite-scroll-delay="20"
              infinite-scroll-immediate="false"
              style="width: 100%"
              height="650"
              stripe
              :header-cell-style="setTitle"

          >
            <el-table-column type="index" width="50"/>
            <el-table-column prop="source_code" width="auto" v-if="false"/>
            <el-table-column prop="target_code" width="auto" v-if="false"/>
            <el-table-column :label="sourceMapName" align="center">
              <el-table-column prop="source_attr_1" :label="getHeadLabel(0)" width="auto" v-if="showColumn(0)">
                <template #default="scope">
                  <span style="color: #004d8c">{{ scope.row.source_attr_1 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="source_attr_2" :label="getHeadLabel(1)" width="auto" v-if="showColumn(1)"/>
              <el-table-column prop="source_attr_3" :label="getHeadLabel(2)" width="auto" v-if="showColumn(2)"/>
              <el-table-column prop="source_attr_4" :label="getHeadLabel(3)" width="auto" v-if="showColumn(3)"/>
              <el-table-column prop="source_attr_5" :label="getHeadLabel(4)" width="auto" v-if="showColumn(4)"/>
              <el-table-column prop="source_attr_6" :label="getHeadLabel(5)" width="auto" v-if="showColumn(5)"/>
            </el-table-column>
            <el-table-column :label="targetMapName" align="center">
              <el-table-column prop="target_attr_1" :label="getHeadLabel(0)" width="auto" v-if="showColumn(0)">
                <template #default="scope">
                  <span style="color: #fc5531">{{ scope.row.target_attr_1 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="target_attr_2" :label="getHeadLabel(1)" width="auto" v-if="showColumn(1)"/>
              <el-table-column prop="target_attr_3" :label="getHeadLabel(2)" width="auto" v-if="showColumn(2)"/>
              <el-table-column prop="target_attr_4" :label="getHeadLabel(3)" width="auto" v-if="showColumn(3)"/>
              <el-table-column prop="source_attr_5" :label="getHeadLabel(4)" width="auto" v-if="showColumn(4)"/>
              <el-table-column prop="source_attr_6" :label="getHeadLabel(5)" width="auto" v-if="showColumn(5)"/>
            </el-table-column>
            <el-table-column fixed="right" label="操作" style="text-align: center" width="100">
              <template #default="scope">
                <el-button type="danger" icon="el-icon-delete" @click="handleRemove(scope.row)" text size="mini">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination class="mt15" layout="total" :total="MappingConcepts.length"/>
        </el-tab-pane>
        <el-tab-pane label="未匹配">
          <el-table
              :data="tableData_fail"
              v-loading="uPageParams.loading"
              v-el-table-infinite-scroll="loadMoreUnMapping"
              infinite-scroll-delay="40"
              infinite-scroll-immediate="false"
              stripe
              style="width: 100%"
              height="500"
              :header-cell-style="setTitle"
              scrollbar-always-on="true"
          >
            <el-table-column type="index" width="50"/>
            <el-table-column prop="source_code" width="auto" v-if="false"/>
            <el-table-column prop="target_code" width="auto" v-if="false"/>
            <el-table-column :label="sourceMapName" align="center">
              <el-table-column prop="source_attr_1" :label="getHeadLabel(0)" width="auto" v-if="showColumn(0)">
              </el-table-column>
              <el-table-column prop="source_attr_2" :label="getHeadLabel(1)" width="auto" v-if="showColumn(1)"/>
              <el-table-column prop="source_attr_3" :label="getHeadLabel(2)" width="auto" v-if="showColumn(2)"/>
              <el-table-column prop="source_attr_4" :label="getHeadLabel(3)" width="auto" v-if="showColumn(3)"/>
              <el-table-column prop="source_attr_5" :label="getHeadLabel(4)" width="auto" v-if="showColumn(4)"/>
              <el-table-column prop="source_attr_6" :label="getHeadLabel(5)" width="auto" v-if="showColumn(5)"/>
            </el-table-column>
            <el-table-column :label="targetMapName" align="center">
              <el-table-column prop="target_attr_1" :label="getHeadLabel(0)" width="auto" align="center"
                               v-if="showColumn(0)">
                <template #default="scope">
                  <el-select
                      v-model="scope.row.target_attr_1"
                      :remote-method="queryTargetOptions"
                      filterable
                      remote
                      @change="(val:any) =>{ handleSelectChange(val, scope.row); }"
                      :loading="selectLoading"
                      :disabled="uPageParams.loading"
                      style="width: 100%; height: 24px; text-align: center"
                  >
                    <el-option v-for="(item) in targetOptions" :key="item.key" :label="item.key" :value="item.key">
                      <span style="float: none; color: #fc5531; margin-left: 15px">{{ item.label }}</span>
                    </el-option>
                  </el-select>
                </template>

              </el-table-column>
              <el-table-column prop="target_attr_2" :label="getHeadLabel(1)" width="auto" v-if="showColumn(1)"/>
              <el-table-column prop="target_attr_3" :label="getHeadLabel(2)" width="auto" v-if="showColumn(2)"/>
              <el-table-column prop="target_attr_4" :label="getHeadLabel(3)" width="auto" v-if="showColumn(3)"/>
              <el-table-column prop="target_attr_5" :label="getHeadLabel(4)" width="auto" v-if="showColumn(4)"/>
              <el-table-column prop="target_attr_6" :label="getHeadLabel(5)" width="auto" v-if="showColumn(5)"/>
            </el-table-column>
            <el-table-column fixed="right" align="center" label="操作" width="100">
              <template #default="scope">
                <el-button type="danger" @click="handleClear(scope.row)" text size="mini">清空</el-button>
                <el-button type="success" @click="handlerAdd(scope.row)" text size="mini">暂存</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination class="mt15" layout="total" :total="UnMappingConcepts.length"/>
        </el-tab-pane>
      </el-tabs>
      <div style="text-align: left; margin-left: -10px">
        <el-button size="default" type="primary" class="ml10" @click="handelSaveData()" style="margin-top: 10px"
                   :disabled="pageParams.loading">
          <el-icon>
            <ele-Checked/>
          </el-icon>
          保存数据
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue';
import {ElMessage} from 'element-plus';
import {useRouter} from 'vue-router';
import {
  mappingMatch,
  mapValueList,
  overwriteMappingConcepts,
  mappingConceptList,
  mappingInfo,
  getMapInfo,
} from '/@/api/dictionary/index';

const router = useRouter();

// 定义关键变量
const sourceCode = ref('');
const targetCode = ref('');

// 定义变量内容
const selectLoading = ref(false);
const tableData_success = ref<any>([]);
const tableData_fail = ref<any>([]);
const queryParams = ref<any>({
  properties: [],
});

const carssValueList = ref<any[]>([]);
const lisValueList = ref<any[]>([]);

const MappingConcepts = ref<any[]>([]); //Mapping Data in memory
const UnMappingConcepts = ref<any[]>([]); //UnMapping Data in memory

//查询映射数据列表参数
const queryMappingConceptParams = ref<any>({});
const targetOptions = ref<MapConcept[]>([]);

const sourceMapName = ref('');
const targetMapName = ref('');
const showBtn = ref(true);

//选中字段
const selectFields = ref<any>([]);
const fieldList = ref<any>([]);
const mappingResInfo = ref<any>({});

//初始化已映射数据
const initMappingConceptList = async () => {
  var res = await mappingConceptList(queryMappingConceptParams);
  var data = res.data;
  if (data.length) {
    showBtn.value = false;
  }

  //put mapping concepts in memory
  MappingConcepts.value = data;

  //get UnMappingConcepts by getting diff between mappingList and lis_map value list
  for (var i = 0; i < lisValueList.value.length; i++) {
    var bl = false;
    for (var j = 0; j < MappingConcepts.value.length; j++) {
      if (


          (!lisValueList.value[i].attr_1 || lisValueList.value[i].attr_1 == MappingConcepts.value[j].source_attr_1) &&
          (!lisValueList.value[i].attr_2 || lisValueList.value[i].attr_2 == MappingConcepts.value[j].source_attr_2) &&
          (!lisValueList.value[i].attr_3 || lisValueList.value[i].attr_3 == MappingConcepts.value[j].source_attr_3) &&
          (!lisValueList.value[i].attr_4 || lisValueList.value[i].attr_4 == MappingConcepts.value[j].source_attr_4) &&
          (!lisValueList.value[i].attr_5 || lisValueList.value[i].attr_5 == MappingConcepts.value[j].source_attr_5) &&
          (!lisValueList.value[i].attr_6 || lisValueList.value[i].attr_6 == MappingConcepts.value[j].source_attr_6)
      ) {
        bl = true;
        break;
      }
    }

    if (!bl) {
      UnMappingConcepts.value.push(
          getUMConceptByMap(queryMappingConceptParams.value.sourceCode, queryMappingConceptParams.value.targetCode, lisValueList.value[i])
      );
    }
  }

  initScrollTable();
};


const uPageParams = ref<any>({
  pageSize: 20,
  currentPage: 1,
  loading: false,
  nomore: false,
});

const pageParams = ref<any>({
  pageSize: 20,
  currentPage: 1,
  loading: false,
  nomore: false,
});

/** 未匹配表格滚动事件 */
const loadMoreUnMapping = () => {
  if (uPageParams.value.nomore == true) {
    ElMessage({
      message: "没有更多数据",
      type: "warning",
    });
    return;
  }

  if (tableData_fail.value.length >= UnMappingConcepts.value.length) {
    //当前页码数等于总页数的时候,提示没有更多数据了
    uPageParams.value.loading = false;
    uPageParams.value.nomore = true;
  } else {
    //当数据没有加载完的时候,继续加载数据
    uPageParams.value.loading = true;
    uPageParams.value.currentPage++; //当前页数字加一

    let startIndex = (uPageParams.value.currentPage - 1) * uPageParams.value.pageSize;
    let endIndex = uPageParams.value.currentPage * uPageParams.value.pageSize;
    if (endIndex >= UnMappingConcepts.value.length) {
      endIndex = UnMappingConcepts.value.length;
    }

    tableData_fail.value = tableData_fail.value.concat(UnMappingConcepts.value.slice(startIndex, endIndex));
    uPageParams.value.loading = false;
  }
};

/** 已匹配表格滚动事件 */
const loadMoreMapping = () => {
  if (pageParams.value.nomore == true) {
    ElMessage({
      message: "没有更多数据",
      type: "warning",
    });
    return;
  }

  if (tableData_success.value.length >= MappingConcepts.value.length) {
    pageParams.value.loading = false;
    pageParams.value.nomore = true;
  } else {
    //当数据没有加载完的时候,继续加载数据
    pageParams.value.loading = true;
    pageParams.value.currentPage++; //当前页数字加一

    let startIndex = (pageParams.value.currentPage - 1) * pageParams.value.pageSize;
    let endIndex = pageParams.value.currentPage * pageParams.value.pageSize;
    if (endIndex >= MappingConcepts.value.length) {
      endIndex = MappingConcepts.value.length;
    }

    tableData_success.value = tableData_success.value.concat(MappingConcepts.value.slice(startIndex, endIndex));
    pageParams.value.loading = false;
  }
};

// 自动匹配字典数据
const match = async () => {
  pageParams.value.loading = true;
  uPageParams.value.loading = true;

  initMemoryData();
  queryParams.value.properties = fieldList.value;
  var res = await mappingMatch(queryParams.value);

  MappingConcepts.value = res.data.mapping_concepts;
  UnMappingConcepts.value = res.data.unmapping_concepts.map((element: any) => {
    return getUMConceptByMap(sourceCode.value, targetCode.value, element);
  });

  initScrollTable();
};

const refresh = async () => {
  initMemoryData()
  await initMappingConceptList();
}

const removeRow = (array: any[], row: any): any[] => {

  var index = array.indexOf(row)
  var left = array.slice(0, index);
  var right = array.slice(index + 1);
  return left.concat(right);
}

/**移除已匹配元素 */
const handleRemove = (row: any) => {

  tableData_success.value = removeRow(tableData_success.value, row);
  MappingConcepts.value = removeRow(MappingConcepts.value, row);

  tableData_fail.value.unshift(row);
  UnMappingConcepts.value.unshift(row);
};

/**清除选择 */
const handleClear = (row: any) => {
  row.target_attr_1 = '';
  row.target_attr_2 = '';

  if (row.target_attr_3) {
    row.target_attr_3 = '';
  }
  if (row.target_attr_4) {
    row.target_attr_4 = '';
  }
  if (row.target_attr_5) {
    row.target_attr_5 = '';
  }
  if (row.target_attr_6) {
    row.target_attr_6 = '';
  }
};

/**暂存为已匹配 */
const handlerAdd = (row: any) => {

  if (row.source_code == '' || row.target_code == '' || row.target_attr_1 == '') {
    return;
  }

  tableData_fail.value = removeRow(tableData_fail.value, row);
  UnMappingConcepts.value = removeRow(UnMappingConcepts.value, row);

  tableData_success.value.unshift(row);
  MappingConcepts.value.unshift(row);
};

/** 初始化滚动表格 */
const initScrollTable = () => {
  pageParams.value.currentPage = 0;
  pageParams.value.pageSize = 20;
  pageParams.value.loading = true;
  pageParams.value.nomore = false;

  uPageParams.value.currentPage = 0;
  uPageParams.value.pageSize = 20;
  uPageParams.value.loading = true;
  uPageParams.value.nomore = false;


  loadMoreMapping();
  loadMoreUnMapping();
};

//保存数据
const handelSaveData = async () => {
  await overWriteData();

  initMemoryData();
  await initMappingConceptList();
};

const initMemoryData = () => {
  tableData_success.value = [];
  tableData_fail.value = [];
  UnMappingConcepts.value = [];
  MappingConcepts.value = [];

}

//覆盖数据
const overWriteData = async () => {
  var addList = MappingConcepts.value;
  var parmObj = {
    mappingConcepts: addList,
    mappingInfo: {
      id: mappingResInfo.value.id,
      properties: mappingResInfo.value.properties,
      source_code: mappingResInfo.value.source_code,
      target_code: mappingResInfo.value.target_code,
    },
  };
  var res = await overwriteMappingConcepts(parmObj);
  if (res.data && res.message == 'success') {
    ElMessage({
      message: `保存成功`,
      type: 'success',
    });
  } else {
    ElMessage({
      message: `失败成功`,
      type: 'error',
    });
  }
};

// 表格中下拉框事件
const handleSelectChange = (val: any, row: any) => {
  var index = tableData_fail.value.indexOf(row);

  for (var i = 0; i < carssValueList.value.length; i++) {
    if (carssValueList.value[i].attr_1 && carssValueList.value[i].attr_1 == val) {
      if (carssValueList.value[i].attr_1) {
        tableData_fail.value[index].target_attr_1 = carssValueList.value[i].attr_1;
      }

      if (carssValueList.value[i].attr_2) {
        tableData_fail.value[index].target_attr_2 = carssValueList.value[i].attr_2;
      }

      if (carssValueList.value[i].attr_3) {
        tableData_fail.value[index].target_attr_3 = carssValueList.value[i].attr_3;
      }
      if (carssValueList.value[i].attr_4) {
        tableData_fail.value[index].target_attr_4 = carssValueList.value[i].attr_4;
      }
      if (carssValueList.value[i].attr_5) {
        tableData_fail.value[index].target_attr_5 = carssValueList.value[i].attr_5;
      }
      if (carssValueList.value[i].attr_6) {
        tableData_fail.value[index].target_attr_6 = carssValueList.value[i].attr_6;
      }
    }
  }
};

/**查询目标字典项 */
const queryTargetOptions = (query: string) => {
  if (query) {

    selectLoading.value = true;
    targetOptions.value = [];

    setTimeout(() => {
      for (var i = 0; i < carssValueList.value.length; i++) {
        let r = carssValueList.value[i];
        if (
            (r.attr_1 && r.attr_1.includes(query)) ||
            (r.attr_2 && r.attr_2.includes(query)) ||
            (r.attr_3 && r.attr_3.includes(query)) ||
            (r.attr_4 && r.attr_4.includes(query)) ||
            (r.attr_5 && r.attr_5.includes(query)) ||
            (r.attr_6 && r.attr_6.includes(query))
        ) {

          let key: string = (r.attr_1 || '');
          let label: string = (r.attr_1 || '') + "   " + (r.attr_2 || '') + "  " + (r.attr_3 || '') + "&nbsp" + (r.attr_4 || '') + "   " + (r.attr_5 || '') + "   " + (r.attr_6 || '');
          let obj = {
            key: key,
            value: key,
            label: label
          }
          targetOptions.value.push(obj);
        }
      }

      selectLoading.value = false;
    }, 1000);

  } else {
    targetOptions.value = [];
  }
};

// 页面加载时
onMounted(async () => {
  queryParams.value.source_code = router.currentRoute.value.query.sourceCode;
  queryParams.value.target_code = router.currentRoute.value.query.targetCode;

  sourceCode.value = <string>router.currentRoute.value.query.sourceCode;
  targetCode.value = <string>router.currentRoute.value.query.targetCode;

  getMapInfo(sourceCode.value).then(res => {
    sourceMapName.value = res.data.name;
  });
  getMapInfo(targetCode.value).then(res => {
    targetMapName.value = res.data.name;
  });


  mappingInfo(queryParams).then(res => {
    mappingResInfo.value = res.data;

    let properties = JSON.parse(res.data.properties);
    fieldList.value = properties;
    selectFields.value = properties.filter((p: any) => p.compare == true).map((p: any) => p.code);

  });


  await initMapConcepts(sourceCode.value, targetCode.value);

  queryMappingConceptParams.value.sourceCode = queryParams.value.source_code;
  queryMappingConceptParams.value.targetCode = queryParams.value.target_code;
  queryMappingConceptParams.value.limit = 100000;
  queryMappingConceptParams.value.offset = 0;

  await initMappingConceptList();
});

//页面卸载时，清理const变量
onUnmounted(async () => {
  tableData_fail.value = null
  tableData_success.value = null
  MappingConcepts.value = null
  UnMappingConcepts.value = null
  targetOptions.value = null
  carssValueList.value = null
  lisValueList.value = null
  fieldList.value = null

});


/**初始化源字典和目标字典的数据**/
const initMapConcepts = async (sourcode: string, targetCode: string) => {
  var query = ref<any>({code: sourcode, limit: 10000, offset: 0});
  var sRes = await mapValueList(query);
  lisValueList.value = sRes.data;

  query.value.code = targetCode;
  var res = await mapValueList(query);
  carssValueList.value = res.data;
};

/**设置表头背景颜色 */
const setTitle = (row: any) => {
  var len = row.row.length;

  if (row.columnIndex == 0 && len == 4) {
    return {background: '#004d8c', color: '#FFFFFF'};
  }

  if (row.columnIndex == 1 && len == 4) {
    return {background: '#004d8c', color: '#FFFFFF'};
  }
  if (row.columnIndex == 2 && len == 4) {
    return {background: '#fc5531', color: '#FFFFFF'};
  }

  if (row.columnIndex == 3 && len == 4) {
    return {background: '#fc5531', color: '#FFFFFF'};
  }

  var columnCount = fieldList.value.length;
  if (row.columnIndex < columnCount && len == columnCount * 2) {
    return {background: '#004d8c', color: '#FFFFFF'};
  }
  if (row.columnIndex >= columnCount && len == columnCount * 2) {
    return {background: '#fc5531', color: '#FFFFFF'};
  }
};

const getHeadLabel = (index: any) => {
  if (index > fieldList.value.length - 1) {
    return '';
  } else {
    return fieldList.value[index].code;
  }
};

const showColumn = (index: any) => {
  if (index > fieldList.value.length - 1) {
    return false;
  } else {
    return true;
  }
};


const getUMConceptByMap = (sourceCode: string, targetCode: string, data: any): any => {
  var obj =
      {
        source_code: sourceCode,
        target_code: targetCode,
        source_attr_1: data.attr_1 || '',
        source_attr_2: data.attr_2 || '',
        source_attr_3: data.attr_3 || '',
        source_attr_4: data.attr_4 || '',
        source_attr_5: data.attr_5 || '',
        source_attr_6: data.attr_6 || '',
        target_attr_1: '',
        target_attr_2: '',
        target_attr_3: '',
        target_attr_4: '',
        target_attr_5: '',
        target_attr_6: '',
      }

  return obj
};


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

.el-select {
  width: 220px;
  height: 32px;

  .el-input__inner {
    height: 32px;
  }

  .el-input__prefix,
  .el-input__suffix {
    height: 32px;
  }

  /* 下面设置右侧按钮居中 */
  .el-input__suffix {
    top: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
    align-content: flex-start;
  }

  /* 输入框加上上下边是 32px + 2px =34px */
  .el-input__icon {
    line-height: 32px;
  }
}
</style>
