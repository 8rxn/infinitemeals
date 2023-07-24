import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { array, z } from "zod";

const responseSchema = z.object({
  id: z.string(),
  name: z.string(),
  ingredients: array(z.string()),
  instructions: array(z.string()),
  tags: array(z.string()).optional(),
  imgUrl: z.string().optional(),
  imgDomain: z.string().optional(),
  imgSource: z.string().optional(),
});

const reqSchema = z.object({
  name: z.string(),
  ingredients: array(z.string()),
  instructions: array(z.string()),
  tags: array(z.string()).optional(),
  imgUrl: z.string().optional(),
  imgDomain: z.string().optional(),
  imgSource: z.string().optional(),
});

export async function POST(req: Request, res: NextResponse) {
  try {
    const recipe = await req.json();
    const recipeGPT = await recipe.json;

    console.log(
      "========= \n\n\n RecipeGPT \n\n\n ",
      recipeGPT["instructions"]?.map((step: string) => step),
      "=================="
    );

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
        steps: {
          create: recipeGPT.instructions?.map((step: string, i: number) => ({
            step: step,
            index: i,
          })),
        },
        tags: {
          connectOrCreate: recipeGPT.tagsRelated?.map((tag: string) => ({
            create: { name: tag.replaceAll(" ", "_").toLowerCase() },
            where: { name: tag.replaceAll(" ", "_").toLowerCase() },
          })),
        },
        searchTerms: {
          create: recipeGPT.commonNames?.map((term: string) => ({
            term: term,
          })),
        },
      },
    });

    recipeGPT.id = createdRecipe.id;

    console.log("Created Recipe", createdRecipe);

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

// console.log("\n\n\n=====\nRecipe gpt\n\n", recipeGPT);
// const createdRecipe = await prisma.recipe.create({
//   data: {
//     name: recipeGPT.name,
//     ingredients: {
//       create: recipeGPT.ingredients?.map((ingredient: string, i: number) => ({
//         item: ingredient,
//         index: i,
//       })),
//     },
//     steps: {
//       create: recipeGPT.instructions?.map((step: string, i: number) => ({
//         step: step,
//         index: i,
//       })),
//     },
//     tags: {
//       connectOrCreate: recipeGPT.tagsRelated?.map((tag: string) => ({
//         create: { name: tag.replaceAll(" ", "_").toLowerCase() },
//         where: { name: tag.replaceAll(" ", "_").toLowerCase() },
//       })),
//     },
//     searchTerms: {
//       create: recipeGPT.commonNames?.map((term: string) => ({
//         term: term,
//       })),
//     },
//   },
// });

// recipeGPT.id = createdRecipe.id;

// console.log("Created Recipe", createdRecipe);
