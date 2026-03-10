import { Form, FormProps } from "antd";

export type SWTFormProps = FormProps & {
  children: React.ReactNode;
};

const SWTForm = ({ children, ...props }: SWTFormProps) => {
  return (
    <Form {...props} layout={props?.layout ?? "vertical"}>
      {children}
    </Form>
  );
};

export default SWTForm;
