"use client";

import { Switch } from "antd";
import SWTInput, { SWTInputTextArea } from "@/src/@core/component/AntD/SWTInput";
import SWTInputNumber from "@/src/@core/component/AntD/SWTInputNumber";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTModal from "@/src/@core/component/AntD/SWTModal";
import SWTUpload from "@/src/@core/component/AntD/SWTUpload";
import { Plus, Inbox, Trash2 } from "lucide-react";
import { useState } from "react";
import { Form, Tooltip } from "antd";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { uploadFileToCloudinary, deleteUploads } from "@/src/services/admin/upload.service";
import { useBrands } from "@/src/services/admin/brand.service";
import { useCategories } from "@/src/services/admin/category.service";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}

export default function AddProductModal({ isOpen, onClose, onAdd }: AddProductModalProps) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { brands, isLoading: isBrandsLoading } = useBrands();
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  const handleFinish = async (values: any) => {
    setIsSubmitting(true);
    let uploadedUrls: string[] = [];

    try {
      // Safely upload files straight to Cloudinary bypass backend
      const parsedImages = await Promise.all(
        fileList.map(async (f) => {
          if (f.url) return f.url;
          if (f.thumbUrl && f.thumbUrl.startsWith("http")) return f.thumbUrl; // old existing images
          
          if (f.originFileObj) {
            const url = await uploadFileToCloudinary(f.originFileObj, "products");
            uploadedUrls.push(url);
            return url;
          }
          if (f instanceof File || f instanceof Blob) {
            const url = await uploadFileToCloudinary(f, "products");
            uploadedUrls.push(url);
            return url;
          }
          return null;
        })
      );

      const submissionData = {
        ...values,
        images: parsedImages.filter(Boolean),
      };
      
      // Ensure nested objects don't trigger crashes
      if (!submissionData.variants) submissionData.variants = [];
      if (!submissionData.specifications) submissionData.specifications = [];

      // Process variant-specific images
      if (submissionData.variants.length > 0) {
        for (let i = 0; i < submissionData.variants.length; i++) {
          const variant = submissionData.variants[i];
          if (variant.imageFile && variant.imageFile.length > 0) {
            const fileItem = variant.imageFile[0];
            const rawFile = fileItem.originFileObj || fileItem;
            
            if (rawFile instanceof File || rawFile instanceof Blob) {
              const url = await uploadFileToCloudinary(rawFile, "variants");
              uploadedUrls.push(url);
              variant.imageUrl = url;
            } else if (fileItem.url) {
              variant.imageUrl = fileItem.url;
            } else if (fileItem.thumbUrl && fileItem.thumbUrl.startsWith("http")) {
              variant.imageUrl = fileItem.thumbUrl;
            }
            // Cleanup the heavy binary object from the payload
            delete variant.imageFile;
          }
        }
      }

      await onAdd(submissionData);
      form.resetFields();
      setFileList([]);
      onClose();
      showNotificationSuccess("Đã hoàn tất tải ảnh và thêm sản phẩm thành công!");
    } catch (err: any) {
      console.error(err);
      showNotificationError(err.message || 'Lỗi khi tải ảnh lên hệ thống');
      
      // Rollback orphaned images
      if (uploadedUrls.length > 0) {
         try {
           await deleteUploads(uploadedUrls);
           console.log("Rolled back orphaned images from Cloudinary: ", uploadedUrls);
         } catch (rollbackErr) {
           console.error("Failed to rollback images", rollbackErr);
         }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadProps = {
    onRemove: (file: any) => {
      setFileList((prev) => {
        const index = prev.indexOf(file);
        const newFileList = prev.slice();
        newFileList.splice(index, 1);
        return newFileList;
      });
    },
    beforeUpload: (file: any) => {
      setFileList((prev) => [...prev, file]);
      return false;
    },
    fileList,
  };

  return (
    <SWTModal
      title={
        <span className="text-xl font-black bg-gradient-to-r from-brand-600 to-rose-500 bg-clip-text text-transparent dark:from-brand-400 dark:to-cyan-400 inline-block drop-shadow-sm pb-1">
          Thêm Sản Phẩm Mới
        </span>
      }
      open={isOpen}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Lưu sản phẩm"
      cancelText="Hủy"
      width={800}
      okButtonProps={{
        loading: isSubmitting,
        className: "!bg-brand-600 hover:!bg-brand-700 !border-none !shadow-md shadow-brand-500/30 !rounded-xl",
      }}
      cancelButtonProps={{
        className: "dark:!text-slate-300 dark:!bg-slate-800 dark:!border-slate-700 !rounded-xl",
      }}
      className="[&_.ant-modal-header]:!px-6 [&_.ant-modal-header]:!pt-6 [&_.ant-modal-body]:!px-6 [&_.ant-modal-footer]:!px-6 [&_.ant-modal-footer]:!pb-6 sm:[&_.ant-modal-header]:!px-8 sm:[&_.ant-modal-header]:!pt-8 sm:[&_.ant-modal-body]:!px-8 sm:[&_.ant-modal-footer]:!px-8 sm:[&_.ant-modal-footer]:!pb-8 dark:[&_.ant-modal-content]:!bg-slate-900/90 dark:[&_.ant-modal-content]:!border dark:[&_.ant-modal-content]:!border-brand-500/20 dark:[&_.ant-modal-header]:!bg-transparent dark:[&_.ant-modal-title]:!bg-transparent"
    >
      <SWTForm
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="mt-6 [&_.ant-form-item-label>label]:font-semibold [&_.ant-form-item-label>label]:text-slate-700 dark:[&_.ant-form-item-label>label]:!text-slate-300"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <SWTFormItem
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <SWTInput placeholder="Vd: Son MAC Matte Lipstick..." className="dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white" />
          </SWTFormItem>

          <SWTFormItem
            name="brandId"
            label="Thương hiệu"
            rules={[{ required: true, message: 'Vui lòng chọn hoặc nhập thương hiệu' }]}
          >
            <SWTSelect
              placeholder="Chọn thương hiệu"
              loading={isBrandsLoading}
              options={brands?.map((b: any) => ({ label: b.name, value: b.id })) || []}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
              }
              className="w-full dark:[&_.ant-select-selector]:!bg-slate-800/80 dark:[&_.ant-select-selector]:!border-slate-700 dark:[&_.ant-select-selection-item]:!text-white"
            />
          </SWTFormItem>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <SWTFormItem
            name="categoryId"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <SWTSelect
              placeholder="Chọn danh mục"
              loading={isCategoriesLoading}
              options={categories?.map((c: any) => ({ label: c.name, value: c.id })) || []}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
              }
              className="w-full dark:[&_.ant-select-selector]:!bg-slate-800/80 dark:[&_.ant-select-selector]:!border-slate-700 dark:[&_.ant-select-selection-item]:!text-white"
            />
          </SWTFormItem>
          <SWTFormItem
            name="status"
            label="Trạng thái hiển thị"
            initialValue="ACTIVE"
          >
            <SWTSelect
              placeholder="Chọn trạng thái"
              options={[
                { label: "Đang bán (ACTIVE)", value: "ACTIVE" },
                { label: "Đã ẩn (HIDDEN)", value: "HIDDEN" },
                { label: "Ngừng bán (STOPPED)", value: "STOPPED" },
              ]}
              className="w-full dark:[&_.ant-select-selector]:!bg-slate-800/80 dark:[&_.ant-select-selector]:!border-slate-700 dark:[&_.ant-select-selection-item]:!text-white"
            />
          </SWTFormItem>
        </div>
        <SWTFormItem
          name="short_description"
          label="Mô tả ngắn gọn"
        >
          <SWTInput placeholder="Mô tả nổi bật dùng để hiển thị trên danh sách sản phẩm..." className="dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white" />
        </SWTFormItem>

        <SWTFormItem
          name="long_description"
          label="Chi tiết sản phẩm"
        >
          <SWTInputTextArea rows={4} placeholder="Viết giới thiệu công dụng, cách dùng, thành phần chi tiết của mỹ phẩm..." className="dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white" />
        </SWTFormItem>

        <div className="mb-6 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <Form.List name="specifications">
            {(fields, { add, remove }) => (
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-0">Thông số kỹ thuật (Specifications)</h4>
                  <Tooltip title="Thêm thông số mới" color="#10b981" placement="top">
                    <div
                      onClick={() => add()}
                      className="flex items-center justify-center p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30 rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus size={18} className="stroke-[2.5]" />
                    </div>
                  </Tooltip>
                </div>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="flex gap-4 items-start">
                    <div className="flex-1">
                      <SWTFormItem
                        {...restField}
                        name={[name, 'label']}
                        className="!mb-0"
                        rules={[{ required: true, message: 'Nhập nhãn (Vd: Thương hiệu)' }]}
                      >
                        <SWTInput placeholder="Tên thông số (Vd: Loại da)" className="dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white" />
                      </SWTFormItem>
                    </div>
                    <div className="flex-1">
                      <SWTFormItem
                        {...restField}
                        name={[name, 'value']}
                        className="!mb-0"
                        rules={[{ required: true, message: 'Nhập giá trị' }]}
                      >
                        <SWTInput placeholder="Giá trị (Vd: Mọi loại da)" className="dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white" />
                      </SWTFormItem>
                    </div>
                    <Tooltip title="Xóa" color="#ef4444" placement="top">
                      <button
                        type="button"
                        onClick={() => remove(name)}
                        className="h-11 px-3 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors shrink-0"
                      >
                        <Trash2 size={20} />
                      </button>
                    </Tooltip>
                  </div>
                ))}
              </div>
            )}
          </Form.List>
        </div>

        <div className="flex flex-col gap-6">
          <SWTFormItem
            name="images"
            label="Hình ảnh sản phẩm (Tối đa 8 ảnh)"
          >
            <SWTUpload
              {...uploadProps}
              type="drag"
              limitFile={8}
              uploadType="image"
              listType="picture"
              multiple
              className="dark:[&_.ant-upload-drag]:!bg-slate-800/50 dark:[&_.ant-upload-drag]:!border-slate-700 hover:dark:[&_.ant-upload-drag]:!border-brand-500/60 dark:[&_.ant-upload-text]:!text-slate-300 dark:[&_.ant-upload-hint]:!text-slate-500"
            >
              <div className="py-4">
                <p className="ant-upload-drag-icon flex justify-center text-brand-500 dark:text-brand-400 mb-4">
                  <Inbox size={40} className="stroke-[1.5]" />
                </p>
                <p className="ant-upload-text font-medium">Nhấp hoặc kéo thả hình ảnh vào đây</p>
                <p className="ant-upload-hint text-sm text-slate-500 mt-2 px-4">
                  Hỗ trợ định dạng JPG, PNG. Có thể tải lên hình ảnh đại diện và các ảnh sản phẩm khác.
                </p>
              </div>
            </SWTUpload>
          </SWTFormItem>

          <div className="bg-slate-50 dark:bg-slate-900/40 p-4 sm:p-5 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-lg mb-1">Các Biến Thể & Tồn Kho (Variants)</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Quản lý kích cỡ (Size), màu sắc (Shade) và số lượng tồn kho.</p>
              </div>
            </div>

            <Form.List name="variants">
              {(fields, { add, remove }) => (
                <div className="flex flex-col gap-4">
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key} className="relative bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="absolute top-4 right-4">
                        <Tooltip title="Xóa biến thể này" color="#ef4444" placement="top">
                          <button
                            type="button"
                            onClick={() => remove(name)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </Tooltip>
                      </div>
                      
                      <h5 className="font-medium text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b border-slate-100 dark:border-slate-700/50">Biến thể {index + 1}</h5>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
                        <SWTFormItem
                          {...restField}
                          name={[name, 'color']}
                          label="Màu sắc / Tên"
                          className="!mb-4"
                        >
                          <SWTInput placeholder="Vd: Đỏ Ruby..." className="dark:!bg-slate-900/50 dark:!border-slate-700 dark:!text-white" />
                        </SWTFormItem>

                        <SWTFormItem
                          {...restField}
                          name={[name, 'size']}
                          label="Kích cỡ"
                          className="!mb-4"
                        >
                          <SWTInput placeholder="Vd: 30ml..." className="dark:!bg-slate-900/50 dark:!border-slate-700 dark:!text-white" />
                        </SWTFormItem>

                        <SWTFormItem
                          {...restField}
                          name={[name, 'statusName']}
                          label="Nhãn sự kiện"
                          className="!mb-4"
                          initialValue="NEW"
                        >
                          <SWTSelect
                            options={[
                              { label: "Mới ra mắt (NEW)", value: "NEW" },
                              { label: "Bán chạy (BEST)", value: "BEST_SELLING" },
                              { label: "Xu hướng (HOTS)", value: "TRENDING" },
                            ]}
                            className="w-full dark:[&_.ant-select-selector]:!bg-slate-900/50 dark:[&_.ant-select-selector]:!border-slate-700"
                          />
                        </SWTFormItem>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
                        <SWTFormItem
                          {...restField}
                          name={[name, 'price']}
                          label="Giá bán (VNĐ)"
                          className="!mb-0"
                          rules={[{ required: true, message: 'Nhập giá' }]}
                        >
                          <SWTInputNumber min={0} max={1000000000} placeholder="0" style={{ width: "100%" }} className="dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-900/50 dark:!border-slate-700" />
                        </SWTFormItem>

                        <SWTFormItem
                          {...restField}
                          name={[name, 'salePrice']}
                          label="Giá khuyến mãi"
                          className="!mb-0"
                        >
                          <SWTInputNumber min={0} max={1000000000} placeholder="0" style={{ width: "100%" }} className="dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-900/50 dark:!border-slate-700" />
                        </SWTFormItem>

                        <SWTFormItem
                          {...restField}
                          name={[name, 'stock_quantity']}
                          label="Kho (Số lượng)"
                          className="!mb-0"
                          rules={[{ required: true, message: 'Nhập SL tồn kho' }]}
                        >
                          <SWTInputNumber min={0} max={1000000} placeholder="0" style={{ width: "100%" }} className="dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-900/50 dark:!border-slate-700" />
                        </SWTFormItem>
                      </div>
                      
                      {/* Variant specific Image Upload */}
                      <SWTFormItem
                        {...restField}
                        name={[name, 'imageFile']}
                        label="Ảnh minh họa riêng cho biến thể"
                        className="!mb-0 mt-4"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                          if (Array.isArray(e)) return e;
                          return e?.fileList;
                        }}
                      >
                        <SWTUpload
                          type="drag"
                          limitFile={1}
                          uploadType="image"
                          listType="picture-card"
                          beforeUpload={() => false}
                          className="dark:[&_.ant-upload-drag]:!bg-slate-900/50 dark:[&_.ant-upload-drag]:!border-slate-700"
                        >
                          <div className="flex flex-col items-center justify-center p-2">
                            <Plus size={20} className="text-slate-400 mb-1" />
                            <span className="text-xs text-slate-500">Tải ảnh lên</span>
                          </div>
                        </SWTUpload>
                      </SWTFormItem>

                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => add()}
                    className="flex justify-center items-center gap-2 h-12 mt-2 w-full border-2 border-dashed border-brand-300 dark:border-brand-500/50 text-brand-600 dark:text-brand-400 font-semibold hover:bg-brand-50 text-base dark:hover:bg-brand-500/10 rounded-xl transition-all shadow-sm"
                  >
                    <Plus size={20} className="stroke-[2.5]" /> Thêm Phiên Bản Sản Phẩm Mới (Variant)
                  </button>
                </div>
              )}
            </Form.List>
          </div>
        </div>
      </SWTForm>
    </SWTModal>
  );
}
