import { NextResponse } from "next/server";
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
  name: z.string().max(1000),
  nationality: z.string().max(1000),
});

export async function POST(req: Request, res: NextResponse) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

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

    console.log("\n\n\n============ Response\n===========\n\n", response);

    const responseJson = await response.json();
    console.log(
      "\n\n\n============ Response JSON \n===========\n\n",
      responseJson
    );

    const responseAI = JSON.stringify(responseJson.choices[0].text)
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

    console.log("\n\n\n=====\njsondata\n\n", jsondata);

    //   const jsondata = ` {
    //     "name": "Schezwan Fried Rice",
    //       "ingredients": ["2 cups cooked rice", "1/2 cup chopped onion", "1/2 cup chopped bell pepper", "1/2 cup chopped carrots", "1/4 cup chopped celery", "1/4 cup chopped green onions", "1/4 cup chopped garlic", "1/4 cup soy sauce", "1/4 cup schezwan sauce", "1/4 cup vegetable oil", "Salt and pepper to taste"],
    //       "instructions": ["Heat oil in a large skillet over medium-high heat.", "Add onion, bell pepper, carrots, celery, and green onions. Cook for 3-4 minutes, stirring occasionally.", "Add garlic and cook for an additional minute.", "Add cooked rice and stir to combine.", "Add soy sauce and schezwan sauce and stir to combine.", "Cook for an additional 3-4 minutes, stirring occasionally.", "Season with salt and pepper to taste.", "Serve hot."],
    //       "tagsRelated": ["Chinese", "Fried Rice", "Schezwan"],
    //       "commonNames": ["Chinese Fried Rice", "Schezwan Rice"]
    // }`
    const recipeGPT = JSON.parse(jsondata);

    recipeGPT.commonNames.push(name);

    console.log(recipeGPT);

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
