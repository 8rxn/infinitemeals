import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { z } from "zod";
import { authOptions } from "@/server/auth";
import { redis } from "@/server/redis";

const responseSchema = z.object({
  tag: z.string(),
});

const reqSchema= z.object(
    {
        tag: z.string()
    }
)


export async function POST(req: Request, res: NextResponse) {
  const session = await getServerSession(authOptions);
   if (!session) {
    return NextResponse.json(
      { error: "You need to be logged in to Create Tags" },
      { status: 401 }
    );
  }

  try {

    const body =  await req.json()
    
    const {tag} = reqSchema.parse(body)

    const tagExists = await prisma.tags.findFirst({
        where:{
            name:tag.replaceAll(" ","_").toLowerCase()
        }
    })

    // console.log("\n\n\n\nTagExists?:",tagExists)

    if(tagExists!==null){
      return NextResponse.json({error:"Tag Already Exists"},{status:400})
    }
    
    const tagCreated = await prisma.tags.create(
        {
            data:{
                name:tag.replaceAll(" ","_").toLowerCase(),
            }
        }
    )

    await redis.expire("tags",0)

    return NextResponse.json(responseSchema.parse({tag: tagCreated.name}), {
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
