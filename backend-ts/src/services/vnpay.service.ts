import qs from "qs";
import crypto from "crypto";
import moment from "moment";

const VNP_TMN_CODE = process.env.VNP_TMN_CODE || "";
const VNP_HASH_SECRET = process.env.VNP_HASH_SECRET || "";
const VNP_URL = process.env.VNP_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const VNP_RETURN_URL = process.env.VNP_RETURN_URL || "http://localhost:3000/profile/orders";

/**
 * VNPay Standard Encoding for version 2.1.0
 * Sorts keys and encodes values (spaces converted to +)
 */
function sortObject(obj: any) {
  const sorted: any = {};
  const str: any = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

export const createVnpayUrl = ({ amount, orderId, ipAddr = "127.0.0.1" }: any) => {
  const date = new Date();
  const createDate = moment(date).format("YYYYMMDDHHmmss");

  let vnp_Params: any = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: VNP_TMN_CODE,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: "Thanh toan don hang " + orderId,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: VNP_RETURN_URL,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  const sortedParams = sortObject(vnp_Params);
  const signData = qs.stringify(sortedParams, { encode: false });

  const hmac = crypto.createHmac("sha512", VNP_HASH_SECRET);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  sortedParams["vnp_SecureHash"] = signed;

  return VNP_URL + "?" + qs.stringify(sortedParams, { encode: false });
};

export const verifyVnpaySignature = (query: any) => {
  const vnp_Params = { ...query };
  const secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  const sortedParams = sortObject(vnp_Params);
  const signData = qs.stringify(sortedParams, { encode: false });

  const hmac = crypto.createHmac("sha512", VNP_HASH_SECRET);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  return secureHash === signed;
};