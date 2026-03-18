"use client";

import { useState, useEffect } from "react";
import { Form, Radio, Skeleton, Divider } from "antd";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import { SWTInput } from "@/src/@core/component/AntD/SWTInput";
import { useCheckoutStore } from "@/src/stores/useCheckoutStore";
import AddressAutocomplete from "./AddressAutocomplete";
import { 
  PlusCircleOutlined, 
  CheckCircleFilled, 
  UserOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined 
} from "@ant-design/icons";
import { useAuth } from "@/src/context/AuthContext";
import { getCustomerInfo } from "@/src/services/customer/user.service";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { Address } from "@/src/@core/type/checkout";

export default function CheckoutForm() {
  const [form] = Form.useForm();
  const { currentUser } = useAuth();
  const userId = currentUser?.id;

  const { data: response, isLoading } = useFetchSWR(
    userId ? `/users/${userId}` : null,
    () => getCustomerInfo(userId!)
  );

  const customer = response;
  const info = useCheckoutStore((s) => s.info);
  const setInfo = useCheckoutStore((s) => s.setInfo);
  const reset = useCheckoutStore((s) => s.reset);
  
  const [addingNew, setAddingNew] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const addresses = info.addresses || [];

  // Reset nếu Guest có rác từ session cũ
  useEffect(() => {
    if (!userId && info.addresses.length > 0) {
      reset(); 
    }
  }, [userId]);

  // Sync dữ liệu từ API
  useEffect(() => {
    if (customer) {
      const apiAddresses = customer.addresses || [];
      setInfo({
        name: info.name || customer.name || "",
        phone: info.phone || customer.phone || "",
        addresses: addresses.length > 0 ? addresses : apiAddresses,
      });

      if (apiAddresses.length > 0 && selectedIndex === null) {
        setSelectedIndex(0);
        setInfo({ 
          address: apiAddresses[0].address,
          lat: apiAddresses[0].lat,
          lon: apiAddresses[0].lon
        });
      }
    }
  }, [customer]);

  // Sync Form fields
  useEffect(() => {
    form.setFieldsValue({
      name: info.name,
      phone: info.phone,
    });
  }, [info.name, info.phone, form]);

  const handleSelectAddress = (index: number) => {
    setSelectedIndex(index);
    setAddingNew(false);
    const selectedAddr = addresses[index];
    setInfo({ 
      address: selectedAddr.address,
      lat: selectedAddr.lat,
      lon: selectedAddr.lon
    });
  };

  const handleAddNewAddress = (newAddr: Address) => {
    const updatedList = [...addresses, newAddr];
    setInfo({ 
      addresses: updatedList, 
      address: newAddr.address,
      lat: newAddr.lat,
      lon: newAddr.lon
    });
    setSelectedIndex(updatedList.length - 1);
    setAddingNew(false);
  };

  if (userId && isLoading) return <SWTCard><Skeleton active avatar /></SWTCard>;

  return (
    <SWTCard className="space-y-6 border-none shadow-md rounded-2xl p-6">
      {/* PHẦN 1: THÔNG TIN NGƯỜI NHẬN (Cố định ở trên) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-4">
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tight">Người nhận hàng</h2>
        </div>

        <SWTForm
          form={form}
          layout="vertical"
          onValuesChange={(_, values) => setInfo({ ...values })}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <SWTFormItem 
              name="name" 
              label={<span className="font-semibold text-gray-600">Họ và tên</span>}
              rules={[{ required: true, message: "Nhập tên người nhận" }]}
            >
              <SWTInput prefix={<UserOutlined className="text-blue-500" />} placeholder="VD: Nguyễn Văn A" className="h-11 rounded-xl" showCount={false} />
            </SWTFormItem>
            <SWTFormItem 
              name="phone" 
              label={<span className="font-semibold text-gray-600">Số điện thoại</span>}
              rules={[{ required: true, message: "Nhập số điện thoại" }]}
            >
              <SWTInput prefix={<PhoneOutlined className="text-blue-500" />} placeholder="09xxxxxxxx" className="h-11 rounded-xl" showCount={false} />
            </SWTFormItem>
          </div>
        </SWTForm>
      </div>

      <Divider className="my-2" />

      {/* PHẦN 2: CHỌN ĐỊA CHỈ GIAO HÀNG */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-bold text-gray-700 flex items-center gap-2">
            <EnvironmentOutlined className="text-red-500" /> Địa chỉ giao hàng
          </h3>
          {addresses.length > 0 && !addingNew && (
            <button 
              onClick={() => { setAddingNew(true); setSelectedIndex(null); }}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              + Thêm địa chỉ mới
            </button>
          )}
        </div>

        {/* DANH SÁCH CARD ĐỊA CHỈ */}
        {addresses.length > 0 && !addingNew && (
          <Radio.Group
            className="w-full flex flex-col gap-3"
            value={selectedIndex}
            onChange={(e) => handleSelectAddress(e.target.value)}
          >
            {addresses.map((addr, idx) => (
              <div 
                key={idx}
                onClick={() => handleSelectAddress(idx)}
                className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  selectedIndex === idx ? "border-blue-500 bg-blue-50/30 shadow-sm" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Radio value={idx} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 font-medium leading-relaxed">{addr.address}</p>
                  </div>
                  {selectedIndex === idx && <CheckCircleFilled className="text-blue-500" />}
                </div>
              </div>
            ))}
          </Radio.Group>
        )}

        {/* FORM NHẬP ĐỊA CHỈ MỚI (Hiện khi chưa có địa chỉ hoặc bấm thêm mới) */}
        {(addingNew || addresses.length === 0) && (
          <div className="p-5 border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50/10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-blue-600 uppercase">Tìm kiếm địa chỉ giao hàng</span>
              {addresses.length > 0 && (
                <button 
                  className="text-xs text-gray-400 hover:text-red-500"
                  onClick={() => { setAddingNew(false); setSelectedIndex(0); }}
                >
                  Hủy bỏ
                </button>
              )}
            </div>
            <AddressAutocomplete onChange={handleAddNewAddress} />
            <p className="text-[11px] text-gray-400 mt-2">
              * Vui lòng chọn địa chỉ từ gợi ý để chúng tôi tính phí ship chính xác nhất.
            </p>
          </div>
        )}
      </div>
    </SWTCard>
  );
}