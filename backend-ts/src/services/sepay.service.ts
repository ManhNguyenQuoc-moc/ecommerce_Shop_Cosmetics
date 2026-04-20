import crypto from "crypto";
import { SePayPgClient } from "sepay-pg-node";

const SEPAY_ENV = (process.env.SEPAY_ENV || "sandbox") as "sandbox" | "production";
const SEPAY_MERCHANT_CODE = process.env.SEPAY_MERCHANT_CODE || "";
const SEPAY_SECRET_KEY = process.env.SEPAY_SECRET_KEY || "";
const SEPAY_RETURN_URL = process.env.SEPAY_RETURN_URL || "http://localhost:3000/profile/orders";
const SEPAY_CHECKOUT_RETURN_URL = process.env.SEPAY_CHECKOUT_RETURN_URL || "";
const SEPAY_PAYMENT_METHOD =
  (process.env.SEPAY_PAYMENT_METHOD as "BANK_TRANSFER" | "NAPAS_BANK_TRANSFER" | undefined) ||
  "BANK_TRANSFER";
const SEPAY_REQUIRE_SIGNATURE = String(process.env.SEPAY_REQUIRE_SIGNATURE || "false").toLowerCase() === "true";

const assertSepayConfig = () => {
  if (!SEPAY_MERCHANT_CODE) {
    throw new Error("SEPay is not configured. Missing SEPAY_MERCHANT_CODE.");
  }

  if (!SEPAY_SECRET_KEY) {
    throw new Error("SEPay is not configured. Missing SEPAY_SECRET_KEY.");
  }
};

const getSepayClient = () => {
  assertSepayConfig();

  return new SePayPgClient({
    env: SEPAY_ENV,
    merchant_id: SEPAY_MERCHANT_CODE,
    secret_key: SEPAY_SECRET_KEY,
  });
};

export const createSepayCheckoutPayload = ({
  amount,
  orderId,
}: {
  amount: number;
  orderId: string;
}) => {
  const client = getSepayClient();
  const normalizedAmount = Math.max(0, Math.round(Number(amount) || 0));

  const fallbackCheckoutReturnUrl = (() => {
    try {
      const successUrl = new URL(SEPAY_RETURN_URL);
      return `${successUrl.origin}/checkout`;
    } catch {
      return "http://localhost:3000/checkout";
    }
  })();

  const checkoutReturnUrl = SEPAY_CHECKOUT_RETURN_URL || fallbackCheckoutReturnUrl;

  const checkoutUrl = client.checkout.initCheckoutUrl();
  const checkoutFields = client.checkout.initOneTimePaymentFields({
    operation: "PURCHASE",
    payment_method: SEPAY_PAYMENT_METHOD,
    order_invoice_number: orderId,
    order_amount: normalizedAmount,
    currency: "VND",
    order_description: `Thanh toan don hang ${orderId}`,
    success_url: `${SEPAY_RETURN_URL}?orderId=${encodeURIComponent(orderId)}&payment_status=SUCCESS`,
    error_url: `${checkoutReturnUrl}?orderId=${encodeURIComponent(orderId)}&payment_status=FAILED`,
    cancel_url: `${checkoutReturnUrl}?orderId=${encodeURIComponent(orderId)}&payment_status=CANCELLED`,
    custom_data: JSON.stringify({ orderId }),
  });

  return {
    checkoutUrl,
    checkoutFields,
  };
};

export const verifySepaySignature = (payload: Record<string, any>, headers?: Record<string, any>) => {
  const headerSignatureValue =
    headers?.["x-sepay-signature"] ||
    headers?.["x-signature"] ||
    headers?.["signature"] ||
    headers?.["x-sepay-sign"] ||
    "";

  const headerSignature = Array.isArray(headerSignatureValue)
    ? String(headerSignatureValue[0] || "")
    : String(headerSignatureValue || "");

  const receivedSignature = String(payload.signature || payload.sign || payload.mac || headerSignature || "");
  if (!receivedSignature) {
    return !SEPAY_REQUIRE_SIGNATURE;
  }

  if (!SEPAY_SECRET_KEY) {
    return !SEPAY_REQUIRE_SIGNATURE;
  }

  try {
    const client = getSepayClient();
    const normalizedFields: Record<string, any> = {
      ...payload,
      merchant: payload.merchant || SEPAY_MERCHANT_CODE,
      order_invoice_number:
        payload.order_invoice_number ||
        payload.orderId ||
        payload.order_id ||
        payload.reference ||
        payload.ref,
      order_amount: payload.order_amount || payload.amount || payload.total_amount || payload.value,
    };

    // SDK signature algorithm (HMAC SHA256 base64 over whitelisted fields)
    const expectedSdkSignature = client.checkout.signFields(normalizedFields);
    if (expectedSdkSignature === receivedSignature) {
      return true;
    }

    // Backward-compatible fallback for old custom integration format
    const amount = String(normalizedFields.order_amount || "");
    const orderId = String(normalizedFields.order_invoice_number || "");
    if (!amount || !orderId) return false;

    const signData = `amount=${amount}&orderId=${orderId}`;
    const expectedLegacySignature = crypto
      .createHmac("sha256", SEPAY_SECRET_KEY)
      .update(signData)
      .digest("hex");

    return expectedLegacySignature === receivedSignature;
  } catch {
    return false;
  }
};
