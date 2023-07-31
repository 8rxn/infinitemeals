import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { array, z } from "zod";
import { redis } from "@/server/redis";

const responseSchema = z.object({
  id: z.string(),
  name: z.string(),
  ingredients: array(z.string()),
  instructions: array(z.string()),
  tagsRelated: array(z.string()).nullable(),
});

const reqSchema = z.object({
  id: z.string(),
});

export async function POST(req: Request, res: NextResponse) {
  try {
    const body = await req.json();
    const { id } = reqSchema.parse(body.json);

    const cachedRecipe = await redis.get(id);

    // const validCachedRecipe = cachedRecipe
    //   .replaceAll("name", '"name"')
    //   .replaceAll("id", '"id"')
    //   .replaceAll("ingredients", '"ingredients"')
    //   .replaceAll("instructions", '"instructions"')
    //   .replaceAll("tagsRelated", '"tagsRelated"');

    // console.log("\n\n===============\n\nvalidCachedRecipe: ", validCachedRecipe);

    // console.log("parsed:\n\n\n", JSON.parse(cachedRecipe));

    if (cachedRecipe) {
      return NextResponse.json(responseSchema.parse(cachedRecipe), {
        status: 200,
      });
    }

    const recipe = await prisma.recipe.findFirst({
      where: {
        id: id,
      },
      include: {
        tags: true,
        ingredients: true,
        steps: true,
      },
    });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const responseJSON = {
      id: recipe.id,
      name: recipe.name,
      ingredients: recipe.ingredients.map((ingredient) => ingredient.item),
      instructions: recipe.steps.map((step) => step.step),
      tagsRelated: recipe.tags.map((tag) => tag.name),
    };

    await redis.set(`${recipe.id}`, responseJSON);

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
