
import { NextResponse } from "next/server";
import { z } from "zod";

const responseSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  source: z.string().url(),
  domain: z.string(),
});

const reqSchema = z.object({
  name: z.string().max(1000),
});

export const runtime= "edge"

export async function POST(req: Request, res: NextResponse) {
  try {
    const jsonReq = await req.json();

    console.log(
      "\n\n=======================\nFetched using Google Search API \n\n========================\n"
    );
    const responseFetch = await fetch(
      `https://serpapi.com/search.json?engine=google_images&q=food+image+${jsonReq.name}&google_domain=google.com&gl=in&hl=en&api_key=${process.env.SERP_API_KEY}`
    );

    const response = await responseFetch.json();

    console.log(
      "\n\n=======================\n",
      response["images_results"][0],
      " \n\n========================\n"
    );

    if (!response) {
      return NextResponse.json(
        { error: "Something went Wrong No image found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { result: response["images_results"][0] },
      { status: 200 }
    );
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
