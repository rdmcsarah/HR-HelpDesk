import { Prisma, PrismaClient } from "@prisma/client";
import { time } from "console";
import { NextResponse } from "next/server";
import crypto from "crypto";

function generateHexId() {
  return `SA_${crypto.randomBytes(4).toString("hex").toUpperCase()}`; // Example: SA_3FA4C9D1
}
// import {prisma} from "@/prisma/prisma";
const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title");
    interface RawRequestId {
      id: string;
    }
    // Build the where clause based on query parameters
    const where: any = {};

    const empId = searchParams.get("empId");
    if (empId) {
      where.empId = empId; // Ensure id is a number
    }

    const ring = searchParams.get("ring");
    if (ring !== null && ring === "") {
      // Return all pending requests, regardless of request history
      where.status = "PENDING";
  where.requestHistory = {
    none: {} // Matches only if the array is empty (no entries)
  };
    }

    if (title) {
      where.title = {
        contains: title,
        mode: "insensitive", // for case-insensitive search
      };
    }
    const status = searchParams.get("status");
    if (status) {
      where.status = status as any; // Cast to any since we know it matches RequestStatus
    }

    const id = searchParams.get("id");
    if (id) {
      where.id = String(id); // Ensure id is a number
    }
    const empcode = searchParams.get("empcode");

    if (empcode) {
      where.requestHistory = {
        some: {
          assignedto: empcode,
        },
      };
    }

const assignedId = searchParams.get("assignedId");
if (assignedId) {
    // Get request IDs where the most recent history is assigned to this user
    const rawResults = await prisma.$queryRaw<RawRequestId[]>`
      SELECT rh."requestId" as id
      FROM "Request_History" rh
      WHERE rh.id IN (
        SELECT rh2.id
        FROM "Request_History" rh2
        WHERE rh2."requestId" = rh."requestId"
        ORDER BY rh2."time" DESC
        LIMIT 1
      )
      AND rh."assignedto" = ${assignedId}
    `;

    // Type guard for safety
    if (!Array.isArray(rawResults)) {
      throw new Error('Invalid query result format');
    }

    const requestIds = rawResults.map(r => r.id);

    // Get full request data with most recent history
    const requests = await prisma.req.findMany({
      where: { id: { in: requestIds } },
      include: {
        emp: true,
        requestHistory: {
          orderBy: { time: "desc" },
          take: 1
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return new Response(JSON.stringify(requests), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

  } 


    // const managerId = searchParams.get("managerId");
    // if (managerId) {
    //   const emps = await prisma.emp.findMany({
    //     where: { managerId: managerId },
    //   });

    //   if (emps.length > 0) {
    //     where.requestHistory = {
    //       some: {
    //         assignedto: {
    //           in: emps.map((emp) => emp.employeeId),
    //         },
    //       },
    //     };
    //   }
    // }
    const managerId = searchParams.get("managerId");
    if (managerId) {
      // First get all employees under this manager
      const employees = await prisma.emp.findMany({
        where: { managerId: managerId },
      });

      const employeeIds = employees.map((e: { employeeId: string }) => e.employeeId);

      if (employeeIds.length === 0) {
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      console.log("Employee IDs:", employeeIds);

      const rawResults = await prisma.$queryRaw<RawRequestId[]>`
  SELECT rh."requestId" as id
  FROM "Request_History" rh
  WHERE rh.id IN (
    SELECT rh2.id
    FROM "Request_History" rh2
    WHERE rh2."requestId" = rh."requestId"
    ORDER BY rh2."time" DESC
    LIMIT 1
  )
  AND rh."assignedto" IN (${Prisma.join(employeeIds)})
`;

      // Type guard to ensure proper typing
      const isRawRequestIdArray = (data: unknown): data is RawRequestId[] => {
        return (
          Array.isArray(data) &&
          data.every((item) => typeof item?.id === "string")
        );
      };

      if (!isRawRequestIdArray(rawResults)) {
        throw new Error("Unexpected query result format");
      }

      const requestIds = rawResults.map((r) => r.id);

      const requests = await prisma.req.findMany({
        where: { id: { in: requestIds } },
        include: {
          emp: true,
          requestHistory: {
            orderBy: { time: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return new Response(JSON.stringify(requests), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      console.log("Search Params:", title);

      // If you want to filter by something else instead of age:
      // For example, status or requestType

      const requestType = searchParams.get("requestType");
      if (requestType) {
        where.requestType = requestType as any;
      }

      const assignedId = searchParams.get("assignedId");
      if (assignedId) {
        where.assignedId = assignedId;
      } else if (assignedId === "") {
        where.assignedId = null;

        where.status = "PENDING";
      }
      // // Fetch requests with optional filters
      const requests = await prisma.req.findMany({
        where,

        include: {
          emp: true, // Include related employee data
          // documents: true
          requestHistory: true,
        },
        orderBy: {
          createdAt: "desc", // Sort by newest first
        },
      });

      return new Response(JSON.stringify(requests), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.error("Error fetching requests:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch requests" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const empId = body.empId;

    // Check if employee exists
    const empExists = await prisma.emp.findUnique({
      where: { employeeId: empId },
    });

    if (!empExists) {
      return NextResponse.json(
        {
          error: "User not found",
          details: `No employee with ID **${empId} exists`,
        },
        { status: 404 }
      );
    }

    // Create the request
            const hexId = generateHexId();

    const newRequest = await prisma.req.create({
      data: {
        id: hexId, // Use the generated hex ID
        title: body.title,
        description: body.description,
        status: body.status,
        requestType: body.requestType,
        empId: body.empId,
        documentUrl: body.documentUrl,
        replyDocumentUrl: body.replyDocumentUrl,
        project: body.project, // Add project field
        documentUrlNew:body.documentUrlNew,
        replydocumentUrlNew:body.replydocumentUrlNew
      },
    });
    return NextResponse.json(newRequest, { 
      status: 201,
      headers: {
       "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    });
    // return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("id");
    const currentEmployeeId = searchParams.get("currEmpId");

    if (!requestId) {
      return NextResponse.json(
        {
          error: "Invalid request ID",
          details: "Please provide a valid ID in the query parameters",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log("Update payload:", body);

    const {
      assignedby,
      assignedto,
      reply,
      status,
      counter,
      assignedAt,
      replyDocumentUrl,
      assignedId,
      replydocumentUrlNew
    } = body;

    let updatedData: any = null;

    if (assignedby) {
      const admin = await prisma.emp.findUnique({
        where: { employeeId: assignedby },
      });

      if (!admin) {
        return NextResponse.json(
          { message: "No employee with this ID" },
          { status: 404 }
        );
      }

      if (admin.empType === "SUPER_ADMIN" || admin.empType === "MANAGER") {
        if (assignedto) {
          const assignee = await prisma.emp.findUnique({
            where: { employeeId: assignedto },
          });

          if (assignee?.empType !== "EMPLOYEE") {
            updatedData = {
              requestHistory: {
                create: {
                  assignedby,
                  assignedto,
                  time: new Date(),
                },
              },
              counter,

              assignedAt: new Date(),
            };
          }
        }
      }
    } else if (currentEmployeeId) {
      const assignee = await prisma.emp.findUnique({
        where: { employeeId: currentEmployeeId },
      });

      if (assignee?.empType !== "EMPLOYEE") {
        const reqHistory = await prisma.request_History.findFirst({
          where: {
            assignedto: currentEmployeeId,
          },
        });

        if (!reqHistory) {
          return NextResponse.json(
            { message: "This user is not assigned to this task" },
            { status: 403 }
          );
        }

        updatedData = {
          reply,
          status,
          replyDocumentUrl,
          ...(replydocumentUrlNew !== null && { replydocumentUrlNew }), // Only include if not null          closedAt: new Date(),
        };
      }
    }

    if (!updatedData) {
      return NextResponse.json(
        { message: "No valid update data provided or unauthorized action." },
        { status: 400 }
      );
    }

    const updatedRequest = await prisma.req.update({
      where: { id: String(requestId) },
      data: updatedData,
    });

    return NextResponse.json({
      message: "Request updated successfully",
      data: updatedRequest,
    });
  } catch (error: any) {
    console.error("Error updating request:", error);
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
export const dynamic = 'force-dynamic' // If you need full dynamic behavior
