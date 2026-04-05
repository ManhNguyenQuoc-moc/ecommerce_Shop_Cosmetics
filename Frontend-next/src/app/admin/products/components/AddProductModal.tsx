"use client";

import SWTInput, { SWTInputTextArea } from "@/src/@core/component/AntD/SWTInput";
import SWTInputNumber from "@/src/@core/component/AntD/SWTInputNumber";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTModal from "@/src/@core/component/AntD/SWTModal";
import SWTUpload from "@/src/@core/component/AntD/SWTUpload";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import { Plus, Inbox, Trash2 } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTIconButton from "@/src/@core/component/SWTIconButton";
import { useState } from "react";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { uploadFileToCloudinary, deleteUploads } from "@/src/services/admin/upload.service";
import { useBrands } from "@/src/services/admin/brand.service";
import { useCategories } from "@/src/services/admin/category.service";

import { CreateProductInput, ProductSpecificationInput ,CreateVariantInput } from "@/src/services/models/product/input.dto";

interface AddProductFormValues {
  name: string;
  brandId: string;
  categoryId: string;
  short_description?: string;
  long_description?: string;
  status?: 'ACTIVE' | 'HIDDEN' | 'STOPPED';
  specifications?: ProductSpecificationInput[];
  variants?: Array<{
    color?: string;
    size?: string;
    sku?: string;
    costPrice?: number;
    price: number;
    salePrice?: number;
    statusName?: 'BEST_SELLING' | 'TRENDING' | 'NEW';
    imageFile?: any[]; // AntD Upload file list
  }>;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: CreateProductInput) => void;
}

export default function AddProductModal({ isOpen, onClose, onAdd }: AddProductModalProps) {
  const [form] = SWTForm.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { brands, isLoading: isBrandsLoading } = useBrands();
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  const handleFinish = async (values: AddProductFormValues) => {
    setIsSubmitting(true);
    let uploadedUrls: string[] = [];

    try {
      // 1. Upload gallery images
      const images = await Promise.all(
        fileList.map(async (file) => {
          const rawFile = file.originFileObj || file;
          if (rawFile instanceof File || rawFile instanceof Blob) {
            const url = await uploadFileToCloudinary(rawFile, "products");
            uploadedUrls.push(url);
            return url;
          }
          return null;
        })
      );

      // 2. Process variants and their images
      const variants = values.variants ? await Promise.all(
        values.variants.map(async (v) => {
          let imageUrl: string | undefined = undefined;

          if (v.imageFile && v.imageFile.length > 0) {
            const fileItem = v.imageFile[0];
            const rawFile = fileItem.originFileObj || fileItem;

            if (rawFile instanceof File || rawFile instanceof Blob) {
              imageUrl = await uploadFileToCloudinary(rawFile, "variants");
              uploadedUrls.push(imageUrl);
            }
          }

          return {
            color: v.color,
            size: v.size,
            sku: v.sku,
            costPrice: v.costPrice || null, 
            price: v.price,
            salePrice: v.salePrice || null,
            statusName: v.statusName,
            imageUrl: imageUrl || null
          };
        })
      ) : [];

      // 3. Construct clean submission data
      const submissionData: CreateProductInput = {
        name: values.name,
        brandId: values.brandId,
        categoryId: values.categoryId,
        short_description: values.short_description,
        long_description: values.long_description,
        status: values.status || "HIDDEN",
        images: images.filter((url): url is string => url !== null),
        specifications: values.specifications || [],
        variants: variants as CreateVariantInput[]
      };

      console.log(">>> [Create Product] Submission Data:", submissionData);

      await onAdd(submissionData);
      form.resetFields();
      setFileList([]);
      onClose();
      showNotificationSuccess("Thêm sản phẩm thành công!");
    } catch (err: any) {
      console.error("Add Product Error:", err);

      if (uploadedUrls.length > 0) {
        try {
          await deleteUploads(uploadedUrls);
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
        <span className="text-xl font-black text-brand-500">
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
        loading={isSubmitting}
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
            className="md:col-span-1"
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
            initialValue="HIDDEN"
            className="md:col-span-1"
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
          <SWTForm.List name="specifications">
            {(fields, { add, remove }) => (
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-0">Thông số kỹ thuật (Specifications)</h4>
                  <SWTTooltip title="Thêm thông số mới" color="#10b981" placement="top">
                    <div
                      onClick={() => add()}
                      className="flex items-center justify-center p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30 rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus size={18} className="stroke-[2.5]" />
                    </div>
                  </SWTTooltip>
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
                    <SWTTooltip title="Xóa" color="#ef4444" placement="top">
                      <SWTIconButton
                        onClick={() => remove(name)}
                        icon={<Trash2 size={20} />}
                        className="h-11 px-3 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors shrink-0"
                      />
                    </SWTTooltip>
                  </div>
                ))}
              </div>
            )}
          </SWTForm.List>
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
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-lg mb-1">Các Phiên Bản Sản Phẩm (Variants)</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Quản lý kích cỡ (Size), màu sắc (Shade) tạo thành các phiên bản.</p>
              </div>
            </div>

            <SWTForm.List name="variants">
              {(fields, { add, remove }) => (
                <div className="flex flex-col gap-4">
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key} className="relative bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="absolute top-4 right-4">
                        <SWTTooltip title="Xóa biến thể này" color="#ef4444" placement="top">
                          <SWTIconButton
                            onClick={() => remove(name)}
                            icon={<Trash2 size={18} />}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          />
                        </SWTTooltip>
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
                              { label: "Giảm giá (SALE)", value: "SALE" },
                            ]}
                            className="w-full dark:[&_.ant-select-selector]:!bg-slate-900/50 dark:[&_.ant-select-selector]:!border-slate-700"
                          />
                        </SWTFormItem>
                      </div>

                      {/* Đã sửa thành sm:grid-cols-3 để chứa đủ 3 cột giá */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
                        <SWTFormItem
                          {...restField}
                          name={[name, 'costPrice']}
                          label="Giá nhập (VNĐ)"
                          className="!mb-0"
                          rules={[{ required: true, message: 'Nhập giá nhập' }]}
                        >
                          <SWTInputNumber min={0} max={1000000000} placeholder="0" style={{ width: "100%" }} className="dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-900/50 dark:!border-slate-700" />
                        </SWTFormItem>

                        <SWTFormItem
                          {...restField}
                          name={[name, 'price']}
                          label="Giá bán (VNĐ)"
                          className="!mb-0"
                          rules={[{ required: true, message: 'Nhập giá bán' }]}
                        >
                          <SWTInputNumber min={0} max={1000000000} placeholder="0" style={{ width: "100%" }} className="dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-900/50 dark:!border-slate-700" />
                        </SWTFormItem>
                        
                        <SWTFormItem
                          {...restField}
                          name={[name, 'salePrice']}
                          label="Giá khuyến mãi"
                          className="!mb-0"
                          dependencies={[['variants', index, 'price']]}
                          rules={[
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                const originalPrice = getFieldValue(['variants', index, 'price']);
                                if (!value || !originalPrice || value <= originalPrice) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error('Giá khuyến mãi không được cao hơn giá gốc'));
                              },
                            }),
                          ]}
                        >
                          <SWTInputNumber min={0} max={1000000000} placeholder="0" style={{ width: "100%" }} className="dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-900/50 dark:!border-slate-700" />
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

                  <SWTButton
                    onClick={() => add()}
                    className="!h-12 mt-2 !w-full !border-2 !border-dashed !border-brand-300 dark:!border-brand-500/50 !text-brand-600 dark:!text-brand-400 !font-semibold hover:!bg-brand-50 text-base dark:hover:!bg-brand-500/10 !rounded-xl transition-all shadow-sm"
                    startIcon={<Plus size={20} className="stroke-[2.5]" />}
                  >
                    Thêm Phiên Bản Sản Phẩm Mới (Variant)
                  </SWTButton>
                </div>
              )}
            </SWTForm.List>
          </div>
        </div>
      </SWTForm>
    </SWTModal>
  );
}