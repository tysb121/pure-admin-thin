<template>
  <el-card shadow="never" :body-style="{ height: 'calc(100vh - 260px)' }">
    <template #header>
      <div class="card-header">
        <span class="font-medium"> 个人网站配置项 </span>
      </div>
    </template>

    <el-form
      ref="ruleFormRef"
      :model="newFormInline"
      :rules="formRules"
      label-width="82px"
    >
      <el-row :gutter="30">
        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item label="网站头像" prop="avatar">
            <el-upload
              class="avatar-uploader"
              action="#"
              :auto-upload="true"
              :show-file-list="false"
              :http-request="handleAvatarUpload"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :limit="1"
              accept="image/*"
            >
              <img
                v-if="newFormInline.avatar"
                :src="newFormInline.avatar"
                class="avatar"
              />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </re-col>
        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item label="欢迎语句" prop="welcomeText">
            <el-input
              v-model="newFormInline.welcomeText"
              clearable
              placeholder="请输入欢迎语句"
            />
          </el-form-item>
        </re-col>
        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item label="介绍标题" prop="introduceTitle">
            <el-input
              v-model="newFormInline.introduceTitle"
              clearable
              placeholder="请输入介绍标题"
              type="textarea"
            />
          </el-form-item>
        </re-col>
        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item label="介绍文字" prop="introduce">
            <el-input
              v-model="newFormInline.introduce"
              clearable
              placeholder="请输入介绍文字"
              type="textarea"
            />
          </el-form-item>
        </re-col>

        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item label="默认背景图" prop="defaultBackground">
            <el-upload
              v-model:file-list="fileList"
              class="upload-demo"
              action="#"
              :on-preview="handlePreview"
              :before-remove="handleRemove"
              list-type="picture"
              :auto-upload="false"
            >
              <el-button type="primary">上传背景图片</el-button>
              <!-- <template #tip>
                <div class="el-upload__tip">
                  jpg/png files with a size less than 500kb
                </div>
              </template> -->
            </el-upload>
          </el-form-item>
        </re-col>
      </el-row>
      <el-row>
        <re-col>
          <el-form-item>
            <el-button
              :loading="loading"
              :disabled="loading"
              type="primary"
              @click="submitForm"
              >提交</el-button
            >
            <!-- <el-button @click="resetForm">重置</el-button> -->
          </el-form-item>
        </re-col>
      </el-row>
    </el-form>
  </el-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import type {
  UploadFile,
  UploadProps,
  UploadUserFile,
  UploadRequestOptions,
  Action
} from "element-plus";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { removeFile, uploadFile, uploadFiles } from "@/api/system";
import {
  createWebConfig,
  getNewConfig,
  getWebConfig,
  updateWebConfig
} from "./utils/api";

const loading = ref(false);
const imageUrl = ref("");
const ruleFormRef = ref();
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: "",
    avatar: "",
    welcomeText: "",
    introduce: "",
    introduceTitle: "",
    defaultBackground: ""
  })
});
const newFormInline = ref(props.formInline);
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
};
const beforeAvatarUpload: UploadProps["beforeUpload"] = rawFile => {
  // console.log(rawFile);

  // if (rawFile.type !== "image/jpeg") {
  //   ElMessage.error("Avatar picture must be JPG format!");
  //   return false;
  // } else if (rawFile.size / 1024 / 1024 > 2) {
  //   ElMessage.error("Avatar picture size can not exceed 2MB!");
  //   return false;
  // }
  return true;
};

const handleAvatarUpload: UploadProps["httpRequest"] = async ({ file }) => {
  console.log(file);
  const formData = new FormData();
  formData.append("file", file);
  uploadFile(formData).then(res => {
    if (res.code === 0) {
      ElMessage.success("上传成功");
      newFormInline.value.avatar = res.data.url;
    }
  });
};

const fileList = ref<UploadUserFile[]>([]);

const handleRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
  return ElMessageBox.confirm(`确定要删除该文件${uploadFile.name} 吗?`).then(
    async () => {
      const r = await removeFile({ fileId: uploadFile.id });
      if (r.code === 0) {
        ElMessage.success("删除成功");
        return true;
      }
    },
    () => false
  );
};

const handlePreview: UploadProps["onPreview"] = file => {
  console.log(file);
};

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });

async function upload(files = [], busiId: string) {
  let list = files.filter(it => !it.id);
  if (list.length === 0) return;
  const formData = new FormData();
  list.forEach((file: any) => {
    console.log(file);
    formData.append("files", file.raw);
  });
  formData.append("busiId", busiId);
  await uploadFiles(formData);
}

function submitForm() {
  getRef().validate((valid: boolean) => {
    if (valid) {
      // console.log("submit!");
      if (newFormInline.value.id) {
        loading.value = true;
        updateWebConfig(newFormInline.value)
          .then(res => {
            if (res.code === 0) {
              ElMessage.success("修改成功");
              upload(fileList.value, newFormInline.value.id);
            }
          })
          .finally(() => (loading.value = false));
      } else {
        createWebConfig(newFormInline.value)
          .then(res => {
            if (res.code === 0) {
              ElMessage.success("保存成功");
              newFormInline.value = res.data;
              upload(fileList.value, newFormInline.value.id);
            }
          })
          .finally(() => (loading.value = false));
      }
    } else {
      // console.log("error submit!!");
      return false;
    }
  });
}

onMounted(() => {
  getNewConfig().then(res => {
    if (res.code === 0 && res.data) {
      newFormInline.value = res.data;
      fileList.value = res.data.backgroundImages.map(item => {
        return {
          url: item.filePath,
          name: item.originalName,
          id: item.id
        };
      });
    }
  });
});
</script>
<style lang="scss" scoped>
.upload-demo {
  width: 100%;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
::v-deep .el-upload-list--picture {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  .el-upload-list__item {
    max-width: 200px;
  }
}
</style>
