import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET() {

    const test = await prisma.emp.findMany({
            distinct: ['position'],

       select: {
         position: true,
       },

        })
                ;
    console.log(test);


  return  Response.json(test);
}