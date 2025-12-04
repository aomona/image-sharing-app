import {
  uuid,
  boolean,
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
    title: text("title").notNull(),
    originalImageUrl: text("original_image_url").notNull(),
    imageUrl: text("image_url").notNull(),
    filter: json("filter"),
    description: text("description"),
    ccLicense: text("cc_license").notNull(),
    downloadable: boolean("downloadable"),
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
