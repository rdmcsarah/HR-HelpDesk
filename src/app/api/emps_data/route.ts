
import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
const prisma = new PrismaClient();

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     console.log("Request Body:", body);

//     // Check if the input is an array
//     if (!Array.isArray(body)) {
//       return new Response(JSON.stringify({ error: "Expected an array of employees" }), {
//         status: 400,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//     }

//     // Transform Excel data to match your database schema
//     const transformedEmployees = body.map((excelEmployee) => {
//       // Combine Last Name + First Name for the name field
//       const fullName = `${excelEmployee['Last Name'] || ''} ${excelEmployee['First Name'] || ''}`.trim();
      
//       return {
//         name: fullName || null,
//         email: excelEmployee['Email'] || null,
//         phone: null, // Not in Excel, set to null
//         image: null, // Not in Excel, set to null
//         department: excelEmployee['AR Department'] || null,
//         employeeId: excelEmployee['Employee Code'] || null,
//         position: excelEmployee['Position'] || null,
//         empType: "EMPLOYEE", // Default value
//         managerId: null, // Not in Excel, set to null
//         typeOfWork: [], // Default empty array
//         project: null, // Not in Excel, set to null
//       };
//     });

//     // Create multiple employees at once
//     const newEmployees = await prisma.$transaction(
//       transformedEmployees.map((employee) =>
//         prisma.emp.create({
//           data: employee,
//         })
//       )
//     );

//     return new Response(JSON.stringify(newEmployees), {
//       status: 201,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (error) {
//     console.error("Error creating employees:", error);
//     return new Response(JSON.stringify({ error: "Failed to create employees" }), {
//       status: 500,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   }
// }




// export async function POST(request: Request) {
//   try {
//     // 1. Get the file from FormData
//     const formData = await request.formData();
//     const file = formData.get('file') as File | null;

//     if (!file) {
//       return NextResponse.json(
//         { error: "No file uploaded" },
//         { status: 400 }
//       );
//     }

//     // 2. Read the Excel file
//     const buffer = await file.arrayBuffer();
//     const workbook = XLSX.read(buffer);
//     const firstSheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[firstSheetName];

//     // 3. Convert to JSON (assuming first row is headers)
//     const excelData = XLSX.utils.sheet_to_json(worksheet);

//     // 4. Take first 3 records and transform
//     const transformedEmployees = excelData.slice(0, 3).map((row: any) => ({
//       name: `${row['Last Name'] || ''} ${row['First Name'] || ''}`.trim(),
//       email: row['Email'],
//       phone: null,
//       image: null,
//       department: row['Department'] || row['AR Department'], // Handle both possible column names
//       employeeId: row['Employee Code'],
//       position: row['Position'],
//       empType: "EMPLOYEE" as const,
//       managerId: null,
//       typeOfWork: []
//     }));

//     // 5. Insert into database
//     const newEmployees = await prisma.$transaction(
//       transformedEmployees.map(employee => 
//         prisma.emp.create({ data: employee })
//       )
//     );

//     return NextResponse.json({
//       message: "Processed first 3 Excel records",
//       count: newEmployees.length,
//       employees: newEmployees
//     });

//   } catch (error) {
//     console.error("Error processing Excel:", error);
//     return NextResponse.json(
//       { error: "Failed to process Excel file" },
//       { status: 500 }
//     );
//   }
// }




// export async function POST(request: Request) {
//   try {
//     // 1. Get the file from FormData
//     const formData = await request.formData();
//     const file = formData.get('file') as File | null;

//     if (!file) {
//       return NextResponse.json(
//         { error: "No file uploaded" },
//         { status: 400 }
//       );
//     }

//     // 2. Read the Excel file
//     const buffer = await file.arrayBuffer();
//     const workbook = XLSX.read(buffer);
//     const firstSheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[firstSheetName];

//     // 3. Convert to JSON (assuming first row is headers)
//     const excelData = XLSX.utils.sheet_to_json(worksheet);

//     // 4. Take first 3 records and transform
//     const transformedEmployees = (excelData as any[]).map((row) => ({
//       name: `${row['Last Name'] || ''} ${row['First Name'] || ''}`.trim(),
//       email: row['Emails from AD'] || row['Email'] || null, // Handle both possible column names
//       phone: row['Phone'] || null,
//       image: null,
//       // department: row['Department'] || null,
//       employeeId: row['Employee Code'],
//       position: row['Position'],
//       empType: "EMPLOYEE" as const,
//       managerId: null,
//       typeOfWork: []
//     }));

//     // 5. Insert into database with better connection handling
//     let newEmployees;
//     try {
//       // Option 1: Use createMany if your Prisma version supports it
//       // newEmployees = await prisma.emp.createMany({
//       //   data: transformedEmployees,
//       //   skipDuplicates: true,
//       // });

//       // Option 2: Use sequential creates instead of transaction if pool is small
//       newEmployees = [];
//       for (const employee of transformedEmployees) {
//         const created = await prisma.emp.create({ data: employee });
//         newEmployees.push(created);
//       }

//       // Option 3: Keep transaction but with connection validation
//       // await prisma.$queryRaw`SELECT 1`; // Test connection first
//       // newEmployees = await prisma.$transaction(
//       //   transformedEmployees.map(employee => 
//       //     prisma.emp.create({ data: employee })
//       //   )
//       // );

//       console.log("New employees created:", newEmployees.length);
//       return NextResponse.json({
//         message: "Processed first 3 Excel records",
//         count: newEmployees.length,
//         employees: newEmployees
//       });

//     } catch (dbError) {
//       console.error("Database error:", dbError);
//       return NextResponse.json(
//         { error: "Database operation failed", details: dbError },
//         { status: 500 }
//       );
//     }

//   } catch (error) {
//     console.error("Error processing Excel:", error);
//     return NextResponse.json(
//       { error: "Failed to process Excel file", details: error },
//       { status: 500 }
//     );
//   }
// }


// export async function POST(request: Request) {
//   try {
//     // 1. Get the file from FormData
//     const formData = await request.formData();
//     const file = formData.get('file') as File | null;

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     // 2. Read the Excel file
//     const buffer = await file.arrayBuffer();
//     const workbook = XLSX.read(buffer);
//     const firstSheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[firstSheetName];

//     // 3. Convert to JSON
//     const excelData = XLSX.utils.sheet_to_json(worksheet);

//     // 4. Transform and validate
//     const transformedEmployees: any[] = [];
//     const skippedRows: any[] = [];

//     for (const row of excelData as any[]) {
//       const department = row['Department'];
//       const email = row['Emails from AD'] || row['Email'];

//       if (!department || !email) {
//         skippedRows.push({ reason: 'Missing department or email', row });
//         continue;
//       }

//       transformedEmployees.push({
//         name: `${row['Last Name'] || ''} ${row['First Name'] || ''}`.trim(),
//         email:row['Emails from AD'] || row['Email'] , // Handle both possible column names
//         phone: row['Phone'] || null,
//         image: null,
//         department: department.toString(),
//         employeeId: row['Employee Code'],
//         position: row['Position'],
//         empType: "EMPLOYEE" as const,
//         managerId: null,
//         typeOfWork: []
//       });
//     }

//     // 5. Insert using createMany with skipDuplicates
//     let insertResult;
//     try {
//       insertResult = await prisma.emp.createMany({
//         data: transformedEmployees,
//         skipDuplicates: true,
//       });

//       console.log("Inserted employees:", insertResult.count);
//       console.log("Skipped rows:", skippedRows.length);
//       return NextResponse.json({
//         message: "Excel data processed successfully",
//         insertedCount: insertResult.count,
//         skippedCount: skippedRows.length,
//         skippedRows, // optional: remove this if too large or sensitive
//       });

//     } catch (dbError) {
//       console.error("Database error:", dbError);
//       return NextResponse.json(
//         { error: "Database operation failed", details: dbError },
//         { status: 500 }
//       );
//     }

//   } catch (error) {
//     console.error("Error processing Excel:", error);
//     return NextResponse.json(
//       { error: "Failed to process Excel file", details: error },
//       { status: 500 }
//     );
//   }
// }



export async function POST(request: Request) {
  try {
    // 1. Get the file from FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 2. Read the Excel file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // 3. Convert to JSON
    const excelData = XLSX.utils.sheet_to_json(worksheet);

    // 4. Transform all records (don't skip any)
const transformedEmployees = (excelData as any[])
  // .filter(row => row['Employee Code']) // Skip rows with no employee code
  .map(row => {
    const phone = row['Phone'] ? String(row['Phone']) : null;

    return {
      name:( row['First Name'] +" "+row['First Name'] )||'Unknown Employee',
      email: row['Emails from AD'] || 'Unassigned',
      phone: phone,
      image: null,
      department: row['Department']?.toString() || 'Unassigned',
      employeeId: row['Employee Code'],
      position: row['Position'] || 'Employee',
      empType: "EMPLOYEE" as const,
      managerId: null,
      typeOfWork: []
    };
  });

// Log how many were filtered out due to missing employee code
const filteredOutCount = excelData.length - transformedEmployees.length;
console.log(`Filtered out ${filteredOutCount} records with no employee code`);

// 5. Insert all valid records
// console.log("Transformed Employees:", transformedEmployees);

// console.log("Transformed Employees:", transformedEmployees);

// 1. Get all existing employee IDs from the database
const existingEmployees = await prisma.emp.findMany({
  select: {
    employeeId: true // Assuming employeeId is your unique field
  }
});

const existingIds = existingEmployees.map(emp => emp.employeeId);

// 2. Find duplicates in your input data
const duplicates = transformedEmployees.filter(emp => 
  existingIds.includes(emp.employeeId)
);

console.log("Duplicate employees (will be skipped):#########################", duplicates);


let insertResult;
try {
  insertResult = await prisma.emp.createMany({
    data: transformedEmployees,
    skipDuplicates: true, // Skip duplicates based on unique fields (likely employeeId)
  });
console.log("Insert Result:################################################");
  console.log("Valid records with employee codes:", transformedEmployees.length);
  console.log("Successfully inserted employees:", insertResult.count);
  
  return NextResponse.json({
    message: "Excel data processed successfully",
    totalRecords: excelData.length,
    filteredOutDueToNoEmployeeCode: filteredOutCount,
    validRecords: transformedEmployees.length,
    insertedCount: insertResult.count,
    duplicatesSkipped: transformedEmployees.length - insertResult.count,
  });
} catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Database operation failed", details: dbError },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error processing Excel:", error);
    return NextResponse.json(
      { error: "Failed to process Excel file", details: error },
      { status: 500 }
    );
  }
}


// export async function POST(request: Request) {
//   try {
//     // 1. Get the file from FormData
//     const formData = await request.formData();
//     const file = formData.get('file') as File | null;

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     // 2. Read the Excel file
//     const buffer = await file.arrayBuffer();
//     const workbook = XLSX.read(buffer);
//     const firstSheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[firstSheetName];

//     // 3. Convert to JSON
//     const excelData = XLSX.utils.sheet_to_json(worksheet);

//     // 4. Transform all records with proper validation
//     const transformedEmployees = (excelData as any[])
//       .filter(row => row['Employee Code']) // Only include rows with employee code
//       .map(row => {
//         // Validate and clean data
//         const firstName = row['First Name']?.toString()?.trim() || '';
//         const lastName = row['Last Name']?.toString()?.trim() || '';
//         const email = row['Emails from AD']?.toString()?.trim() || 'Unassigned';
//         const phone = row['Phone'] ? String(row['Phone']).trim() : null;
//         const department = row['Department']?.toString()?.trim() || 'Unassigned';
//         const employeeId = String(row['Employee Code']).trim();
//         const position = row['Position']?.toString()?.trim() || 'Employee';

//         return {
//           name: `${firstName} ${lastName}`.trim() || 'Unknown Employee',
//           email: email,
//           phone: phone,
//           image: null,
//           department: department,
//           employeeId: employeeId,
//           position: position,
//           empType: "EMPLOYEE" as const,
//           managerId: null,
//           typeOfWork: []
//         };
//       });

//     console.log(`Processed ${transformedEmployees.length} valid records`);

//     // 5. Check for duplicates
//     const existingEmployees = await prisma.emp.findMany({
//       select: {
//         employeeId: true
//       }
//     });

//     const existingIds = new Set(existingEmployees.map(emp => emp.employeeId));
//     const newEmployees = transformedEmployees.filter(emp => !existingIds.has(emp.employeeId));

//     console.log(`Found ${transformedEmployees.length - newEmployees.length} duplicates`);

//     // 6. Insert in batches to avoid timeouts
//     const BATCH_SIZE = 100;
//     let insertedCount = 0;

//     for (let i = 0; i < newEmployees.length; i += BATCH_SIZE) {
//       const batch = newEmployees.slice(i, i + BATCH_SIZE);
//       try {
//         const result = await prisma.emp.createMany({
//           data: batch,
//           skipDuplicates: true, // Extra protection
//         });
//         insertedCount += result.count;
//         console.log(`Inserted batch ${i / BATCH_SIZE + 1}: ${result.count} records`);
//       } catch (batchError) {
//         console.error(`Error in batch ${i / BATCH_SIZE + 1}:`, batchError);
//         // Continue with next batches even if one fails
//       }
//     }

//     return NextResponse.json({
//       message: "Excel data processed successfully",
//       totalRecords: excelData.length,
//       validRecords: transformedEmployees.length,
//       insertedCount: insertedCount,
//       duplicatesSkipped: transformedEmployees.length - newEmployees.length,
//       existingRecordsSkipped: newEmployees.length - insertedCount,
//     });

//   } catch (error) {
//     console.error("Error processing Excel:", error);
//     return NextResponse.json(
//       { 
//         error: "Failed to process Excel file",
//         details: error instanceof Error ? error.message : String(error)
//       },
//       { status: 500 }
//     );
//   }
// }

export async function DELETE() {
  

  try {
    // Delete all employees
    const deletedEmployees = await prisma.emp.deleteMany({});
    
    return NextResponse.json({
      message: "All employees deleted successfully",
      count: deletedEmployees.count,
    });
  } catch (error) {
    console.error("Error deleting employees:", error);
    return NextResponse.json(
      { error: "Failed to delete employees", details: error },
      { status: 500 }
    );
  }
}