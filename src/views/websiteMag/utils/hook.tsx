import editForm from "../form.vue";
import { message } from "@/utils/message";
import {
  getWebsiteList,
  createWebsite,
  updateWebsite,
  deleteWebsite,
  getWebsiteDetail
} from "./api";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { deviceDetection } from "@pureadmin/utils";

export function useWebsite() {
  const form = reactive({
    title: ""
  });

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);

  const columns: TableColumnList = [
    {
      label: "站点名称",
      prop: "title"
    },
    {
      label: "站点网址",
      prop: "webUrl"
    },
    {
      label: "网站描述",
      prop: "description"
    },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }
  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getWebsiteList(toRaw(form));
    dataList.value = data.rows;
    pagination.total = data.total;
    pagination.pageSize = data.size;
    pagination.currentPage = data.current;

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  async function openDialog(title = "新增", row?: FormItemProps) {
    let formInline: FormItemProps = null;
    if (title == "修改") {
      let res = await getWebsiteDetail({ id: row.id });
      if (res.code === 0) {
        formInline = res.data;
      }
    }
    addDialog({
      title: `${title}站点`,
      props: {
        formInline: {
          id: row?.id ?? "",
          title: row?.title ?? "",
          webUrl: row?.webUrl ?? "",
          description: row?.description ?? "",
          remark: row?.remark ?? ""
        }
      },
      width: "45%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了站点名称为${curData.title}的这条数据`, {
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
              let res = await createWebsite(curData);
              if (res.code === 0) chores();
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              let res = await updateWebsite(curData);
              if (res.code === 0) chores();
            }
          }
        });
      }
    });
  }

  function handleDelete(row) {
    deleteWebsite({ id: row.id }).then(res => {
      if (res.code === 0) {
        message(`您删除了站点名称为${row.title}的这条数据`, {
          type: "success"
        });
        onSearch();
      }
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    pagination,
    /** 搜索 */
    onSearch,
    /** 重置 */
    resetForm,
    /** 新增、修改菜单 */
    openDialog,
    /** 删除菜单 */
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
