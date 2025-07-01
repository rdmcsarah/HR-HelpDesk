import React from "react";
import DataTableDemo, { schema } from "./table_1";
import { z } from "zod";

export default {
  title: "Components/DataTableDemo",
  component: DataTableDemo,
};

const mockData: z.infer<typeof schema>[] = [
  {
    id: 1,
    title: "Vacation Request",
    description: "Requesting annual leave for 2 weeks.",
    requestType: "Vacation",
    status: "COMPLETED",
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date("2024-06-02"),
    closedAt: new Date("2024-06-10"),
    comments: ["Approved by manager"],
    assignedToId: 101,
    userId: "emp001",
    assignedTo: "Manager A",
  },
  {
    id: 2,
    title: "Equipment Request",
    description: "Need a new laptop for remote work.",
    requestType: "Equipment",
    status: "PENDING",
    createdAt: new Date("2024-06-05"),
    updatedAt: new Date("2024-06-06"),
    closedAt: new Date("2024-06-15"),
    comments: ["Waiting for IT approval"],
    assignedToId: 102,
    userId: "emp002",
    assignedTo: "IT Dept",
  },
  {
    id: 3,
    title: "Expense Reimbursement",
    description: "Reimbursement for travel expenses.",
    requestType: "Expense",
    status: "REJECTED",
    createdAt: new Date("2024-06-10"),
    updatedAt: new Date("2024-06-11"),
    closedAt: new Date("2024-06-12"),
    comments: ["Missing receipts"],
    assignedToId: 103,
    userId: "emp003",
    assignedTo: "Finance",
  },
];

const inputTitles = ["Request", "ID", "Request Type", "Status", "Created At", "Closed At", "MyRequest"];
const empcode = "emp001";

export const Default = () => (
  <DataTableDemo data={mockData} inputTitles={inputTitles} empcode={empcode} />
);
