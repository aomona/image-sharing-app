"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { PostCloseAlertDialog } from "./postCloseAlertDialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { postAction } from "@/server-actions/post";
import {
  postSchema,
  ACCEPTED_IMAGE_TYPES,
  PostFormInput,
} from "@/schemas/post";
import { Checkbox } from "@/components/ui/checkbox";

export function PostDialog() {
  const [open, setOpen] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [showCloseAlert, setShowCloseAlert] = useState(false);
  const handleConfirmClose = () => {
    setShowCloseAlert(false);
    setOpen(false);
    form.reset();
    setTagsInput("");
  };

  const form = useForm({
    defaultValues: {
      image: undefined,
      title: "",
      description: "",
      license: "none",
      downloadable: false,
      tags: [],
    } as PostFormInput,
    validators: {
      onSubmit: postSchema,
      onChange: postSchema,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      if (value.image) {
        formData.append("image", value.image);
      }
      formData.append("title", value.title);
      formData.append("description", value.description);
      formData.append("license", value.license);
      formData.append("downloadable", String(value.downloadable));
      formData.append("tags", value.tags.join(","));

      const toastId = toast.loading("画像を投稿中...");
      try {
        await postAction(formData);
        toast.success("画像の投稿が正常に完了しました。", { id: toastId });
        setOpen(false);
        form.reset();
        setTagsInput("");
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
      setTagsInput("");
    }
    setOpen(newOpen);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
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
                          field.handleChange(file ?? undefined);
                        }}
                        aria-invalid={isInvalid}
                      />
                      <FieldDescription>
                        JPEG, PNG, GIF, WebP, TIFF, BMP, AVIF形式、最大20MB
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
                      <FieldLabel htmlFor="post-form-title">
                        タイトル
                      </FieldLabel>
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
                        {field.state.value.length}/200文字
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
                        ライセンス
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
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="downloadable"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field orientation="horizontal" data-invalid={isInvalid}>
                      <Checkbox
                        checked={field.state.value}
                        onCheckedChange={(checked) =>
                          field.handleChange(checked === true)
                        }
                        id="post-form-downloadable"
                      />
                      <FieldLabel htmlFor="post-form-downloadable">
                        ダウンロードを許可
                      </FieldLabel>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="tags"
                validators={{
                  onChange: ({ value }) => {
                    if (value.length > 10) {
                      return "タグは10個以下にしてください。";
                    }
                    const tooLongTag = value.find((tag) => tag.length > 20);
                    if (tooLongTag) {
                      return `タグ「${tooLongTag}」は20文字以下にしてください。`;
                    }
                    return undefined;
                  },
                }}
                children={(field) => {
                  const hasErrors = field.state.meta.errors.length > 0;
                  const handleChange = (
                    e: React.ChangeEvent<HTMLInputElement>,
                  ) => {
                    const raw = e.target.value;
                    setTagsInput(raw);
                    const tags = raw
                      .split(",")
                      .map((v) => v.trim())
                      .filter((v) => v.length > 0);
                    field.handleChange(tags);
                  };
                  const handleBlur = (
                    e: React.FocusEvent<HTMLInputElement>,
                  ) => {
                    field.handleBlur();
                    const raw = e.target.value;
                    const tags = [
                      ...new Set(
                        raw
                          .split(",")
                          .map((v) => v.trim())
                          .filter((v) => v.length > 0),
                      ),
                    ];
                    field.handleChange(tags);
                    setTagsInput(tags.join(", "));
                  };
                  return (
                    <Field data-invalid={hasErrors}>
                      <FieldLabel htmlFor="post-form-tags">
                        タグ（任意）
                      </FieldLabel>
                      <Input
                        id="post-form-tags"
                        name={field.name}
                        value={tagsInput}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        aria-invalid={hasErrors}
                        placeholder="風景, 自然, 旅行"
                        autoComplete="off"
                      />
                      <FieldDescription>
                        カンマ区切りで最大10個のタグを追加できます。
                      </FieldDescription>
                      {hasErrors && (
                        <FieldError
                          errors={field.state.meta.errors.map((e) => ({
                            message: typeof e === "string" ? e : String(e),
                          }))}
                        />
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
