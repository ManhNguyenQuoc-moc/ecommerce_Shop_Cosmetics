"use client";

import React from "react";
import { App, ConfigProvider } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { StyleProvider } from "@ant-design/cssinjs";
import viVN from "antd/locale/vi_VN";
import { SidebarProvider } from "./sidebar-provider";
import { AuthProvider } from "@/src/context/AuthContext";
import { useMessageInit } from "../utils/message";
import { GoogleOAuthProvider } from "@react-oauth/google";
import defaultTheme from "@/src/themes/default";

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
        <ConfigProvider theme ={defaultTheme}  locale={viVN}>
          <App>
              <MessageInitializer>
                <SidebarProvider>
                  <AuthProvider>
                    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
                      {children}
                    </GoogleOAuthProvider>
                  </AuthProvider>
                </SidebarProvider>
              </MessageInitializer>
          </App>
        </ConfigProvider>
      </StyleProvider>
    </AntdRegistry>
  );
}
