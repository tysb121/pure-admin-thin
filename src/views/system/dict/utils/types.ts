interface FormItemProps {
  id?: string;
  /** 用于判断是`新增`还是`修改` */
  title: string;
  dictId: string;
  value: string;
  label: string;
  sort: string;
  typeCode: string;
  parentId: string;
  remark: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
