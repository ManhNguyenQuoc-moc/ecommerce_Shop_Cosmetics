import { PurchaseOrder } from "@prisma/client";
import { CreatePODTO, POQueryFiltersDTO } from "../DTO/purchase/input/CreatePODTO";
import { UpdatePODTO } from "../DTO/purchase/input/UpdatePODTO";
import { PODetailDTO, POListItemDTO, POStatus } from "../DTO/purchase/output/POResponseDTO";

export interface IPurchaseRepository {
  getPurchaseOrders(
    skip: number,
    take: number,
    filters?: POQueryFiltersDTO
  ): Promise<[POListItemDTO[], number]>;

  getPurchaseOrderById(id: string): Promise<PODetailDTO | null>;

  createPurchaseOrder(data: CreatePODTO): Promise<PurchaseOrder>;

  updatePurchaseOrder(id: string, data: UpdatePODTO): Promise<PurchaseOrder>;

  updatePurchaseOrderStatus(id: string, status: POStatus): Promise<PurchaseOrder>;
}
