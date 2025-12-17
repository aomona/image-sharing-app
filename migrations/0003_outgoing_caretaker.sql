ALTER TABLE "post" ADD COLUMN "original_image_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "filter" json;