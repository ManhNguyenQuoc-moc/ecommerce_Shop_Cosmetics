"use client";

import { useEffect, useState, type MouseEvent } from "react";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTInputNumber from "@/src/@core/component/AntD/SWTInputNumber";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { useGetSettings, useUpdateSettings } from "@/src/services/admin/user/setting.hook";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";

type PointsSettingFormValues = {
  point_percentage: number;
};

export default function PointsSettingClient() {
  useSWTTitle("Cấu Hình Điểm Thưởng | Admin");
  const [form] = SWTForm.useForm<PointsSettingFormValues>();
  const [isEditing, setIsEditing] = useState(false);
  const { settings, isLoading, mutate } = useGetSettings();
  const { trigger: updateSettings, isMutating } = useUpdateSettings();

  useEffect(() => {
    if (settings?.point_percentage !== undefined) {
      form.setFieldsValue({
        point_percentage: settings.point_percentage
      });
    }
  }, [settings, form]);

  const onFinish = async (values: PointsSettingFormValues) => {
    if (!isEditing) return;

    try {
      await updateSettings({ point_percentage: values.point_percentage });
      showNotificationSuccess("Lưu cấu hình điểm thưởng thành công");
      setIsEditing(false);
      mutate();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Lưu thất bại";
      showNotificationError(errorMessage);
    }
  };

  const handleEnableEdit = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsEditing(true);
  };

  const handleCancelEdit = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (settings?.point_percentage !== undefined) {
      form.setFieldsValue({ point_percentage: settings.point_percentage });
    } else {
      form.resetFields(["point_percentage"]);
    }

    setIsEditing(false);
  };

  if (isLoading) return <div>Đang tải cài đặt...</div>;

  return (
    <div className="max-w-2xl bg-white p-6 rounded-2xl shadow-sm border border-gray-100 dark:bg-bg-card dark:border-border-brand">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Cấu Hình Điểm Thưởng</h2>
      <SWTForm
        form={form}
        layout="vertical"
        loading={isLoading}
        onFinish={onFinish}
      >
        <SWTFormItem
          name="point_percentage"
          label={
            <div className="text-gray-700 font-medium dark:text-gray-300">
              Tỉ lệ tích điểm theo % hóa đơn <br/>
              <span className="text-xs text-gray-400 font-normal">
                (VD: Điền 5, khi khách mua 1.000.000đ sẽ nhận được 50.000 điểm)
              </span>
            </div>
          }
          rules={[
            { required: true, message: "Vui lòng nhập tỷ lệ %" },
            { type: 'number', min: 0, max: 100, message: "Phải từ 0 đến 100%" }
          ]}
        >
          <SWTInputNumber
            className="!w-full rounded-xl"
            addonAfter="%" 
            placeholder="Ví dụ: 5"
            disabled={!isEditing}
            min={0}
            max={100}
            style={{ width: "100%" }}
          />
        </SWTFormItem>

        <div className="flex justify-end pt-4">
          {!isEditing ? (
            <SWTButton
              type="default"
              size="sm"
              htmlType="button"
              onClick={handleEnableEdit}
              className="!w-auto !h-10 !px-6"
            >
              Chỉnh sửa
            </SWTButton>
          ) : (
            <div className="flex items-center gap-3">
              <SWTButton
                type="default"
                size="sm"
                htmlType="button"
                onClick={handleCancelEdit}
                className="!w-auto !h-10 !px-6"
              >
                Hủy
              </SWTButton>
              <SWTButton
                htmlType="submit"
                variant="solid"
                size="sm"
                loading={isMutating}
                className="!w-auto !h-10 !px-6"
              >
                Lưu cài đặt
              </SWTButton>
            </div>
          )}
        </div>
      </SWTForm>
    </div>
  );
}
