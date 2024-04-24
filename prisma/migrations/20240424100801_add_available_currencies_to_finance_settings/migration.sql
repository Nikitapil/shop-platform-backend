-- AlterTable
ALTER TABLE "FinanceSettings" ADD COLUMN     "availableCurrencies" TEXT[] DEFAULT ARRAY['USD']::TEXT[];
