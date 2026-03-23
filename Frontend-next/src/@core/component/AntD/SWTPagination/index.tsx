'use client';
import { Pagination, PaginationProps } from "antd";
import clsx from "clsx";

type SWTPaginationProps = PaginationProps & {
};

const SWTPagination = (props: SWTPaginationProps) => {
  return (
    <Pagination
      {...props}
      className={clsx(
        "dark:[&_.ant-pagination-item]:!bg-slate-900/50",
        "dark:[&_.ant-pagination-item]:!border-slate-700/80",
        "dark:[&_.ant-pagination-item>a]:!text-slate-300",
        "dark:[&_.ant-pagination-item-active]:!bg-brand-500/20",
        "dark:[&_.ant-pagination-item-active]:!border-brand-500",
        "dark:[&_.ant-pagination-item-active>a]:!text-brand-400",
        "dark:[&_.ant-pagination-prev>button]:!bg-slate-900/50",
        "dark:[&_.ant-pagination-next>button]:!bg-slate-900/50",
        "dark:[&_.ant-pagination-prev>button]:!text-slate-300",
        "dark:[&_.ant-pagination-next>button]:!text-slate-300",
        "dark:[&_.ant-pagination-prev>button]:!border-slate-700/80",
        "dark:[&_.ant-pagination-next>button]:!border-slate-700/80",
        "dark:[&_.ant-pagination-disabled>button]:!text-slate-600",
        "dark:[&_.ant-pagination-disabled>button]:!bg-slate-900/20",
        "dark:[&_.ant-pagination-disabled>button]:!border-slate-800",
        "dark:[&_.ant-pagination-jump-prev_.ant-pagination-item-ellipsis]:!text-slate-500",
        "dark:[&_.ant-pagination-jump-next_.ant-pagination-item-ellipsis]:!text-slate-500",
        "dark:[&_.ant-select-selector]:!bg-slate-900/50",
        "dark:[&_.ant-select-selector]:!border-slate-700/80",
        "dark:[&_.ant-select-selection-item]:!text-slate-200",
        "dark:[&_.ant-select-arrow]:!text-slate-400",
        "dark:[&_.ant-pagination-total-text]:!text-slate-400",
        props.className
      )}
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
