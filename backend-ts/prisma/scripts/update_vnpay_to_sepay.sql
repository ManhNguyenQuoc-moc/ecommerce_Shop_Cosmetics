UPDATE "Order"
SET "payment_method" = 'SEPAY'
WHERE "payment_method"::text = 'VNPAY';
