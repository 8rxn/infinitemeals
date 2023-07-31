import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { array, z } from "zod";
import { redis } from "@/server/redis";

const responseSchema = z.object({
  tags: array(z.string()).optional(),
});

export async function GET(req: Request, res: NextResponse) {
  try {
    const cachedTags = await redis.get("tags");
    if (cachedTags) {
      return NextResponse.json(responseSchema.parse(cachedTags), {
        status: 200,
      });
    }
    const tags = await prisma.tags.findMany({
      orderBy: {
        recipes: {
          _count: "desc",
        },
      },
      where: {
        name: { not: "" },
      },
    });

    const responseJSON = {
      tags: tags.map((tag) => {
        return tag.name;
      }),
    };
    await redis.set("tags",responseJSON);

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
