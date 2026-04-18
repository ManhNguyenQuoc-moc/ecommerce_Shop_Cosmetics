import axios from "axios";
import crypto from "crypto";
import dayjs from "dayjs";

const APP_ID = process.env.ZALOPAY_APP_ID || "2554";
const KEY1 = process.env.ZALOPAY_KEY1 || "";
const KEY2 = process.env.ZALOPAY_KEY2 || "";
const ENDPOINT = process.env.ZALOPAY_ENDPOINT || "https://sb-openapi.zalopay.vn/v2/create";
const CALLBACK_URL = process.env.ZALOPAY_CALLBACK_URL || "";
const RETURN_URL = process.env.ZALOPAY_RETURN_URL || "http://localhost:3000/profile/orders";

const hmacSha256Hex = (key: string, str: string) =>
  crypto.createHmac("sha256", key).update(str).digest("hex");

export const createZaloPayOrder = async ({ amount, orderId, items = [] }: any) => {
  const now = dayjs();
  const app_time = Date.now();
  const app_trans_id = `${now.format("YYMMDD")}_${orderId}`; // Format: YYMMDD_orderId

  const embed_data = JSON.stringify({
    redirecturl: RETURN_URL,
  });

  const item = JSON.stringify(items || []);
  const app_user = "Customer";
  const description = `Thanh toan don hang ${orderId}`;

  // app_id|app_trans_id|app_user|amount|app_time|embed_data|item
  const rawData = `${APP_ID}|${app_trans_id}|${app_user}|${amount}|${app_time}|${embed_data}|${item}`;
  const mac = hmacSha256Hex(KEY1, rawData);

  const payload = {
    app_id: Number(APP_ID),
    app_trans_id,
    app_user,
    app_time,
    item,
    embed_data,
    amount: Number(amount),
    description,
    bank_code: "", // Allow all
    callback_url: CALLBACK_URL,
    mac,
  };

  try {
    const response = await axios.post(ENDPOINT, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 20000,
    });
    return response.data; // Contains order_url
  } catch (error: any) {
    console.error("ZaloPay API Error:", error.response?.data || error.message);
    throw new Error("Failed to create ZaloPay payment");
  }
};

export const verifyZaloPayCallback = (data: string, requestMac: string) => {
  const calculatedMac = hmacSha256Hex(KEY2, data);
  return calculatedMac === requestMac;
};
