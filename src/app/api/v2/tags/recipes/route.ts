import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { array, z } from "zod";
import { authOptions } from "@/server/auth";

const responseSchema = z.object({
  recipes: z.array(
    z.object({
      name: z.string(),
      tags: array(z.string()).optional(),
      imgUrl: z.string().url().nullable(),
      id: z.string(),
    })
  ),
});

const reqSchema = z.object({
  tag: z.string(),
});

export async function POST(req: Request, res: NextResponse) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "You need to be logged in to request data" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { tag } = reqSchema.parse(body.json);

    const recipes =
      tag === "all"
        ? await prisma.recipe.findMany({
            include: {
              tags: true,
            },
            distinct: ["name"],
            orderBy: {
              id: "desc",
            }
          })
        : await prisma.recipe.findMany({
            where: {
              tags: {
                some: {
                  name: tag.replaceAll(" ", "_").toLowerCase(),
                },
              },
            },
            include: {
              tags: true,
            },
            distinct: ["name"],
          });

    const responseArray: [
      | {
          name: string;
          tags: string[];
          id: string;
          imgUrl: string;
        }
      | {}
    ] = [{}];

    responseArray.pop();

    recipes.map((recipe) => {
      responseArray.push({
        name: recipe.name,
        tags: recipe.tags.map((tag) => tag.name),
        id: recipe.id,
        imgUrl: recipe.imgUrl,
      });
    });

    console.log("Response Array", responseArray);

    if (recipes.length === 0) {
      return NextResponse.json(responseSchema.parse({ recipes: [] }), {
        status: 404,
      });
    }

    return NextResponse.json(responseSchema.parse({ recipes: responseArray }), {
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
