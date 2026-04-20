-- Replace legacy VNPAY enum value with SEPAY and normalize PaymentMethod enum

DO $
$
BEGIN
    IF EXISTS (SELECT 1
    FROM pg_type
    WHERE typname = 'PaymentMethod_new') THEN
    DROP TYPE "PaymentMethod_new";
END
IF;
END $$;

CREATE TYPE "PaymentMethod_new" AS ENUM
('COD', 'SEPAY', 'MOMO', 'ZALOPAY');

ALTER TABLE "Order"
ALTER COLUMN "payment_method" DROP DEFAULT;

ALTER TABLE "Order"
ALTER COLUMN "payment_method"
TYPE
"PaymentMethod_new"
USING
(
  CASE
    WHEN "payment_method"::text = 'VNPAY' THEN 'SEPAY'
    ELSE "payment_method"::text
END
)::"PaymentMethod_new";

DROP TYPE "PaymentMethod";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";

ALTER TABLE "Order"
ALTER COLUMN "payment_method"
SET
DEFAULT 'COD'::"PaymentMethod";
