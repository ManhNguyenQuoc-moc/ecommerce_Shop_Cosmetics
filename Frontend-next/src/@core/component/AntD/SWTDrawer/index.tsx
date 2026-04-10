"use client";

import { Drawer, DrawerProps } from "antd";
import React from "react";

export type SWTDrawerProps = DrawerProps & {
  children?: React.ReactNode;
  bodyClassName?: string;
};

const SWTDrawer = ({ children, className = "", bodyClassName, ...props }: SWTDrawerProps) => {
  return (
    <Drawer
      {...props}
      classNames={{
        body: bodyClassName,
        ...props.classNames,
      }}
      className={`custom-swt-drawer ${className}`}
    >
      {children}
    </Drawer>
  );
};

export default SWTDrawer;
