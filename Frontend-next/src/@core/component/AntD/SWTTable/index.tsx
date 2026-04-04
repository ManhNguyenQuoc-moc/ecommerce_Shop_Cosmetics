'use client';
import { Table, TableProps } from "antd";
import SWTPagination from "../SWTPagination";
import SWTRenderIf from "../../SWTRenderIf";
import SWTEmpty from "../SWTEmpty";

type SWTTableProps = TableProps<any> & {
  columns: any[];
  dataSource: any[];
  pagination?: SWTPaginationProps | false;
};

type SWTPaginationProps = {
  totalCount: number;
  page: number;
  fetch: number;
  onChange: (page: number, fetch: number) => void;
};

const SWTTable = ({
  columns,
  dataSource,
  pagination,
  ...props
}: SWTTableProps) => {
  return (
    <>
      <Table
        rowKey={props?.rowKey ?? "id"}
        {...props}
        className={`
          dark:[&_.ant-table]:!bg-transparent
          dark:[&_.ant-table-container]:!bg-transparent
          dark:[&_.ant-table-content]:!bg-transparent
          dark:[&_.ant-table-thead>tr>th]:!bg-slate-800/80
          dark:[&_.ant-table-thead>tr>th]:!text-slate-200
          dark:[&_.ant-table-thead>tr>th]:!border-slate-700
          dark:[&_.ant-table-tbody>tr>td]:!bg-transparent
          dark:[&_.ant-table-tbody>tr>td]:!text-slate-200
          dark:[&_.ant-table-tbody>tr>td]:!border-slate-700/50
          dark:[&_.ant-table-tbody>tr:hover>td]:!bg-slate-800/50
          dark:[&_.ant-table-placeholder]:!bg-transparent
          ${props.className || ""}
        `}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        locale={{
          emptyText: <SWTRenderIf condition={(dataSource ?? [])?.length === 0}><SWTEmpty /></SWTRenderIf>,
        }}
      />
      {pagination && typeof pagination === 'object' && (
        <SWTPagination
          className="!m-2 flex justify-end rounded-xl"
          total={pagination.totalCount}
          current={pagination.page}
          pageSize={pagination.fetch}
          onChange={pagination.onChange}
        />
      )}
    </>
  );
};

export default SWTTable;
