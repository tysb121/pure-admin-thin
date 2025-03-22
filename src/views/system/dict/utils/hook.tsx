import "./reset.css";
// import dayjs from "dayjs";
import editForm from "../form/index.vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import type { FormItemProps } from "../utils/types";
import {
  getKeyList,
  // isAllEmpty,
  // hideTextAtIndex,
  deviceDetection
} from "@pureadmin/utils";
import {
  getDictList,
  getDictItemList,
  getDictItemDetail,
  createDictItem,
  updateDictItem,
  removeDictItem
} from "./api";
// import { ElMessageBox } from "element-plus";
import { type Ref, h, ref, toRaw, computed, reactive, onMounted } from "vue";

export function useUser(tableRef: Ref, treeRef: Ref) {
  const form = reactive({
    // 左侧部门树的id
    deptId: "",
    userName: "",
    phone: "",
    status: ""
  });
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  // const switchLoadMap = ref({});
  const higherDeptOptions = ref();
  const treeData = ref([]);
  const treeLoading = ref(true);
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "勾选列", // 如果需要表格多选，此处label必须设置
      type: "selection",
      fixed: "left",
      reserveSelection: true // 数据刷新后保留选项
    },
    // {
    //   label: "用户编号",
    //   prop: "id",
    //   width: 90
    // },
    {
      label: "数据值",
      prop: "value",
      minWidth: 130
    },
    {
      label: "数据名称",
      prop: "label",
      minWidth: 130
    },
    {
      label: "排序",
      prop: "sort",
      minWidth: 90
    },
    {
      label: "备注",
      prop: "remarks",
      minWidth: 90
    },
    // {
    //   label: "创建时间",
    //   minWidth: 90,
    //   prop: "createdTime",
    //   formatter: ({ createdTime }) =>
    //     dayjs(createdTime).format("YYYY-MM-DD HH:mm:ss")
    // },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];
  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });

  function handleUpdate(row) {
    console.log(row);
  }

  function handleDelete(row) {
    removeDictItem({ id: row.id }).then(() => {
      message(`您删除了字典项编号为${row.id}的这条数据`, { type: "success" });
      onSearch();
    });
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }

  /** 取消选择 */
  function onSelectionCancel() {
    selectedNum.value = 0;
    // 用于多选表格，清空用户的选择
    tableRef.value.getTableRef().clearSelection();
  }

  /** 批量删除 */
  function onbatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
    message(`已删除用户编号为 ${getKeyList(curSelected, "id")} 的数据`, {
      type: "success"
    });
    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const searchObj = {
      ...toRaw(form),
      current: pagination.currentPage,
      size: pagination.pageSize
    };
    const { data } = await getDictItemList(searchObj);
    dataList.value = data.rows;
    pagination.total = data.total;
    pagination.pageSize = data.size;
    pagination.currentPage = data.current;

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    form.deptId = "";
    treeRef.value.onTreeReset();
    onSearch();
  };

  function onTreeSelect({ id, selected }) {
    form.deptId = selected ? id : "";
    onSearch();
  }

  async function openDialog(title = "新增", row?: FormItemProps) {
    if (title == "修改") {
      let res = await getDictItemDetail({ id: row.id });
      if (res.code === 0) {
        row = res.data;
      }
    }
    addDialog({
      title: `${title}字典项`,
      props: {
        formInline: {
          id: row?.id ?? "",
          title,
          dictId: row?.dictId ?? 0,
          value: row?.value ?? "",
          label: row?.label ?? "",
          sort: row?.sort ?? "",
          typeCode: row?.typeCode ?? "",
          parentId: row?.parentId ?? "",
          remark: row?.remark ?? ""
        }
      },
      width: "46%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了字典项名称为${curData.label}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              const par = JSON.parse(JSON.stringify(curData));
              let res = await createDictItem(par);
              if (res.code === 0) chores();
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              const par = JSON.parse(JSON.stringify(curData));
              let res = await updateDictItem(par);
              if (res.code === 0) chores();
            }
          }
        });
      }
    });
  }

  onMounted(async () => {
    treeLoading.value = true;
    onSearch();

    // 归属部门
    const { data } = await getDictList();
    higherDeptOptions.value = data;
    treeData.value = data;
    treeLoading.value = false;
  });

  return {
    form,
    loading,
    columns,
    dataList,
    treeData,
    treeLoading,
    selectedNum,
    pagination,
    buttonClass,
    deviceDetection,
    onSearch,
    resetForm,
    onbatchDel,
    openDialog,
    onTreeSelect,
    handleUpdate,
    handleDelete,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
