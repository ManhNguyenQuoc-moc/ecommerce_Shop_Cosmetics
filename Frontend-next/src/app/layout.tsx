import { Be_Vietnam_Pro } from "next/font/google";
import { Metadata, Viewport } from "next";
import AppProviders from "../@core/provider/AppProviders";
import "@/public/css/globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700"], // Thêm 600 nếu Antd cần SemiBold
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
});

export const metadata: Metadata = {
  title: "SWT COSMETICS | Premium Shop",
  description: "Ecommerce Shop Cosmetics Premium - Chăm sóc vẻ đẹp của bạn",
  icons: {
    icon: "/images/main/logo-app.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={beVietnamPro.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('admin-theme');
                  const supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && supportDarkMode)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className={`${beVietnamPro.className} antialiased text-slate-900`}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}