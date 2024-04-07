-- CreateTable
CREATE TABLE "FinanceSettings" (
    "id" TEXT NOT NULL DEFAULT 'Finance_Settings',
    "tax" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "FinanceSettings_pkey" PRIMARY KEY ("id")
);
