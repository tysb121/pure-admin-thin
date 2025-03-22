<script setup lang="ts">
import { ref, computed, watch, getCurrentInstance } from "vue";

import Dept from "@iconify-icons/ri/git-branch-line";
import OfficeBuilding from "@iconify-icons/ep/office-building";
import LocationCompany from "@iconify-icons/ep/add-location";
import { Plus } from "@element-plus/icons-vue";
interface Tree {
  id: string;
  name: string;
  highlight?: boolean;
  children?: Tree[];
}

defineProps({
  treeLoading: Boolean,
  treeData: Array
});

const emit = defineEmits(["tree-select"]);

const treeRef = ref();
const isExpand = ref(true);
const searchValue = ref("");
const highlightMap = ref({});
const { proxy } = getCurrentInstance();
const defaultProps = {
  children: "children",
  label: "typeName"
};

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.name.includes(value);
};

function nodeClick(value) {
  const nodeId = value.$treeNodeId;
  highlightMap.value[nodeId] = highlightMap.value[nodeId]?.highlight
    ? Object.assign({ id: nodeId }, highlightMap.value[nodeId], {
        highlight: false
      })
    : Object.assign({ id: nodeId }, highlightMap.value[nodeId], {
        highlight: true
      });
  Object.values(highlightMap.value).forEach((v: Tree) => {
    if (v.id !== nodeId) {
      v.highlight = false;
    }
  });
  emit(
    "tree-select",
    highlightMap.value[nodeId]?.highlight
      ? Object.assign({ ...value, selected: true })
      : Object.assign({ ...value, selected: false })
  );
}

function toggleRowExpansionAll(status) {
  isExpand.value = status;
  const nodes = (proxy.$refs["treeRef"] as any).store._getAllNodes();
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].expanded = status;
  }
}

/** 重置部门树状态（选中状态、搜索框值、树初始化） */
function onTreeReset() {
  highlightMap.value = {};
  searchValue.value = "";
  toggleRowExpansionAll(true);
}

function onAddDict() {}

watch(searchValue, val => {
  treeRef.value!.filter(val);
});

defineExpose({ onTreeReset });
</script>

<template>
  <div
    v-loading="treeLoading"
    class="h-full bg-bg_color overflow-hidden relative"
    :style="{ minHeight: `calc(100vh - 141px)` }"
  >
    <div class="flex items-center h-[34px]">
      <el-input
        v-model="searchValue"
        class="ml-2 mr-2"
        size="small"
        placeholder="请输入名称"
        clearable
      >
        <template #suffix>
          <el-icon class="el-input__icon">
            <IconifyIconOffline
              v-show="searchValue.length === 0"
              icon="ri:search-line"
            />
          </el-icon>
        </template>
      </el-input>

      <el-button
        class="mr-2"
        size="small"
        type="primary"
        :icon="Plus"
        circle
        @click="onAddDict"
      />
    </div>
    <el-divider />
    <el-scrollbar height="calc(90vh - 88px)">
      <el-tree
        ref="treeRef"
        :data="treeData"
        node-key="id"
        size="small"
        :props="defaultProps"
        default-expand-all
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        @node-click="nodeClick"
      >
        <template #default="{ node, data }">
          <div
            :class="[
              'rounded',
              'flex',
              'items-center',
              'select-none',
              'hover:text-primary',
              searchValue.trim().length > 0 &&
                node.label.includes(searchValue) &&
                'text-red-500',
              highlightMap[node.id]?.highlight ? 'dark:text-primary' : ''
            ]"
            :style="{
              color: highlightMap[node.id]?.highlight
                ? 'var(--el-color-primary)'
                : '',
              background: highlightMap[node.id]?.highlight
                ? 'var(--el-color-primary-light-7)'
                : 'transparent'
            }"
          >
            <IconifyIconOffline
              :icon="
                data.type === 1
                  ? OfficeBuilding
                  : data.type === 2
                    ? LocationCompany
                    : Dept
              "
            />
            <span class="!w-[120px] !truncate" :title="node.label">
              {{ node.label }}
            </span>
            <el-button
              class="mr-2"
              size="small"
              type="primary"
              :icon="Plus"
              circle
              @click="onAddDict"
            />
          </div>
        </template>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-divider) {
  margin: 0;
}

:deep(.el-tree) {
  --el-tree-node-hover-bg-color: transparent;
}
</style>
