"use client";

import React from "react";
import { App, ConfigProvider } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { StyleProvider } from "@ant-design/cssinjs";
import viVN from "antd/locale/vi_VN";
import ThemeProvider from "./theme-provider";
import { SidebarProvider } from "./sidebar-provider";
import { AuthProvider } from "@/src/context/AuthContext";
import { useMessageInit } from "../utils/message";

/**
 * MessageInitializer handles Ant Design global message/notification initialization
 */
const MessageInitializer = ({ children }: { children: React.ReactNode }) => {
  useMessageInit();
  return <>{children}</>;
};

type AppProvidersProps = {
  children: React.ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <AntdRegistry>
      <StyleProvider hashPriority="low">
        <ConfigProvider locale={viVN}>
          <App>
            <ThemeProvider>
              <MessageInitializer>
                <SidebarProvider>
                  <AuthProvider>
                    {children}
                  </AuthProvider>
                </SidebarProvider>
              </MessageInitializer>
            </ThemeProvider>
          </App>
        </ConfigProvider>
      </StyleProvider>
    </AntdRegistry>
  );
}
