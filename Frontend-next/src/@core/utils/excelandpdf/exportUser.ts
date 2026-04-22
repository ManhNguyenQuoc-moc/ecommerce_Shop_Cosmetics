import { UserProfileDTO } from "@/src/services/admin/user/models/output.model.dto";
import { loadExportLibs, setupPdfFont, getPdfTableStyles } from "./exportGeneral";

export const exportUsersToExcel = async (data: UserProfileDTO[]) => {
  const { XLSX } = await loadExportLibs();

  const wsData: any[][] = [
    ["DANH SÁCH NGƯỜI DÙNG / KHÁCH HÀNG"],
    ["Ngày xuất:", new Date().toLocaleString("vi-VN")],
    [],
    ["#", "Tên đầy đủ", "Email", "Số điện thoại", "Giới tính", "Ngày sinh", "Điểm tích lũy", "Hạng thành viên", "Ngày tham gia", "Trạng thái"]
  ];

  data.forEach((item, index) => {
    wsData.push([
      index + 1,
      item.full_name || "N/A",
      item.email,
      item.phone || "N/A",
      item.gender || "N/A",
      item.birthday ? new Date(item.birthday).toLocaleDateString("vi-VN") : "N/A",
      item.loyalty_points || 0,
      item.member_rank || "Bronze",
      item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN") : "N/A",
      item.is_banned ? "Bị chặn" : "Hoạt động"
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols'] = [
    { wch: 5 }, { wch: 30 }, { wch: 25 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 12 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Users");
  XLSX.writeFile(wb, `Danh-sach-Nguoi-Dung-${new Date().getTime()}.xlsx`);
};

export const exportUsersToPDF = async (data: UserProfileDTO[]) => {
  const { jsPDF, autoTable } = await loadExportLibs();
  const doc = new jsPDF('landscape');
  await setupPdfFont(doc);

  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  doc.setFontSize(18);
  doc.text("DANH SÁCH NGƯỜI DÙNG", PAGE_WIDTH / 2, 20, { align: "center" });

  doc.setFontSize(10);
  doc.text(`Ngày xuất: ${new Date().toLocaleString("vi-VN")}`, 14, 28);

  const tableColumn = ["#", "Tên đầy đủ", "Email", "Số điện thoại", "Điểm", "Hạng", "Ngày tham gia", "Trạng thái"];
  const tableRows = data.map((item, index) => [
      index + 1,
      item.full_name || "N/A",
      item.email || "N/A",
      item.phone || "N/A",
      item.loyalty_points || 0,
      item.member_rank || "Bronze",
      item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN") : "N/A",
      item.is_banned ? "Chặn" : "OK"
  ]);

  autoTable(doc, {
    startY: 35,
    head: [tableColumn],
    body: tableRows,
    ...getPdfTableStyles(doc),
  });

  doc.save(`Danh-sach-Nguoi-Dung-${new Date().getTime()}.pdf`);
};
