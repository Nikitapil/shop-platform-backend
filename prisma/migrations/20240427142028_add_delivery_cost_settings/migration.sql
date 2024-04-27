-- AlterTable
ALTER TABLE "FinanceSettings" ADD COLUMN     "deliveryCost" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "orderPriceWithFreeDelivery" INTEGER NOT NULL DEFAULT 0;
