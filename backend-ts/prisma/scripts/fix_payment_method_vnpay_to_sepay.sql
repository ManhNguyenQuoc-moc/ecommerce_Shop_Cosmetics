ALTER TYPE "PaymentMethod"
ADD VALUE
IF NOT EXISTS 'SEPAY';

UPDATE "Order"
SET "payment_method" = 'SEPAY'
WHERE "payment_method"::text = 'VNPAY';
