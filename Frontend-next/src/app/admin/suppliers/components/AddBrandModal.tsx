"use client";

import React, { useEffect, useState } from 'react';
import { Upload } from "antd";
import { Image as ImageIcon, Link as LinkIcon, Mail, Phone, MapPin, Info, Upload as UploadIcon, X } from "lucide-react";
import SWTModal from "@/src/@core/component/AntD/SWTModal";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTInput, { SWTInputTextArea } from "@/src/@core/component/AntD/SWTInput";
import SWTUpload from "@/src/@core/component/AntD/SWTUpload";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { useCreateBrand, useUpdateBrand } from "@/src/hooks/admin/brand.hook";
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

  const [logoFileList, setLogoFileList] = useState<any[]>([]);
  const [bannerFileList, setBannerFileList] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && isOpen) {
      form.setFieldsValue(initialData);
      if (initialData.logo?.url) {
        setLogoFileList([{ uid: '-1', name: 'logo.png', status: 'done', url: initialData.logo.url }]);
      } else {
        setLogoFileList([]);
      }
      if (initialData.banner?.url) {
        setBannerFileList([{ uid: '-1', name: 'banner.png', status: 'done', url: initialData.banner.url }]);
      } else {
        setBannerFileList([]);
      }
    } else {
      form.resetFields();
      setLogoFileList([]);
      setBannerFileList([]);
    }
  }, [initialData, form, isOpen]);

  const handleFinish = async (values: any) => {
    setIsSubmitting(true);
    try {
      let finalLogoUrl = logoFileList[0]?.url || "";
      let finalBannerUrl = bannerFileList[0]?.url || "";

      // Check if new files need to be uploaded
      if (logoFileList[0] && !logoFileList[0].url) {
        const file = logoFileList[0].originFileObj || logoFileList[0];
        finalLogoUrl = await uploadImage(file);
      }

      if (bannerFileList[0] && !bannerFileList[0].url) {
        const file = bannerFileList[0].originFileObj || bannerFileList[0];
        finalBannerUrl = await uploadImage(file);
      }

      const payload = {
        ...values,
        logo: finalLogoUrl ? { url: finalLogoUrl } : undefined,
        banner: finalBannerUrl ? { url: finalBannerUrl } : undefined
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SWTModal
      title={
        <span className="text-xl font-black text-brand-500">
          {initialData ? "CHỈNH SỬA NHÀ CUNG CẤP" : "THÊM NHÀ CUNG CẤP MỚI"}
        </span>
      }
      open={isOpen}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={initialData ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy"
      width={700}
      okButtonProps={{
        loading: isSubmitting,
        className: "!bg-brand-600 hover:!bg-brand-700 !border-none !shadow-md shadow-brand-500/30 !rounded-xl",
      }}
      cancelButtonProps={{
        className: "bg-bg-muted text-text-muted border-border-default !rounded-xl",
      }}
      className="[&_.ant-modal-header]:!px-6 [&_.ant-modal-header]:!pt-6 [&_.ant-modal-body]:!px-6 [&_.ant-modal-footer]:!px-6 [&_.ant-modal-footer]:!pb-6 sm:[&_.ant-modal-header]:!px-8 sm:[&_.ant-modal-header]:!pt-8 sm:[&_.ant-modal-body]:!px-8 sm:[&_.ant-modal-footer]:!px-8 sm:[&_.ant-modal-footer]:!pb-8 [&_.ant-modal-content]:!bg-bg-card/90 [&_.ant-modal-content]:!backdrop-blur-xl [&_.ant-modal-content]:!border [&_.ant-modal-content]:!border-border-default [&_.ant-modal-header]:!bg-transparent [&_.ant-modal-title]:!bg-transparent"
    >
      <SWTForm
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="mt-6 [&_.ant-form-item-label>label]:font-bold [&_.ant-form-item-label>label]:text-text-sub uppercase text-xs tracking-tight"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <SWTFormItem name="name" label="Tên nhà cung cấp / Thương hiệu" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
            <SWTInput placeholder="Vd: L'Oréal, Rohto..." prefix={<Info size={16} className="text-text-muted" />} className="!bg-bg-muted !border-border-default text-text-main" />
          </SWTFormItem>

          <SWTFormItem name="email" label="Email liên hệ">
            <SWTInput placeholder="example@brand.com" prefix={<Mail size={16} className="text-text-muted" />} className="!bg-bg-muted !border-border-default text-text-main" />
          </SWTFormItem>

          <SWTFormItem name="phone" label="Số điện thoại">
            <SWTInput placeholder="0987..." prefix={<Phone size={16} className="text-text-muted" />} className="!bg-bg-muted !border-border-default text-text-main" />
          </SWTFormItem>

          <SWTFormItem name="address" label="Địa chỉ văn phòng">
            <SWTInput placeholder="Quận 1, TP.HCM..." prefix={<MapPin size={16} className="text-text-muted" />} className="!bg-bg-muted !border-border-default text-text-main" />
          </SWTFormItem>
        </div>

        <SWTFormItem name="description" label="Giới thiệu thương hiệu / Ghi chú">
          <SWTInputTextArea rows={3} placeholder="Thông tin chi tiết về nhà cung cấp..." className="!bg-bg-muted !border-border-default text-text-main" />
        </SWTFormItem>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-4">
          {/* Logo Upload */}
          <SWTFormItem label="Logo Thương hiệu">
            <SWTUpload
              type="drag"
              uploadType="image"
              listType="picture"
              limitFile={1}
              fileList={logoFileList}
              beforeUpload={(file) => {
                setLogoFileList([file]);
                return false;
              }}
              onRemove={() => setLogoFileList([])}
              className="[&_.ant-upload-drag]:!bg-bg-muted/50 [&_.ant-upload-drag]:!border-border-default [&_.ant-upload-list-item]:!border-border-default [&_.ant-upload-list-item-name]:!text-text-sub"
            >
              <div className="py-4">
                <p className="ant-upload-drag-icon flex justify-center text-brand-500 mb-2">
                  <UploadIcon size={32} className="stroke-[1.5]" />
                </p>
                <p className="ant-upload-text text-sm font-bold text-text-main">Nhấp hoặc kéo thả Logo</p>
              </div>
            </SWTUpload>
          </SWTFormItem>

          {/* Banner Upload */}
          <SWTFormItem label="Ảnh Bìa (Banner)">
            <SWTUpload
              type="drag"
              uploadType="image"
              listType="picture"
              limitFile={1}
              fileList={bannerFileList}
              beforeUpload={(file) => {
                setBannerFileList([file]);
                return false;
              }}
              onRemove={() => setBannerFileList([])}
              className="[&_.ant-upload-drag]:!bg-bg-muted/50 [&_.ant-upload-drag]:!border-border-default [&_.ant-upload-list-item]:!border-border-default [&_.ant-upload-list-item-name]:!text-text-sub"
            >
              <div className="py-4">
                <p className="ant-upload-drag-icon flex justify-center text-brand-500 mb-2">
                  <ImageIcon size={32} className="stroke-[1.5]" />
                </p>
                <p className="ant-upload-text text-sm font-bold text-text-main">Nhấp hoặc kéo thả Banner</p>
              </div>
            </SWTUpload>
          </SWTFormItem>
        </div>
      </SWTForm>
    </SWTModal>
  );
}
