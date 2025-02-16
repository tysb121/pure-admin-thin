import editForm from "../form.vue";
import { message } from "@/utils/message";
import {
  getPostsList,
  createPosts,
  updatePosts,
  deletePosts,
  getPostsDetail
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
      label: "文章标题",
      prop: "title"
    },
    {
      label: "作者",
      prop: "author"
    },
    {
      label: "分类",
      prop: "classify"
    },
    {
      label: "封面图",
      prop: "coverUrl"
    },
    {
      label: "状态",
      prop: "status",
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={
            row.status === "0"
              ? "primary"
              : row.status === "1"
                ? "warning"
                : "success"
          }
          effect="plain"
        >
          {row.status === "0"
            ? "暂存"
            : row.status === "1"
              ? "待审核"
              : "已发布"}
        </el-tag>
      )
    },
    {
      label: "发布时间",
      prop: "publicTime"
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
    const { data } = await getPostsList(toRaw(form));
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
      let res = await getPostsDetail({ id: row.id });
      if (res.code === 0) {
        formInline = res.data;
      }
    }
    addDialog({
      title: `${title}文章`,
      props: {
        formInline: {
          id: row?.id ?? "",
          title: row?.title ?? "",
          author: row?.author ?? "",
          content: row?.content ?? "",
          coverUrl: row?.coverUrl ?? "",
          status: row?.status ?? "0",
          publicTime: row?.publicTime ?? "",
          classify: row?.classify ?? ""
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
          message(`您${title}了文章标题为${curData.title}的这条数据`, {
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
              let res = await createPosts(curData);
              if (res.code === 0) chores();
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              let res = await updatePosts(curData);
              if (res.code === 0) chores();
            }
          }
        });
      }
    });
  }

  function handleDelete(row) {
    deletePosts({ id: row.id }).then(res => {
      if (res.code === 0) {
        message(`您删除了文章标题为${row.title}的这条数据`, {
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
