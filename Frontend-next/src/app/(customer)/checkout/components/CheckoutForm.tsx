"use client";

import { useState, useEffect } from "react";
import { Form, Radio, Divider } from "antd";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import { SWTInput } from "@/src/@core/component/AntD/SWTInput";
import { useCheckout } from "@/src/hooks/useCheckout";
import AddressAutocomplete from "./AddressAutocomplete";
import {
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Address } from "@/src/@core/type/checkout";

export default function CheckoutForm() {
  const [form] = Form.useForm();
  const {
    customer,
    addresses,
    selectedAddress,
    setCustomer,
    setSelectedAddress,
    setAddresses,
    fetchCustomerInfo
  } = useCheckout();

  const [addingNew, setAddingNew] = useState(false);

  useEffect(() => {
    fetchCustomerInfo();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
    });
  }, [customer, form]);

  const handleSelectAddress = (addr: Address) => {
    setSelectedAddress(addr);
    setAddingNew(false);
  };

  const handleAddNewAddress = (newAddr: Address) => {
    const updated = [...addresses, newAddr];
    setAddresses(updated);
    setSelectedAddress(newAddr);
    setAddingNew(false);
  };

  return (
    <SWTCard
      className="!border-none !shadow-md !rounded-2xl !p-6 flex flex-col gap-6 min-h-[450px]"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-4">
          <h2 className="text-lg font-bold text-gray-800 uppercase">
            Thông tin người nhận hàng
          </h2>
        </div>
        <SWTForm
          form={form}
          layout="vertical"
          onValuesChange={(_, values) => setCustomer(values)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SWTFormItem name="name" label="Họ và tên" rules={[{ required: true }]}>
              <SWTInput
                prefix={<UserOutlined />}
                placeholder="Vui lòng nhập tên"
                className="h-11 rounded-xl"
                showCount={false}
                allowClear={false}
              />
            </SWTFormItem>

            <SWTFormItem name="phone" label="Số điện thoại" rules={[{ required: true }]}>
              <SWTInput
                prefix={<PhoneOutlined />}
                placeholder="Vui lòng nhập số điện thoại"
                className="h-11 rounded-xl"
                showCount={false}
                allowClear={false}
              />
            </SWTFormItem>
            <SWTFormItem name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <SWTInput
                prefix={<MailOutlined />}
                placeholder="Vui lòng nhập email"
                className="h-11 rounded-xl"
                showCount={false}
                allowClear={false}
              />
            </SWTFormItem>
          </div>
        </SWTForm>
      </div>

      <Divider className="!my-2" />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2 text-gray-700">
            <EnvironmentOutlined className="text-red-500" />
            Địa chỉ giao hàng
          </h3>
          {addresses.length > 0 && (
            <button
              onClick={() => setAddingNew(!addingNew)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {addingNew ? "Hủy" : "Thêm"}
            </button>
          )}
        </div>

        {addresses.length > 0 && (
          <Radio.Group
            value={selectedAddress?.address}
            className="flex flex-col gap-3"
          >
            {addresses.map((addr, idx) => {
              const isActive = selectedAddress?.address === addr.address;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectAddress(addr)}
                  className={`border rounded-xl p-4 my-2 cursor-pointer transition flex items-start gap-3 ${
                    isActive
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Radio value={addr.address} />
                  <div className="flex-1 text-sm text-gray-700 leading-relaxed">
                    {addr.address}
                  </div>
                </div>
              );
            })}
          </Radio.Group>
        )}
        {(addingNew || addresses.length === 0) && (
          <div className="border-2 border-dashed border-blue-200 rounded-xl p-4 bg-blue-50/20">
            <AddressAutocomplete onChange={handleAddNewAddress} />
            <p className="text-[11px] text-gray-400 mt-2">
              * Chọn từ gợi ý để tính phí ship chính xác
            </p>
          </div>
        )}
      </div>
    </SWTCard>
  );
}