import { UserProfileDTO } from "@/src/services/admin/user/models/output.model.dto";
import { loadExportLibs, setupPdfFont, getPdfTableStyles } from "./exportGeneral";

export const exportRewardsToExcel = async (data: UserProfileDTO[]) => {
  const { XLSX } = await loadExportLibs();

  const wsData: any[][] = [
    ["DANH SÁCH ĐIỂM THƯỞNG KHÁCH HÀNG"],
    ["Ngày xuất:", new Date().toLocaleString("vi-VN")],
    [],
    ["#", "Khách hàng", "Email", "Hạng thành viên", "Điểm tích lũy", "Điểm đã đổi", "Điểm hiện tại", "Trạng thái ví"]
  ];

  data.forEach((item, index) => {
    wsData.push([
      index + 1,
      item.full_name || "N/A",
      item.email,
      item.member_rank || "Đồng",
      item.lifetime_points || 0,
      item.used_points || 0,
      item.loyalty_points || 0,
      item.is_point_wallet_locked ? "Đã khóa" : "Hoạt động"
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols'] = [
    { wch: 5 }, { wch: 30 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Rewards");
  XLSX.writeFile(wb, `Danh-sach-Diem-Thuong-${new Date().getTime()}.xlsx`);
};

export const exportRewardsToPDF = async (data: UserProfileDTO[]) => {
  const { jsPDF, autoTable } = await loadExportLibs();
  const doc = new jsPDF();
  await setupPdfFont(doc);

  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  doc.setFontSize(18);
  doc.text("DANH SÁCH ĐIỂM THƯỞNG", PAGE_WIDTH / 2, 20, { align: "center" });

  doc.setFontSize(10);
  doc.text(`Ngày xuất: ${new Date().toLocaleString("vi-VN")}`, 14, 28);

  const tableColumn = ["#", "Khách hàng", "Hạng", "Tích lũy", "Đã đổi", "Hiện tại", "Trạng thái ví"];
  const tableRows = data.map((item, index) => [
      index + 1,
      item.full_name || "N/A",
      item.member_rank || "Đồng",
      item.lifetime_points || 0,
      item.used_points || 0,
      item.loyalty_points || 0,
      item.is_point_wallet_locked ? "Khóa" : "Mở"
  ]);

  autoTable(doc, {
    startY: 35,
    head: [tableColumn],
    body: tableRows,
    ...getPdfTableStyles(doc),
  });

  doc.save(`Danh-sach-Diem-Thuong-${new Date().getTime()}.pdf`);
};
