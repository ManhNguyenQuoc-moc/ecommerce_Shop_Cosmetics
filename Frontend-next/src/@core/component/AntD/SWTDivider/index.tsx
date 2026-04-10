"use client";

import { Divider, DividerProps } from "antd";
import React from "react";

export type SWTDividerProps = DividerProps & {
  className?: string;
};

const SWTDivider = ({ className = "", ...props }: SWTDividerProps) => {
  return (
    <Divider
      {...props}
      className={`
        custom-swt-divider
        dark:!border-slate-800
        dark:[&_.ant-divider-inner-text]:!text-slate-500
        ${className}
      `}
    />
  );
};

export default SWTDivider;
