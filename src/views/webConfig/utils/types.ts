interface FormItemProps {
  id: string;
  avatar: string;
  welcomeText: string;
  introduce: string;
  introduceTitle: string;
  defaultBackground: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
