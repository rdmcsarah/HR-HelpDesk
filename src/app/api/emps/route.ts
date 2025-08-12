import { PrismaClient } from "@prisma/client";
import { Phone } from "lucide-react";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    // Build the where clause based on query parameters
    const where: any = {};

    if (name) {
      where.name = {
        contains: name,
        mode: "insensitive", // for case-insensitive search
      };
    }
    console.log("Search Params:", name);

    // If you want to filter by something else instead of age:
    // For example, status or requestType
    const email = searchParams.get("email");
    if (email) {
      where.email = email as any; // Cast to any since we know it matches Requestemail
    }

    const empId = searchParams.get("employeeId");
    if (empId) {
      where.employeeId = empId as any;
    }

    const position = searchParams.get("position");
    if (position) {
      where.position = position as any;
    }
    const department = searchParams.get("department");
    if (department) {
      where.department = department as any;
    }

    const managerId = searchParams.get("managerId");
    if (managerId) {
      where.managerId = managerId as any;
    }

    const empType = searchParams.get("empType");
    const excludeEmpType = searchParams.get("excludeEmpType");

    if (empType) {
      where.empType = empType as any;
    } else if (excludeEmpType) {
      where.empType = { not: excludeEmpType };
    }

    // // Fetch requests with optional filters
    const employees = await prisma.emp.findMany({
      where,

      include: {
        Emp: true,
      },
      orderBy: {
        createdAt: "desc", // Sort by newest first
      },
    });

    return new Response(JSON.stringify(employees), {
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

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     console.log("Request Body:", body);

//     const newRequest = await prisma.emp.create({
//       data: {
//         name: body.name,
//         email: body.email,
//         image: body.image,
//         department: body.department,
//         employeeId: body.employeeId,
//         position: body.position,
//         empType: body.empType,
//         managerId: body.managerId,
//       },
//     });

//     return new Response(JSON.stringify(newRequest), {
//       status: 201,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (error) {
//     console.error("Error creating request:", error);
//     return new Response(JSON.stringify({ error: "Failed to create request" }), {
//       status: 500,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   }
// }

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Request Body:", body);

    // Check if the input is an array
    if (!Array.isArray(body)) {
      return new Response(JSON.stringify({ error: "Expected an array of employees" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Create multiple employees at once
    const newEmployees = await prisma.$transaction(
      body.map((employee) =>
        prisma.emp.createMany({
          data: {
            name: employee.name,
            email: employee.email,
            image: employee.image,
            department: employee.department,
            employeeId: employee.employeeId,
            position: employee.position,
            empType: employee.empType,
            managerId: employee.managerId,
            typeOfWork: employee.typeOfWork,
          },
        })
      )
    );

    return new Response(JSON.stringify(newEmployees), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating employees:", error);
    return new Response(JSON.stringify({ error: "Failed to create employees" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

// export async function PUT(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const empId = await searchParams.get("employeeId");

//     if (!empId) {
//       return new Response(
//         JSON.stringify({
//           error: "Invalid request ID",
//         }),
//         { status: 400 }
//       );
//     }

//     // 3. Parse and validate request body
//     const body = await request.json();
//     console.log("Update payload:", body);

//     const { name, email, image, department, position, managerId ,typeOfWork} = body;

//     // 4. Verify the request exists
//     const existingRequest = await prisma.emp.findUnique({
//       where: { employeeId: empId },
//     });

//     if (!existingRequest) {
//       return new Response(
//         JSON.stringify({
//           error: "Request not found",
//           details: `No employee with ID ${empId} exists`,
//         }),
//         { status: 404 }
//       );
//     }

//     // 7. Prepare update data
//     const updateData: any = {
//       ...(name && { name }),
//       ...(email && { email }),
//       ...(image && { image }),
//       ...(department && { department }),
//       ...(position && { position }),
//       ...(managerId && { managerId }),
//       ...(typeOfWork && { typeOfWork: body.typeOfWork }),
//     };

//     // 9. Perform update
//     const updatedRequest = await prisma.emp.update({
//       where: { employeeId: empId },
//       data: updateData,
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
//   }
// }


export async function PUT(request: Request) {
  try {
    // Parse request body - now expecting an array of employee updates
    const body = await request.json();
    
    console.log("Update payload:", body);

    // Validate that we received an array
    if (!Array.isArray(body)) {
      return new Response(
        JSON.stringify({
          error: "Invalid request format",
          details: "Expected an array of employee updates",
        }),
        { status: 400 }
      );
    }

    // Validate each employee update in the array
    for (const update of body) {
      if (!update.employeeId) {
        return new Response(
          JSON.stringify({
            error: "Invalid request",
            details: "Each employee update must include an employeeId",
          }),
          { status: 400 }
        );
      }

      // Verify the employee exists
      const existingEmployee = await prisma.emp.findUnique({
        where: { employeeId: update.employeeId },
      });

      if (!existingEmployee) {
        return new Response(
          JSON.stringify({
            error: "Employee not found",
            details: `No employee with ID ${update.employeeId} exists`,
          }),
          { status: 404 }
        );
      }
    }

    // Process all updates in a transaction
    const updateResults = await prisma.$transaction(
      body.map((update) => {
        const { employeeId, name,phone, email, image, department, position, managerId, typeOfWork,empType } = update;

        // Prepare update data for this employee
        const updateData: any = {
          ...(name && { name }),
          ...(email && { email }),
          ...(image && { image }),
          ...(employeeId && { employeeId }), // Ensure employeeId is included for identification
          ...(department && { department }),
          ...(position && { position }),
          ...(managerId && { managerId }),
          ...(empType && {empType}),
          // ...(typeOfWork && { typeOfWork }),
            ...(typeOfWork && typeOfWork.length > 0 && { typeOfWork }),
              ...(phone && { phone })  // 👈 Add this only if `phone` is a valid string


        };

        return prisma.emp.update({
          where: { employeeId },
          data: updateData,
        });
      })
    );

    return new Response(JSON.stringify(updateResults), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PUT error:", error);
    return new Response(
      JSON.stringify({
        error: "Bulk update failed",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // 1. Get request ID from URL
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("id");

    if (!requestId ) {
      return new Response(
        JSON.stringify({
          error: "Invalid request ID",
          details: "Please provide a numeric ID in the query parameters",
        }),
        { status: 400 }
      );
    }

    // 2. Verify the request exists
    const existingRequest = await prisma.emp.findUnique({
      where: { employeeId: requestId },
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

    // 3. Perform deletion
    await prisma.emp.delete({
      where: { employeeId: requestId },
    });

    return new Response(null, { status: 204 }); // No content for successful deletion
  } catch (error) {
    console.error("DELETE error:", error);
    return new Response(
      JSON.stringify({
        error: "Request deletion failed",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
}
export const dynamic = 'force-dynamic' // If you need full dynamic behavior
