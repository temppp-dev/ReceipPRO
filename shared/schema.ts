import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  integer,
  text,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  credits: integer("credits").default(5).notNull(),
  totalReceiptsSent: integer("total_receipts_sent").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Receipts table
export const receipts = pgTable("receipts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  customerName: varchar("customer_name").notNull(),
  customerEmail: varchar("customer_email").notNull(),
  billingAddress: text("billing_address").notNull(),
  productName: varchar("product_name").notNull(),
  productImageUrl: varchar("product_image_url"),
  productPrice: integer("product_price").notNull(), // Store as cents
  quantity: integer("quantity").notNull(),
  taxRate: integer("tax_rate").notNull(), // Store as basis points (0.01% = 1)
  shipping: integer("shipping").notNull(), // Store as cents
  subtotal: integer("subtotal").notNull(), // Store as cents
  tax: integer("tax").notNull(), // Store as cents
  total: integer("total").notNull(), // Store as cents
  orderNumber: varchar("order_number").notNull(),
  emailSent: boolean("email_sent").default(false).notNull(),
  emailSentAt: timestamp("email_sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin users table
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").unique().notNull(),
  passwordHash: varchar("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertReceipt = typeof receipts.$inferInsert;
export type Receipt = typeof receipts.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;

export const insertReceiptSchema = createInsertSchema(receipts).omit({
  id: true,
  userId: true,
  orderNumber: true,
  emailSent: true,
  emailSentAt: true,
  createdAt: true,
  subtotal: true,
  tax: true,
  total: true,
});

export const addCreditsSchema = z.object({
  userId: z.string().min(1),
  credits: z.number().min(1).max(1000),
});

export type InsertReceiptData = z.infer<typeof insertReceiptSchema>;
export type AddCreditsData = z.infer<typeof addCreditsSchema>;
