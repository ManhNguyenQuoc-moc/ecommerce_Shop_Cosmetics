
export default function Loading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6 animate-pulse">
      {/* Breadcrumb */}
      <div className="h-4 w-48 bg-gray-200 rounded-full" />

      {/* Page title */}
      <div className="h-8 w-64 bg-gray-200 rounded-xl" />

      {/* Content blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-gray-100 h-48" />
        ))}
      </div>
    </div>
  );
}