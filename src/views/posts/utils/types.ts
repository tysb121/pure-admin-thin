interface FormItemProps {
  id: string;
  title: string;
  author: string;
  content: string;
  coverUrl: string;
  status: string;
  publicTime: string;
  classify: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
