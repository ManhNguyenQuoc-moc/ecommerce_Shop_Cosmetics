"use client";

import React, { useEffect } from "react";
import { Form, InputNumber } from "antd";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { useGetSettings, useUpdateSettings } from "@/src/services/admin/user/setting.hook";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";

export default function PointsSettingClient() {
  const [form] = Form.useForm();
  const { settings, isLoading, mutate } = useGetSettings();
  const { trigger: updateSettings, isMutating } = useUpdateSettings();

  useEffect(() => {
    if (settings?.point_percentage !== undefined) {
      form.setFieldsValue({
        point_percentage: settings.point_percentage
      });
    }
  }, [settings, form]);

  const onFinish = async (values: any) => {
    try {
      await updateSettings({ point_percentage: values.point_percentage });
      showNotificationSuccess("Lưu cấu hình điểm thưởng thành công");
      mutate();
    } catch (error: any) {
      showNotificationError(error.message || "Lưu thất bại");
    }
  };

  if (isLoading) return <div>Đang tải cài đặt...</div>;

  return (
    <div className="max-w-2xl bg-white p-6 rounded-2xl shadow-sm border border-gray-100 dark:bg-bg-card dark:border-border-brand">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Cấu Hình Điểm Thưởng</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
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
          <InputNumber 
            className="w-full h-11 !rounded-xl" 
            addonAfter="%" 
            placeholder="Ví dụ: 5"
          />
        </Form.Item>

        <div className="flex justify-end pt-4">
          <SWTButton
            htmlType="submit"
            variant="solid"
            loading={isMutating}
            className="w-32"
          >
            Lưu cài đặt
          </SWTButton>
        </div>
      </Form>
    </div>
  );
}
