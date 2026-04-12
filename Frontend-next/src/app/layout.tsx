import { Be_Vietnam_Pro } from "next/font/google";
import { Metadata } from "next";
import AppProviders from "../@core/provider/AppProviders";
import "@/public/css/globals.css";

// Configure Be Vietnam Pro using next/font/google for optimal performance
const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
});

export const metadata: Metadata = {
  title: "SHOP COSMETICS",
  description: "Ecommerce Shop Cosmetics Premium",
  icons: {
    icon: "/images/main/logo-app.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${beVietnamPro.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const isAdmin = window.location.pathname.startsWith('/admin');
                const isDark = localStorage.getItem('admin-theme') === 'dark' || (!localStorage.getItem('admin-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isAdmin && isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `
          }}
        />
      </head>
      <body className={`${beVietnamPro.className} antialiased`}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}