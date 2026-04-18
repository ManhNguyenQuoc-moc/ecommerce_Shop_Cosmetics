import axios from "axios";
import crypto from "crypto";

// Use environment variables or fallback to official sandbox keys
const PARTNER_CODE = process.env.MOMO_PARTNER_CODE || "MOMODJOL20220706";
const ACCESS_KEY = process.env.MOMO_ACCESS_KEY || "l6vGptHevY676p92";
const SECRET_KEY = process.env.MOMO_SECRET_KEY || "776p92l6vGptHevY676p92l6vGptHevY";
const ENDPOINT = process.env.MOMO_ENDPOINT || "https://test-payment.momo.vn/v2/gateway/api/create";
const RETURN_URL = process.env.MOMO_RETURN_URL || "http://localhost:3000/profile/orders";
const IPN_URL = process.env.MOMO_IPN_URL || "http://localhost:5000/api/payment/momo/ipn";

const createSignature = (raw: string) => {
  console.log("MoMo Raw Signature String:", raw);
  const signature = crypto.createHmac("sha256", SECRET_KEY).update(raw).digest("hex");
  console.log("MoMo Generated Signature:", signature);
  return signature;
};

export const createMomoPaymentUrl = async ({ amount, orderId, orderInfo = "Thanh toan don hang", extraData = "" }: any) => {
  try {
    const requestId = orderId + "_" + Date.now();
    const requestType = "captureWallet";

    // Build raw signature string exactly in alphabetical order:
    // accessKey -> amount -> extraData -> ipnUrl -> orderId -> orderInfo -> partnerCode -> redirectUrl -> requestId -> requestType
    const rawSignature =
      `accessKey=${ACCESS_KEY}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&ipnUrl=${IPN_URL}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&partnerCode=${PARTNER_CODE}` +
      `&redirectUrl=${RETURN_URL}` +
      `&requestId=${requestId}` +
      `&requestType=${requestType}`;

    const signature = createSignature(rawSignature);

    const payload = {
      partnerCode: PARTNER_CODE,
      accessKey: ACCESS_KEY,
      requestId,
      amount: String(amount),
      orderId,
      orderInfo,
      redirectUrl: RETURN_URL,
      ipnUrl: IPN_URL,
      extraData,
      requestType,
      signature,
      lang: "vi",
    };

    const response = await axios.post(ENDPOINT, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
    });

    return response.data; // contains payUrl
  } catch (error: any) {
    if (error?.response?.data) {
        console.error("MOMO API Error Response:", error.response.data);
    } else {
        console.error("MOMO Service Error:", error.message);
    }
    throw new Error("Failed to create MoMo payment");
  }
};

export const verifyMomoSignature = (body: any) => {
  const rawSignature =
    `accessKey=${body.accessKey || ACCESS_KEY}` +
    `&amount=${body.amount || ""}` +
    `&extraData=${body.extraData || ""}` +
    `&message=${body.message || ""}` +
    `&orderId=${body.orderId || ""}` +
    `&orderInfo=${body.orderInfo || ""}` +
    `&orderType=${body.orderType || ""}` +
    `&partnerCode=${body.partnerCode || ""}` +
    `&payType=${body.payType || ""}` +
    `&requestId=${body.requestId || ""}` +
    `&responseTime=${body.responseTime || ""}` +
    `&resultCode=${body.resultCode || ""}`;

  const verifySignature = createSignature(rawSignature);
  return verifySignature === body.signature;
};
