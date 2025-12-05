import { z } from "zod";

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/tiff",
  "image/bmp",
  "image/avif",
];

export const licenseValues = [
  "none",
  "CC0",
  "CC BY",
  "CC BY-SA",
  "CC BY-ND",
  "CC BY-NC",
  "CC BY-NC-SA",
  "CC BY-NC-ND",
] as const;

export type License = (typeof licenseValues)[number];

export const postSchema = z.object({
  image: z
    .file({ error: "画像ファイルを選択してください。" })
    .mime(ACCEPTED_IMAGE_TYPES, { error: "サポートされていない形式です。" })
    .max(50 * 1024 * 1024, { error: "画像サイズは50MB以下にしてください。" }),
  title: z
    .string()
    .min(1, { error: "タイトルは必須です。" })
    .max(20, { error: "タイトルは20文字以下にしてください。" }),
  description: z
    .string()
    .max(200, { error: "説明は200文字以下にしてください。" }),
  license: z.enum(licenseValues),
  downloadable: z.boolean(),
});

// バリデーション後の型（imageは必須）
export type PostFormValues = z.infer<typeof postSchema>;

// フォーム入力用の型（imageはundefinedを許容）
export type PostFormInput = {
  image: File | undefined;
  title: string;
  description: string;
  license: License;
  downloadable: boolean;
};
