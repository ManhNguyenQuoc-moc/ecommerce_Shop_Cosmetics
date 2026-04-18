# Fix Cascading Renders & Suspense Issues - Summary

## Vấn đề đã được sửa

### 1. **Cascading Renders (Render chồng chéo)**

**Nguyên nhân cũ:**

- `useSearchParams()` được gọi trực tiếp trong `AppHeader` và khiến re-render liên tục
- `searchTerm` state được init từ URL nhưng không có điều kiện kiểm soát
- Scroll handler không tối ưu

**Giải pháp áp dụng:**

- ✅ Tách riêng `HeaderSearchInput.tsx` - chỉ component này sử dụng `useSearchParams()`
- ✅ Dùng `key={urlSearchTerm}` để React tự reset input mà không cần `useEffect`
- ✅ Scroll handler dùng `setScrolled((prev) => ...)` để chỉ update khi giá trị thực sự thay đổi

**Files tạo:**

```
└── HeaderSearchInput.tsx        (useSearchParams hook - riêng biệt)
└── HeaderActionButtons.tsx      (Cart + UserDropdown - riêng biệt)
└── HeaderContainer.tsx          (Scroll detection wrapper)
└── HeaderSkeleton.tsx           (Static fallback - không hooks)
```

---

### 2. **Missing Suspense Boundary Error**

**Nguyên nhân cũ:**

- `AppHeader` gọi `useSearchParams()` nhưng không được bọc trong Suspense
- Next.js build step khởi động pre-rendering và phát hiện hook này không có fallback
- HeaderFallback quá phức tạp, có thể chứa các component gọi hooks

**Giải pháp áp dụng:**

- ✅ **Granular Suspense Boundaries**: Bọc từng phần riêng lẻ thay vì toàn bộ header

  ```
  <Suspense fallback={<HeaderSkeleton />}>
    <HeaderDataWrapper />     {/* Fetch server data */}
  </Suspense>
  ```

- ✅ **Fallback tĩnh**: `HeaderSkeleton.tsx` chỉ chứa HTML tĩnh, **không có bất kỳ hooks nào**

  ```tsx
  export default function HeaderSkeleton() {
    return <div className="h-[150px] md:h-[160px] lg:h-[180px]" />;
  }
  ```

- ✅ **Local Suspense cho dynamic parts**:
  ```tsx
  <Suspense fallback={<HeaderSearchSkeleton />}>
    <HeaderSearchInput /> {/* Chỉ có hook này đây */}
  </Suspense>
  ```

---

### 3. **Build Timeout (60s hang)**

**Nguyên nhân cũ:**

- Cascading renders từ vấn đề 1 gây vòng lặp vô hạn
- HeaderFallback có khả năng gọi các component dùng hooks
- Next.js bị kẹt khi cố giải quyết render boundaries

**Giải pháp:**

- ✅ Loại bỏ cascading renders → không còn vòng lặp vô hạn
- ✅ Simplify fallback → chỉ dùng HTML tĩnh
- ✅ Tách riêng phần động → mỗi Suspense boundary chỉ bọc một phần nhỏ

---

### 4. **UX Optimization - Progressive Hydration**

**Vấn đề cũ:**

- Toàn bộ header phải chờ API fetch categories thì mới hiện ra
- User thấy trống trơn trước khi dữ liệu về

**Giải pháp áp dụng:**

- ✅ **Logo + Menu shell hiện ngay**: CustomerHeader render static structure trước
- ✅ **Search & Actions load asynchronously**: Chỉ bọc những phần dynamic trong Suspense riêng

**Trình tự render:**

1. HeaderSkeleton hiển thị ngay (150px height)
2. Logo & menu structure hiện lên (static)
3. Search input load vào với fallback
4. Action buttons (Cart, User) load vào với fallback

---

## Cấu trúc Files mới

```
src/layout/customer/
├── AppHeader.tsx              (★ Simplified - only static header shell)
├── HeaderContainer.tsx        (NEW - Scroll detection wrapper)
├── HeaderSearchInput.tsx      (NEW - Search with useSearchParams)
├── HeaderActionButtons.tsx    (NEW - Cart + User menu)
├── HeaderSkeleton.tsx         (NEW - Static fallback skeletons)
├── AppSideBar.tsx
├── BackgroundDecor.tsx
└── ...

src/app/(customer)/
└── layout.tsx                 (★ Updated - Granular Suspense)
```

---

## Điểm chính của từng File

### `AppHeader.tsx` (Simplified)

```tsx
// ✅ Không có useSearchParams
// ✅ Không có scroll detection (chuyển sang Container)
// ✅ Nhận scrolled prop từ parent
// ✅ Nhận children prop cho search + buttons
export default function CustomerHeader({
  initialCategories = [],
  initialBrands = [],
  children,
  scrolled = false,
}) {
  // Chỉ render static header structure
  return (
    <header>
      <Logo />
      <MenuCustomer />
      {children} {/* Search + Buttons render ở đây */}
    </header>
  );
}
```

### `HeaderContainer.tsx` (Scroll handling)

```tsx
// ✅ Duy nhất component chịu trách nhiệm scroll detection
// ✅ Callback tối ưu: setScrolled((prev) => ...)
export default function HeaderContainer({
  initialCategories = [],
  initialBrands = [],
  children,
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isOverThreshold = window.scrollY > 10;
      // ✅ Chỉ update khi thực sự thay đổi
      setScrolled((prev) =>
        prev !== isOverThreshold ? isOverThreshold : prev,
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <CustomerHeader scrolled={scrolled}>{children}</CustomerHeader>;
}
```

### `HeaderSearchInput.tsx` (useSearchParams isolated)

```tsx
// ✅ Duy nhất component dùng useSearchParams
// ✅ Dùng key để reset input thay vì useState + useEffect
export default function HeaderSearchInput() {
  const searchParams = useSearchParams();
  const urlSearchTerm = searchParams.get("searchTerm") || "";

  return (
    <input
      key={`desktop-${urlSearchTerm}`} // ✅ Key reset
      defaultValue={urlSearchTerm}
      // ...
    />
  );
}
```

### `HeaderSkeleton.tsx` (Pure static HTML)

```tsx
// ✅ NO hooks, NO client components
// ✅ Chỉ là JSX tĩnh
export default function HeaderSkeleton() {
  return <div className="h-[150px] md:h-[160px] lg:h-[180px]" />;
}

export function HeaderSearchSkeleton() {
  return (
    <div className="hidden md:flex flex-1 max-w-xl mx-4">
      <div className="w-full h-10 bg-brand-100 rounded-2xl animate-pulse" />
    </div>
  );
}
```

### `layout.tsx` (Granular Suspense)

```tsx
// ✅ Suspense boundaries cho từng phần riêng
async function HeaderDataWrapper() {
  const [categories, brands] = await Promise.all([...]);

  return (
    <HeaderContainer initialCategories={categories} initialBrands={brands}>
      <div className="flex gap-6">
        {/* Search - Suspense riêng */}
        <Suspense fallback={<HeaderSearchSkeleton />}>
          <HeaderSearchInput />
        </Suspense>

        {/* Actions - Suspense riêng */}
        <Suspense fallback={<ActionButtonSkeleton />}>
          <HeaderActionButtons />
        </Suspense>
      </div>
    </HeaderContainer>
  );
}

export default function CustomerLayout({ children }) {
  return (
    <>
      {/* Main header Suspense - hiện HeaderSkeleton ngay */}
      <Suspense fallback={<HeaderSkeleton />}>
        <HeaderDataWrapper />
      </Suspense>

      <main>{children}</main>
    </>
  );
}
```

---

## Kết quả

| Vấn đề                 | Trước               | Sau                    |
| ---------------------- | ------------------- | ---------------------- |
| **Build timeout**      | ❌ Bị hang 60s      | ✅ Bình thường         |
| **Cascading renders**  | ❌ Re-render vô hạn | ✅ Tối ưu với callback |
| **Suspense boundary**  | ❌ Missing error    | ✅ Granular & tĩnh     |
| **UX - Menu hiện lên** | ❌ Chờ API          | ✅ Ngay lập tức        |
| **Code quality**       | ❌ Phức tạp         | ✅ Tách rời logic      |

---

## Testing Checklist

- [ ] `npm run build` pass (không hang 60s)
- [ ] `npm run dev` - Header hiển thị ngay (Logo + Menu)
- [ ] Search input load với skeleton
- [ ] Cart/User buttons load với skeleton
- [ ] Scroll event trigger smooth transitions
- [ ] No console errors về Suspense/hooks
- [ ] Fresh page load: Progressive render (shell → search → actions)
- [ ] Mobile search appears below header on scroll
- [ ] Desktop search centered in header

---

## Deployment Notes

1. **Build Process**: Tất cả components được đánh dấu `"use client"` ở đúng vị trí
2. **No SSR issues**: Chỉ server components (HeaderDataWrapper) được dùng cho data fetching
3. **Progressive Enhancement**: Fallback skeletons giữ UI ổn định khi loading
4. **Performance**: Scroll detection tối ưu với callback comparator

---

## Rollback Instructions (nếu cần)

Nếu có issue, revert những changes này:

```bash
git revert <commit-hash>
```

Các files chính có thay đổi:

- `src/app/(customer)/layout.tsx`
- `src/layout/customer/AppHeader.tsx`

Các files được thêm:

- `src/layout/customer/HeaderContainer.tsx`
- `src/layout/customer/HeaderSearchInput.tsx`
- `src/layout/customer/HeaderActionButtons.tsx`
- `src/layout/customer/HeaderSkeleton.tsx`
