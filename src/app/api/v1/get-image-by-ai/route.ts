import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { Configuration, OpenAIApi } from "openai-edge";
import { prisma } from "@/server/db";
import { v2 as cloudinary } from "cloudinary";

const responseSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  source: z.string().url(),
  domain: z.string(),
});

const reqSchema = z.object({
  name: z.string().max(1000),
  id: z.string().max(500),
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

    const imgFromDB = await prisma.recipe.findFirst({
      where: {
        OR: [
          {
            name: jsonReq.name,
          },
          {
            id: jsonReq.id,
          },
        ],
      },
      select: {
        imgUrl: true,
        imgDomain: true,
        imgSource: true,
      },
    });

    if (!imgFromDB?.imgUrl) {
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);

      const response = await openai.createImage({
        prompt: "A food image of " + jsonReq.name,
        n: 1,
        size: "256x256",
      });

      console.log("\n\n\nFetched using DALLE API \n\n\n");

      if (!response) {
        return NextResponse.json({ error: "No image found" }, { status: 404 });
      }

      const responseJson= await response.json();

      const url = responseJson.data[0].url;

      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      });

      const cloudinaryResponse = await cloudinary.uploader.upload(url || "");
      const cloudinaryUrl = cloudinaryResponse?.secure_url;

      const addImageToDB = await prisma.recipe.update({
        where: {
          id: jsonReq.id,
        },
        data: {
          imgUrl: cloudinaryUrl,
          imgDomain: "DALLE",
          imgSource: "https://openai.com/dall-e-2",
        },
      });

      return NextResponse.json(
        responseSchema.parse({
          name: jsonReq.name,
          url: addImageToDB.imgUrl,
          domain: addImageToDB.imgDomain,
          source: addImageToDB.imgSource,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }


    return NextResponse.json(
      responseSchema.parse({
        name: jsonReq.name,
        url: imgFromDB.imgUrl,
        domain: imgFromDB.imgDomain,
        source: imgFromDB.imgSource,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
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
