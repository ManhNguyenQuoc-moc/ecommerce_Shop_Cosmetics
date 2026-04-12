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
import { supabase } from "@/src/@core/utils/supabase";
import { useAuth } from "@/src/context/AuthContext";

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
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatar);
  const { mutate } = useSWRConfig();
  const { currentUser, updateUser } = useAuth();

  const syncFormValues = () => {
    form.setFieldsValue({
      full_name: initialData.full_name,
      phone: initialData.phone,
      gender: initialData.gender,
      birthday: initialData.birthday ? dayjs(initialData.birthday) : undefined,
    });
  };

  useEffect(() => {
    syncFormValues();
    setAddresses(initialData.addresses || []);
    setAvatarUrl(initialData.avatar);
  }, [initialData, form]);

  const onFinish = async (values: any) => {
    try {
      // Check if anything has actually changed
      const isBirthdaySame = (values.birthday && initialData.birthday)
        ? dayjs(values.birthday).isSame(dayjs(initialData.birthday), 'day')
        : (!values.birthday && !initialData.birthday);

      const hasChanged =
        values.full_name !== initialData.full_name ||
        values.phone !== initialData.phone ||
        values.gender !== initialData.gender ||
        !isBirthdaySame ||
        JSON.stringify(addresses) !== JSON.stringify(initialData.addresses || []) ||
        avatarUrl !== initialData.avatar;

      if (!hasChanged) {
        showNotificationSuccess("Thông tin không có thay đổi");
        setIsEdit(false);
        return;
      }

      setIsSubmitting(true);
      const updateData = {
        full_name: values.full_name,
        phone: values.phone,
        gender: values.gender,
        birthday: values.birthday ? values.birthday.toISOString() : null,
        addresses,
        avatar: avatarUrl,
      };

      const response = await updateCustomerInfo(updateData);
      const updatedUserFromApi = (response as any).data || response;

      // Sync global auth state with the actual data returned from server
      updateUser({
        name: updatedUserFromApi.full_name || updatedUserFromApi.name || values.full_name,
        full_name: updatedUserFromApi.full_name || values.full_name,
        avatar: updatedUserFromApi.avatar || avatarUrl || currentUser?.avatar,
        phone: updatedUserFromApi.phone || values.phone,
      });

   
      try {
        await supabase.auth.updateUser({
          data: {
            full_name: values.full_name,
            phone: values.phone
          }
        });
      } catch (supabaseError) {
        console.warn("Failed to sync profile update to Supabase Auth:", supabaseError);
      }

      // Update SWR cache immediately with the new data

      await mutate("/users/me", updatedUserFromApi, false);

      showNotificationSuccess("Cập nhật thành công");

      setIsEdit(false);
    } catch (err: any) {
      showNotificationError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    setIsEdit(true);
    // Ensure form fields are updated after state change
    setTimeout(syncFormValues, 0);
  };

  const handleCancel = () => {
    setIsEdit(false);
    form.resetFields();
    setAvatarUrl(initialData.avatar);
    syncFormValues();
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
    <SWTCard className="!rounded-2xl !border !border-border-default !shadow-sm !bg-bg-card transition-colors" bodyClassName="!p-0">
      <div
        className="h-44 sm:h-52 rounded-t-2xl bg-cover bg-center relative group"
        style={{ backgroundImage: "url('/images/main/background.jpg')" }}
      >
        <div className="absolute top-4 left-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-2 right-12 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-4 right-4 flex gap-2">
          {!isEdit ? (
            <SWTButton
              type="text"
              size="sm"
              onClick={handleEdit}
              startIcon={<EditOutlined className="!text-brand-500" />}
              className="!flex !items-center !gap-1.5 !bg-bg-card/80 !backdrop-blur !text-text-main hover:!bg-bg-card !text-sm !font-bold !px-3 !py-1.5 !rounded-full !shadow !transition-all !h-[40px] !border !border-border-default"
            >
              Chỉnh sửa
            </SWTButton>
          ) : (
            <>
              <SWTButton
                onClick={handleCancel}
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
              currentAvatar={avatarUrl}
              onAvatarChange={setAvatarUrl}
              size={112}
            />
          </div>
          <div className="pb-1 mt-25 flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-black text-text-main leading-tight truncate uppercase tracking-tight">
              {initialData.full_name || "Chưa cập nhật"}
            </h1>
            <p className="text-sm text-text-muted mt-0.5 flex items-center gap-1.5 font-medium">
              <MailOutlined className="text-text-muted opacity-70" />
              {initialData.email || "—"}
            </p>
          </div>

          {/* Loyalty points pill — top right of name area */}
          <div className="shrink-0 sm:pb-1">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-sm">
              <GiftOutlined />
              {initialData.loyalty_points ?? 0} điểm
            </div>
          </div>
        </div>
        <Divider className="!my-4 !border-border-default" />
        <SWTForm form={form} layout="vertical" onFinish={onFinish}>
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 opacity-70">
            Thông tin cơ bản
          </p>

          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">

            {/* Họ và tên */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-black text-text-muted uppercase tracking-wider opacity-60">
                Họ và tên
              </label>
              {isEdit ? (
                <SWTFormItem name="full_name" className="!mb-0">
                  <SWTInput prefix={<UserOutlined className="text-text-muted" />} className="!bg-bg-muted !border-border-default text-text-main" />
                </SWTFormItem>
              ) : (
                <p className="text-text-main font-bold text-base">
                  {initialData.full_name || "—"}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-black text-text-muted uppercase tracking-wider opacity-60">
                Số điện thoại
              </label>
              {isEdit ? (
                <SWTFormItem name="phone" className="!mb-0">
                  <SWTInput prefix={<PhoneOutlined className="text-text-muted" />} className="!bg-bg-muted !border-border-default text-text-main" />
                </SWTFormItem>
              ) : (
                <p className="text-text-main font-bold text-base">
                  {initialData.phone || "—"}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-black text-text-muted uppercase tracking-wider opacity-60">
                Giới tính
              </label>
              {isEdit ? (
                <SWTFormItem name="gender" className="!mb-0">
                  <SWTSelect
                    placeholder="Chọn giới tính"
                    className="[&_.ant-select-selector]:!bg-bg-muted [&_.ant-select-selector]:!border-border-default [&_.ant-select-selection-item]:!text-text-main"
                    options={[
                      { label: "Nam", value: "MALE" },
                      { label: "Nữ", value: "FEMALE" },
                      { label: "Khác", value: "OTHER" },
                    ]}
                  />
                </SWTFormItem>
              ) : (
                <p className="text-text-main font-bold text-base">
                  {genderLabel(initialData.gender)}
                </p>
              )}
            </div>

            {/* Ngày sinh */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-black text-text-muted uppercase tracking-wider opacity-60">
                Ngày sinh
              </label>
              {isEdit ? (
                <SWTFormItem
                  name="birthday"
                  className="!mb-0"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (value && value.isAfter(dayjs().subtract(16, "year"))) {
                          return Promise.reject(new Error("Bạn phải ít nhất 16 tuổi."));
                        }
                        if (value && value.isAfter(dayjs())) {
                          return Promise.reject(new Error("Ngày sinh không thể ở tương lai."));
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <SWTDatePicker
                    className="w-full h-10 !rounded-md !bg-bg-muted !border-border-default !text-text-main"
                    label="Ngày sinh"
                    disabledDate={(current) => {
                      return current && (current > dayjs().endOf('day') || current > dayjs().subtract(16, 'year'));
                    }}
                  />
                </SWTFormItem>
              ) : (
                <p className="text-text-main font-bold text-base">
                  {initialData.birthday
                    ? new Date(initialData.birthday).toLocaleDateString("vi-VN")
                    : "—"}
                </p>
              )}
            </div>
          </div>

          <Divider className="!my-6 !border-border-default" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2 opacity-70">
                Địa chỉ giao hàng
              </p>
              {isEdit && (
                <SWTButton
                  type="text"
                  icon={<PlusOutlined />}
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
                  className="flex items-start justify-between bg-bg-muted/50 hover:bg-bg-muted border border-border-default rounded-xl px-4 py-3 transition-all my-3"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <EnvironmentOutlined className="text-brand-500 shrink-0" />
                    <span className="text-text-main text-sm font-bold truncate tracking-tight">{addr.address}</span>
                    {addr.isDefault && (
                      <Tag
                        icon={<CheckCircleFilled />}
                        className="!rounded-full !px-2 !py-0 !m-0 !text-xs !font-black !uppercase !tracking-widest !border-none !bg-status-info-bg !text-status-info-text shrink-0"
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