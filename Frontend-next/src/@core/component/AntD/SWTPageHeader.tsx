"use client";

import React from "react";
import { Breadcrumb, Space } from "antd";
import { useRouter } from "next/navigation";
import SWTButton from "./SWTButton";
import { MoveLeft } from "lucide-react";

interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface SWTPageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  extra?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  className?: string;
}

const SWTPageHeader: React.FC<SWTPageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  extra,
  showBack = false,
  onBack,
  className = "",
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className={`${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb
          items={breadcrumbs.map((item) => ({
            title: item.href ? (
              <a onClick={(e) => { e.preventDefault(); router.push(item.href!); }}>{item.title}</a>
            ) : (
              item.title
            ),
          }))}
          className="text-xs text-slate-400"
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {showBack && (
            <SWTButton
              variant="text"
              icon={<MoveLeft size={20} />}
              onClick={handleBack}
              className="!w-10 !h-10 !p-0 !min-w-0 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-500 dark:text-white sm:text-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {extra && (
          <div className="flex items-center gap-3">
            {extra}
          </div>
        )}
      </div>
    </div>
  );
};

export default SWTPageHeader;
