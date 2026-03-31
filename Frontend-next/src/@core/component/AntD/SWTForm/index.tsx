import { Form, FormProps } from "antd";
import AntSpin from "../AntSpin";

export type SWTFormProps = FormProps & {
  children: React.ReactNode;
  loading?: boolean;
};

const SWTForm = ({ children, loading = false, ...props }: SWTFormProps) => {
  return (
    <AntSpin spinning={loading}>
      <Form {...props} layout={props?.layout ?? "vertical"}>
        {children}
      </Form>
    </AntSpin>
  );
};

// Expose internal AntD Form components through SWTForm
SWTForm.useForm = Form.useForm;
SWTForm.useWatch = Form.useWatch;
SWTForm.Item = Form.Item;
SWTForm.List = Form.List;
SWTForm.ErrorList = Form.ErrorList;
SWTForm.Provider = Form.Provider;

export default SWTForm;
