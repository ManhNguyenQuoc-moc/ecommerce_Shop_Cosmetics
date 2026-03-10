'use client';
import { Table, TableProps } from "antd";
import SWTPagination from "../SWTPagination";
import SWTRenderIf from "../../SWTRenderIf";
import SWTEmpty from "../SWTEmpty";

type SWTTableProps = TableProps<any> & {
  columns: any[];
  dataSource: any[];
  pagination?: SWTPaginationProps;
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
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        locale={{
          emptyText: <SWTRenderIf condition={(dataSource ?? [])?.length === 0}><SWTEmpty /></SWTRenderIf>,
        }}
      />
      <SWTRenderIf condition={pagination != null && pagination != undefined}>
        <SWTPagination
          className="m-2 flex justify-end rounded-xl"
          total={pagination?.totalCount}
          current={pagination?.page}
          pageSize={pagination?.fetch}
          onChange={pagination?.onChange}
        />
      </SWTRenderIf>
    </>
  );
};

export default SWTTable;
