"use client";

import { useState, useEffect } from "react";
import { useSWRConfig } from "swr";
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
  GiftOutlined,
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
import ProfileAvatarUpload from "./ProfileAvatarUpload";

type Props = {
  initialData: UserProfileDTO;
};

const genderLabel = (g?: string) =>
  g === "MALE" ? "Nam" : g === "FEMALE" ? "Nữ" : g === "OTHER" ? "Khác" : "—";

export default function ProfileForm({ initialData }: Props) {
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addresses, setAddresses] = useState(initialData.addresses || []);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const { mutate } = useSWRConfig();

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
      await mutate("/users/me");
      showNotificationSuccess("Cập nhật thành công");
      setIsEdit(false);
    } catch (err: any) {
      showNotificationError(err.message || "Đã có lỗi xảy ra");
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
    setAddresses(
      addresses.map((addr: any, i: number) => ({ ...addr, isDefault: i === index }))
    );
  };

  return (
    <SWTCard className=" !rounded-2xl !border-none !shadow-sm overflow-hidden" bodyClassName="p-0">
      <div
        className="relative h-40 md:h-52 bg-gradient-to-r from-brand-400 via-pink-400 to-rose-400 rounded-t-2xl"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 50%, rgba(255,180,150,0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(180,120,255,0.35) 0%, transparent 60%)",
        }}
      >
        <div className="absolute top-4 left-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-2 right-12 w-32 h-32 bg-white/10 rounded-full blur-3xl" />

        <div className="absolute top-4 right-4 flex gap-2">
          {!isEdit ? (
            <SWTButton
              type="text"
              size="sm"
              onClick={() => setIsEdit(true)}
              startIcon={<EditOutlined className="!text-brand-500" />}
              className="!flex !items-center !gap-1.5 !bg-white/80 !backdrop-blur !text-gray-700 hover:!bg-white !text-sm !font-medium !px-3 !py-1.5 !rounded-full !shadow !transition-all !h-[40px]"
            >
              Chỉnh sửa
            </SWTButton>
          ) : (
            <>
              <SWTButton
                onClick={() => setIsEdit(false)}
                startIcon={<CloseOutlined />}
                className="!flex !items-center !gap-1.5 !h-[40px] !bg-white/80 !backdrop-blur !text-gray-600 hover:!bg-white !text-sm !font-medium !px-3 !py-1.5 !rounded-full !shadow !transition-all"
              >
                Huỷ
              </SWTButton>
              <SWTButton
                type="primary"
                onClick={() => form.submit()}
                loading={isSubmitting}
                startIcon={<SaveOutlined />}
                className="!flex !items-center !gap-1.5 !h-[40px] !bg-brand-500 hover:!bg-brand-600 !text-white !text-sm !font-medium !px-4 !py-1.5 !rounded-full !shadow !transition-all"
              >
                Lưu
              </SWTButton>
            </>
          )}
        </div>
      </div>
      <div className="px-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 mb-4">
          <div className="shrink-0">
            <ProfileAvatarUpload
              currentAvatar={initialData.avatar}
              displayName={undefined}
              size={112}
            />
          </div>
          <div className="pb-1 flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight truncate">
              {initialData.full_name || "Chưa cập nhật"}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
              <MailOutlined className="text-gray-400" />
              {initialData.email || "—"}
            </p>
          </div>

          {/* Loyalty points pill — top right of name area */}
          <div className="shrink-0 sm:pb-1">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
              <GiftOutlined />
              {initialData.loyalty_points ?? 0} điểm
            </div>
          </div>
        </div>
        <Divider className="!my-4" />
        <SWTForm form={form} layout="vertical" onFinish={onFinish}>
          {/* Section label */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Thông tin cơ bản
          </p>

          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">

            {/* Họ và tên */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Họ và tên
              </label>
              {isEdit ? (
                <SWTFormItem name="full_name" className="!mb-0">
                  <SWTInput prefix={<UserOutlined className="text-gray-400" />} />
                </SWTFormItem>
              ) : (
                <p className="text-gray-800 font-semibold text-base">
                  {initialData.full_name || "—"}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Số điện thoại
              </label>
              {isEdit ? (
                <SWTFormItem name="phone" className="!mb-0">
                  <SWTInput prefix={<PhoneOutlined className="text-gray-400" />} />
                </SWTFormItem>
              ) : (
                <p className="text-gray-800 font-semibold text-base">
                  {initialData.phone || "—"}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Giới tính
              </label>
              {isEdit ? (
                <SWTFormItem name="gender" className="!mb-0">
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
                <p className="text-gray-800 font-semibold text-base">
                  {genderLabel(initialData.gender)}
                </p>
              )}
            </div>

            {/* Ngày sinh */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Ngày sinh
              </label>
              {isEdit ? (
                <SWTFormItem name="birthday" className="!mb-0">
                  <SWTDatePicker className="w-full" label="Ngày sinh" />
                </SWTFormItem>
              ) : (
                <p className="text-gray-800 font-semibold text-base">
                  {initialData.birthday
                    ? new Date(initialData.birthday).toLocaleDateString("vi-VN")
                    : "—"}
                </p>
              )}
            </div>
          </div>

          <Divider className="!my-6" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <EnvironmentOutlined />
                Địa chỉ giao hàng
              </p>
              {isEdit && (
                <SWTButton
                  type="text"
                  icon={<PlusOutlined/>}
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="!flex !items-center !gap-1 !text-sm !text-brand-500 hover:!text-brand-700 !font-medium !transition-colors !w-[150px]"
                >
                  Thêm địa chỉ
                </SWTButton>
              )}
            </div>

            <div className="space-y-2">
              {addresses.length === 0 && (
                <p className="text-sm text-gray-400 italic py-2">Chưa có địa chỉ nào.</p>
              )}
              {addresses.map((addr: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start justify-between bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl px-4 py-3 transition-all my-3"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <EnvironmentOutlined className="text-brand-400 shrink-0" />
                    <span className="text-gray-700 text-sm font-medium truncate">{addr.address}</span>
                    {addr.isDefault && (
                      <Tag
                        icon={<CheckCircleFilled />}
                        className="!rounded-full !px-2 !py-0 !m-0 !text-[10px] !border-none !bg-blue-50 !text-blue-500 shrink-0"
                      >
                        Mặc định
                      </Tag>
                    )}
                  </div>

                  {isEdit && (
                    <div className="flex items-center gap-3 ml-3 shrink-0">
                      {!addr.isDefault && (
                        <SWTButton
                          type="text"
                          onClick={() => handleSetDefaultAddress(idx)}
                          className="!text-xs !h-[30px] !text-gray-400 hover:!text-brand-500 hover:!bg-white !transition-colors !whitespace-nowrap "
                        >
                          Đặt mặc định
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
                <div className="mt-2">
                  <AddressAutocomplete onChange={handleAddAddress} />
                </div>
              )}
            </div>
          </div>
        </SWTForm>
      </div>
    </SWTCard>

  );
}