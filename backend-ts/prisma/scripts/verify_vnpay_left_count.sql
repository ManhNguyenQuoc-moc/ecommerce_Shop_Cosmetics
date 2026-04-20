SELECT COUNT(*) AS vnpay_rows
FROM "Order"
WHERE "payment_method"::text = 'VNPAY';
