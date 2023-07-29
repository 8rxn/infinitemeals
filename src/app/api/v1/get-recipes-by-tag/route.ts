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

    console.log(body.json);
    const { tag } = reqSchema.parse(body.json);

    const recipes =
      tag === "all"
        ? await prisma.recipe.findMany({
            include: {
              tags: true,
            },
            distinct: ["name"],
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
      // console.log("Trying on Text Davinci - 3");
      // const configuration = new Configuration({
      //   apiKey: process.env.OPENAI_API_KEY,
      // });
      // const openai = new OpenAIApi(configuration);

      // const response = await openai.createCompletion({
      //   model: "text-davinci-003",
      //   prompt: `Random Recipe related to ${tag} as a json object of type: {name:string,ingredients:string[],steps:string[],tagsRelated:string[]}`,
      //   temperature: 0,
      //   max_tokens: 600,
      //   top_p: 1,
      //   frequency_penalty: 0,
      //   presence_penalty: 0,
      //   stop: ['"""'],
      // });

      // console.log("response:\n",response.data.choices[0].text,"\n\n")

      // const responseAI = JSON.stringify(response.data.choices[0].text)
      // .replaceAll("\\n", "\n")
      // .replaceAll("\\", "")
      // .replaceAll('""', '"');
      // console.log("responseAI:\n",responseAI,"\n\n")

      // const jsondata = responseAI
      // .substring(0, responseAI.length - 1)
      // .replace('"', "")
      // .trim()
      // .replaceAll('name:', '"name":')
      // .replaceAll("ingredients:", '"ingredients":')
      // .replaceAll("steps:", '"instructions":')
      // .replaceAll("tagsRelated:", '"tagsRelated":')
      // .replaceAll(",\n", ",\n  ");

      // console.log("responseJSONDATA:\n",responseAI,"\n\n")

      // const recipeGPT = await JSON.parse(jsondata);

      // console.log("responseGPT:\n", recipeGPT, "\n\n");

      // const createdRecipe = await prisma.recipe.create({
      //   data: {
      //     name: recipeGPT.name,
      //     ingredients: {
      //       create: recipeGPT.ingredients.map(
      //         (ingredient: string, i: number) => ({
      //           item: ingredient,
      //           index: i,
      //         })
      //       ),
      //     },
      //     steps: {
      //       create: recipeGPT.instructions.map((step: string, i: number) => ({
      //         step: step,
      //         index: i,
      //       })),
      //     },
      //     tags: {
      //       connectOrCreate: recipeGPT.tagsRelated.map((tag: string) => ({
      //         create: { name: tag.replaceAll(" ", "_").toLowerCase() },
      //         where: { name: tag.replaceAll(" ", "_").toLowerCase() },
      //       })),
      //     },
      //   },
      // });

      // console.log("CreatedRecipe:\n", createdRecipe, "\n\n");

      // responseArray.push(recipeGPT);

      // console.log("Response Array", responseArray);
      // return NextResponse.json(responseSchema.parse(responseArray), {
      //   status: 200,
      // });

      return NextResponse.json(responseSchema.parse({ recipes: [] }), {status:404})
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
