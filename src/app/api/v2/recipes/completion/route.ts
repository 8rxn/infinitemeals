import { NextResponse } from "next/server";
import { array, z } from "zod";
// import { Configuration, OpenAIApi } from "openai-edge";
import OpenAI from "openai";

import { parse } from "best-effort-json-parser";

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


export const runtime = 'edge'

export async function POST(req: Request, res: NextResponse) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  // "configuration" on edge

  try {
    const body = await req.json();
    const { name, nationality } = reqSchema.parse(body.json);

    const tools = [
      {
        type: "function",
        function: {
          name: "get_recipe_json",
          description:
            "Get the recipe for a given food item from a given location as a json object of type {name:string,ingredients:string[],steps:string[],tagsRelated:string[],commonNames:string[]}",
          parameters: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description:
                  "The name of the item for which recipe is to be fetched",
              },
              nationality: {
                type: "string",
                description:
                  "The place where the food is famously from or a specific way of cooking that particular item",
              },
            },
          },
        },
      },
    ];

    const response = await openai.chat.completions.create({
      // model: "gpt-3.5-turbo-1106",
      // messages: messages,
      // functions: tools,
      // max_tokens: 600,
      // temperature: 0,
      // function_call: "auto",
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content:
            "extract name from user message, generate it's recipe, return json object of type {name:string,ingredients:string[],steps:string[],tagsRelated:string[],commonNames:string[]}",
        },
        {
          role: "user",
          content: `give recipe for name=${name}${
            nationality ? ` from nationality=${nationality}` : ""
          } as json`,
        },
      ],
      // functions: [
      //   {
      //     name: "get_recipe_json",
      //     description:
      //       "Get the recipe for a given food item from a given location as a json object of type {name:string,,steps:string[],tagsRelated:string[],commonNames:string[]}",
      //     parameters: {
      //       type: "object",
      //       properties: {
      //         name: {
      //           type: "string",
      //           description:
      //             "The name of the item for which recipe is to be fetched",
      //         },
      //         nationality: {
      //           type: "string",
      //           description:
      //             "The place where the food is famously from or a specific way of cooking that particular item",
      //         },
      //         ingredients: {
      //           type: "string",
      //           description: "The ingredients required to make the dish",
      //         },
      //         steps: {
      //           type: "string",
      //           description: "The steps required to make the dish",
      //         },
      //         tagsRelated: {
      //           type: "string",
      //           description: "Tags related to the dish",
      //         },
      //         commonNames: {
      //           type: "string",
      //           description: "Common names of the dish",
      //         },
      //       },
      //     },

      //   },
      // ],
      max_tokens: 600,
      // function_call: "auto",
      response_format: { type: "json_object" },
    });
    console.log(
      "\n\n\n============ Response\n===========\n\n",
      response.choices[0].message
    );

    const responseMessage = `${response.choices[0].message.content}`;

    // const responseSample = ``;

    // const sample = `"{\n  \"name\": \"Malai Chap\",\n  \"ingredients\": [\n    \"1 cup malai (clotted cream)\",\n    \"1/2 cup milk\",\n    \"2 tbsp ghee (clarified butter)\",\n    \"1/2 cup sugar\",\n    \"1/4 tsp cardamom powder\",\n    \"2 tbsp chopped nuts (almonds, pistachios, cashews) for garnish\"\n  ],\n  \"steps\": [\n    \"Heat ghee in a pan and add the malai. Cook on medium heat for 5 minutes, stirring constantly.\",\n    \"Add the milk and continue to cook for another 5 minutes, stirring frequently.\",\n    \"Add the sugar and cardamom powder, and cook for 5-7 minutes until the mixture thickens and starts to leave the sides of the pan.\",\n    \"Remove from heat and let it cool for a few minutes.\",\n    \"Pour the mixture into serving bowls, garnish with chopped nuts, and refrigerate for 2 hours before serving.\"\n  ],\n  \"tagsRelated\": [\n    \"Indian dessert\",\n    \"Cream-based dessert\",\n    \"Quick and easy\"\n  ],\n  \"commonNames\": [\n    \"Malai Chap\",\n    \"Malai Kulfi\",\n    \"Malai Pudding\"\n  ]\n}"`;

    if (responseMessage == null) {
      return NextResponse.json(
        { error: "something went wrong" },
        { status: 500 }
      );
    }

    const sampleGPT = responseMessage
      .replaceAll("\\n", "\n")
      .replaceAll("\\", "")
      .replaceAll('""', '"')
      .replaceAll(`steps`, `instructions`);

    console.log("\n\n\n sample gpt\n\n", sampleGPT);

    // const sampleGPT = `{
    //   "name": "Malai Chap",
    //   "ingredients": [
    //     "Chicken",
    //     "Yogurt",
    //     "Fresh cream",
    //     "Ginger-garlic paste",
    //     "Green chilies",
    //     "Coriander leaves",
    //     "Mint leaves",
    //     "Lemon juice",
    //     "Cashew nut paste",
    //     "Garam masala",
    //     "Turmeric powder",
    //     "Red chili powder",
    //     "Kasuri methi",
    //     "Salt",
    //     "Oil"
    //   ],
    //   "steps": [
    //     "Marinate chicken with yogurt, ginger-garlic paste, and salt for 30 minutes.",
    //     "Heat oil in a pan and add marinated chicken. Cook until the chicken is half done.",
    //     "Add green chilies, coriander leaves, and mint leaves. Saute for a few minutes.",
    //     "Add cashew nut paste, garam masala, turmeric powder, red chili powder, and salt. Mix well.",
    //     "Cook until the chicken is tender and the masala is well-cooked.",
    //     "Add fresh cream, lemon juice, and kasuri methi. Mix and cook for a few more minutes.",
    //     "Garnish with coriander leaves and serve hot."
    //   ],
    //   "tagsRelated": [
    //     "Indian cuisine",
    //     "Creamy chicken",
    //     "Spicy",
    //     "Flavorful"
    //   ],
    //   "commonNames": [
    //     "Malai Chicken",
    //     "Creamy Chicken Curry"
    //   ]
    // }`;

    let JsonResponse;

    try {
      JsonResponse = parse(sampleGPT);
    } catch (error) {
      console.error("improper json\n\n", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }

    console.log(JsonResponse);

    JsonResponse.commonNames.push(name);

    return NextResponse.json(responseSchema.parse(JsonResponse), {
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
