"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { PostCloseAlertDialog } from "./postCloseAlertDialog";
import Image from "next/image";
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
} from "@/components/ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { postAction } from "@/server-actions/post";
import { postSchema, ACCEPTED_TYPES, MAX_SIZE_MB } from "@/schemas/post";
import { createPreviewDataUrls } from "./imagePreview";

export function PostDialog() {
  const [open, setOpen] = useState(false);
  const [showCloseAlert, setShowCloseAlert] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const handleConfirmClose = () => {
    setShowCloseAlert(false);
    setOpen(false);
    form.reset();
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
  };

  const form = useForm({
    defaultValues: {
      image: [] as File[],
      postText: "",
    },
    validators: {
      onSubmit: postSchema,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();

      if (value.image && value.image.length > 0) {
        value.image.forEach((file) => {
          formData.append("image", file);
        });
      }

      if (value.postText) {
        formData.append("postText", value.postText);
      }

      const toastId = toast.loading("画像を投稿中...");
      try {
        await postAction(formData);
        toast.success("画像の投稿が正常に完了しました。", { id: toastId });
        setOpen(false);
        form.reset();
        previewUrls.forEach((url) => URL.revokeObjectURL(url));
        setPreviewUrls([]);
      } catch (err) {
        const message =
          err instanceof Error && err.message
            ? `画像の投稿に失敗しました。 ${err.message}`
            : "画像の投稿に失敗しました。";
        toast.error(message, { id: toastId });
      }
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      const shouldConfirm = form.state.isDirty;
      if (shouldConfirm) {
        setShowCloseAlert(true);
        return;
      }
      form.reset();
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
    }
    setOpen(newOpen);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline">投稿する</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>画像を投稿</DialogTitle>
            <DialogDescription>どんな写真が撮れた？</DialogDescription>
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
                        accept={ACCEPTED_TYPES.join(",")}
                        multiple
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files) {
                            const fileArray = Array.from(files);
                            field.handleChange(fileArray);
                            createPreviewDataUrls(fileArray);
                          }
                        }}
                        aria-invalid={isInvalid}
                      />
                      <FieldDescription>
                        JPEG, PNG, WebP, AVIF形式、各{MAX_SIZE_MB}
                        MBまで、最大10枚
                        {field.state.value && field.state.value.length > 0 && (
                          <span className="block mt-1">
                            選択中: {field.state.value.length}枚
                          </span>
                        )}
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                      {/* 画像プレビュー */}
                      {previewUrls.length > 0 && (
                        <div className="mt-3 flex gap-2 overflow-x-auto">
                          {previewUrls.map((url, index) => (
                            <div
                              key={url}
                              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border"
                            >
                              <Image
                                src={url}
                                alt={`プレビュー ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="postText"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  const textLength = field.state.value?.length || 0;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="post-form-postText">
                        本文（任意）
                      </FieldLabel>
                      <Textarea
                        id="post-form-postText"
                        name={field.name}
                        value={field.state.value || ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="投稿に本文を追加..."
                        className="min-h-25 resize-none"
                      />
                      <FieldDescription
                        className={`${textLength > 200 ? "text-red-400" : ""}`}
                      >
                        {textLength}/200文字
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
            <Button
              type="submit"
              form="post-form"
              disabled={form.state.isSubmitting}
            >
              投稿
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PostCloseAlertDialog
        showCloseAlert={showCloseAlert}
        setShowCloseAlert={setShowCloseAlert}
        handleConfirmClose={handleConfirmClose}
      />
    </>
  );
}
