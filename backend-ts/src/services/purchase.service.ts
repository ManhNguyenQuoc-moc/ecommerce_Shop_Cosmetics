import { IPurchaseRepository } from "../interfaces/IPurchaseRepository";
import { PurchaseRepository } from "../repositories/purchase.repository";
import { InventoryRepository } from "../repositories/inventory.repository";
import { CreatePODTO, POQueryFiltersDTO } from "../DTO/purchase/input/CreatePODTO";
import { UpdatePODTO } from "../DTO/purchase/input/UpdatePODTO";
import { ReceiveStockDTO } from "../DTO/purchase/input/ReceiveStockDTO";
import { POListItemDTO, POStatus } from "../DTO/purchase/output/POResponseDTO";

import { PagedResult } from "../common/paged-result";
const inventoryRepo = new InventoryRepository();

export class PurchaseService {
  constructor(
    private readonly purchaseRepo: IPurchaseRepository = new PurchaseRepository()
  ) { }

  async getPurchaseOrders(
    page: number = 1,
    limit: number = 10,
    filters?: POQueryFiltersDTO
  ): Promise<PagedResult<POListItemDTO>> {
    const skip = (page - 1) * limit;
    const [orders, total] = await this.purchaseRepo.getPurchaseOrders(skip, limit, filters);
    return { data: orders, total, page, pageSize: limit };
  }

  async getPurchaseOrderItems(id: string, page: number, limit: number): Promise<PagedResult<any>> {
    const skip = (page - 1) * limit;
    const [items, total] = await this.purchaseRepo.getPurchaseOrderItems(id, skip, limit);
    return { data: items, total, page, pageSize: limit };
  }

  async getPurchaseOrderReceipts(id: string, page: number, limit: number): Promise<PagedResult<any>> {
    const skip = (page - 1) * limit;
    const [receipts, total] = await this.purchaseRepo.getPurchaseOrderReceipts(id, skip, limit);
    return { data: receipts, total, page, pageSize: limit };
  }

  async getPurchaseOrderById(id: string) {
    return this.purchaseRepo.getPurchaseOrderById(id);
  }

  async createPurchaseOrder(data: CreatePODTO) {
    if (!data.items || data.items.length === 0) {
      throw new Error("Phiếu nhập phải có ít nhất 1 mặt hàng");
    }
    return this.purchaseRepo.createPurchaseOrder(data);
  }

  async updatePurchaseOrder(id: string, data: UpdatePODTO) {
    const po = await this.purchaseRepo.getPurchaseOrderById(id);
    if (!po) throw new Error("Không tìm thấy phiếu nhập");
    if (po.status !== "DRAFT") throw new Error("Chỉ phiếu ở trạng thái DRAFT mới được chỉnh sửa");
    if (!data.items || data.items.length === 0) {
      throw new Error("Phiếu nhập phải có ít nhất 1 mặt hàng");
    }
    if (data.brandId && data.brandId !== po.brandId) {
      throw new Error("Không được thay đổi thương hiệu của phiếu nhập");
    }
    const safeData = { ...data, brandId: po.brandId };
    return this.purchaseRepo.updatePurchaseOrder(id, safeData);
  }

  async confirmPurchaseOrder(id: string) {
    const po = await this.purchaseRepo.getPurchaseOrderById(id);
    if (!po) throw new Error("Không tìm thấy phiếu nhập");
    if (po.status !== "DRAFT") throw new Error("Chỉ phiếu ở trạng thái DRAFT mới được duyệt");
    return this.purchaseRepo.updatePurchaseOrderStatus(id, "CONFIRMED" as POStatus);
  }

  async cancelPurchaseOrder(id: string) {
    const po = await this.purchaseRepo.getPurchaseOrderById(id);
    if (!po) throw new Error("Không tìm thấy phiếu nhập");
    if (po.status === "COMPLETED") throw new Error("Không thể hủy phiếu đã hoàn tất");
    if (po.status === "CANCELLED") throw new Error("Phiếu này đã bị hủy trước đó");
    return this.purchaseRepo.updatePurchaseOrderStatus(id, "CANCELLED" as POStatus);
  }

  async receiveStock(dto: ReceiveStockDTO) {
    const po = await this.purchaseRepo.getPurchaseOrderById(dto.poId);
    if (!po) throw new Error("Không tìm thấy phiếu nhập");
    if (po.status !== "CONFIRMED" && po.status !== "PARTIALLY_RECEIVED") {
      throw new Error("Phiếu nhập phải ở trạng thái CONFIRMED hoặc PARTIALLY_RECEIVED");
    }

    const results = [];
    for (const item of dto.items) {
      const result = await inventoryRepo.receiveStockWithTransaction(
        dto.poId,
        item.variantId,
        item,
        item.quantity,
        item.note
      );
      results.push(result);
    }
    return results;
  }
}
