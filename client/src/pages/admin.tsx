import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Users, Receipt, Activity, LogOut, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const addCreditsSchema = z.object({
  userId: z.string().min(1, "Please select a user"),
  credits: z.number().min(1, "Credits must be at least 1").max(1000, "Maximum 1000 credits"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type AddCreditsFormData = z.infer<typeof addCreditsSchema>;

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const creditsForm = useForm<AddCreditsFormData>({
    resolver: zodResolver(addCreditsSchema),
    defaultValues: {
      userId: "",
      credits: 0,
    },
  });

  // Check admin status on load
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch("/api/admin/status");
        const data = await response.json();
        setIsLoggedIn(data.isAdmin);
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  const { data: users = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/users"],
    enabled: isLoggedIn,
  });

  const { data: receipts = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/receipts"],
    enabled: isLoggedIn,
  });

  const { data: stats } = useQuery<{ totalUsers: number; totalReceipts: number }>({
    queryKey: ["/api/admin/stats"],
    enabled: isLoggedIn,
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiRequest("POST", "/api/admin/login", data);
      return await response.json();
    },
    onSuccess: () => {
      setIsLoggedIn(true);
      toast({
        title: "Success!",
        description: "Logged in successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Login failed",
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/logout", {});
      return await response.json();
    },
    onSuccess: () => {
      setIsLoggedIn(false);
      loginForm.reset();
      toast({
        title: "Success!",
        description: "Logged out successfully",
      });
    },
  });

  const addCreditsMutation = useMutation({
    mutationFn: async (data: AddCreditsFormData) => {
      const response = await apiRequest("POST", "/api/admin/add-credits", data);
      return await response.json();
    },
    onSuccess: () => {
      creditsForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Success!",
        description: "Credits added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add credits",
        variant: "destructive",
      });
    },
  });

  const onLogin = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const onAddCredits = (data: AddCreditsFormData) => {
    addCreditsMutation.mutate(data);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <Card className="glass border-white/20 w-full max-w-md mx-4">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Admin Panel</h2>
              <p className="text-gray-300">Sign in to access admin features</p>
            </div>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          label="Username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingLabelInput
                          label="Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full btn-gradient py-3 rounded-lg text-white font-semibold"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
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
                <Shield className="text-white text-sm" />
              </div>
              <span className="text-white font-bold text-xl">Admin Panel</span>
            </div>
            <Button 
              variant="ghost"
              className="text-gray-300 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="pt-20 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
              <p className="text-gray-300">Manage users and system settings</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="glass border-white/20 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Plus className="text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Add Credits</h3>
                <p className="text-gray-300 text-sm">Grant credits to users</p>
              </CardContent>
            </Card>
            
            <Card className="glass border-white/20 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Manage Users</h3>
                <p className="text-gray-300 text-sm">View user activity</p>
              </CardContent>
            </Card>
            
            <Card className="glass border-white/20 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Receipt className="text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">View Receipts</h3>
                <p className="text-gray-300 text-sm">Monitor all receipts</p>
              </CardContent>
            </Card>
          </div>

          {/* Admin Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="glass border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Users className="text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Total Receipts</p>
                    <p className="text-2xl font-bold text-white">{stats?.totalReceipts || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center">
                    <Receipt className="text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Active Sessions</p>
                    <p className="text-2xl font-bold text-white">1</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                    <Activity className="text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">System Status</p>
                    <p className="text-2xl font-bold text-green-400">Online</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <Activity className="text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Management */}
          <Card className="glass border-white/20 mb-8">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-white mb-6">User Management</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20">
                      <TableHead className="text-gray-300">Email</TableHead>
                      <TableHead className="text-gray-300">Name</TableHead>
                      <TableHead className="text-gray-300">Credits</TableHead>
                      <TableHead className="text-gray-300">Receipts Sent</TableHead>
                      <TableHead className="text-gray-300">Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user: any) => (
                      <TableRow key={user.id} className="border-white/10">
                        <TableCell className="text-white">{user.email}</TableCell>
                        <TableCell className="text-white">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}` 
                            : user.firstName || user.lastName || '-'
                          }
                        </TableCell>
                        <TableCell className="text-white">{user.credits}</TableCell>
                        <TableCell className="text-white">{user.totalReceiptsSent}</TableCell>
                        <TableCell className="text-white">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Add Credits Section */}
          <Card className="glass border-white/20">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-white mb-6">Add Credits to User</h2>
              <Form {...creditsForm}>
                <form onSubmit={creditsForm.handleSubmit(onAddCredits)} className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <FormField
                      control={creditsForm.control}
                      name="userId"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue placeholder="Select User" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {users.map((user: any) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.email} ({user.credits} credits)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={creditsForm.control}
                      name="credits"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <FloatingLabelInput
                              label="Credits to Add"
                              type="number"
                              min="1"
                              max="1000"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="btn-gradient px-6 py-3 rounded-lg text-white font-semibold"
                    disabled={addCreditsMutation.isPending}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Credits
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
