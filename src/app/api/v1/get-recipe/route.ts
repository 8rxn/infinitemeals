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
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

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
      console.log("Trying on GPT-3");
      const openai = new OpenAIApi(configuration);

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Recipe for ${name}${
          !!nationality ? ` from ${nationality}` : ""
        } as a json object of type: {name:string,ingredients:string[],steps:string[],tagsRelated:string[],commonNames:string[]}`,
        temperature: 0,
        max_tokens: 600,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ['"""'],
      });
      const responseAI = JSON.stringify(response.data.choices[0].text)
        .replaceAll("\\n", "\n")
        .replaceAll("\\", "")
        .replaceAll('""', '"');

      const jsondata = responseAI
        .substring(0, responseAI.length - 1)
        .replace('"', "")
        .trim()
        .replaceAll("name:", '"name":')
        .replaceAll("ingredients:", '"ingredients":')
        .replaceAll("steps:", '"instructions":')
        .replaceAll("tagsRelated:", '"tagsRelated":')
        .replaceAll("commonNames:", '"commonNames":')
        .replaceAll(",\n", ",\n  ");

        console.log("\n\n\n=====\njsondata\n\n",jsondata)
        
        const recipeGPT = JSON.parse(jsondata);
        
        console.log("\n\n\n=====\nRecipe gpt\n\n",recipeGPT)
      const createdRecipe = await prisma.recipe.create({
        data: {
          name: recipeGPT.name,
          ingredients: {
            create: recipeGPT.ingredients.map(
              (ingredient: string, i: number) => ({
                item: ingredient,
                index: i,
              })
            ),
          },
          steps: {
            create: recipeGPT.instructions.map((step: string, i: number) => ({
              step: step,
              index: i,
            })),
          },
          tags: {
            connectOrCreate: recipeGPT.tagsRelated.map((tag: string) => ({
              create: { name: tag.replaceAll(" ", "_").toLowerCase() },
              where: { name: tag.replaceAll(" ", "_").toLowerCase() },
            })),
          },
          searchTerms:{
            create:recipeGPT.commonNames.map((term:string)=>({
              term:term
            }))
          }
         
        },
      });

      recipeGPT.id = createdRecipe.id;

      console.log("Created Recipe", createdRecipe);
      return NextResponse.json(responseSchema.parse(recipeGPT), {
        status: 200,
      });

      console.log("Recipe not found");
      return NextResponse.json({error:"nothing found"},{status:404})
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
