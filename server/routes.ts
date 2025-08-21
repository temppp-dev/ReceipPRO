import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertReceiptSchema, addCreditsSchema } from "@shared/schema";
import { sendReceiptEmail } from "./emailService";
import bcrypt from "bcrypt";

function generateOrderNumber(): string {
  return 'W' + Math.random().toString().slice(2, 11);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Initialize admin user
  const existingAdmin = await storage.getAdminUser('admin1');
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin', 10);
    await storage.createAdminUser({
      username: 'admin1',
      passwordHash,
    });
  }

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Admin login route
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const admin = await storage.getAdminUser(username);
      if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, admin.passwordHash);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Set admin session
      (req.session as any).isAdmin = true;
      (req.session as any).adminId = admin.id;

      res.json({ success: true });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // Admin logout route
  app.post('/api/admin/logout', (req, res) => {
    (req.session as any).isAdmin = false;
    (req.session as any).adminId = null;
    res.json({ success: true });
  });

  // Check admin status
  app.get('/api/admin/status', (req, res) => {
    const isAdmin = (req.session as any)?.isAdmin || false;
    res.json({ isAdmin });
  });

  // Admin middleware
  const requireAdmin = (req: any, res: any, next: any) => {
    if (!(req.session as any)?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  };

  // Receipt routes
  app.post('/api/receipts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.credits <= 0) {
        return res.status(400).json({ message: 'Insufficient credits' });
      }

      const validatedData = insertReceiptSchema.parse(req.body);
      
      // Calculate amounts (convert to cents for storage)
      const productPrice = Math.round(validatedData.productPrice * 100);
      const quantity = validatedData.quantity;
      const taxRate = validatedData.taxRate;
      const shipping = Math.round(validatedData.shipping * 100);
      
      const subtotal = productPrice * quantity;
      const tax = Math.round(subtotal * (taxRate / 100));
      const total = subtotal + tax + shipping;

      const receiptData = {
        ...validatedData,
        userId,
        productPrice,
        shipping,
        subtotal,
        tax,
        total,
        orderNumber: generateOrderNumber(),
      };

      const receipt = await storage.createReceipt(receiptData);
      
      // Send email
      const emailSent = await sendReceiptEmail(receipt);
      if (emailSent) {
        await storage.updateReceiptEmailStatus(receipt.id, true);
        
        // Deduct credit
        await storage.updateUserCredits(userId, user.credits - 1);
      }

      res.json({ 
        receipt,
        emailSent,
        message: emailSent ? 'Receipt sent successfully' : 'Receipt created but email failed'
      });
    } catch (error) {
      console.error('Create receipt error:', error);
      res.status(500).json({ message: 'Failed to create receipt' });
    }
  });

  app.get('/api/receipts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const receipts = await storage.getUserReceipts(userId);
      res.json(receipts);
    } catch (error) {
      console.error('Get receipts error:', error);
      res.status(500).json({ message: 'Failed to fetch receipts' });
    }
  });

  // Admin routes
  app.get('/api/admin/users', requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  app.get('/api/admin/receipts', requireAdmin, async (req, res) => {
    try {
      const receipts = await storage.getAllReceipts();
      res.json(receipts);
    } catch (error) {
      console.error('Get all receipts error:', error);
      res.status(500).json({ message: 'Failed to fetch receipts' });
    }
  });

  app.post('/api/admin/add-credits', requireAdmin, async (req, res) => {
    try {
      const validatedData = addCreditsSchema.parse(req.body);
      const user = await storage.getUser(validatedData.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const updatedUser = await storage.updateUserCredits(
        validatedData.userId, 
        user.credits + validatedData.credits
      );
      
      res.json(updatedUser);
    } catch (error) {
      console.error('Add credits error:', error);
      res.status(500).json({ message: 'Failed to add credits' });
    }
  });

  app.get('/api/admin/stats', requireAdmin, async (req, res) => {
    try {
      const totalUsers = await storage.getTotalUsers();
      const totalReceipts = await storage.getTotalReceipts();
      
      res.json({
        totalUsers,
        totalReceipts,
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ message: 'Failed to fetch stats' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
