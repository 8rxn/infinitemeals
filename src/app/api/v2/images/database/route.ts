import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db";
import { redis } from "@/server/redis";

const responseSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  source: z.string().url(),
  domain: z.string(),
});

const reqSchema = z.object({
  name: z.string().max(1000),
  id: z.string(),
});

export async function POST(req: Request, res: NextResponse) {
  try {
    const jsonReq = await req.json();

    const { name, id } = reqSchema.parse(jsonReq);

    const cachedImg = await redis.get("img_" + name);

    if (cachedImg) {
      return NextResponse.json(responseSchema.parse(cachedImg), {
        status: 200,
      });
    }

    // console.log(
    //   "\n\n====================\n\n",
    //   "jsonReq : \n { name: ",
    //   name,
    //   ", \nid: ",
    //   id,
    //   "}\n\n====================\n\n"
    // );
    const imgFromDB = await prisma.recipe.findFirst({
      where: {
        OR: [
          {
            name: name,
          },
          {
            id: id,
          },
        ],
      },
      select: {
        imgUrl: true,
        imgDomain: true,
        imgSource: true,
      },
    });

    // console.log(
    //   "\n\n====================\n\n",
    //   "imgFromDB \n ",
    //   imgFromDB,
    //   "\n\n====================\n\n"
    // );

    if (imgFromDB?.imgUrl === null) {
      return NextResponse.json(
        { error: "Image Not in database" },
        { status: 404 }
      );
    }

    await redis.set("img_" + name, {
      name: name,
      url: imgFromDB?.imgUrl,
      domain: imgFromDB?.imgDomain,
      source: imgFromDB?.imgSource,
    });

    return NextResponse.json(
      responseSchema.parse({
        name: name,
        url: imgFromDB?.imgUrl,
        domain: imgFromDB?.imgDomain,
        source: imgFromDB?.imgSource,
      }),
      {
        status: 200,
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
