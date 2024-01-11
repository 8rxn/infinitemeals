import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { array, z } from "zod";
import { Configuration, OpenAIApi } from "openai-edge";

const responseSchema = z.object({
  name: z.string(),
  ingredients: array(z.string()),
  instructions: array(z.string()),
  tagsRelated: array(z.string()).nullable(),
  commonNames: array(z.string()).nullable(),
  imgUrl: z.string().optional(),
  imgDomain: z.string().optional(),
  imgSource: z.string().optional(),
});

const reqSchema = z.object({
  tag: z.string(),
});

export async function POST(req: Request, res: NextResponse) {
  try {
    const body = await req.json();

    console.log(body.json);
    const { tag } = reqSchema.parse(body.json);

    console.log("Trying on GPT");
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Random Recipe related to ${tag} as a json object of type: {name:string,ingredients:string[],steps:string[],tagsRelated:string[],commonNames:string[]}`,
      temperature: 0,
      max_tokens: 600,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ['"""'],
    });

    const responseJson = await response.json();

    const responseAI = JSON.stringify(responseJson.choices[0].text)
      .replaceAll("\\n", "\n")
      .replaceAll("\\", "")
      .replaceAll('""', '"');
    console.log("responseAI:\n", responseAI, "\n\n");

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

    console.log("responseJSONDATA:\n", responseAI, "\n\n");

    const recipeGPT = await JSON.parse(jsondata);

    // const recipeGPT = {
    //   name: "Thai Green Curry",
    //   ingredients: [
    //     "2 tablespoons vegetable oil",
    //     "2 tablespoons green curry paste",
    //     "1 can (14 ounces) coconut milk",
    //     "1/2 cup chicken broth",
    //     "2 tablespoons fish sauce",
    //     "1 tablespoon sugar",
    //     "1 red bell pepper, cut into 1-inch pieces",
    //     "1/2 cup fresh or frozen green peas",
    //     "1/2 cup fresh or frozen baby corn",
    //     "1/2 cup fresh or frozen bamboo shoots",
    //     "1/2 cup fresh or frozen Thai eggplant",
    //     "1/2 cup fresh or frozen Thai basil leaves",
    //     "1/2 cup fresh or frozen Thai holy basil leaves",
    //     "1/2 cup fresh or frozen Thai sweet basil leaves",
    //     "1/2 cup fresh or frozen Thai holy basil leaves",
    //     "1/2 cup fresh or frozen Thai sweet basil leaves",
    //   ],
    //   instructions: [
    //     "Heat the oil in a large skillet over medium-high heat. Add the curry paste and cook, stirring, for 1 minute. Add the coconut milk, chicken broth, fish sauce, and sugar and bring to a boil. Reduce the heat to low and simmer for 5 minutes.",
    //     "Add the bell pepper, peas, baby corn, bamboo shoots, eggplant, and all the basil leaves. Simmer for 5 minutes, or until the vegetables are tender.",
    //     "Serve the curry over steamed jasmine rice.",
    //   ],
    //   tagsRelated: ["Thai", "Curry", "Green Curry", "Vegetarian"],
    //   commonNames: [
    //     "Kaeng Khiao Wan",
    //     "Kaeng Khiao Wan Kai",
    //     "Kaeng Khiao Wan Gai",
    //   ],
    // };

    console.log("responseGPT:\n", recipeGPT, "\n\n");

    return NextResponse.json(responseSchema.parse(recipeGPT), {
      status: 200,
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
