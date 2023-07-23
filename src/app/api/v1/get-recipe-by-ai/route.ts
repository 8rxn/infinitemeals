import { NextResponse } from "next/server";
import { array, z } from "zod";
import { Configuration, OpenAIApi } from "openai-edge";

const responseSchema = z.object({
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
    
    console.log("\n\n\n============ Response\n===========\n\n",response)

    const responseJson= await response.json()
    console.log("\n\n\n============ Response JSON \n===========\n\n",responseJson)

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

    const recipeGPT = JSON.parse(jsondata);



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
