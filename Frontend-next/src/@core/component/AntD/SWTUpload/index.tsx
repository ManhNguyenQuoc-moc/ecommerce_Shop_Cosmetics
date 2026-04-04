"use client";
import React, { useState, useEffect } from "react";
import { Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import SWTButton from "../SWTButton";
import ImgCrop from "antd-img-crop";
import { LoadingOutlined } from "@ant-design/icons";
import UploadIcon from "../../SWTIcon/iconoir/upload";
import SWTRenderIf from "../../SWTRenderIf";
import {
    showNotificationSuccess,
    showNotificationError,
} from "@/src/@core/utils/message";

export type SWTUploadProps = UploadProps & {
    uploadType?: "avatar" | "image";
    limitFile: number;
    isShowlistFile?: boolean;
    label?: string;
    crop?: boolean;
    aspect?: number;
    icon?: React.ReactNode;
    className?: string;
};

const SWTUpload = ({
    limitFile = 3,
    uploadType = "image",
    multiple = uploadType !== "avatar" && true,
    icon = <UploadIcon />,
    label = `${uploadType === "avatar" ? "" : "Tải ảnh lên"}`,
    className,
    listType = "picture",
    crop = false,
    aspect = 1 / 1,
    ...props
}: SWTUploadProps) => {

    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([...(props.fileList || []),]);
    useEffect(() => {
        if (props.fileList) {
            setFileList(props.fileList);
        }
    }, [props.fileList]);
    const FILE_ACCEPT_MAP = {
        image: "image/png, image/jpeg, image/webp",
        avatar: "image/png, image/jpeg",
        // file: ".csv, .xlsx, .xls"
    };

    const accept = FILE_ACCEPT_MAP[uploadType] || FILE_ACCEPT_MAP.image;

    const handleChange: UploadProps["onChange"] = (info) => {
        const { status, name } = info.file;
        let newFileList = [...info.fileList];

        newFileList = newFileList.slice(-limitFile);

        newFileList = newFileList.map((file) => {
            if (file.response) {
                file.url = file.response.url;
            }
            return file;
        });
        setFileList(newFileList);
        props.onChange?.(info);
        setLoading(status === "uploading");
        if (status === "done") {
            showNotificationSuccess(
                `Ảnh ${name} đã được tải lên thành công.`,
                {
                    title: "Tải lên thành công",
                }
            );
        } else if (status === "error") {
            showNotificationError(
                `Không thể tải file ${name} lên máy chủ.`,
                {
                    title: "Tải lên thất bại",
                }
            );
        }
    };

    const uploadButton = (

        <SWTButton
            variant="solid"
            startIcon={loading ? <LoadingOutlined /> : icon}
            disabled={props.disabled}
        >{label}
        </SWTButton>
    );

    const renderUpload = (
        <Upload
            {...props}
            accept={accept}
            maxCount={props.maxCount || limitFile}
            listType={listType}
            fileList={fileList}
            multiple={multiple}
            onChange={handleChange}
            className={`${className}`}
            showUploadList={props.showUploadList ?? (uploadType !== "avatar")}
        >
            {props.children ? (loading ? <LoadingOutlined /> : props.children) : uploadButton}
        </Upload>
    );

    return (
        <div className={className}>
            <SWTRenderIf condition={!!label && listType === "picture"}>
                <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </div>
            </SWTRenderIf>
            {crop && uploadType === "avatar" ? (
                <ImgCrop
                    rotationSlider
                    aspect={aspect}
                    showGrid
                    modalTitle="Chỉnh sửa ảnh"
                >
                    {renderUpload}
                </ImgCrop>
            ) : (
                renderUpload
            )}
        </div>
    );
};

export default SWTUpload;