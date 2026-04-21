"use client";

import { useEffect, useState } from 'react';
import { Image as ImageIcon, Mail, Phone, MapPin, Info, Upload as UploadIcon } from "lucide-react";
import type { UploadFile } from "antd";
import SWTModal from "@/src/@core/component/AntD/SWTModal";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTInput, { SWTInputTextArea } from "@/src/@core/component/AntD/SWTInput";
import SWTUpload from "@/src/@core/component/AntD/SWTUpload";
import { useCreateBrand, useUpdateBrand } from "@/src/services/admin/brand/brand.hook";
import { uploadFileToCloudinary as uploadImage } from "@/src/services/admin/upload.service";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import { BrandResponseDto } from "@/src/services/models/brand/output.dto";
import { CreateBrandDto } from "@/src/services/models/brand/input.dto";
import { mutate as globalMutate } from "swr";
import { BRAND_API_ENDPOINT } from "@/src/services/admin/brand/brand.service";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: BrandResponseDto | null;
};

const phonePattern = /^\d{10}$/;
const brandNamePattern = /^[\p{L}\p{N}][\p{L}\p{N}\s'&.,()\-\/]{1,78}$/u;

export default function AddBrandModal({ isOpen, onClose, initialData }: Props) {
  const [form] = SWTForm.useForm();
  const { trigger: createBrand } = useCreateBrand();
  const { trigger: updateBrand } = useUpdateBrand();

  const [logoFileList, setLogoFileList] = useState<UploadFile[]>([]);
  const [bannerFileList, setBannerFileList] = useState<UploadFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && isOpen) {
      form.setFieldsValue(initialData);
      if (initialData.logo?.url) {
        setLogoFileList([{ uid: '-1', name: 'logo.png', status: 'done', url: initialData.logo.url } as UploadFile]);
      } else {
        setLogoFileList([]);
      }
      if (initialData.banner?.url) {
        setBannerFileList([{ uid: '-1', name: 'banner.png', status: 'done', url: initialData.banner.url } as UploadFile]);
      } else {
        setBannerFileList([]);
      }
    } else {
      form.resetFields();
      setLogoFileList([]);
      setBannerFileList([]);
    }
  }, [initialData, form, isOpen]);

  const handleFinish = async (values: CreateBrandDto) => {
    setIsSubmitting(true);
    try {
      let finalLogoUrl = logoFileList[0]?.url || "";
      let finalBannerUrl = bannerFileList[0]?.url || "";

      // Check if new files need to be uploaded
      if (logoFileList[0] && !logoFileList[0].url) {
        const file = logoFileList[0].originFileObj || logoFileList[0];
        finalLogoUrl = await uploadImage(file as File | Blob);
      }

      if (bannerFileList[0] && !bannerFileList[0].url) {
        const file = bannerFileList[0].originFileObj || bannerFileList[0];
        finalBannerUrl = await uploadImage(file as File | Blob);
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
      globalMutate(
        (key) => typeof key === "string" && key.startsWith(BRAND_API_ENDPOINT),
        undefined,
        { revalidate: true }
      );
      onClose();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Lỗi thao tác";
      showNotificationError(message);
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
      className="[&_.ant-modal-header]:px-6! [&_.ant-modal-header]:pt-6! [&_.ant-modal-body]:px-6! [&_.ant-modal-footer]:px-6! [&_.ant-modal-footer]:pb-6! sm:[&_.ant-modal-header]:px-8! sm:[&_.ant-modal-header]:pt-8! sm:[&_.ant-modal-body]:px-8! sm:[&_.ant-modal-footer]:px-8! sm:[&_.ant-modal-footer]:pb-8! [&_.ant-modal-content]:bg-bg-card/90! [&_.ant-modal-content]:backdrop-blur-xl! [&_.ant-modal-content]:border! [&_.ant-modal-content]:border-border-default! [&_.ant-modal-header]:bg-transparent! [&_.ant-modal-title]:bg-transparent!"
    >
      <SWTForm
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="mt-6 [&_.ant-form-item-label>label]:font-bold [&_.ant-form-item-label>label]:text-text-sub text-xs"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <SWTFormItem
            name="name"
            label="Tên nhà cung cấp / Thương hiệu"
            rules={[
              { required: true, message: "Vui lòng nhập tên" },
              { min: 2, message: "Tên phải có ít nhất 2 ký tự" },
              { max: 80, message: "Tên không được vượt quá 80 ký tự" },
              { pattern: brandNamePattern, message: "Tên thương hiệu không đúng định dạng" },
            ]}
          >
            <SWTInput
              placeholder="Vd: L'Oréal, Rohto..."
              prefix={<Info size={16} className="text-text-muted" />}
              maxLength={80}
              showCount={false}
              className="dark:bg-slate-800/80! dark:border-slate-700! dark:text-white!"
            />
          </SWTFormItem>

          <SWTFormItem
            name="email"
            label="Email liên hệ"
            rules={[
              {
                type: "email",
                message: "Email không đúng định dạng",
              },
              { max: 120, message: "Email không được vượt quá 120 ký tự" },
            ]}
          >
            <SWTInput
              placeholder="example@brand.com"
              prefix={<Mail size={16} className="text-text-muted" />}
              maxLength={120}
              showCount={false}
              className="dark:bg-slate-800/80! dark:border-slate-700! dark:text-white!"
            />
          </SWTFormItem>

          <SWTFormItem
            name="phone"
            label="Số điện thoại"
            rules={[
              { pattern: phonePattern, message: "Số điện thoại phải gồm đúng 10 chữ số" },
            ]}
          >
            <SWTInput
              placeholder="0987654321"
              prefix={<Phone size={16} className="text-text-muted" />}
              maxLength={10}
              showCount
              inputMode="numeric"
              className="dark:bg-slate-800/80! dark:border-slate-700! dark:text-white!"
            />
          </SWTFormItem>

          <SWTFormItem
            name="address"
            label="Địa chỉ văn phòng"
            rules={[{ max: 255, message: "Địa chỉ không được vượt quá 255 ký tự" }]}
          >
            <SWTInput
              placeholder="Quận 1, TP.HCM..."
              prefix={<MapPin size={16} className="text-text-muted" />}
              maxLength={255}
              showCount={false}
              className="dark:bg-slate-800/80! dark:border-slate-700! dark:text-white!"
            />
          </SWTFormItem>
        </div>

        <SWTFormItem
          name="description"
          label="Giới thiệu thương hiệu / Ghi chú"
          rules={[{ max: 500, message: "Mô tả không được vượt quá 500 ký tự" }]}
        >
          <SWTInputTextArea
            rows={3}
            placeholder="Thông tin chi tiết về nhà cung cấp..."
            maxLength={500}
            showCount={false}
            className="dark:bg-slate-800/80! dark:border-slate-700! dark:text-white!"
          />
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
                setLogoFileList([file as UploadFile]);
                return false;
              }}
              onRemove={() => setLogoFileList([])}
              className="[&_.ant-upload-drag]:bg-bg-muted/50! [&_.ant-upload-drag]:border-border-default! [&_.ant-upload-list-item]:border-border-default! [&_.ant-upload-list-item-name]:text-text-sub!"
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
                setBannerFileList([file as UploadFile]);
                return false;
              }}
              onRemove={() => setBannerFileList([])}
              className="[&_.ant-upload-drag]:bg-bg-muted/50! [&_.ant-upload-drag]:border-border-default! [&_.ant-upload-list-item]:border-border-default! [&_.ant-upload-list-item-name]:text-text-sub!"
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
