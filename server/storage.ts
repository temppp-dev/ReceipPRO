import {
  users,
  receipts,
  adminUsers,
  type User,
  type UpsertUser,
  type Receipt,
  type InsertReceipt,
  type AdminUser,
  type InsertAdminUser,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Receipt operations
  createReceipt(receipt: InsertReceipt): Promise<Receipt>;
  getUserReceipts(userId: string): Promise<Receipt[]>;
  getAllReceipts(): Promise<Receipt[]>;
  updateReceiptEmailStatus(receiptId: string, emailSent: boolean): Promise<void>;
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
  updateUserCredits(userId: string, credits: number): Promise<User>;
  getAdminUser(username: string): Promise<AdminUser | undefined>;
  createAdminUser(admin: InsertAdminUser): Promise<AdminUser>;
  
  // Statistics
  getTotalUsers(): Promise<number>;
  getTotalReceipts(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Receipt operations
  async createReceipt(receipt: InsertReceipt): Promise<Receipt> {
    const [newReceipt] = await db
      .insert(receipts)
      .values(receipt)
      .returning();
    return newReceipt;
  }

  async getUserReceipts(userId: string): Promise<Receipt[]> {
    return await db
      .select()
      .from(receipts)
      .where(eq(receipts.userId, userId))
      .orderBy(desc(receipts.createdAt));
  }

  async getAllReceipts(): Promise<Receipt[]> {
    return await db
      .select()
      .from(receipts)
      .orderBy(desc(receipts.createdAt));
  }

  async updateReceiptEmailStatus(receiptId: string, emailSent: boolean): Promise<void> {
    await db
      .update(receipts)
      .set({ 
        emailSent, 
        emailSentAt: emailSent ? new Date() : null 
      })
      .where(eq(receipts.id, receiptId));
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));
  }

  async updateUserCredits(userId: string, credits: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        credits,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getAdminUser(username: string): Promise<AdminUser | undefined> {
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username));
    return admin;
  }

  async createAdminUser(admin: InsertAdminUser): Promise<AdminUser> {
    const [newAdmin] = await db
      .insert(adminUsers)
      .values(admin)
      .returning();
    return newAdmin;
  }

  // Statistics
  async getTotalUsers(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(users);
    return result.count;
  }

  async getTotalReceipts(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(receipts);
    return result.count;
  }
}

export const storage = new DatabaseStorage();
