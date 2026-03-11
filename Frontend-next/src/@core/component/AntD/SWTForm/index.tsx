import { Form, FormProps } from "antd";
import AntSpin from "../AntSpin";

export type SWTFormProps = FormProps & {
  children: React.ReactNode;
  loading?: boolean;
};

const SWTForm = ({ children,loading=false, ...props }: SWTFormProps) => {
  return (
    <AntSpin spinning={loading}>
    <Form {...props} layout={props?.layout ?? "vertical"}>
      {children}
    </Form>
    </AntSpin>
  );
};

export default SWTForm;
