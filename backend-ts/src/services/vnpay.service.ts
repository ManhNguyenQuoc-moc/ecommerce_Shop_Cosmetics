import qs from "qs";
import crypto from "crypto";
import moment from "moment";

export const createPaymentUrl = ({ amount, orderId }: any) => {
  const vnp_TmnCode = "YOUR_TMN_CODE";
  const vnp_HashSecret = "YOUR_SECRET";

  const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  const returnUrl = "http://localhost:3000/payment-success";

  const createDate = moment().format("YYYYMMDDHHmmss");

  let vnp_Params: any = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode,
    vnp_Amount: amount * 100,
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
    vnp_ReturnUrl: returnUrl,
    vnp_CreateDate: createDate,
    vnp_Locale: "vn",
  };

  // sort params
  vnp_Params = Object.fromEntries(
    Object.entries(vnp_Params).sort()
  );

  const signData = qs.stringify(vnp_Params, { encode: false });

  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(signData).digest("hex");

  vnp_Params["vnp_SecureHash"] = signed;

  return vnp_Url + "?" + qs.stringify(vnp_Params, { encode: true });
};