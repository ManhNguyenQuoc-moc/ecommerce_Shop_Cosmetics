"use client";

import React, { useEffect, useState } from 'react';
import { Upload } from "antd";
import { Image as ImageIcon, Link as LinkIcon, Mail, Phone, MapPin, Info, Upload as UploadIcon, X } from "lucide-react";
import SWTModal from "@/src/@core/component/AntD/SWTModal";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTInput, { SWTInputTextArea } from "@/src/@core/component/AntD/SWTInput";
import { useCreateBrand, useUpdateBrand } from "@/src/services/admin/brand.service";
import { uploadFileToCloudinary as uploadImage } from "@/src/services/admin/upload.service";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
};

export default function AddBrandModal({ isOpen, onClose, initialData }: Props) {
  const [form] = SWTForm.useForm();
  const { trigger: createBrand, isMutating: creating } = useCreateBrand();
  const { trigger: updateBrand, isMutating: updating } = useUpdateBrand();
  
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [bannerUrl, setBannerUrl] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
      setLogoUrl(initialData.logo?.url || "");
      setBannerUrl(initialData.banner?.url || "");
    } else {
      form.resetFields();
      setLogoUrl("");
      setBannerUrl("");
    }
  }, [initialData, form, isOpen]);

  const handleUpload = async (file: File, type: 'logo' | 'banner') => {
    try {
      const url = await uploadImage(file);
      if (url) {
        if (type === 'logo') setLogoUrl(url);
        else setBannerUrl(url);
        showNotificationSuccess(`Tải lên ${type} thành công!`);
      }
    } catch (e) {
      showNotificationError("Lỗi khi tải ảnh lên");
    }
    return false; // Prevent auto upload
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        logo: logoUrl ? { url: logoUrl } : undefined,
        banner: bannerUrl ? { url: bannerUrl } : undefined
      };

      if (initialData) {
        await updateBrand({ id: initialData.id, data: payload });
        showNotificationSuccess("Cập nhật nhà cung cấp thành công!");
      } else {
        await createBrand(payload);
        showNotificationSuccess("Thêm nhà cung cấp mới thành công!");
      }
      onClose();
    } catch (e: any) {
      showNotificationError(e.message || "Lỗi thao tác");
    }
  };

  return (
    <SWTModal
      title={
        <div className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          {initialData ? "CHỈNH SỬA NHÀ CUNG CẤP" : "THÊM NHÀ CUNG CẤP MỚI"}
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={creating || updating}
      width={700}
      okText={initialData ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy"
      okButtonProps={{
        className: "!bg-emerald-600 !border-none hover:!bg-emerald-700 !rounded-xl !h-10 px-8 font-bold"
      }}
    >
      <SWTForm form={form} layout="vertical" className="pt-4">
        <div className="grid grid-cols-2 gap-4">
          <SWTFormItem name="name" label="Tên nhà cung cấp / Thương hiệu" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
            <SWTInput placeholder="Vd: L'Oréal, Rohto..." prefix={<Info size={16} className="text-slate-400" />} className="!h-10 !rounded-xl" />
          </SWTFormItem>
          
          <SWTFormItem name="email" label="Email liên hệ">
            <SWTInput placeholder="example@brand.com" prefix={<Mail size={16} className="text-slate-400" />} className="!h-10 !rounded-xl" />
          </SWTFormItem>

          <SWTFormItem name="phone" label="Số điện thoại">
            <SWTInput placeholder="0987..." prefix={<Phone size={16} className="text-slate-400" />} className="!h-10 !rounded-xl" />
          </SWTFormItem>

          <SWTFormItem name="address" label="Địa chỉ văn phòng">
            <SWTInput placeholder="Quận 1, TP.HCM..." prefix={<MapPin size={16} className="text-slate-400" />} className="!h-10 !rounded-xl" />
          </SWTFormItem>
        </div>

        <SWTFormItem name="description" label="Giới thiệu thương hiệu / Ghi chú">
          <SWTInputTextArea rows={3} placeholder="Thông tin chi tiết về nhà cung cấp..." className="!rounded-xl" />
        </SWTFormItem>

        <div className="grid grid-cols-2 gap-8 mt-4">
          {/* Logo Upload */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Logo Thương hiệu</label>
            <div className="relative group overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-400 transition-all aspect-video bg-slate-50 flex items-center justify-center">
              {logoUrl ? (
                <>
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                  <button 
                    onClick={() => setLogoUrl("")}
                    className="absolute top-2 right-2 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <Upload 
                  showUploadList={false} 
                  beforeUpload={(file) => handleUpload(file, 'logo')}
                >
                  <div className="flex flex-col items-center gap-2 cursor-pointer text-slate-400 hover:text-emerald-500">
                    <UploadIcon size={24} />
                    <span className="text-xs font-bold">Tải Logo</span>
                  </div>
                </Upload>
              )}
            </div>
          </div>

          {/* Banner Upload */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Ảnh Bìa (Banner)</label>
            <div className="relative group overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-400 transition-all aspect-video bg-slate-50 flex items-center justify-center">
              {bannerUrl ? (
                <>
                  <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setBannerUrl("")}
                    className="absolute top-2 right-2 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <Upload 
                  showUploadList={false} 
                  beforeUpload={(file) => handleUpload(file, 'banner')}
                >
                  <div className="flex flex-col items-center gap-2 cursor-pointer text-slate-400 hover:text-emerald-500">
                    <ImageIcon size={24} />
                    <span className="text-xs font-bold">Tải Banner</span>
                  </div>
                </Upload>
              )}
            </div>
          </div>
        </div>
      </SWTForm>
    </SWTModal>
  );
}
