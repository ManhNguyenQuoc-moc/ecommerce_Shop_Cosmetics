import { ConfigProvider, theme as antdTheme } from "antd";

export default function AntThemeProvider({ children, mode = "light" }) {
  const isDark = mode === "dark";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,

        token: {

          fontFamily: "var(--font-outfit)",
          fontSize: 14,
          lineHeight: 1.5715,

          /* ===== BRAND ===== */
          colorPrimary: "var(--color-primary)",
          colorLink: "var(--color-primary)",
          colorLinkHover: "var(--color-brand-600)",

          /* ===== STATUS ===== */
          colorSuccess: "var(--color-success)",
          colorWarning: "var(--color-warning)",
          colorError: "var(--color-error)",
          colorInfo: "var(--color-info)",

          colorText: "var(--color-black)",
          colorTextSecondary: "var(--color-gray)",
          colorTextTertiary: "var(--color-gray-disabled)",
          colorTextHeading: "var(--color-black)",

          colorBgLayout: "var(--color-gray-lighter)",
          colorBgBase: "var(--color-white)",
          colorBgContainer: "var(--color-white)",
          colorBgElevated: "var(--color-bg-card)",

          colorBorder: "var(--color-gray-border)",
          colorBorderSecondary: "var(--color-gray-light)",
          borderRadius: 6,
          borderRadiusLG: 8,
          borderRadiusSM: 4,

          boxShadow:
            "0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)",
        },

        components: {
          Button: {
            controlHeight: 40,
            borderRadius: 6,
            fontWeight: 500,
          },
          Input: {
            controlHeight: 40,
            borderRadius: 6,
          },
          Select: {
            controlHeight: 40,
            borderRadius: 6,
          },
          Card: {
            borderRadius: 8,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}