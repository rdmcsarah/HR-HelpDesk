// import React from "react";
// import { Meta, StoryObj } from "@storybook/react";
// import DataTable from "@/components/table_2";
// import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

// const mockAppRouter = {
//   push: () => {},
//   replace: () => {},
//   refresh: () => {},
//   back: () => {},
//   forward: () => {},
//   prefetch: () => Promise.resolve(),
// };

// export default {
//   title: "AdminPanel/DataTable",
//   component: DataTable,
//   decorators: [
//     (Story) => (
//       <AppRouterContext.Provider value={mockAppRouter}>
//         <Story />
//       </AppRouterContext.Provider>
//     ),
//   ],
// } as Meta<typeof DataTable>;

// const mockEmp = {
//   id: 1,
//   name: "Jane Doe",
//   email: "jane.doe@example.com",
//   department: "Engineering",
//   employeeId: "EMP123",
//   empType: "ADMIN",
//   typeOfWork: ["Support", "Development"],
// };

// const mockRequests = [
//   {
//     emp: mockEmp,
//     id: 101,
//     title: "Fix Laptop",
//     description: "The laptop won't turn on",
//     requestType: "RESIGNATION_PROCESS",
//     status: "PENDING",
//     createdAt: new Date(),
//     closedAt: new Date(),
//     assignedToId: 2,
//     userId: "EMP124",
//     assignedTo: "John Manager",
//     reply: "Working on it",
//     name: "Alice Smith",
//     email: "alice.smith@example.com",
//     department: "Support",
//     employeeId: "EMP124",
//     empType: "EMPLOYEE",
//     project: "L3",
//     counter: 2,
//     assignedAt: new Date(),
//     requestHistory: [
//       {
//         assignedby: "Admin User",
//         assignedto: "John Manager",
//         time: new Date(),
//       },
//     ],
//   },
//   {
//     id: 102,
//     title: "sw",
//     description: "dw",
//     requestType: "RESIGNATION_PROCESS",
//     status: "COMPLETED",
//     createdAt: new Date("2025-06-23T06:59:43.237Z"),
//     closedAt: new Date("2025-06-23T07:02:40.889Z"),
//     reply: "dw",
//     project: "LRT",
//     replyDocumentUrl: "https://mclvincsfhqydbsx.public.blob.vercel-storage.com/admin/RDMC991/RDMC111/Screenshot%20%2810%29.png",
//     empId: "RDMC111",
//     adminId: null,
//     assignedId: null,
//     assignedToId: null,
//     assignedTo: "",
//     userId: "",
//     department: "",
//     employeeId: "",
//     empType: "",
//     counter: 1,
//     assignedAt: new Date("2025-06-23T07:00:33.583Z"),
//     documentUrl: "https://mclvincsfhqydbsx.public.blob.vercel-storage.com/RDMC111/Screenshot%20%282%29.png",
//     emp: {
//       id: 17,
//       name: "Sarah Mahmoud",
//       email: "sarah.mahmoudd24@gmail.com",
//       phone: null,
//       image: "edrr",
//       department: "IT",
//       createdAt: new Date("2025-06-19T08:01:08.226Z"),
//       employeeId: "RDMC111",
//       position: "FullStack Developer",
//       project: null,
//       managerId: null,
//       empType: "EMPLOYEE",
//       typeOfWork: [],
//     },
//     requestHistory: [],
//   },
// ];

// const mockAdmins = [mockEmp];

// const inputTitles = [
//   "title",
//   "description",
//   "requestType",
//   "status",
//   "createdAt",
//   "employee.name",
//   "employee.department",
//   "employee.email",
//   "assignedTo",
//   "reply",
// ];

// export const Default: StoryObj<typeof DataTable> = {
//   args: {
//     data: mockRequests,
//     admins: mockAdmins,
//     inputTitles,
//     empcode: "EMP123",
//     emp: mockEmp,
//   },
// };
