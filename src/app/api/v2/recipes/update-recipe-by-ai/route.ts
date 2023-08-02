import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { array, z } from "zod";
import { redis } from "@/server/redis";

const responseSchema = z.object({
  id: z.string(),
  name: z.string(),
  ingredients: array(z.string()),
  instructions: array(z.string()),
  tags: array(z.string()).optional(),
  tagsRelated: array(z.string()).optional(),
  imgUrl: z.string().optional(),
  imgDomain: z.string().optional(),
  imgSource: z.string().optional(),
});

const reqSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  ingredients: array(z.string()),
  instructions: array(z.string()),
  tagsRelated: array(z.string()).nullable(),
  commonNames: array(z.string()).nullable(),
  imgUrl: z.string().optional(),
  imgDomain: z.string().optional(),
  imgSource: z.string().optional(),
});

export async function POST(req: Request, res: NextResponse) {
  try {
    const recipe = await req.json();
    const recipeGPT = reqSchema.parse(recipe.json);

    // console.log(
    //   "========= \n\n\n RecipeGPT[commonNames] \n\n\n ",
    //   recipeGPT.commonNames,
    //   "=================="
    // );

    const createdRecipe = await prisma.recipe.create({
      data: {
        name: recipeGPT.name,
        ingredients: {
          create: recipeGPT.ingredients?.map(
            (ingredient: string, i: number) => ({
              item: ingredient,
              index: i,
            })
          ),
        },
        tags: {
          connectOrCreate: recipeGPT.tagsRelated?.map((tag: string) => ({
            create: { name: tag.replaceAll(" ", "_").toLowerCase() },
            where: { name: tag.replaceAll(" ", "_").toLowerCase() },
          })),
        },
        searchTerms: {
          connectOrCreate: recipeGPT.commonNames?.map((term: string) => ({
            create: { term: term },
            where: { term: term },
          })),
        },
        steps: {
          create: recipeGPT.instructions?.map((step: string, i: number) => ({
            step: step,
            index: i,
          })),
        },
      },
    });

    recipeGPT.id = createdRecipe.id;

    await redis.set(recipeGPT.name, recipeGPT);
    await redis.set(recipeGPT.id, recipeGPT);

    return NextResponse.json(responseSchema.parse(recipeGPT), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
