interface FormItemProps {
  id: string;
  title: string;
  webUrl: string;
  description: string;
  remark: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
