// Static skeleton - NO hooks allowed here!
export default function HeaderSkeleton() {
  return (
    <div className="h-[150px] md:h-[160px] lg:h-[180px] flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
        <span className="text-sm text-brand-600 font-medium">Đang tải...</span>
      </div>
    </div>
  );
}

export function HeaderNavSkeleton() {
  return (
    <div className="hidden lg:block overflow-hidden">
      <div className="pt-5 border-t border-brand-200/50 mt-2">
        <div className="max-w-7xl mx-auto h-[48px] flex items-center justify-center">
          <div className="w-6 h-6 border-3 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
}

export function HeaderSearchSkeleton() {
  return (
    <div className="hidden md:flex flex-1 max-w-4xl mx-4 items-center justify-center min-h-[44px]">
      <div className="w-5 h-5 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );
}
