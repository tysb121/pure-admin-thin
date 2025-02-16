<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: "",
    title: "",
    author: "",
    content: "",
    coverUrl: "",
    status: "0",
    publicTime: "",
    classify: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="文章标题" prop="title">
          <el-input
            v-model="newFormInline.title"
            clearable
            placeholder="请输入文章标题"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="文章作者" prop="author">
          <el-input
            v-model="newFormInline.author"
            clearable
            placeholder="请输入文章作者"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="分类" prop="classify">
          <el-input
            v-model="newFormInline.classify"
            clearable
            placeholder="请输入分类"
          />
        </el-form-item>
      </re-col>
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="文章内容" prop="content">
          <el-input
            v-model="newFormInline.content"
            clearable
            placeholder="请输入文章内容"
            type="textarea"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
