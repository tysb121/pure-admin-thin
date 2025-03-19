<script setup lang="ts">
import "@wangeditor/editor/dist/css/style.css";
import { Boot, IEditorConfig } from "@wangeditor/editor";
import { IToolbarConfig } from "@wangeditor/editor";
import attachmentModule from "@wangeditor/plugin-upload-attachment";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { onBeforeUnmount, ref, shallowRef, onMounted } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { uploadFile } from "@/api/system";
// 注册。要在创建编辑器之前注册，且只能注册一次，一定要判断，不可重复注册。
if (Boot.plugins.length < 13) {
  //判断如果已经插入进去，不在二次插入
  Boot.registerModule(attachmentModule);
}

const mode = "default";
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref("<p>你好</p>");
type InsertFnType = (url: string, alt: string, href: string) => void;
const editorConfig: Partial<IEditorConfig> = {
  placeholder: "请输入内容...",
  // 在编辑器中，点击选中“附件”节点时，要弹出的菜单
  hoverbarKeys: {
    attachment: {
      menuKeys: ["downloadAttachment"] // “下载附件”菜单
    }
  },
  MENU_CONF: {
    uploadImage: {
      // form-data fieldName ，默认值 'wangeditor-uploaded-image'
      fieldName: "file",
      // 单个文件的最大体积限制，默认为 2M
      maxFileSize: 2 * 1024 * 1024, // 1M
      // 最多可上传几个文件，默认为 100
      maxNumberOfFiles: 1,
      // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
      allowedFileTypes: ["image/*"],
      // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
      // meta: {
      //   token: "xxx",
      //   otherKey: "yyy"
      // },

      // 将 meta 拼接到 url 参数中，默认 false
      metaWithUrl: false,

      // 自定义增加 http  header
      // headers: {
      //   Accept: "text/x-json",
      //   otherKey: "xxx"
      // },

      // 跨域是否传递 cookie ，默认为 false
      withCredentials: true,

      // 超时时间，默认为 10 秒
      // timeout: 5 * 1000 // 5 秒
      // 上传之前触发
      onBeforeUpload(file: File) {
        // TS 语法
        // onBeforeUpload(file) {    // JS 语法
        // file 选中的文件，格式如 { key: file }
        return file;

        // 可以 return
        // 1. return file 或者 new 一个 file ，接下来将上传
        // 2. return false ，不上传这个 file
      },

      // 上传进度的回调函数
      onProgress(progress: number) {
        // TS 语法
        // onProgress(progress) {       // JS 语法
        // progress 是 0-100 的数字
        console.log("progress", progress);
      },

      // 单个文件上传成功之后
      onSuccess(file: File, res: any) {
        // TS 语法
        // onSuccess(file, res) {          // JS 语法
        console.log(`${file.name} 上传成功`, res);
      },

      // 单个文件上传失败
      onFailed(file: File, res: any) {
        // TS 语法
        // onFailed(file, res) {           // JS 语法
        console.log(`${file.name} 上传失败`, res);
      },

      // 上传错误，或者触发 timeout 超时
      onError(file: File, err: any, res: any) {
        // TS 语法
        // onError(file, err, res) {               // JS 语法
        console.log(`${file.name} 上传出错`, err, res);
      },
      // 自定义上传
      async customUpload(file: File, insertFn: InsertFnType) {
        console.log(file);

        // TS 语法
        // async customUpload(file, insertFn) {                   // JS 语法
        // file 即选中的文件
        // 自己实现上传，并得到图片 url alt href
        // 最后插入图片
        const formData = new FormData();
        formData.append("file", file);
        await uploadFile(formData).then(res => {
          const { code, data } = res;
          if (code === 0) {
            const { url } = data;
            insertFn(url, file.name, "");
          }
        });
        // insertFn(url, alt, href);
      }
    },
    // “上传附件”菜单的配置
    uploadAttachment: {
      // server: "/api/upload", // 服务端地址
      // timeout: 5 * 1000, // 5s

      // fieldName: "custom-fileName",
      // meta: { token: "xxx", a: 100 }, // 请求时附加的数据
      // metaWithUrl: true, // meta 拼接到 url 上
      // headers: { Accept: "text/x-json" },

      maxFileSize: 10 * 1024 * 1024, // 10M

      // onBeforeUpload(file: File) {
      //   console.log("onBeforeUpload", file);
      //   return file; // 上传 file 文件
      //   // return false // 会阻止上传
      // },
      // onProgress(progress: number) {
      //   console.log("onProgress", progress);
      // },
      // onSuccess(file: File, res: any) {
      //   console.log("onSuccess", file, res);
      // },
      // onFailed(file: File, res: any) {
      //   alert(res.message);
      //   console.log("onFailed", file, res);
      // },
      // onError(file: File, err: Error, res: any) {
      //   alert(err.message);
      //   console.error("onError", file, err, res);
      // },

      // 上传成功后，用户自定义插入文件
      // customInsert(res: any, file: File, insertFn: Function) {
      //   console.log("customInsert", res);
      //   const { url } = res.data || {};
      //   if (!url) throw new Error(`url is empty`);

      //   // 插入附件到编辑器
      //   insertFn(`customInsert-${file.name}`, url);
      // },

      // 用户自定义上传
      customUpload(file: File, insertFn: Function) {
        // console.log("customUpload", file);
        const formData = new FormData();
        formData.append("file", file);
        return uploadFile(formData).then(res => {
          const { code, data } = res;
          if (code === 200) {
            const { url } = data;
            insertFn(`customUpload-${file.name}`, url);
          }
        });
      }

      // // 自定义选择
      // customBrowseAndUpload(insertFn: Function) {
      //   alert('自定义选择文件，如弹出图床')
      //   // 自己上传文件
      //   // 上传之后用 insertFn(fileName, link) 插入到编辑器
      // },

      // 插入到编辑器后的回调
      // onInsertedAttachment(elem: AttachmentElement) {
      //   console.log("inserted attachment", elem);
      // }
    }
  }

  // 其他...
};

const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: ["fullScreen"],
  // 插入哪些菜单
  insertKeys: {
    index: 0, // 自定义插入的位置
    keys: ["uploadAttachment"] // “上传附件”菜单
  }

  // 其他...
};
// 模拟 ajax 异步获取内容
onMounted(() => {
  // setTimeout(() => {
  //   valueHtml.value = "<p>我是模拟的异步数据</p>";
  // }, 1500);
});
const handleCreated = editor => {
  // 记录 editor 实例，重要！
  editorRef.value = editor;
};
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

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
          <div class="wangeditor">
            <Toolbar
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              :mode="mode"
              style="border-bottom: 1px solid #ccc"
            />
            <Editor
              v-model="formInline.content"
              :defaultConfig="editorConfig"
              :mode="mode"
              style="height: 500px; overflow-y: hidden"
              @onCreated="handleCreated"
            />
          </div>
          <!-- <el-input
            v-model="newFormInline.content"
            clearable
            placeholder="请输入文章内容"
            type="textarea"
          /> -->
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
