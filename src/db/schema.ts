import {
  uuid,
  pgTable,
  text,
  index,
  timestamp,
  json,
} from "drizzle-orm/pg-core";
import { user } from "@/db/auth-scheme";
export * from "@/db/auth-scheme";

export const post = pgTable(
  "post",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    originalImageUrl: text("original_image_url").notNull(),
    imageUrl: text("image_url").notNull(),
    filter: json("filter"),
    description: text("description"),
    tags: text("tags").array(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("post_userId_idx").on(table.userId),
    index("post_userId_createdAt_idx").on(table.userId, table.createdAt),
    index("post_createdAt_idx").on(table.createdAt),
  ],
);

export const follow = pgTable(
  "follow",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    followerId: text("follower_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    followingId: text("following_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("follow_followerId_idx").on(table.followerId),
    index("follow_followingId_idx").on(table.followingId),
    index("follow_followerId_followingId_idx").on(
      table.followerId,
      table.followingId,
    ),
  ],
);
