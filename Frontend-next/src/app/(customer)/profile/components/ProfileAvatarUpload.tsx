"use client";

import { useState } from "react";
import { Tooltip } from "antd";
import { CameraOutlined, LoadingOutlined } from "@ant-design/icons";
import  SWTUpload  from "@/src/@core/component/AntD/SWTUpload";
import type { RcFile } from "antd/es/upload";
import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import http from "@/src/@core/http";
import { useAuth } from "@/src/context/AuthContext";
import { DEFAULT_AVATAR_IMAGE } from "@/src/@core/const";

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
  const { currentUser, login } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string>(
    currentAvatar || currentUser?.avatar || DEFAULT_AVATAR_IMAGE
  );
  const [isUploading, setIsUploading] = useState(false);

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

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await http.patch<{ success: boolean; data: { avatar: string } }>(
        "/users/me/avatar",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const newAvatarUrl = res.data?.data?.avatar || avatarUrl;
      setAvatarUrl(newAvatarUrl);
      if (currentUser) {
        const token =
          typeof http.defaults.headers.common["Authorization"] === "string"
            ? http.defaults.headers.common["Authorization"].replace("Bearer ", "")
            : "";
        login(token, { ...currentUser, avatar: newAvatarUrl });
      }

      onAvatarChange?.(newAvatarUrl);
      showNotificationSuccess("Cập nhật ảnh đại diện thành công.");
      onSuccess?.(res.data, file);
    } catch (err: any) {
      showNotificationError(err?.message || "Không thể tải ảnh lên, vui lòng thử lại.");
      onError?.(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div 
        className="relative group inline-block rounded-full"
        style={{ width: size, height: size }}
      >
        <SWTAvatar
          src={avatarUrl}
          alt={displayName || "Avatar"}
          size={size}
          shape="circle"
          className="!rounded-full border-4 border-white shadow-lg"
        />
        <SWTUpload
          uploadType="avatar"
          crop={true}
          limitFile={1}
          showUploadList={false}
          beforeUpload={beforeUpload}
          customRequest={customRequest}
          multiple={false}
          className="absolute inset-0 w-full h-full rounded-full overflow-hidden"
        >
          <Tooltip title="Đổi ảnh đại diện" placement="bottom">
            <SWTButton
              type="text"
              className="!absolute !inset-0 !rounded-full !flex !items-center !justify-center !bg-black/40 !opacity-0 group-hover:!opacity-100 !transition-opacity !duration-200 !cursor-pointer !border-none !p-0"
            >
              {isUploading ? (
                <LoadingOutlined className="!text-white !text-xl" />
              ) : (
                <CameraOutlined className="!text-white !text-xl" />
              )}
            </SWTButton>
          </Tooltip>
        </SWTUpload>
      </div>
      {displayName && (
        <div className="text-center">
          <p className="font-semibold text-gray-800 text-base leading-tight">{displayName}</p>
          <p className="text-xs text-gray-400 mt-0.5">Nhấp vào ảnh để thay đổi</p>
        </div>
      )}
    </div>
  );
}
