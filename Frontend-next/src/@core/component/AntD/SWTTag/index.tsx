"use client";

import { Tag, TagProps } from "antd";
import React from "react";

export type SWTTagProps = TagProps & {
  children?: React.ReactNode;
};

const SWTTag = ({ children, className = "", ...props }: SWTTagProps) => {
  return (
    <Tag
      {...props}
      className={`
        custom-swt-tag
        !rounded-full
        !px-3
        !py-1
        !font-black
        !text-[11px]
        uppercase
        tracking-tight
        ${className}
      `}
    >
      {children}
    </Tag>
  );
};

export default SWTTag;
