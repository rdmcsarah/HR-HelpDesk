import { PrismaClient } from "@prisma/client";
import { Mail } from "lucide-react";
import { NextResponse } from "next/server";

import nodemailer from "nodemailer"; // To send emails

// Environment variables for email credentials

const prisma = new PrismaClient();

// IMAP server configuration
const IMAP_CONFIG = {
  host: "imap.hostinger.com", // Replace with your IMAP server
  port: 993, // IMAP over SSL port
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER || "", // Replace with your email
    pass: process.env.EMAIL_PASS, // Replace with your password
  },
  greetingTimeout: 30000, // Increase timeout to 30 seconds
};

const transporter = nodemailer.createTransport({
  // service: "gmail",
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your app-specific password or less secure app password
  },
});

// export const POST = async (req: Request) => {
//   try {
//     const { html } = await req.json();
//     const { searchParams } = new URL(req.url);
//     const empId = searchParams.get("employeeId");

//     if (!html) {
//       return new NextResponse(
//         JSON.stringify({ message: "MAIL CONTENT IS REQUIRED" }),
//         { status: 500 }
//       );
//     }
//     // const emailBody = typeof body === 'object' ? JSON.stringify(body) : body;

//     const where: any = {};
//     if (empId) {
//       where.employeeId = empId; // Filter by employee ID if provided
//     }

//     const emp = await prisma.emp.findUnique({
//       where,
//     });

//     const managerId = emp?.managerId;

//     if (managerId) {
//       const manager = await prisma.emp.findFirst({
//         where: {
//           managerId: managerId,
//         },
//       });

//       if (manager) {
//         await transporter.sendMail({
//           from: process.env.EMAIL_USER, // Sender address
//           to: emp.email, // List of recipients
//           cc: manager.email, // CC to manager
//           subject: "HrPortal Task", // Subject line
//           html: html, // use html instead of text
//         });
//       }
//     }
//     if (emp) {
//       await transporter.sendMail({
//         from: process.env.EMAIL_USER, // Sender address

//         subject: "HrPortal Task", // Subject line
//         // text: emailBody, // Plain text body
//         html: html, // use html instead of text
//       });
//     }

//     return new NextResponse(
//       JSON.stringify({ message: "MAIL SENT SUCCESSFULLY" }),
//       { status: 200 }
//     );
//   } catch (e: any) {
//     return new NextResponse(JSON.stringify({ error: e.message }), {
//       status: 500,
//     });
//   }
// };


export const POST = async (req: Request) => {
  try {
    const { html } = await req.json();
    const { searchParams } = new URL(req.url);
    const empId = searchParams.get("employeeId");

    if (!html) {
      return new NextResponse(
        JSON.stringify({ message: "MAIL CONTENT IS REQUIRED" }),
        { status: 400 } // Changed from 500 to 400 (Bad Request)
      );
    }

    if (!empId) {
      return new NextResponse(
        JSON.stringify({ message: "EMPLOYEE ID IS REQUIRED" }),
        { status: 400 }
      );
    }

    const employee = await prisma.emp.findUnique({
      where: { employeeId: empId },
    });

    if (!employee) {
      return new NextResponse(
        JSON.stringify({ message: "EMPLOYEE NOT FOUND" }),
        { status: 404 }
      );
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: employee.email,
      subject: "HrPortal Task",
      html: html,
    };

    // Send email to employee

    // If employee has a manager, send CC to manager
    if (employee.managerId) {
      const manager = await prisma.emp.findUnique({
        where: { employeeId: employee.managerId },
      });

      if (manager) {
        await transporter.sendMail({
          ...mailOptions,
          cc: manager.email,
        });
      }
    }else {
          await transporter.sendMail(mailOptions);

    }

    return new NextResponse(
      JSON.stringify({ message: "MAIL SENT SUCCESSFULLY" }),
      { status: 200 }
    );
  } catch (e: any) {
    console.error("Error sending email:", e); // Added error logging
    return new NextResponse(
      JSON.stringify({ 
        error: e.message,
        message: "FAILED TO SEND EMAIL" 
      }), 
      { status: 500 }
    );
  }
};