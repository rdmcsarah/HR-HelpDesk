import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// export async function POST(request: Request) {
//   try {
//     // Step 1: Get the user data from the external API (v2 format)
//     const res = await request.json();
//     console.log("Received user data from API:", res);

//     if (!res.username) {
//       return NextResponse.json(
//         { error: "Invalid user data format - expected v2 format with user object" },
//         { status: 400 }
//       );
//     }
//   // 3. Make the API call

//     const { username } = await res.json();
//     const apiResponse = await fetch("https://rdmc-portal.com/api/user", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ username }),
//     });

//     if (!apiResponse.ok) {
//       const errorData = await apiResponse.json();
//       console.error("API Error:", errorData);
//       return NextResponse.json(
//         { 
//           message: errorData.message || "Failed to fetch user data",
//           details: errorData 
//         },
//         { status: apiResponse.status }
//       );
//     }

//     const responseData = await apiResponse.json();

//     // Step 2: Transform v2 format to your v1 schema
//     const user = responseData.user;
//     const employeeData = {
//       name: user.displayName,
//       email: user.customClaims?.businessEmail ,
//       phone: user.customClaims?.businessPhone || null,
//       image: "", // Default empty
//       department: "", // Can be updated later
//       employeeId: user.uid || user.customClaims?.employeeCode,
//       position: "", // Can be updated later
//       empType: res.type, // Default to regular user
//       managerId: "", // Default empty
//       typeOfWork: [] // Default empty array
//     };

//     console.log("Transformed employee data:", employeeData);

//     // Step 3: Create the employee in your database
//     const newEmployee = await prisma.emp.create({
//       data: employeeData
//     });

//     return NextResponse.json(newEmployee, { status: 201 });

//   } catch (error) {
//     console.error("Error processing employee creation:", error);
//     return NextResponse.json(
//       { 
//         error: "Failed to create employee",
//         details: error instanceof Error ? error.message : String(error)
//       },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: Request) {
  try {
    // Step 1: Parse incoming request
    const res = await request.json();
    console.log("Received user data from API:", res);

    if (!res.username) {
      return NextResponse.json(
        { error: "Invalid user data format - expected v2 format with user object" },
        { status: 400 }
      );
    }

    const { username } = res;

    // Step 2: Fetch external user data
    const apiResponse = await fetch("https://rdmc-portal.com/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error("API Error:", errorData);
      return NextResponse.json(
        { 
          message: errorData.message || "Failed to fetch user data",
          details: errorData 
        },
        { status: apiResponse.status }
      );
    }

    const responseData = await apiResponse.json();
    const user = responseData.user;

    const employeeData = {
      name: user.displayName,
      email: user.customClaims?.businessEmail,
      phone: user.customClaims?.businessPhone || null,
      image: "",
      department: "",
      employeeId: user.uid || user.customClaims?.employeeCode,
      position: "",
      empType: res.type,
      managerId: null,
      typeOfWork: []
    };

    console.log("Transformed employee data:", employeeData);

    const newEmployee = await prisma.emp.create({
      data: employeeData
    });

    return NextResponse.json(newEmployee, { status: 201 });

  } catch (error) {
    console.error("Error processing employee creation:", error);
    return NextResponse.json(
      { 
        error: "Failed to create employee",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
