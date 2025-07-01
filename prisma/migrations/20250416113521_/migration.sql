/*
  Warnings:

  - You are about to drop the column `assignedToId` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_assignedToId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_userId_fkey";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "assignedToId";

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "employee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employeeId" TEXT NOT NULL,
    "position" TEXT NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("employeeId")
);

-- CreateTable
CREATE TABLE "HrAdmin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "employeeId" TEXT NOT NULL,
    "position" TEXT NOT NULL,

    CONSTRAINT "HrAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestAdmin" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "RequestAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employee_email_key" ON "employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employee_employeeId_key" ON "employee"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "HrAdmin_email_key" ON "HrAdmin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "HrAdmin_employeeId_key" ON "HrAdmin"("employeeId");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "employee"("employeeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestAdmin" ADD CONSTRAINT "RequestAdmin_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestAdmin" ADD CONSTRAINT "RequestAdmin_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "HrAdmin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
