import {
  uuid,
  pgTable,
  text,
  index,
  timestamp,
  primaryKey,
  jsonb,
  integer,
  unique,
} from "drizzle-orm/pg-core";
import { user } from "@/db/auth-scheme";
export * from "@/db/auth-scheme";

export const post = pgTable(
  "post",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    text: text("text"),
    tags: text("tags").array(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("post_userId_idx").on(table.userId),
    index("post_userId_createdAt_idx").on(table.userId, table.createdAt),
    index("post_createdAt_idx").on(table.createdAt),
  ],
);

export const postImage = pgTable(
  "post_image",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    originalImageUrl: text("original_image_url").notNull(),
    imageUrl: text("image_url").notNull(),
    filter: jsonb("filter").notNull().default([]),
    postId: uuid("post_id")
      .notNull()
      .references(() => post.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("post_image_postId_idx").on(table.postId)],
);

export const postLike = pgTable(
  "post_like",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => post.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.userId] }),
    index("post_like_postId_idx").on(table.postId),
    index("post_like_userId_idx").on(table.userId),
  ],
);

export const follow = pgTable(
  "follow",
  {
    followerId: text("follower_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    followingId: text("following_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.followerId, table.followingId] }),
    index("follow_followerId_idx").on(table.followerId),
    index("follow_followingId_idx").on(table.followingId),
  ],
);

export const gallery = pgTable(
  "gallery",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    index: integer("index").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    postId: uuid("post_id")
      .notNull()
      .references(() => post.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("gallery_userId_index_unique").on(table.userId, table.index),
    index("gallery_userId_idx").on(table.userId),
  ],
);
