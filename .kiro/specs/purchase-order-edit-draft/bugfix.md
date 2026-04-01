# Bugfix Requirements Document

## Introduction

Hệ thống quản lý phiếu nhập hàng (Purchase Order - PO) hiện tại thiếu chức năng chỉnh sửa (edit) đối với các phiếu đang ở trạng thái DRAFT. Người dùng chỉ có thể tạo mới hoặc xem chi tiết phiếu, nhưng không thể sửa đổi thông tin của phiếu DRAFT đã tạo. Điều này gây bất tiện khi cần điều chỉnh thông tin trước khi duyệt phiếu.

Tính năng edit cần bao gồm:
- API backend: PUT/PATCH endpoint để cập nhật PO
- UI frontend: EditPOModal component cho phép chỉnh sửa
- Chỉ cho phép edit khi status = DRAFT
- Có thể sửa: thương hiệu/nhà cung cấp, ghi chú, danh sách sản phẩm (thêm/xóa/sửa số lượng/giá)

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN người dùng có một phiếu nhập hàng ở trạng thái DRAFT THEN hệ thống không cung cấp nút hoặc chức năng để chỉnh sửa phiếu đó

1.2 WHEN người dùng muốn thay đổi thông tin thương hiệu/nhà cung cấp của phiếu DRAFT THEN hệ thống không cho phép thực hiện thay đổi

1.3 WHEN người dùng muốn thêm/xóa/sửa sản phẩm trong danh sách items của phiếu DRAFT THEN hệ thống không cung cấp giao diện để thực hiện

1.4 WHEN người dùng muốn cập nhật số lượng (orderedQty) hoặc giá nhập (costPrice) của sản phẩm trong phiếu DRAFT THEN hệ thống không cho phép chỉnh sửa

1.5 WHEN người dùng muốn sửa ghi chú (note) của phiếu DRAFT THEN hệ thống không cung cấp chức năng để cập nhật

1.6 WHEN frontend gọi API PUT/PATCH /purchases/:id để cập nhật phiếu DRAFT THEN backend không có endpoint này và trả về lỗi 404

### Expected Behavior (Correct)

2.1 WHEN người dùng xem chi tiết một phiếu nhập hàng ở trạng thái DRAFT THEN hệ thống SHALL hiển thị nút "Chỉnh sửa" hoặc "Edit" cho phép mở modal chỉnh sửa

2.2 WHEN người dùng mở modal chỉnh sửa phiếu DRAFT THEN hệ thống SHALL hiển thị form với dữ liệu hiện tại của phiếu (brandId, note, items) và cho phép thay đổi

2.3 WHEN người dùng thay đổi thương hiệu/nhà cung cấp trong modal edit THEN hệ thống SHALL cho phép chọn thương hiệu mới và cập nhật danh sách sản phẩm tương ứng

2.4 WHEN người dùng thêm/xóa/sửa sản phẩm trong danh sách items THEN hệ thống SHALL cho phép thực hiện các thao tác này và tính toán lại tổng tiền (totalAmount)

2.5 WHEN người dùng cập nhật số lượng hoặc giá nhập của sản phẩm THEN hệ thống SHALL cho phép thay đổi và tự động tính lại thành tiền

2.6 WHEN người dùng submit form chỉnh sửa phiếu DRAFT THEN hệ thống SHALL gọi API PUT/PATCH /purchases/:id với payload chứa brandId, note, items và cập nhật phiếu trong database

2.7 WHEN backend nhận request PUT/PATCH /purchases/:id với status = DRAFT THEN hệ thống SHALL xác thực dữ liệu, cập nhật thông tin phiếu và trả về PODetailDto đã cập nhật

2.8 WHEN việc cập nhật thành công THEN hệ thống SHALL hiển thị thông báo thành công, đóng modal edit, và refresh danh sách/chi tiết phiếu

### Unchanged Behavior (Regression Prevention)

3.1 WHEN người dùng xem chi tiết phiếu nhập hàng ở trạng thái CONFIRMED, PARTIALLY_RECEIVED, COMPLETED, hoặc CANCELLED THEN hệ thống SHALL CONTINUE TO không hiển thị nút "Chỉnh sửa" (chỉ DRAFT mới được edit)

3.2 WHEN người dùng tạo mới phiếu nhập hàng qua CreatePOModal THEN hệ thống SHALL CONTINUE TO hoạt động bình thường với API POST /purchases

3.3 WHEN người dùng duyệt phiếu (confirm) qua nút "Duyệt Phiếu" THEN hệ thống SHALL CONTINUE TO gọi API POST /purchases/:id/confirm và chuyển status sang CONFIRMED

3.4 WHEN người dùng hủy phiếu qua nút "Hủy Phiếu" THEN hệ thống SHALL CONTINUE TO gọi API POST /purchases/:id/cancel và chuyển status sang CANCELLED

3.5 WHEN người dùng nhập kho qua ReceiveStockModal THEN hệ thống SHALL CONTINUE TO hoạt động bình thường với API POST /purchases/receive-stock

3.6 WHEN người dùng xem danh sách phiếu nhập hàng với filters (status, search, brandId, sortBy) THEN hệ thống SHALL CONTINUE TO hoạt động bình thường với API GET /purchases

3.7 WHEN người dùng xuất file PDF hoặc Excel từ PODetailModal THEN hệ thống SHALL CONTINUE TO hoạt động bình thường với các hàm exportPOTopdf và exportPOToExcel

3.8 WHEN backend nhận request cập nhật phiếu có status khác DRAFT (CONFIRMED, COMPLETED, CANCELLED) THEN hệ thống SHALL CONTINUE TO từ chối request và trả về lỗi validation

## Bug Condition Methodology

### Bug Condition Function

```pascal
FUNCTION isBugCondition(X)
  INPUT: X of type PurchaseOrderEditRequest
  OUTPUT: boolean
  
  // Returns true when user attempts to edit a DRAFT PO but the system lacks the functionality
  RETURN X.po.status = "DRAFT" AND X.action = "EDIT"
END FUNCTION
```

### Property Specification - Fix Checking

```pascal
// Property: Fix Checking - Edit DRAFT PO Functionality
FOR ALL X WHERE isBugCondition(X) DO
  result ← editPurchaseOrder'(X)
  ASSERT result.success = true 
    AND result.updatedPO.brandId = X.newBrandId 
    AND result.updatedPO.note = X.newNote
    AND result.updatedPO.items = X.newItems
    AND result.updatedPO.totalAmount = calculateTotal(X.newItems)
    AND result.updatedPO.status = "DRAFT"
END FOR
```

### Property Specification - Preservation Checking

```pascal
// Property: Preservation Checking - Non-DRAFT POs Cannot Be Edited
FOR ALL X WHERE NOT isBugCondition(X) DO
  // X.po.status ∈ {CONFIRMED, PARTIALLY_RECEIVED, COMPLETED, CANCELLED}
  ASSERT editPurchaseOrder(X) = editPurchaseOrder'(X) = ERROR_FORBIDDEN
    AND existingBehavior(X) = existingBehavior'(X)
END FOR
```

**Key Definitions:**
- **editPurchaseOrder**: Hàm gốc (hiện tại không tồn tại - trả về 404)
- **editPurchaseOrder'**: Hàm đã được fix (có endpoint PUT/PATCH /purchases/:id và EditPOModal)
- **isBugCondition(X)**: Điều kiện bug - khi user muốn edit PO có status = DRAFT
- **Preservation Goal**: Các PO không phải DRAFT vẫn không thể edit (giữ nguyên hành vi bảo vệ)
