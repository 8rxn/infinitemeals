import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { array, z } from "zod";
import { authOptions } from "@/server/auth";
import { redis } from "@/server/redis";

const responseSchema = z.object({
  id: z.string(),
  name: z.string(),
  ingredients: array(z.string()),
  instructions: array(z.string()),
  tagsRelated: array(z.string()).optional(),
  imgUrl: z.string().optional().nullable(),
  imgDomain: z.string().optional().nullable(),
  imgSource: z.string().optional().nullable(),
});

const reqSchema = z.object({
  name: z.string().max(1000),
  nationality: z.string().max(1000),
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
    const { name, nationality } = reqSchema.parse(body.json);
    // console.log(
    //   "\n\n ===================\n\n",
    //   "Name: ",
    //   name,
    //   "\nNationality:",
    //   nationality,
    //   "\n\n ===================\n\n"
    // );

    const cachedRecipe = await redis.get(name);

    if (cachedRecipe) {
      return NextResponse.json(responseSchema.parse(cachedRecipe), {
        status: 200,
      });
    }

    const recipe =
      nationality == ""
        ? await prisma.recipe.findFirst({
            where: {
              OR: [
                {
                  name: name,
                },
                {
                  searchTerms: {
                    some: {
                      term: name,
                    },
                  },
                },
              ],
            },
            include: {
              tags: true,
              ingredients: true,
              steps: true,
            },
          })
        : await prisma.recipe.findFirst({
            where: {
              OR: [
                {
                  name: name,
                },
                {
                  searchTerms: {
                    some: {
                      term: name.trim(),
                    },
                  },
                },
              ],
              tags: {
                some: {
                  name: nationality.replaceAll(" ", "_").toLowerCase(),
                },
              },
            },
            include: {
              tags: true,
              ingredients: true,
              steps: true,
            },
          });

    if (recipe?.id === undefined) {
      // console.log("Not Found");
      return NextResponse.json(
        { name: "try-on-ai" },
        {
          status: 404,
        }
      );
    }


    const responseJSON = {
      id: recipe.id,
      name: recipe.name,
      ingredients: recipe.ingredients.map((ingredient) => ingredient.item),
      instructions: recipe.steps.map((step) => step.step),
      tagsRelated: recipe.tags.map((tag) => tag.name),
      imgUrl: recipe.imgUrl,
      imgDomain: recipe.imgDomain,
      imgSource: recipe.imgSource,
    };

    await redis.set(name, responseJSON);

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
