import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { Configuration, OpenAIApi } from "openai-edge";

const responseSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  source: z.string().url(),
  domain: z.string(),
});

const reqSchema = z.object({
  name: z.string().max(1000),
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
    const jsonReq = await req.json();
    const { name } = reqSchema.parse(jsonReq.json);

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createImage({
      prompt: "A food image of " + name,
      n: 1,
      size: "256x256",
    });

    // console.log("\n\n\nFetched using DALLE API \n\n\n");

    if (!response) {
      return NextResponse.json(
        { error: "Something Went Wrong" },
        { status: 404 }
      );
    }

    const res = await response.json();
    const url = res.data.data[0].url;

    return NextResponse.json(
      responseSchema.parse({
        name: name,
        url: url,
        source: "https://openai.com/blog/dall-e/",
        domain: "DALL-E",
      }),
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
