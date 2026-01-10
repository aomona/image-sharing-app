"use server";

import { db } from "@/db";
import { postImage, post } from "@/db/schema";
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
  const parsedData = postSchema.parse({
    image: data.getAll("image"),
    postText: data.get("postText"),
  });

  const postId = crypto.randomUUID();

  const uploaded = await Promise.all(
    parsedData.image.map(async (file) => {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const key = `images/${crypto.randomUUID()}-${safeName}`;

      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: key,
          Body: new Uint8Array(await file.arrayBuffer()),
          ContentType: file.type,
        }),
      );

      return {
        key,
        url: `${process.env.R2_CUSTOM_DOMAIN_URL!.replace(/\/$/, "")}/${key}`,
      };
    }),
  );

  try {
    await db.transaction(async (tx) => {
      await tx.insert(post).values({
        id: postId,
        text: parsedData.postText,
        userId: session.user.id,
      });

      if (uploaded.length) {
        await tx.insert(postImage).values(
          uploaded.map(({ url }) => ({
            originalImageUrl: url,
            imageUrl: url,
            filter: {},
            postId,
          })),
        );
      }
    });

    return { id: postId };
  } catch {
    throw new Error("投稿の作成に失敗しました");
  }
}
