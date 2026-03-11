'use client';
import { Pagination, PaginationProps } from "antd";

type SWTPaginationProps = PaginationProps & {
};

const SWTPagination = (props: SWTPaginationProps) => {
  return (
    <Pagination
      {...props}
      showSizeChanger
      defaultCurrent={1}
      total={props?.total || 0}
      pageSizeOptions={[6, 9, 12, 15]}
      showTotal={
        (total: number, range: [number, number]) => `${range[0]}-${range[1]} trong ${total}`
      }
    />
  );
};

export default SWTPagination;
