CREATE TABLE "gallery" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"index" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"user_id" text NOT NULL,
	"post_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gallery_userId_index_unique" UNIQUE("user_id","index")
);
--> statement-breakpoint
CREATE TABLE "post_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_image_url" text NOT NULL,
	"image_url" text NOT NULL,
	"filter" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"post_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_like" (
	"post_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "post_like_post_id_user_id_pk" PRIMARY KEY("post_id","user_id")
);
--> statement-breakpoint
DROP INDEX "follow_followerId_followingId_idx";--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "follow" DROP CONSTRAINT "follow_pkey";--> statement-breakpoint
ALTER TABLE "follow" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "follow" ADD CONSTRAINT "follow_follower_id_following_id_pk" PRIMARY KEY("follower_id","following_id");--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "text" text;--> statement-breakpoint
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_image" ADD CONSTRAINT "post_image_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_like" ADD CONSTRAINT "post_like_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_like" ADD CONSTRAINT "post_like_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "gallery_userId_idx" ON "gallery" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "post_image_postId_idx" ON "post_image" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "post_like_postId_idx" ON "post_like" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "post_like_userId_idx" ON "post_like" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "post" DROP COLUMN "original_image_url";--> statement-breakpoint
ALTER TABLE "post" DROP COLUMN "image_url";--> statement-breakpoint
ALTER TABLE "post" DROP COLUMN "filter";--> statement-breakpoint
ALTER TABLE "post" DROP COLUMN "description";
