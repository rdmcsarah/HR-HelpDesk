import React from "react";
import DataTable from "./table_2";

export default {
  title: "Components/DataTable",
  component: DataTable,
};

const mockAdmins = [
  {
    id: 1,
    name: "Alice Smith",
    email: "alice@company.com",
    department: "HR",
    employeeId: "admin001",
    empType: "ADMIN",
    typeOfWork: ["VACATION_REQUEST", "SALARY_CERTIFICATE"],
  },
  {
    id: 2,
    name: "Bob Manager",
    email: "bob@company.com",
    department: "IT",
    employeeId: "admin002",
    empType: "MANAGER",
    typeOfWork: ["EQUIPMENT", "HR_LETTER"],
  },
  {
    id: 3,
    name: "Super Admin",
    email: "super@company.com",
    department: "Admin",
    employeeId: "admin003",
    empType: "SUPER_ADMIN",
    typeOfWork: ["*"],
  },
];

const mockEmp = mockAdmins[2]; // SUPER_ADMIN
const empcode = "admin003";

const mockData = [
  {
    emp: mockAdmins[0],
    id: 101,
    title: "Vacation Request",
    description: "Annual leave for 2 weeks.",
    requestType: "VACATION_REQUEST",
    status: "COMPLETED",
    createdAt: new Date("2024-06-01"),
    closedAt: new Date("2024-06-10"),
    assignedToId: 1,
    userId: "emp001",
    assignedTo: "Alice Smith",
    reply: "Approved",
    department: "HR",
    employeeId: "emp001",
    empType: "EMPLOYEE",
    project: "Project A",
    counter: 1,
    assignedAt: new Date("2024-06-02"),
    requestHistory: [
      { assignedby: "admin003", assignedto: "admin001", time: new Date("2024-06-02") },
    ],
  },
  {
    emp: mockAdmins[1],
    id: 102,
    title: "Equipment Request",
    description: "Need a new laptop.",
    requestType: "EQUIPMENT",
    status: "PENDING",
    createdAt: new Date("2024-06-05"),
    closedAt: null,
    assignedToId: 2,
    userId: "emp002",
    assignedTo: "Bob Manager",
    reply: "",
    department: "IT",
    employeeId: "emp002",
    empType: "EMPLOYEE",
    project: "Project B",
    counter: 2,
    assignedAt: new Date("2024-06-06"),
    requestHistory: [
      { assignedby: "admin003", assignedto: "admin002", time: new Date("2024-06-06") },
      { assignedby: "admin002", assignedto: "admin001", time: new Date("2024-06-07") },
    ],
  },
];

const inputTitles = [
  "Request",
  "ID",
  "Request Type",
  "Project",
  "Assigned To",
  "Reassigned",
  "Request By",
  "Created At",
  "Assigned At",
  "Status",
  "Closed At",
  "Action",
  "View",
];

export const Default = () => (
  <DataTable
    filter=""
    data={mockData}
    admins={mockAdmins}
    inputTitles={inputTitles}
    empcode={empcode}
    emp={mockEmp}
  />
);
