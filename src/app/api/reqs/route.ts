import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title");

    // Build the where clause based on query parameters
    const where: any = {};

    const empId = searchParams.get("empId");
    if (empId) {
      where.empId = empId; // Ensure id is a number
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
    } else if(assignedId === "") {
      where.assignedId = null;

      where.status = "PENDING";
    }
    // // Fetch requests with optional filters
    const requests = await prisma.req.findMany({
      where,
      include: {
        emp: true, // Include related employee data
        // documents: true
        
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
          details: `No employee with ID ${empId} exists`,
        },
        { status: 404 }
      );
    }
    
    // Create the request
    const newRequest = await prisma.req.create({
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        requestType: body.requestType,
        empId: body.empId,
        documentUrl: body.documentUrl,
        replyDocumentUrl: body.replyDocumentUrl,
      },
    });

    return NextResponse.json(newRequest, { status: 201 });

  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
//   export async function DELETE(request: Request) {
//     try {
//       // 1. Get request ID from URL
//       const { searchParams } = new URL(request.url);
//       const requestId = searchParams.get("id");

//       if (!requestId || isNaN(Number(requestId))) {
//         return new Response(JSON.stringify({
//           error: 'Invalid request ID',
//           details: 'Please provide a numeric ID in the query parameters'
//         }), { status: 400 });
//       }

//       // 2. Verify the request exists
//       const existingRequest = await prisma.request.findUnique({
//         where: { id: Number(requestId) }
//       });

//       if (!existingRequest) {
//         return new Response(JSON.stringify({
//           error: 'Request not found',
//           details: `No request with ID ${requestId} exists`
//         }), { status: 404 });
//       }

//       // 3. Perform deletion
//       await prisma.request.delete({
//         where: { id: Number(requestId) }
//       });

//       return new Response(null, { status: 204 }); // No content for successful deletion

//     } catch (error) {
//       console.error('DELETE error:', error);
//       return new Response(JSON.stringify({
//         error: 'Request deletion failed',
//         details: error instanceof Error ? error.message : 'Unknown error'
//       }), { status: 500 });
//     }
//   }
 // try {
  //   const formData = await request.formData();
  //   const file = formData.get('reqDocument') as File | null;
    
  //   let reqDocumentUint8Array = null;
  //   if (file) {
  //     const buffer = await file.arrayBuffer();
  //     reqDocumentUint8Array = new Uint8Array(buffer);
  //   }

  //   const title = formData.get('title') as string;
  //   const description = formData.get('description') as string;
  //   const requestType = formData.get('requestType') as RequestType;
  //   const empId = formData.get('empId') as string;

  //   if (!title || !description || !requestType || !empId) {
  //     return NextResponse.json(
  //       { error: 'Missing required fields' },
  //       { status: 400 }
  //     );
  //   }

  //   const createdRequest = await prisma.req.create({
  //     data: {
  //       title,
  //       description,
  //       requestType,
  //       reqDocument: reqDocumentUint8Array ? Buffer.from(reqDocumentUint8Array).toString('base64') : null,
  //       status: 'PENDING',
  //       empId,
  //       createdAt: new Date(),
  //     },
  //   });

  //   return NextResponse.json(createdRequest);
  // } 


export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("id");

    if (!requestId) {
      return new Response(
        JSON.stringify({
          error: "Invalid request ID",
          details: "Please provide a numeric ID in the query parameters",
        }),
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    console.log("Update payload:", body);

    const { assignedId, reply, status, adminId ,counter,assignedAt,replyDocumentUrl} = body;

    // Verify the request exists
    const existingRequest = await prisma.req.findUnique({
      where: { id: String(requestId) },
    });

    if (!existingRequest) {
      return new Response(
        JSON.stringify({
          error: "Request not found",
          details: `No request with ID ${requestId} exists`,
        }),
        { status: 404 }
      );
    }

    if (adminId) {
      const admin = await prisma.emp.findUnique({
        where: { employeeId: adminId },
      });

      if (!admin) {
        return new Response(
          JSON.stringify({
            error: "Admin not found",
            details: `No employee with ID ${adminId} exists`,
          }),
          { status: 404 }
        );
      }

      if (admin.empType === "SUPER_ADMIN") {
        // SUPER_ADMIN can assign, reply, and update status
        if (assignedId) {
          const assignee = await prisma.emp.findUnique({
            where: { employeeId: assignedId },
          });

          if (!assignee || (assignee.empType !== "ADMIN" && assignee.empType !== "SUPER_ADMIN")) {
            return new Response(
              JSON.stringify({
                error: "Invalid assignment",
                details: "Can only assign to ADMIN employees",
              }),
              { status: 400 }
            );
          }
        }
      }
    } else if (
      existingRequest.assignedId !== null &&
      existingRequest.assignedId === assignedId
    ) {
      if (assignedId) {
        const admin = await prisma.emp.findUnique({
          where: { employeeId: assignedId },
        });
      }
    } else {
      // Regular employees can't update requests
      return new Response(
        JSON.stringify({
          error: "Permission denied",
          details: "Only ADMIN or SUPER_ADMIN can update requests",
        }),
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData: any = {
      ...(status && { status: status.toUpperCase() }),
      ...(reply && { reply }),
      ...(counter && { counter }),
      ...(adminId && { adminId }),
      ...(assignedAt && { assignedAt: new Date(assignedAt) }),
      ...(assignedId && { assignedId: assignedId }),
      ...(replyDocumentUrl && { replyDocumentUrl }),
      // adminId, // Track which admin made the update
      closedAt:
        status?.toUpperCase() === "COMPLETED"|| status?.toUpperCase() === "REJECTED"
          ? new Date()
          : existingRequest.closedAt,
    };

    // Perform update
    const updatedRequest = await prisma.req.update({
      where: { id: String(requestId) },
      data: updateData,
      // include: {
      //   emp: true,
      //   assigned: true,
      //   admin: true
      // }
    });

    return new Response(JSON.stringify(updatedRequest), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PUT error:", error);
    return new Response(
      JSON.stringify({
        error: "Request update failed",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Ensure connection is closed
  }
}


// export async function PUT(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const requestId = searchParams.get("id");

//     if (!requestId) {
//       return new Response(
//         JSON.stringify({
//           error: "Invalid request ID",
//           details: "Please provide a numeric ID in the query parameters",
//         }),
//         { status: 400 }
//       );
//     }

//     // Parse and validate request body
//     const body = await request.json();
//     console.log("Update payload:", body);

//     const { assignedId, reply, status, adminId, counter, assignedAt, replyDocumentUrl, requestHistory } = body;

//     // Verify the request exists
//     const existingRequest = await prisma.req.findUnique({
//       where: { id: String(requestId) },
//     });

//     if (!existingRequest) {
//       return new Response(
//         JSON.stringify({
//           error: "Request not found",
//           details: `No request with ID ${requestId} exists`,
//         }),
//         { status: 404 }
//       );
//     }

//     // Permission checks
//     if (adminId) {
//       const admin = await prisma.emp.findUnique({
//         where: { employeeId: adminId },
//       });

//       if (!admin) {
//         return new Response(
//           JSON.stringify({
//             error: "Admin not found",
//             details: `No employee with ID ${adminId} exists`,
//           }),
//           { status: 404 }
//         );
//       }

//       if (admin.empType === "SUPER_ADMIN" || admin.empType === "MANAGER") {
//         if (assignedId) {
//           const assignee = await prisma.emp.findUnique({
//             where: { employeeId: assignedId },
//           });

//           if (!assignee || (assignee.empType !== "ADMIN" && assignee.empType !== "SUPER_ADMIN" && assignee.empType !== "MANAGER")) {
//             return new Response(
//               JSON.stringify({
//                 error: "Invalid assignment",
//                 details: "Can only assign to ADMIN employees",
//               }),
//               { status: 400 }
//             );
//           }
//         }
//       }
//     } else if (
//       existingRequest.assignedId !== null &&
//       existingRequest.assignedId === assignedId
//     ) {
//       if (assignedId) {
//         const admin = await prisma.emp.findUnique({
//           where: { employeeId: assignedId },
//         });
//       }
//     } else {
//       return new Response(
//         JSON.stringify({
//           error: "Permission denied",
//           details: "Only ADMIN or SUPER_ADMIN can update requests",
//         }),
//         { status: 403 }
//       );
//     }

//     // Prepare update data
//     const updateData: {
//       status?: string;
//       reply?: string;
//       counter?: number;
//       adminId?: string;
//       assignedAt?: Date;
//       assignedId?: string;
//       replyDocumentUrl?: string;
//       requestHistory?: { create: Array<{
//         requestId: string;
//         assignedby: string;
//         assignedto: string;
//         time: Date;
//       }> };
//       closedAt?: Date | null;
//     } = {
//       ...(status && { status: status.toUpperCase() }),
//       ...(reply && { reply }),
//       ...(counter && { counter }),
//       ...(adminId && { adminId }),
//       ...(assignedAt && { assignedAt: new Date(assignedAt) }),
//       ...(assignedId && { assignedId }),
//       ...(replyDocumentUrl && { replyDocumentUrl }),
//       closedAt: status?.toUpperCase() === "COMPLETED" ? new Date() : existingRequest.closedAt,
//     };

//     // Handle request history
//     if (requestHistory && Array.isArray(requestHistory)) {
//       updateData.requestHistory = {
//         create: [
//           ...requestHistory.map(item => ({
//             requestId: item.requestId,
//             assignedby: item.assignedby,
//             assignedto: item.assignedto,
//             time: new Date()
//           })),
//           {
//             requestId: existingRequest.id,
//             assignedby: adminId,
//             assignedto: assignedId,
//             time: new Date()
//           }
//         ]
//       };
//     }

//     // Perform update
//     // Remove undefined values from updateData
//     const sanitizedUpdateData = Object.fromEntries(
//       Object.entries(updateData).filter(([_, value]) => value !== undefined)
//     );

//     const updatedRequest = await prisma.req.update({
//       where: { id: String(requestId) },
//       data: sanitizedUpdateData,
//       include: {
//         requestHistory: true,
//       }
//     });

//     return new Response(JSON.stringify(updatedRequest), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });

//   } catch (error) {
//     console.error("PUT error:", error);
//     return new Response(
//       JSON.stringify({
//         error: "Request update failed",
//         details: error instanceof Error ? error.message : "Unknown error",
//       }),
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }



// export async function PUT(request:Request){


//   try{

//     const {searchParams} = new URL(request.url);
//     const requestId = searchParams.get("id");
//     if(!requestId){
//       return new Response(JSON.stringify({
//         error: "Invalid request ID",
//         details: "Please provide a numeric ID in the query parameters",
//       }),{status:400});
//     }
//     const body = await request.json();

//     console.log("Update payload:", body);
//     const { assignedby, assignedto,reply, status, counter, assignedAt, replyDocumentUrl ,empId} = body;


    
//   }

// }

export const dynamic = 'force-dynamic' // If you need full dynamic behavior
