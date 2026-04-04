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
import { useState, useEffect } from "react";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { uploadFileToCloudinary } from "@/src/services/admin/upload.service";
import { useBrands } from "@/src/services/admin/brand.service";
import { useCategories } from "@/src/services/admin/category.service";
import { useProduct, updateProduct, PRODUCT_API_ENDPOINT } from "@/src/services/admin/product.service";
import { mutate as globalMutate } from "swr";

import { UpdateProductInput, ProductSpecificationInput, UpdateVariantInput } from "@/src/services/models/product/input.dto";

interface EditProductFormValues {
  name: string;
  brandId: string;
  categoryId: string;
  short_description?: string;
  long_description?: string;
  status?: 'ACTIVE' | 'HIDDEN' | 'STOPPED';
  price: number;
  salePrice?: number;
  specifications?: ProductSpecificationInput[];
  variants?: Array<{
    id?: string;
    color?: string;
    size?: string;
    sku?: string;
    price: number;
    salePrice?: number;
    statusName?: 'BEST_SELLING' | 'TRENDING' | 'NEW';
    imageId?: string | null;
    imageFile?: any[];
  }>;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  onUpdated?: () => void;
}

export default function EditProductModal({ isOpen, onClose, productId, onUpdated }: EditProductModalProps) {
  const [form] = SWTForm.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [newFileList, setNewFileList] = useState<any[]>([]);
  const [imageIdsToRemove, setImageIdsToRemove] = useState<string[]>([]);

  const { brands, isLoading: isBrandsLoading } = useBrands();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { product, isLoading: isProductLoading } = useProduct(productId && isOpen ? productId : undefined);
  useEffect(() => {
    if (!product || !isOpen || isInitialized) return;
    const imgs = product.images?.map((url: string, i: number) => ({
      uid: `existing-${i}`,
      name: `image-${i}`,
      url,
      status: 'done',
      imageId: product.productImages?.[i]?.imageId,
    })) || [];
    setExistingImages(imgs);
    setNewFileList([]);
    setImageIdsToRemove([]);

    form.setFieldsValue({
      name: product.name,
      brandId: product.brandId,
      categoryId: product.categoryId,
      price: product.price || 0,
      salePrice: product.salePrice || null,
      short_description: product.short_description,
      long_description: product.long_description,
      specifications: product.specifications || [],
      variants: product.variants?.map((v, index) => ({
        id: v.id,
        color: v.color,
        size: v.size,
        sku: v.sku,
        price: v.price || 0,
        salePrice: v.salePrice || null,
        statusName: v.statusName || 'NEW',
        imageId: v.imageId,
        imageFile: v.image ? [{
          uid: `-v-img-${v.id}`,
          name: 'variant-image',
          status: 'done',
          url: typeof v.image === 'string' ? v.image : (v.image as any)?.url,
          imageId: v.imageId,
        }] : [],
      })) || [],
    });
  }, [product, isOpen]);

  const handleClose = () => {
    form.resetFields();
    setIsInitialized(false);
    setExistingImages([]);
    setNewFileList([]);
    setImageIdsToRemove([]);
    onClose();
  };

  const handleFinish = async (values: EditProductFormValues) => {
    if (!productId) return;
    setIsSubmitting(true);

    try {
      // 1. Upload new product gallery images
      const newImages: string[] = [];
      for (const f of newFileList) {
        const rawFile = f.originFileObj || (f instanceof File ? f : null);
        if (rawFile instanceof File || rawFile instanceof Blob) {
          const url = await uploadFileToCloudinary(rawFile, "products");
          newImages.push(url);
        }
      }

      // 2. Process variants
      const variants: UpdateVariantInput[] = values.variants ? await Promise.all(
        values.variants.map(async (v) => {
          let imageUrl: string | null = null;
          let imageId: string | null = v.imageId || null;

          if (v.imageFile && v.imageFile.length > 0) {
            const fileItem = v.imageFile[0];
            const rawFile = fileItem.originFileObj || fileItem;

            if (rawFile instanceof File || rawFile instanceof Blob) {
              // New image uploaded for variant
              imageUrl = await uploadFileToCloudinary(rawFile, "variants");
              imageId = null; // Backend will create new record
            } else if (fileItem.url) {
              // Existing image kept
              imageUrl = fileItem.url;
              imageId = fileItem.imageId || v.imageId || null;
            }
          } else {
            // Image removed
            imageUrl = null;
            imageId = null;
          }

          return {
            id: v.id,
            color: v.color,
            size: v.size,
            sku: v.sku,
            price: v.price,
            salePrice: v.salePrice || null,
            statusName: v.statusName,
            imageUrl,
            imageId
          };
        })
      ) : [];

      // 3. Construct clean submission data
      const submissionData: UpdateProductInput = {
        name: values.name,
        brandId: values.brandId,
        categoryId: values.categoryId,
        short_description: values.short_description,
        long_description: values.long_description,
        status: values.status,
        price: values.price,
        salePrice: values.salePrice || null,
        newImages,
        imageIdsToRemove,
        specifications: values.specifications || [],
        variants
      };

      console.log(">>> [Update Product] Submission Data:", submissionData);

      // 4. Call API
      await updateProduct(productId, submissionData);
      showNotificationSuccess("Cập nhật sản phẩm thành công!");

      globalMutate(
        (key) => typeof key === "string" && key.startsWith(PRODUCT_API_ENDPOINT),
        undefined,
        { revalidate: true }
      );

      onUpdated?.();
      handleClose();
    } catch (err: any) {
      console.error("Update Product Error:", err);
      // Hiển thị ở http interceptor tồi nên ta không cần hiện 2 lần
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveExisting = (file: any) => {
    if (file.imageId) {
      setImageIdsToRemove((prev) => [...prev, file.imageId]);
    }
    setExistingImages((prev) => prev.filter((f) => f.uid !== file.uid));
  };
  const newUploadProps = {
    onRemove: (file: any) => setNewFileList((prev) => prev.filter((f) => f.uid !== file.uid)),
    beforeUpload: (_file: any) => false, // prevent auto-upload
    onChange: ({ fileList }: any) => {
      setNewFileList(fileList);
    },
    fileList: newFileList,
  };

  return (
    <SWTModal
      title={
         <span className="text-xl font-black text-brand-500">
          Chỉnh Sửa Sản Phẩm
        </span>
      }
      open={isOpen}
      onCancel={handleClose}
      onOk={() => form.submit()}
      okText="Lưu thay đổi"
      cancelText="Hủy"
      width={800}
      okButtonProps={{
        loading: isSubmitting,
        className: "!bg-fuchsia-600 hover:!bg-fuchsia-700 !border-none !shadow-md shadow-fuchsia-500/30 !rounded-xl",
      }}
      cancelButtonProps={{
        className: "dark:!text-slate-300 dark:!bg-slate-800 dark:!border-slate-700 !rounded-xl",
      }}
      className="[&_.ant-modal-header]:!px-6 [&_.ant-modal-header]:!pt-6 [&_.ant-modal-body]:!px-6 [&_.ant-modal-footer]:!px-6 [&_.ant-modal-footer]:!pb-6 sm:[&_.ant-modal-header]:!px-8 sm:[&_.ant-modal-header]:!pt-8 sm:[&_.ant-modal-body]:!px-8 sm:[&_.ant-modal-footer]:!px-8 sm:[&_.ant-modal-footer]:!pb-8 dark:[&_.ant-modal-content]:!bg-slate-900/90 dark:[&_.ant-modal-content]:!border dark:[&_.ant-modal-content]:!border-fuchsia-500/20 dark:[&_.ant-modal-header]:!bg-transparent dark:[&_.ant-modal-title]:!bg-transparent"
    >
      {isProductLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-400">Đang tải dữ liệu sản phẩm...</div>
        </div>
      ) : (
        <SWTForm
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          loading={isSubmitting}
          className="mt-6 [&_.ant-form-item-label>label]:font-semibold [&_.ant-form-item-label>label]:text-slate-700 dark:[&_.ant-form-item-label>label]:!text-slate-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <SWTFormItem name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}>
              <SWTInput placeholder="Vd: Son MAC Matte Lipstick..." className="dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white" />
            </SWTFormItem>

            <SWTFormItem name="brandId" label="Thương hiệu" rules={[{ required: true, message: 'Vui lòng chọn thương hiệu' }]}>
              <SWTSelect
                placeholder="Chọn thương hiệu"
                loading={isBrandsLoading}
                options={brands?.map((b: any) => ({ label: b.name, value: b.id })) || []}
                showSearch
                filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                className="w-full dark:[&_.ant-select-selector]:!bg-slate-800/80 dark:[&_.ant-select-selector]:!border-slate-700 dark:[&_.ant-select-selection-item]:!text-white"
              />
            </SWTFormItem>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <SWTFormItem name="categoryId" label="Danh mục" rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}>
              <SWTSelect
                placeholder="Chọn danh mục"
                loading={isCategoriesLoading}
                options={categories?.map((c: any) => ({ label: c.name, value: c.id })) || []}
                showSearch
                filterOption={(input, option) => (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())}
                className="w-full dark:[&_.ant-select-selector]:!bg-slate-800/80 dark:[&_.ant-select-selector]:!border-slate-700 dark:[&_.ant-select-selection-item]:!text-white"
              />
            </SWTFormItem>
            <SWTFormItem name="status" label="Trạng thái hiển thị">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <SWTFormItem
              name="price"
              label="Giá niêm yết (VNĐ)"
              rules={[{ required: true, message: 'Nhập giá gốc' }]}
            >
              <SWTInputNumber
                min={0}
                max={1000000000}
                placeholder="0"
                style={{ width: "100%" }}
                className="dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-800/80 dark:!border-slate-700"
              />
            </SWTFormItem>

            <SWTFormItem
              name="salePrice"
              label="Giá khuyến mãi"
              dependencies={['price']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const originalPrice = getFieldValue('price');
                    if (!value || !originalPrice || value <= originalPrice) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Giá khuyến mãi không được cao hơn giá gốc'));
                  },
                }),
              ]}
            >
              <SWTInputNumber
                min={0}
                max={1000000000}
                placeholder="0"
                style={{ width: "100%" }}
                className="dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-800/80 dark:!border-slate-700"
              />
            </SWTFormItem>
          </div>

          <SWTFormItem name="short_description" label="Mô tả ngắn gọn">
            <SWTInput placeholder="Mô tả nổi bật..." className="dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white" />
          </SWTFormItem>

          <SWTFormItem name="long_description" label="Chi tiết sản phẩm">
            <SWTInputTextArea rows={4} placeholder="Chi tiết công dụng, cách dùng..." className="dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white" />
          </SWTFormItem>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Ảnh hiện tại</p>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((img) => (
                  <div key={img.uid} className="relative group w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <SWTIconButton
                        onClick={() => handleRemoveExisting(img)}
                        icon={<Trash2 size={14} />}
                        className="text-white bg-red-500/80 rounded-lg p-1 hover:bg-red-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Images */}
          <SWTFormItem name="images" label="Thêm ảnh mới">
            <SWTUpload
              {...newUploadProps}
              type="drag"
              limitFile={8}
              uploadType="image"
              listType="picture"
              multiple
              className="dark:[&_.ant-upload-drag]:!bg-slate-800/50 dark:[&_.ant-upload-drag]:!border-slate-700"
            >
              <div className="py-4">
                <p className="ant-upload-drag-icon flex justify-center text-fuchsia-500 dark:text-fuchsia-400 mb-4">
                  <Inbox size={40} className="stroke-[1.5]" />
                </p>
                <p className="ant-upload-text font-medium">Nhấp hoặc kéo thả hình ảnh mới vào đây</p>
                <p className="ant-upload-hint text-sm text-slate-500 mt-2 px-4">Hỗ trợ JPG, PNG. Ảnh cũ ở trên sẽ được giữ lại.</p>
              </div>
            </SWTUpload>
          </SWTFormItem>

          {/* Specifications */}
          <div className="mb-6 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <SWTForm.List name="specifications">
              {(fields, { add, remove }) => (
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-0">Thông số kỹ thuật</h4>
                    <SWTTooltip title="Thêm thông số" color="#10b981" placement="top">
                      <div onClick={() => add()} className="flex items-center justify-center p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500/30 rounded-lg transition-colors cursor-pointer">
                        <Plus size={18} className="stroke-[2.5]" />
                      </div>
                    </SWTTooltip>
                  </div>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="flex gap-4 items-start">
                      <div className="flex-1">
                        <SWTFormItem {...restField} name={[name, 'label']} className="!mb-0" rules={[{ required: true, message: 'Nhập nhãn' }]}>
                          <SWTInput placeholder="Tên thông số" className="dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white" />
                        </SWTFormItem>
                      </div>
                      <div className="flex-1">
                        <SWTFormItem {...restField} name={[name, 'value']} className="!mb-0" rules={[{ required: true, message: 'Nhập giá trị' }]}>
                          <SWTInput placeholder="Giá trị" className="dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white" />
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

          {/* Variants */}
          <div className="bg-slate-50 dark:bg-slate-900/40 p-4 sm:p-5 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-lg mb-1">Biến Thể Sản Phẩm (Variants)</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Biến thể bị xóa sẽ được ẩn (không xóa khỏi DB).</p>
              </div>
            </div>

            <SWTForm.List name="variants">
              {(fields, { add, remove }) => (
                <div className="flex flex-col gap-4">
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key} className="relative bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="absolute top-4 right-4 flex gap-2">
                        <SWTTooltip title="Xóa biến thể này (ẩn trong DB)" color="#ef4444" placement="top">
                          <SWTIconButton
                            onClick={() => remove(name)}
                            icon={<Trash2 size={18} />}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          />
                        </SWTTooltip>
                      </div>

                      {/* Hidden field for variant id */}
                      <SWTFormItem {...restField} name={[name, 'id']} className="hidden !mb-0">
                        <SWTInput />
                      </SWTFormItem>
                      <SWTFormItem {...restField} name={[name, 'imageId']} className="hidden !mb-0">
                        <SWTInput />
                      </SWTFormItem>

                      <h5 className="font-medium text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b border-slate-100 dark:border-slate-700/50">
                        Biến thể {index + 1}
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-4">
                        <SWTFormItem {...restField} name={[name, 'color']} label="Màu sắc / Tên" className="!mb-4">
                          <SWTInput placeholder="Vd: Đỏ Ruby..." className="dark:!bg-slate-900/50 dark:!border-slate-700 dark:!text-white" />
                        </SWTFormItem>
                        <SWTFormItem {...restField} name={[name, 'size']} label="Kích cỡ" className="!mb-4">
                          <SWTInput placeholder="Vd: 30ml..." className="dark:!bg-slate-900/50 dark:!border-slate-700 dark:!text-white" />
                        </SWTFormItem>
                        
                        <SWTFormItem {...restField} name={[name, 'statusName']} label="Nhãn sự kiện" className="!mb-4" initialValue="NEW">
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                        <SWTFormItem {...restField} name={[name, 'price']} label="Giá bán (VNĐ)" className="!mb-0" rules={[{ required: true, message: 'Nhập giá' }]}>
                          <SWTInputNumber min={0} placeholder="0" style={{ width: "100%" }} className="dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-900/50 dark:!border-slate-700" />
                        </SWTFormItem>
[diff_block_end]
[diff_block_start]
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
                          <SWTInputNumber min={0} placeholder="0" style={{ width: "100%" }} className="dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-900/50 dark:!border-slate-700" />
                        </SWTFormItem>
                      </div>

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
                    className="!h-12 mt-2 !w-full !border-2 !border-dashed !border-fuchsia-300 dark:!border-fuchsia-500/50 !text-fuchsia-600 dark:!text-fuchsia-400 !font-semibold hover:!bg-fuchsia-50 text-base dark:hover:!bg-fuchsia-500/10 !rounded-xl transition-all shadow-sm"
                    startIcon={<Plus size={20} className="stroke-[2.5]" />}
                  >
                    Thêm Biến Thể Mới
                  </SWTButton>
                </div>
              )}
            </SWTForm.List>
          </div>
        </SWTForm>
      )}
    </SWTModal>
  );
}
