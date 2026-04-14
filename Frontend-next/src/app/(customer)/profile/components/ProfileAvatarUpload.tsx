"use client";
import { useState, useEffect } from "react";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import { CameraOutlined, LoadingOutlined } from "@ant-design/icons";
import SWTUpload from "@/src/@core/component/AntD/SWTUpload";
import type { RcFile } from "antd/es/upload";
import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import { useAuth } from "@/src/context/AuthContext";
import { useSWRConfig } from "swr";
import { DEFAULT_AVATAR_IMAGE } from "@/src/@core/const";
import { uploadFileToCloudinary } from "@/src/services/admin/upload.service";
import { updateCustomerInfo } from "@/src/services/customer/user/user.service";

type Props = {
  currentAvatar?: string;
  displayName?: string;
  onAvatarChange?: (avatarUrl: string) => void;
  size?: number;
};

export default function ProfileAvatarUpload({
  currentAvatar,
  displayName,
  onAvatarChange,
  size = 96,
}: Props) {
  const { currentUser, updateUser, isUploadingAvatar, setIsUploadingAvatar } = useAuth();
  const { mutate } = useSWRConfig();
  const [avatarUrl, setAvatarUrl] = useState<string>(
    currentAvatar || currentUser?.avatar || DEFAULT_AVATAR_IMAGE
  );

  useEffect(() => {
    // Sync with prop even if null to allow resetting to default
    setAvatarUrl(currentAvatar || currentUser?.avatar || DEFAULT_AVATAR_IMAGE);
  }, [currentAvatar, currentUser?.avatar]);

  const beforeUpload = (file: RcFile) => {
    const isImage = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
    if (!isImage) {
      showNotificationError("Chỉ chấp nhận file ảnh JPG, PNG hoặc WebP.");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      showNotificationError("Ảnh phải nhỏ hơn 2MB.");
      return false;
    }
    return true;
  };

  const [isLocalUploading, setIsLocalUploading] = useState(false);

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    setIsLocalUploading(true);
    setIsUploadingAvatar(true);

    try {
      const url = await uploadFileToCloudinary(file as File, "avatars");
      await updateCustomerInfo({ avatar: url });
      setAvatarUrl(url);
      updateUser({ avatar: url });
      await mutate("/users/me");
      onAvatarChange?.(url);
      showNotificationSuccess("Ảnh đại diện đã được cập nhật thành công.");
      onSuccess?.(url);
    } catch (err: any) {
      showNotificationError(err?.message || "Không thể tải ảnh lên, vui lòng thử lại.");
      onError?.(err);
    } finally {
      setIsLocalUploading(false);
      setIsUploadingAvatar(false);
    }
  };

  const isLoading = isLocalUploading || isUploadingAvatar;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative group inline-block rounded-full bg-bg-card shadow-md overflow-hidden"
        style={{ width: size, height: size }}
      >
        <SWTAvatar
          src={avatarUrl}
          alt={displayName || "Avatar"}
          size={size}
          shape="circle"
          className="!rounded-full border-2 border-border-default"
        />

        {/* Persistent Loading Overlay for Profile Avatar */}
        {isLoading && (
          <div className="absolute inset-1 rounded-full flex items-center justify-center bg-bg-card/70 backdrop-blur-[2px] z-10 transition-all duration-300">
            <div className="flex flex-col items-center gap-2">
              <LoadingOutlined className="text-brand-500 text-3xl animate-spin" />
              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-tighter">Đang tải</span>
            </div>
          </div>
        )}
        <SWTUpload
          uploadType="avatar"
          crop={true}
          limitFile={1}
          showUploadList={false}
          beforeUpload={beforeUpload}
          customRequest={customRequest}
          multiple={false}
          disabled={isLoading}
          className="absolute inset-0 w-full h-full rounded-full overflow-hidden"
        >
          <SWTTooltip title={isLoading ? "Đang tải..." : "Đổi ảnh đại diện"} placement="bottom">
            <div
              className={`absolute inset-0 rounded-full flex items-center justify-center bg-black/40 transition-opacity duration-200 cursor-pointer ${isLoading ? "opacity-0 pointer-events-none" : "opacity-0 group-hover:opacity-100"
                }`}
            >
              <CameraOutlined className="!text-white !text-2xl" />
            </div>
          </SWTTooltip>
        </SWTUpload>
      </div>
      {displayName && (
        <div className="text-center">
          <p className="font-bold text-text-main text-lg leading-tight mb-1">{displayName}</p>
          <p className="text-xs font-black text-brand-500 uppercase tracking-widest opacity-80">Hồ sơ cá nhân</p>
        </div>
      )}
    </div>
  );
}

