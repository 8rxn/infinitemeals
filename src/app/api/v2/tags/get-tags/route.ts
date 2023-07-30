import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { array, z } from "zod";
import { authOptions } from "@/server/auth";

const responseSchema = z.object({
  tags: array(z.string()).optional(),
});



export async function GET(req: Request, res: NextResponse) {
  const session = await getServerSession(authOptions);
   if (!session) {
    return NextResponse.json(
      { error: "You need to be logged in to request data" },
      { status: 401 }
    );
  }

  try {
    
    const tags = await prisma.tags.findMany(
        {
            orderBy:{
                recipes:{
                    _count:"desc"
                }
            },
            where: {
                name: {not:""},
              },
            
        }
    )

    const responseJSON= {tags:tags.map((tag)=>{return tag.name})}

    return NextResponse.json(responseSchema.parse(responseJSON), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
