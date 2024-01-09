import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { array, z } from "zod";

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

export async function GET() {
  try {
    const recipe = {
      name: "Malai Chap",
      ingredients: [
        "500g chicken breast, cut into bite-sized pieces",
        "1 cup full-fat yogurt",
        "1/2 cup heavy cream",
        "2 tbsp ginger-garlic paste",
        "1 tsp garam masala",
        "1 tsp coriander powder",
        "1/2 tsp turmeric",
        "1/2 tsp red chili powder",
        "1/4 tsp cardamom powder",
        "1/4 tsp nutmeg powder",
        "2 tbsp oil",
        "1 cup thinly sliced onions",
        "2 green chilies, chopped",
        "1/4 cup chopped coriander leaves",
        "Salt to taste",
      ],
      instructions: [
        "Mix the yogurt, cream, ginger-garlic paste, garam masala, coriander powder, turmeric, red chili powder, cardamom powder, nutmeg powder, and salt in a bowl to make the marinade.",
        "Add the chicken pieces to the marinade and coat them well. Cover and refrigerate for at least 2 hours, preferably overnight.",
        "Heat oil in a pan over medium heat. Add the sliced onions and sauté until golden brown.",
        "Add the marinated chicken along with the marinade to the pan. Cook on medium heat until the chicken is tender and the sauce thickens.",
        "Add chopped green chilies and coriander leaves. Mix well and cook for another 2-3 minutes.",
        "Serve hot with naan or rice.",
      ],
      tagsRelated: ["Indian Cuisine", "Creamy Chicken", "Spicy", "Main Course"],
      commonNames: [],
    };
    const recipeGPT = reqSchema.parse(recipe);

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
