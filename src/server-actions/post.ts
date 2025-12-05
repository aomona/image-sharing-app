"use server";

import { db } from "@/db";
import { post } from "@/db/schema";
import { r2 } from "@/lib/r2";
import { postSchema } from "@/schemas/post";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function postAction(data: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("この操作にはログインが必要です。");
  }

  const downloadablerow = data.get("downloadable");
  const downloadable = downloadablerow === "true";

  const tagsrow = data.get("tags") as string;
  const tags = tagsrow.split(",");

  const parsedData = postSchema.parse({
    image: data.get("image"),
    title: data.get("title"),
    description: data.get("description"),
    license: data.get("license"),
    downloadable: downloadable,
    tags: tags,
  });

  const params = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: `images/${crypto.randomUUID()}-${parsedData.image.name}`,
    Body: Buffer.from(await parsedData.image.arrayBuffer()),
    ContentType: parsedData.image.type,
  };

  await r2.send(new PutObjectCommand(params));
  const imageUrl = `${process.env.R2_CUSTOM_DOMAIN_URL}/${params.Key}`;
  await db.insert(post).values({
    title: parsedData.title,
    originalImageUrl: imageUrl,
    imageUrl: imageUrl,
    description: parsedData.description,
    ccLicense: parsedData.license,
    filter: {},
    downloadable: parsedData.downloadable,
    userId: session.user.id,
    tags: parsedData.tags,
  });
}
