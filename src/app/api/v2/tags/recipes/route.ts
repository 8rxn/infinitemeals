import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { array, z } from "zod";

const responseSchema = z.object({
  recipes: z.array(
    z.object({
      name: z.string(),
      tags: array(z.string()).optional(),
      imgUrl: z.string().url().nullable(),
      id: z.string(),
    })
  ),
  nextPage: z.number().optional(),
});

const reqSchema = z.object({
  tag: z.string(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export async function POST(req: Request, res: NextResponse) {
  try {
    const body = await req.json();
    const { tag, page, limit } = reqSchema.parse(body.json);

    const skip = (page - 1) * limit;

    const recipes =
      tag === "all"
        ? await prisma.recipe.findMany({
            include: {
              tags: true,
            },
            distinct: ["name"],
            orderBy: {
              id: "desc",
            },
            take: limit,
            skip: skip,
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
            take: limit,
            skip: skip,
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

    // console.log("Response Array", responseArray);

    if (recipes.length === 0 && page == 1) {
      return NextResponse.json(responseSchema.parse({ recipes: [] }), {
        status: 404,
      });
    }

    return NextResponse.json(
      responseSchema.parse({ recipes: responseArray, nextPage: page + 1 }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
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
