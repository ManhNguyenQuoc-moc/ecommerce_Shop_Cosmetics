"use client";

import { useState, useEffect, useCallback } from "react";
import { Form, Divider } from "antd";
import {
  User,
  Phone,
  Mail,
  Edit,
  Save,
  X,
  Shield,
  MapPin,
  Calendar,
} from "lucide-react";

import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import { SWTInput } from "@/src/@core/component/AntD/SWTInput";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTDatePicker from "@/src/@core/component/AntD/SWTDatePicker";
import dayjs from "dayjs";

import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import { updateCustomerInfo } from "@/src/services/customer/user/user.service";
import { UserProfileDTO } from "@/src/services/admin/user/models/output.model.dto";
import ProfileAvatarUpload from "@/src/app/(customer)/profile/components/ProfileAvatarUpload";
import { useAuth } from "@/src/context/AuthContext";
import { useUserProfile } from "@/src/services/admin/user/user.hook";

type Props = {
  initialData?: UserProfileDTO;
};

const genderLabel = (g?: string) =>
  g === "MALE" ? "Nam" : g === "FEMALE" ? "Nữ" : g === "OTHER" ? "Khác" : "—";

export default function AdminProfileForm({ initialData }: Props) {
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const { currentUser, updateUser } = useAuth();
  
  // Use the hook to fetch profile data with real-time updates
  const { data: profileData, mutate: mutateProfile } = useUserProfile();
  const profileInfo = profileData || initialData;

  const syncFormValues = useCallback(() => {
    if (!profileInfo) return;

    const firstAddress = profileInfo.addresses?.[0]?.address || "";
    form.setFieldsValue({
      full_name: profileInfo.full_name || profileInfo.email?.split("@")[0],
      phone: profileInfo.phone,
      gender: profileInfo.gender,
      birthday: profileInfo.birthday ? dayjs(profileInfo.birthday) : undefined,
      work_address: firstAddress,
    });
  }, [profileInfo, form]);

  useEffect(() => {
    if (profileInfo) {
      syncFormValues();
      setAvatarUrl(profileInfo.avatar || "");
    }
  }, [profileInfo, syncFormValues]);

  const onFinish = async (values: {
    full_name: string;
    phone: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    birthday?: dayjs.Dayjs;
    work_address?: string;
  }) => {
    try {
      setIsSubmitting(true);
      const addresses = values.work_address
        ? [{ address: values.work_address, isDefault: true }]
        : [];

      const updateData = {
        full_name: values.full_name,
        phone: values.phone,
        gender: values.gender,
        birthday: values.birthday ? values.birthday.toISOString() : undefined,
        addresses: addresses,
        avatar: avatarUrl,
      };

      const response = await updateCustomerInfo(updateData);
      const updatedUserFromApi = (response as { data?: UserProfileDTO } | UserProfileDTO) as
        | { data?: UserProfileDTO }
        | UserProfileDTO;
      const normalizedProfile = ("data" in updatedUserFromApi && updatedUserFromApi.data
        ? updatedUserFromApi.data
        : updatedUserFromApi) as UserProfileDTO;

      updateUser({
        name: normalizedProfile.full_name || values.full_name,
        full_name: normalizedProfile.full_name || values.full_name,
        avatar: normalizedProfile.avatar || avatarUrl || currentUser?.avatar,
      });

      // Revalidate the profile data immediately to ensure UI updates
      await mutateProfile(normalizedProfile, false);
      showNotificationSuccess("Cập nhật thông tin quản trị viên thành công");
      setIsEdit(false);
    } catch (err: unknown) {
      showNotificationError(err instanceof Error ? err.message : "Đã có lỗi xảy ra khi cập nhật");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    setIsEdit(true);
    setTimeout(syncFormValues, 0);
  };

  const handleCancel = () => {
    setIsEdit(false);
    form.resetFields();
    setAvatarUrl(profileInfo?.avatar || "");
    syncFormValues();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in pb-10">
      {/* Left Column - Profile Card */}
      <div className="lg:col-span-1 p-8 admin-card flex flex-col items-center text-center relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 blur-[50px] rounded-full pointer-events-none" />

        <div className="relative group mt-4 mb-2">
          <ProfileAvatarUpload
            currentAvatar={avatarUrl}
            onAvatarChange={setAvatarUrl}
            size={130}
          />
        </div>

        <h3 className="mt-8 text-2xl font-black admin-section-heading tracking-tight">
          {profileInfo?.full_name || "Quản trị viên"}
        </h3>

        <div className="mt-4 flex flex-col gap-3 w-full">
          <div className="inline-flex items-center justify-center font-bold px-4 py-2 rounded-xl border text-xs bg-brand-50 text-brand-600 border-brand-100 dark:bg-brand-500/10 dark:text-brand-400 dark:border-brand-500/20 uppercase tracking-widest">
            {profileInfo?.role || "—"}
          </div>
          <div className="inline-flex items-center justify-center gap-2 font-bold px-4 py-2 rounded-xl border text-xs bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Đang hoạt động
          </div>
        </div>

        <Divider className="my-8! dark:border-slate-800!" />

        <div className="w-full space-y-4 px-2">
          <div className="flex flex-col items-center gap-1.5 p-4 rounded-xl admin-subsection">
            <Shield className="text-brand-500 mb-1" size={24} />
            <span className="text-[10px] uppercase font-black admin-text-muted tracking-widest">Quyền hệ thống</span>
            <span className="text-sm font-bold admin-section-heading italic">Toàn quyền truy cập</span>
          </div>
        </div>
      </div>

      {/* Right Column - Detailed Info */}
      <div className="lg:col-span-2 p-8 admin-card relative overflow-hidden transition-all duration-300">
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-500/5 blur-[50px] rounded-full pointer-events-none" />

        <div className="flex justify-between items-center mb-10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-brand-500 rounded-full" />
            <h3 className="text-xl font-black admin-section-heading uppercase tracking-wider m-0!">Thông tin chi tiết</h3>
          </div>

          <div className="flex gap-2">
            {!isEdit ? (
              <SWTButton
                type="primary"
                className="bg-brand-500! text-white! border-transparent! rounded-full! px-6! font-black! transition-all shadow-md shadow-brand-500/20 hover:bg-brand-600! h-11!"
                startIcon={<Edit size={16} />}
                onClick={handleEdit}
              >
                Chỉnh sửa
              </SWTButton>
            ) : (
              <>
                <SWTButton
                  onClick={handleCancel}
                  startIcon={<X size={18} />}
                  className="rounded-full! px-6! font-black! h-11! bg-bg-muted! dark:bg-bg-muted! border-none text-text-sub!"
                >
                  Huỷ
                </SWTButton>
                <SWTButton
                  type="primary"
                  onClick={() => form.submit()}
                  loading={isSubmitting}
                  startIcon={<Save size={18} />}
                  className="rounded-full! px-6! font-black! h-11! bg-brand-500! shadow-lg! shadow-brand-500/20"
                >
                  Lưu
                </SWTButton>
              </>
            )}
          </div>
        </div>

        <SWTForm form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12 relative z-10 mt-4">
            {/* Họ và tên */}
            <div className="space-y-3">
              <label className="text-[11px] uppercase font-black text-brand-500 dark:text-brand-400 tracking-widest flex items-center gap-2">
                <User size={14} /> Họ và tên Quản trị
              </label>
              {isEdit ? (
                <SWTFormItem 
                  name="full_name" 
                  className="mb-0!"
                  rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
                >
                  <SWTInput className="h-12! rounded-xl! dark:bg-slate-800/80! dark:border-slate-700! dark:text-white!" />
                </SWTFormItem>
              ) : (
                <div className="admin-field-display flex items-center gap-4 pb-3">
                  <span className="font-bold text-lg">{profileInfo?.full_name || "—"}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-3">
              <label className="text-[11px] uppercase font-black text-brand-500 dark:text-brand-400 tracking-widest flex items-center gap-2">
                <Mail size={14} /> Email hệ thống
              </label>
              <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-700/50 pb-3 cursor-not-allowed">
                <span className="font-bold text-lg">{profileInfo?.email || "—"}</span>
              </div>
            </div>

            {/* Điện thoại */}
            <div className="space-y-3">
              <label className="text-[11px] uppercase font-black text-brand-500 dark:text-brand-400 tracking-widest flex items-center gap-2">
                <Phone size={14} /> Điện thoại liên tâm
              </label>
              {isEdit ? (
                <SWTFormItem 
                  name="phone" 
                  className="mb-0!"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    { pattern: /^[0-9+]{10,12}$/, message: "Số điện thoại không hợp lệ" }
                  ]}
                >
                  <SWTInput className="h-12! rounded-xl! dark:bg-slate-800/80! dark:border-slate-700! dark:text-white!" />
                </SWTFormItem>
              ) : (
                <div className="admin-field-display flex items-center gap-4 pb-3">
                  <span className="font-bold text-lg">{profileInfo?.phone || "—"}</span>
                </div>
              )}
            </div>

            {/* Ngày sinh */}
            <div className="space-y-3">
              <label className="text-[11px] uppercase font-black text-brand-500 dark:text-brand-400 tracking-widest flex items-center gap-2">
                <Calendar size={14} /> Ngày sinh
              </label>
              {isEdit ? (
                <SWTFormItem 
                  name="birthday" 
                  className="mb-0!"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày sinh" },
                    {
                      validator: (_, value) => {
                        if (value && value.isAfter(dayjs().subtract(16, "year"))) {
                          return Promise.reject(new Error("Bạn phải ít nhất 16 tuổi"));
                        }
                        if (value && value.isAfter(dayjs())) {
                          return Promise.reject(new Error("Ngày sinh không thể ở tương lai"));
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <SWTDatePicker className="w-full h-12! rounded-xl! dark:[&_.ant-picker-input>input]:text-white! dark:bg-slate-800/80! dark:border-slate-700!" />
                </SWTFormItem>
              ) : (
                <div className="admin-field-display flex items-center gap-4 pb-3">
                  <span className="font-bold text-lg">
                    {profileInfo?.birthday ? dayjs(profileInfo?.birthday).format("DD/MM/YYYY") : "—"}
                  </span>
                </div>
              )}
            </div>

            {/* Giới tính */}
            <div className="space-y-3">
              <label className="text-[11px] uppercase font-black text-brand-500 dark:text-brand-400 tracking-widest flex items-center gap-2">
                <User size={14} /> Giới tính
              </label>
              {isEdit ? (
                <SWTFormItem 
                  name="gender" 
                  className="mb-0!"
                  rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
                >
                  <SWTSelect
                    className="h-12! w-full dark:[&_.ant-select-selector]:bg-slate-800/80! dark:[&_.ant-select-selector]:border-slate-700! dark:[&_.ant-select-selection-item]:text-white!"
                    placeholder="Chọn giới tính"
                    options={[
                      { label: "Nam", value: "MALE" },
                      { label: "Nữ", value: "FEMALE" },
                      { label: "Khác", value: "OTHER" },
                    ]}
                  />
                </SWTFormItem>
              ) : (
                <div className="admin-field-display flex items-center gap-4 pb-3">
                  <span className="font-bold text-lg">{genderLabel(profileInfo?.gender)}</span>
                </div>
              )}
            </div>

            {/* Địa chỉ */}
            <div className="md:col-span-2 space-y-3">
              <label className="text-[11px] uppercase font-black text-brand-500 dark:text-brand-400 tracking-widest flex items-center gap-2">
                <MapPin size={14} /> Địa chỉ làm việc
              </label>
              {isEdit ? (
                <SWTFormItem 
                  name="work_address" 
                  className="mb-0!"
                  rules={[{ required: true, message: "Vui lòng nhập địa chỉ làm việc" }]}
                >
                  <SWTInput className="h-12! rounded-xl! dark:bg-slate-800/80! dark:border-slate-700! dark:text-white!" />
                </SWTFormItem>
              ) : (
                <div className="admin-field-display flex items-center gap-4 pb-3">
                  <span className="font-bold text-lg truncate">
                    {profileInfo?.addresses?.[0]?.address || "—"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </SWTForm>
      </div>
    </div>
  );
}
