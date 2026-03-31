"use client";
import { Outfit } from "next/font/google";
import ThemeProvider from "../@core/provider/theme-provider";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { SidebarProvider } from "../@core/provider/sidebar-provider";
import viVN from "antd/locale/vi_VN";
import { ConfigProvider } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
import { AuthProvider } from "@/src/context/AuthContext";
import "@/public/css/globals.css";
import { useMessageInit } from "../@core/utils/message";
import { Provider } from "react-redux";
// import { store } from "../stores";

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const MessageInitializer = ({ children }: { children: React.ReactNode }) => {
    useMessageInit();
    return <>{children}</>;
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>SHOP COSMETICS</title>
        <link rel="icon" type="image/png" href="/images/main/logo-app.png"></link>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `
          }}
        />
      </head>
      <body className={`${outfit.className}`}>
        {/* <Provider store={store}> */}
        <StyleProvider hashPriority="low">
          <ConfigProvider locale={viVN}>
            <ThemeProvider>
              <MessageInitializer>
                <SidebarProvider>
                  <AuthProvider><AntdRegistry>{children}</AntdRegistry></AuthProvider>
                </SidebarProvider>
              </MessageInitializer>
            </ThemeProvider>
          </ConfigProvider>
        </StyleProvider>
        {/* </Provider> */}
      </body>
    </html>
  );
}