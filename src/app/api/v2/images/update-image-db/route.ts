import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db";
import { v2 as cloudinary } from "cloudinary";
import { UploadApiResponse } from "cloudinary";

const responseSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  source: z.string().url(),
  domain: z.string(),
});

const reqSchema = z.object({
  name: z.string().max(1000),
  result: z.object({
    link: z.string().url(),
    original: z.string().url(),
    source: z.string(),
    thumbnail: z.string().url(),
  }),
  id: z.string(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "You need to be logged in to request data" },
      { status: 401 }
    );
  }

  try {
    const request = await req.json();

    // console.log(
    //   "=================\n\n request \n\n==================\n\n",
    //   request
    // );
    
    const { result, id, name } = reqSchema.parse(request);

    const source = result.link;
    const url = result.original;
    const domain = result.source;

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    let cloudinaryResponse: UploadApiResponse;
    let cloudinaryUrl: string = "";
    try {
      cloudinaryResponse = await cloudinary.uploader.upload(url || "");
      cloudinaryUrl = cloudinaryResponse?.secure_url;
    } catch (err) {
      if (
        err != null &&
        typeof err == "object" &&
        "http_code" in err &&
        err.http_code == "404"
      ) {
        cloudinaryResponse = await cloudinary.uploader.upload(result.thumbnail);
        cloudinaryUrl = cloudinaryResponse?.secure_url;
      }
    }

    const addImageToDB = await prisma.recipe.update({
      where: {
        id: id,
      },
      data: {
        imgUrl: cloudinaryUrl,
        imgDomain: domain,
        imgSource: source,
      },
    });

    return NextResponse.json(
      responseSchema.parse({
        name: name,
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
  } catch (error) {
    // console.log(error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    // console.log(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
