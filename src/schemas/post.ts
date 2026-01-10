import { z } from "zod";

export const MAX_SIZE_MB = 20;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
export const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const oneImageSchema = z
  .file()
  .max(MAX_SIZE_BYTES, { error: `画像は${MAX_SIZE_MB}MBまでにしてください` })
  .mime(ACCEPTED_TYPES, { error: "対応していないファイル形式です" });

export const postSchema = z.object({
  image: z
    .array(z.file())
    .min(1, { error: "画像は必須です" })
    .max(10, { error: "画像は最大10枚までアップロードできます" })
    .superRefine((files, ctx) => {
      files.forEach((file, i) => {
        const r = oneImageSchema.safeParse(file);
        if (!r.success) {
          const msg = r.error.issues[0]?.message ?? "不正なファイルです";
          ctx.addIssue({
            code: "custom",
            message: `${i + 1}枚目: ${msg}`,
            path: [],
          });
        }
      });
    }),
  postText: z.string().max(200, { error: "本文は200文字までにしてください" }),
});

export type PostFormValues = z.infer<typeof postSchema>;
