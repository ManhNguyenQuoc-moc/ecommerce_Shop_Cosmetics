'use client';

import { Breadcrumb, BreadcrumbProps } from "antd";

type SWTBreadcrumbProps = BreadcrumbProps & {};

const SWTBreadcrumb = ({ ...props }: SWTBreadcrumbProps) => {
  return <Breadcrumb {...props} className="m-2" items={props?.items} />;
};

export default SWTBreadcrumb;
