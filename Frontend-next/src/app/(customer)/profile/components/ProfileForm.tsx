"use client";

import { useState, useEffect } from "react";
import { Form, Divider, Tag } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";

import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import { SWTInput } from "@/src/@core/component/AntD/SWTInput";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTDatePicker from "@/src/@core/component/AntD/SWTDatePicker";
import dayjs from "dayjs";

import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import { updateCustomerInfo } from "@/src/services/customer/user.service";
import AddressAutocomplete from "../../checkout/components/AddressAutocomplete";
import { UserProfileDTO } from "@/src/services/models/user/output.dto";
import { Address } from "@/src/@core/type/checkout";

type Props = {
  initialData: UserProfileDTO;
};

export default function ProfileForm({ initialData }: Props) {
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addresses, setAddresses] = useState(initialData.addresses || []);
  const [showAddAddress, setShowAddAddress] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      full_name: initialData.full_name,
      phone: initialData.phone,
      gender: initialData.gender,
      birthday: initialData.birthday ? dayjs(initialData.birthday) : undefined,
    });
    setAddresses(initialData.addresses || []);
  }, [initialData, form]);

  const onFinish = async (values: any) => {
    try {
      setIsSubmitting(true);

      await updateCustomerInfo({
        full_name: values.full_name,
        phone: values.phone,
        gender: values.gender,
        birthday: values.birthday ? values.birthday.toISOString() : null,
        addresses,
      });

      showNotificationSuccess("Cập nhật thành công");
      setIsEdit(false);
    } catch (err: any) {
      showNotificationError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAddress = (addr: any) => {
    const isFirst = addresses.length === 0;
    setAddresses([...addresses, { ...addr, isDefault: isFirst }]);
    setShowAddAddress(false);
  };

  const handleSetDefaultAddress = (index: number) => {
    const newAddresses = addresses.map((addr: any, i: number) => ({
      ...addr,
      isDefault: i === index,
    }));
    setAddresses(newAddresses);
  };
  return (
    <SWTCard className="!p-6 !md:!p-8 !rounded-2xl !shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Thông tin cá nhân
        </h2>
        {!isEdit ? (
          <SWTButton
            type="text"
            startIcon={<EditOutlined />}
            onClick={() => setIsEdit(true)}
          >
            Chỉnh sửa
          </SWTButton>
        ) : (
          <div className="flex gap-2">
            <SWTButton
              startIcon={<CloseOutlined />}
              onClick={() => setIsEdit(false)}
            >
              Huỷ
            </SWTButton>
            <SWTButton
              type="primary"
              startIcon={<SaveOutlined />}
              loading={isSubmitting}
              onClick={() => form.submit()}
            >
              Lưu
            </SWTButton>
          </div>
        )}
      </div>

      <Divider />

      <SWTForm form={form} layout="vertical" onFinish={onFinish}>
        <div className="grid md:grid-cols-2 gap-6">
          {/* NAME */}
          <div>
            <label className="text-sm text-gray-500">Họ và tên</label>

            {isEdit ? (
              <SWTFormItem name="full_name">
                <SWTInput prefix={<UserOutlined />} />
              </SWTFormItem>
            ) : (
              <div className="text-gray-800 font-medium mt-1">
                {initialData.full_name || "-"}
              </div>
            )}
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm text-gray-500">Số điện thoại</label>

            {isEdit ? (
              <SWTFormItem name="phone">
                <SWTInput prefix={<PhoneOutlined />} />
              </SWTFormItem>
            ) : (
              <div className="text-gray-800 font-medium mt-1">
                {initialData.phone || "-"}
              </div>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <div className="text-gray-800 mt-1 flex items-center gap-2">
              <MailOutlined />
              {initialData.email}
            </div>
          </div>

          {/* GENDER */}
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Giới tính</label>
            {isEdit ? (
              <SWTFormItem name="gender">
                <SWTSelect
                  placeholder="Chọn giới tính"
                  options={[
                    { label: "Nam", value: "MALE" },
                    { label: "Nữ", value: "FEMALE" },
                    { label: "Khác", value: "OTHER" },
                  ]}
                />
              </SWTFormItem>
            ) : (
              <div className="text-gray-800 font-medium mt-1">
                {initialData.gender === "MALE" ? "Nam" : initialData.gender === "FEMALE" ? "Nữ" : initialData.gender === "OTHER" ? "Khác" : "-"}
              </div>
            )}
          </div>

          {/* BIRTHDAY */}
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Ngày sinh</label>
            {isEdit ? (
              <SWTFormItem name="birthday">
                <SWTDatePicker className="w-full" label="Ngày sinh" />
              </SWTFormItem>
            ) : (
              <div className="text-gray-800 font-medium mt-1">
                {initialData.birthday
                  ? new Date(initialData.birthday).toLocaleDateString("vi-VN")
                  : "-"}
              </div>
            )}
          </div>

          {/* LOYALTY */}
          <div>
            <label className="text-sm text-gray-500">Điểm tích luỹ</label>
            <div className="text-gray-800 mt-1 font-semibold text-brand-600">
              {initialData.loyalty_points || 0}
            </div>
          </div>
        </div>

        {/* ADDRESS */}
        <Divider />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold flex items-center gap-2">
              <EnvironmentOutlined />
              Địa chỉ
            </h3>

            {isEdit && (
              <SWTButton
                type="text"
                startIcon={<PlusOutlined />}
                onClick={() => setShowAddAddress(!showAddAddress)}
              >
                Thêm
              </SWTButton>
            )}
          </div>

          <div className="space-y-3">
            {addresses.map((addr: any, idx: number) => (
              <div
                key={idx}
                className="flex items-start justify-between border rounded-xl p-4 bg-gray-50 hover:bg-white transition-all"
              >
                <div className="flex flex-col gap-1">
                   <div className="flex items-center gap-2">
                      <span className="text-gray-700 font-medium">{addr.address}</span>
                      {addr.isDefault && (
                        <Tag color="blue" icon={<CheckCircleFilled />} className="!rounded-full !px-3 !m-0 !text-[11px] !border-none !bg-blue-50 !text-blue-500">
                          Mặc định
                        </Tag>
                      )}
                   </div>
                </div>

                {isEdit && (
                  <div className="flex items-center gap-3">
                    {!addr.isDefault && (
                      <SWTButton
                        type="text"
                        size="sm"
                        className="!text-gray-400 !text-xs hover:!text-brand-500"
                        onClick={() => handleSetDefaultAddress(idx)}
                      >
                        Thiết lập mặc định
                      </SWTButton>
                    )}
                    <DeleteOutlined
                      onClick={() =>
                        setAddresses(addresses.filter((_: any, i: number) => i !== idx))
                      }
                      className="text-red-400 cursor-pointer hover:text-red-600 transition-colors"
                    />
                  </div>
                )}
              </div>
            ))}

            {showAddAddress && (
              <AddressAutocomplete onChange={handleAddAddress} />
            )}
          </div>
        </div>
      </SWTForm>
    </SWTCard>
  );
}