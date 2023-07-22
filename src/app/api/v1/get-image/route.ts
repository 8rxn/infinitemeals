import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { BingImagesParameters } from "serpapi";
import { getJson } from "serpapi";
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

    console.log(
      "\n\n====================\n\n",
      "jsonReq : \n { name: ",
      jsonReq.name,
      ", \nid: ",
      jsonReq.id,
      "}\n\n====================\n\n"
    );
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

    console.log(
      "\n\n====================\n\n",
      "imgFromDB \n ",
      imgFromDB,
      "\n\n====================\n\n"
    );

    if (!imgFromDB?.imgUrl) {
      console.log(
        "\n\n=======================\nFetched using Google Search API \n\n========================\n"
      );
      const responseFetch = await fetch(
        `https://serpapi.com/search.json?engine=google_images&q=food+image+${jsonReq.name}&google_domain=google.com&gl=in&hl=en&api_key=${process.env.SERP_API_KEY}`
      );

      const response = await responseFetch.json();

      console.log(
        "\n\n=======================\n",
        response["images_results"],
        " \n\n========================\n"
      );

      if (!response) {
        return NextResponse.json(
          { error: "Something went Wrong No image found" },
          { status: 404 }
        );
      }
      const source = response["images_results"][0].link;
      const url = response["images_results"][0].original;
      const domain = response["images_results"][0].source;

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
          imgDomain: domain,
          imgSource: source,
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
