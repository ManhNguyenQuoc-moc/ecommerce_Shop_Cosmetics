"use client";

import { useState, useEffect } from "react";
import { Form, Radio, Divider } from "antd";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import { SWTInput } from "@/src/@core/component/AntD/SWTInput";
import { useCheckout } from "@/src/hooks/customer/checkout.hook";
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
      className="!border border-border-default !shadow-md !rounded-2xl !p-6 !bg-bg-card flex flex-col gap-6 min-h-[450px]"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-l-4 border-brand-500 pl-4">
          <h2 className="text-lg font-bold text-text-main uppercase">
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

      <Divider className="!my-2 border-border-default" />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2 text-text-sub uppercase text-sm">
            <EnvironmentOutlined className="text-status-error-text" />
            Địa chỉ giao hàng
          </h3>
          {addresses.length > 0 && (
            <button
              onClick={() => setAddingNew(!addingNew)}
              className="text-sm text-brand-500 hover:opacity-80 font-bold"
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
                  className={`border rounded-xl p-4 my-2 cursor-pointer transition flex items-start gap-3 ${isActive
                      ? "border-brand-500 bg-brand-500/5 shadow-sm"
                      : "border-border-default hover:border-brand-500/50"
                    }`}
                >
                  <Radio value={addr.address} />
                  <div className="flex-1 text-sm text-text-sub leading-relaxed">
                    {addr.address}
                  </div>
                </div>
              );
            })}
          </Radio.Group>
        )}
        {(addingNew || addresses.length === 0) && (
          <div className="border-2 border-dashed border-brand-500/20 rounded-xl p-4 bg-bg-muted">
            <AddressAutocomplete onChange={handleAddNewAddress} />
            <p className="text-[11px] text-text-muted mt-2">
              * Chọn từ gợi ý để tính phí ship chính xác
            </p>
          </div>
        )}
      </div>
    </SWTCard>
  );
}