import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { array, z } from "zod";
import { authOptions } from "@/server/auth";
import { Configuration, OpenAIApi } from "openai";


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
    console.log(
      "\n\n ===================\n\n",
      "Name: ",
      name,
      "\nNationality:",
      nationality,
      "\n\n ===================\n\n"
    );

    const recipe =
      nationality == ""
        ? await prisma.recipe.findFirst({
            where: {
              OR: [
                {
                  name: name,
                },
                {
                  searchTerms:{
                    some:{
                      term:name
                    }
                  }
                }
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
                  searchTerms:{
                    some:{
                      term:name
                    }
                  }
                }
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
     

      console.log("Not Found", );
      return NextResponse.json({name:"try-on-ai"}, {
        status: 404,
      });
    }

    console.log(recipe.tags.map((tag) => tag.name));

    const responseJSON = {
      id: recipe.id,
      name: recipe.name,
      ingredients: recipe.ingredients.map((ingredient) => ingredient.item),
      instructions: recipe.steps.map((step) => step.step),
      tags: recipe.tags.map((tag) => tag.name),
      imgUrl: recipe.imgUrl,
      imgDomain: recipe.imgDomain,
      imgSource: recipe.imgSource,
    };

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
