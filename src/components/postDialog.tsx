"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
  FieldDescription,
} from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/tiff",
  "image/bmp",
  "image/avif",
];

const licenseValues = [
  "none",
  "CC0",
  "CC BY",
  "CC BY-SA",
  "CC BY-ND",
  "CC BY-NC",
  "CC BY-NC-SA",
  "CC BY-NC-ND",
] as const;

type License = (typeof licenseValues)[number];

const postSchema = z.object({
  image: z
    .custom<File | undefined>()
    .refine((file): file is File => file instanceof File, {
      message: "画像ファイルを選択してください。",
    })
    .refine((file) => !file || file.size <= 50 * 1024 * 1024, {
      message: "画像サイズは50MB以下にしてください。",
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "サポートされていない形式です。",
    }),
  title: z
    .string()
    .min(1, { message: "タイトルは必須です。" })
    .max(20, { message: "タイトルは20文字以下にしてください。" }),
  description: z
    .string()
    .max(200, { message: "説明は200文字以下にしてください。" }),
  license: z.enum(licenseValues),
});

type PostFormValues = {
  image: File | undefined;
  title: string;
  description: string;
  license: License;
};

export function PostDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      image: undefined,
      title: "",
      description: "",
      license: "none",
    } as PostFormValues,
    validators: {
      onSubmit: postSchema,
    },
    onSubmit: async ({ value }) => {
      toast.promise(
        new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 2000);
        }),
        {
          loading: "画像を投稿中...",
          success: "画像の投稿が正常に完了しました",
          error: "画像の投稿に失敗しました。",
        },
      );

      setOpen(false);
      form.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">画像を投稿</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>画像を投稿</DialogTitle>
          <DialogDescription>画像を投稿しましょう</DialogDescription>
        </DialogHeader>

        <form
          id="post-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="image"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="post-form-image">画像</FieldLabel>
                    <Input
                      id="post-form-image"
                      name={field.name}
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.handleChange(file);
                        }
                      }}
                      aria-invalid={isInvalid}
                    />
                    <FieldDescription>
                      JPEG, PNG, GIF, WebP, TIFF, BMP, AVIF形式、最大50MB
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="title"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="post-form-title">タイトル</FieldLabel>
                    <Input
                      id="post-form-title"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="美しい風景"
                      autoComplete="off"
                    />
                    <FieldDescription
                      className={`${field.state.value.length > 20 ? "text-red-400" : ""}`}
                    >
                      {field.state.value.length}/20文字
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="description"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="post-form-description">
                      説明（任意）
                    </FieldLabel>
                    <Textarea
                      id="post-form-description"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="この画像について説明してください"
                      className="min-h-[100px] resize-none"
                    />
                    <FieldDescription
                      className={`${field.state.value.length > 200 ? "text-red-400" : ""}`}
                    >
                      {field.state.value?.length || 0}/200文字
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="license"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="post-form-license">
                      ライセンス（任意）
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as typeof field.state.value)
                      }
                    >
                      <SelectTrigger
                        id="post-form-license"
                        aria-invalid={isInvalid}
                      >
                        <SelectValue placeholder="ライセンスを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          <span className="font-medium">選択しない</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            ライセンス未設定
                          </span>
                        </SelectItem>
                        <SelectItem value="CC0">
                          <span className="font-medium">CC0</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            著作権放棄・自由に利用可
                          </span>
                        </SelectItem>
                        <SelectItem value="CC BY">
                          <span className="font-medium">CC BY</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            クレジット表示で自由に利用可
                          </span>
                        </SelectItem>
                        <SelectItem value="CC BY-SA">
                          <span className="font-medium">CC BY-SA</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            表示＋同じライセンスで共有
                          </span>
                        </SelectItem>
                        <SelectItem value="CC BY-ND">
                          <span className="font-medium">CC BY-ND</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            表示＋改変禁止
                          </span>
                        </SelectItem>
                        <SelectItem value="CC BY-NC">
                          <span className="font-medium">CC BY-NC</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            表示＋非営利のみ
                          </span>
                        </SelectItem>
                        <SelectItem value="CC BY-NC-SA">
                          <span className="font-medium">CC BY-NC-SA</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            表示＋非営利＋同じライセンス
                          </span>
                        </SelectItem>
                        <SelectItem value="CC BY-NC-ND">
                          <span className="font-medium">CC BY-NC-ND</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            表示＋非営利＋改変禁止
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldDescription>
                      画像のライセンスを選択してください
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button type="submit" form="post-form">
            投稿
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
