import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Textarea } from "@/components/ui/textarea";
import { Receipt, ArrowLeft, Send } from "lucide-react";
import { ReceiptPreview } from "@/components/receipt-preview";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

const receiptSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Invalid email address"),
  billingAddress: z.string().min(1, "Billing address is required"),
  productName: z.string().min(1, "Product name is required"),
  productImageUrl: z.string().url().optional().or(z.literal("")),
  productPrice: z.number().min(0.01, "Price must be greater than 0"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  taxRate: z.number().min(0).max(100, "Tax rate must be between 0 and 100"),
  shipping: z.number().min(0, "Shipping must be 0 or greater"),
});

type ReceiptFormData = z.infer<typeof receiptSchema>;

export default function ReceiptCreator() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ReceiptFormData>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      billingAddress: "",
      productName: "",
      productImageUrl: "",
      productPrice: 0,
      quantity: 1,
      taxRate: 0,
      shipping: 0,
    },
  });

  const createReceiptMutation = useMutation({
    mutationFn: async (data: ReceiptFormData) => {
      const response = await apiRequest("POST", "/api/receipts", data);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: data.emailSent 
          ? "Receipt created and sent successfully!" 
          : "Receipt created but email delivery failed. Please try again.",
        variant: data.emailSent ? "default" : "destructive",
      });
      
      if (data.emailSent) {
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["/api/receipts"] });
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      }
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Error",
        description: error.message || "Failed to create receipt",
        variant: "destructive",
      });
    },
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const onSubmit = (data: ReceiptFormData) => {
    if (!user || user.credits <= 0) {
      toast({
        title: "Insufficient Credits",
        description: "You need at least 1 credit to send a receipt",
        variant: "destructive",
      });
      return;
    }

    createReceiptMutation.mutate(data);
  };

  const watchedValues = form.watch();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Receipt className="text-white text-sm" />
              </div>
              <span className="text-white font-bold text-xl">ReceiptPro</span>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="glass rounded-lg px-4 py-2">
                  <span className="text-gray-300">Credits: </span>
                  <span className="text-white font-semibold">{user.credits}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center text-gray-300 text-sm mb-4">
              <Link href="/">
                <Button variant="ghost" className="text-gray-300 hover:text-white p-0">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Dashboard
                </Button>
              </Link>
              <span className="mx-2">→</span>
              <span>Create Receipt</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Create New Receipt</h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Product Images Sidebar */}
            <Card className="glass border-white/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Product Gallery</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-white/80 mb-2">Apple Products</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: "iPhone 15 Pro", url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1692895395658" },
                        { name: "MacBook Pro", url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290" },
                        { name: "iPad Pro", url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-13-select-wifi-spacegray-202405?wid=2000&hei=2000&fmt=p-jpg&qlt=80&.v=1713308272877" },
                        { name: "AirPods Pro", url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=2000&hei=2000&fmt=p-jpg&qlt=80&.v=1660803972361" }
                      ].map((product, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            form.setValue("productImageUrl", product.url);
                            form.setValue("productName", product.name);
                          }}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all border border-white/20 hover:border-white/40"
                        >
                          <img 
                            src={product.url} 
                            alt={product.name}
                            className="w-full h-12 object-cover rounded mb-1"
                          />
                          <p className="text-white text-xs text-center">{product.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-white/80 mb-2">Cartier Jewelry</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: "Santos 100 Watch", price: 12500, url: "https://cdn.discordapp.com/ephemeral-attachments/1342020267446243343/1399935771238076497/40mm-cartier-santos-100-xl-black-diamond-montre-or-noir-bijoux-medusa-homme-quebec-canada-606-removebg-preview.png?ex=688acf49&is=68897dc9&hm=f1942cea7c1fc1cb7310ae0edcacb1463f832f8d918775c62000cec1bbf9f8f1&" },
                        { name: "Love Bracelet", price: 7100, url: "https://cartier.scene7.com/is/image/Cartier/B6035517_0?&wid=1200&hei=1200&fmt=pjpeg&resMode=sharp&op_usm=1,1,3,0&defaultImage=common_noimage&prdImg=pdp_480" },
                        { name: "Panthère Ring", price: 8900, url: "https://cartier.scene7.com/is/image/Cartier/N4211700_0?&wid=1200&hei=1200&fmt=pjpeg&resMode=sharp&op_usm=1,1,3,0&defaultImage=common_noimage&prdImg=pdp_480" },
                        { name: "Trinity Necklace", price: 3200, url: "https://cartier.scene7.com/is/image/Cartier/B7428600_0?&wid=1200&hei=1200&fmt=pjpeg&resMode=sharp&op_usm=1,1,3,0&defaultImage=common_noimage&prdImg=pdp_480" }
                      ].map((product, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            form.setValue("productImageUrl", product.url);
                            form.setValue("productName", product.name);
                            form.setValue("productPrice", product.price);
                          }}
                          className="p-2 bg-red-900/20 hover:bg-red-900/30 rounded-lg transition-all border border-red-500/30 hover:border-red-500/50"
                        >
                          <img 
                            src={product.url} 
                            alt={product.name}
                            className="w-full h-12 object-cover rounded mb-1"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/80x80/8B0000/ffffff?text=Cartier";
                            }}
                          />
                          <p className="text-red-300 text-xs text-center">{product.name}</p>
                          <p className="text-red-400 text-xs font-semibold">${product.price.toLocaleString()}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                  <h4 className="text-purple-300 text-sm font-semibold mb-2">Quick Templates</h4>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        form.setValue("productName", "Custom Luxury Item");
                        form.setValue("productPrice", 999.99);
                        form.setValue("quantity", 1);
                        form.setValue("taxRate", 8.25);
                        form.setValue("shipping", 0);
                      }}
                      className="w-full text-left p-2 bg-purple-800/30 hover:bg-purple-800/50 rounded text-purple-200 text-xs transition-all"
                    >
                      🎯 Luxury Template
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        form.setValue("productName", "Business Service");
                        form.setValue("productPrice", 2499.99);
                        form.setValue("quantity", 1);
                        form.setValue("taxRate", 10);
                        form.setValue("shipping", 25);
                      }}
                      className="w-full text-left p-2 bg-blue-800/30 hover:bg-blue-800/50 rounded text-blue-200 text-xs transition-all"
                    >
                      💼 Business Template
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Receipt Form */}
            <Card className="glass border-white/20">
              <CardContent className="p-8">
                <h2 className="text-xl font-bold text-white mb-6">Receipt Details</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FloatingLabelInput
                                label="Customer Name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="customerEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FloatingLabelInput
                                label="Customer Email"
                                type="email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="billingAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                className="bg-white/10 border-white/20 text-white placeholder-transparent resize-none h-24"
                                placeholder="Billing Address"
                                {...field}
                              />
                              <label className="absolute left-4 top-3 text-gray-300 pointer-events-none floating-label">
                                Billing Address
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="productImageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FloatingLabelInput
                              label="Product Image URL (Optional)"
                              type="url"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="productName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FloatingLabelInput
                                label="Product Name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="productPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FloatingLabelInput
                                label="Price ($)"
                                type="number"
                                step="0.01"
                                min="0"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FloatingLabelInput
                                label="Quantity"
                                type="number"
                                min="1"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="taxRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FloatingLabelInput
                                label="Tax Rate (%)"
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shipping"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FloatingLabelInput
                                label="Shipping ($)"
                                type="number"
                                step="0.01"
                                min="0"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full btn-gradient py-4 rounded-lg text-white font-semibold text-lg"
                        disabled={createReceiptMutation.isPending || !user || user.credits <= 0}
                      >
                        {createReceiptMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Receipt
                          </>
                        )}
                      </Button>
                      <p className="text-gray-400 text-sm mt-2 text-center">
                        This will use 1 credit from your account
                      </p>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Receipt Preview */}
            <Card className="glass border-white/20">
              <CardContent className="p-8">
                <h2 className="text-xl font-bold text-white mb-6">Live Preview</h2>
                <ReceiptPreview data={watchedValues} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
