/*
  Warnings:

  - You are about to drop the `HrAdmin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Request` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RequestAdmin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `employee` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EMPTYPE" AS ENUM ('EMPLOYEE', 'ADMIN', 'SUPER_ADMIN', 'MANAGER');

-- CreateEnum
CREATE TYPE "TypeOfWork" AS ENUM ('MEDICAL_INSURANCE', 'SALARY_CERTIFICATE', 'VACATION_REQUEST', 'HR_LETTTER', 'Debit_Card', 'Payment_Slip', 'Medical_Reimbursement', 'Khazna_Tech', 'HumanPlus_Creation', 'ONBOARDING_PROCESS', 'RESIGNATION_PROCESS', 'CONTRACTS', 'SOCIAL_INSURANCE', 'PUBLIC_MEDICAL_INSURANCE', 'PRIVATE_MEDICAL_INSURANCE', 'LEAVE_REQUEST', 'KELIO_PERMISSIONS', 'OTHER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "RequestType" ADD VALUE 'HR_LETTTER';
ALTER TYPE "RequestType" ADD VALUE 'Debit_Card';
ALTER TYPE "RequestType" ADD VALUE 'Payment_Slip';
ALTER TYPE "RequestType" ADD VALUE 'Medical_Reimbursement';
ALTER TYPE "RequestType" ADD VALUE 'Khazna_Tech';
ALTER TYPE "RequestType" ADD VALUE 'HumanPlus_Creation';
ALTER TYPE "RequestType" ADD VALUE 'ONBOARDING_PROCESS';
ALTER TYPE "RequestType" ADD VALUE 'RESIGNATION_PROCESS';
ALTER TYPE "RequestType" ADD VALUE 'CONTRACTS';
ALTER TYPE "RequestType" ADD VALUE 'SOCIAL_INSURANCE';
ALTER TYPE "RequestType" ADD VALUE 'PUBLIC_MEDICAL_INSURANCE';
ALTER TYPE "RequestType" ADD VALUE 'PRIVATE_MEDICAL_INSURANCE';
ALTER TYPE "RequestType" ADD VALUE 'LEAVE_REQUEST';
ALTER TYPE "RequestType" ADD VALUE 'KELIO_PERMISSIONS';

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_userId_fkey";

-- DropForeignKey
ALTER TABLE "RequestAdmin" DROP CONSTRAINT "RequestAdmin_adminId_fkey";

-- DropForeignKey
ALTER TABLE "RequestAdmin" DROP CONSTRAINT "RequestAdmin_requestId_fkey";

-- DropTable
DROP TABLE "HrAdmin";

-- DropTable
DROP TABLE "Request";

-- DropTable
DROP TABLE "RequestAdmin";

-- DropTable
DROP TABLE "employee";

-- CreateTable
CREATE TABLE "Emp" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "image" TEXT,
    "department" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employeeId" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "managerId" TEXT,
    "empType" "EMPTYPE" NOT NULL,
    "typeOfWork" "TypeOfWork"[]
);

-- CreateTable
CREATE TABLE "Req" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "requestType" "RequestType" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "reply" TEXT,
    "replyDocumentUrl" TEXT,
    "empId" TEXT,
    "adminId" TEXT,
    "assignedId" TEXT,
    "counter" INTEGER,
    "assignedAt" TIMESTAMP(3),
    "documentUrl" TEXT,

    CONSTRAINT "Req_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "department" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employeeId" TEXT NOT NULL,
    "position" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "contentType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request_History" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "assignedby" TEXT NOT NULL,
    "assignedto" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Request_History_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Emp_email_key" ON "Emp"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Emp_employeeId_key" ON "Emp"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeId_key" ON "User"("employeeId");

-- AddForeignKey
ALTER TABLE "Emp" ADD CONSTRAINT "Emp_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Emp"("employeeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Req" ADD CONSTRAINT "Req_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Emp"("employeeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Req" ADD CONSTRAINT "Req_assignedId_fkey" FOREIGN KEY ("assignedId") REFERENCES "Emp"("employeeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Req" ADD CONSTRAINT "Req_empId_fkey" FOREIGN KEY ("empId") REFERENCES "Emp"("employeeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request_History" ADD CONSTRAINT "Request_History_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Req"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request_History" ADD CONSTRAINT "Request_History_assignedby_fkey" FOREIGN KEY ("assignedby") REFERENCES "Emp"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request_History" ADD CONSTRAINT "Request_History_assignedto_fkey" FOREIGN KEY ("assignedto") REFERENCES "Emp"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;
