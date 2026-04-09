"use client";

import { Drawer, DrawerProps } from "antd";
import React from "react";

export type SWTDrawerProps = DrawerProps & {
  children?: React.ReactNode;
};

const SWTDrawer = ({ children, className = "", ...props }: SWTDrawerProps) => {
  return (
    <Drawer
      {...props}
      className={`custom-swt-drawer ${className}`}
    >
      {children}
    </Drawer>
  );
};

export default SWTDrawer;
