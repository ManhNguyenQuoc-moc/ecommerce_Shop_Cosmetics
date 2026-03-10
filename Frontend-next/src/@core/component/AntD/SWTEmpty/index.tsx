import { Empty, EmptyProps } from "antd";

type SWTEmptyProps = EmptyProps & {};

const SWTEmpty = ({ ...props }: SWTEmptyProps) => {
  return (
    <Empty
      {...props}
      description={props.description ?? "Không có dữ liệu"}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    />
  );
};

export default SWTEmpty;
