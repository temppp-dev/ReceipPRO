import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Receipt, Calendar, Coins, CheckCircle, Plus, LogOut } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [location, setLocation] = useState<string>();

  const { data: receipts = [] } = useQuery<any[]>({
    queryKey: ["/api/receipts"],
    enabled: isAuthenticated,
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const totalReceipts = receipts.length;
  const thisMonth = new Date().getMonth();
  const monthlyReceipts = receipts.filter((r: any) => 
    new Date(r.createdAt).getMonth() === thisMonth
  ).length;

  if (!user) {
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
              <div className="glass rounded-lg px-4 py-2">
                <span className="text-gray-300">Credits: </span>
                <span className="text-white font-semibold">{user.credits}</span>
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
        </div>
      </nav>

      <div className="pt-20 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-300">
                Welcome back, {user.firstName || user.email?.split('@')[0] || 'User'}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="glass border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Total Receipts</p>
                    <p className="text-2xl font-bold text-white">{totalReceipts}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Receipt className="text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">This Month</p>
                    <p className="text-2xl font-bold text-white">{monthlyReceipts}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center">
                    <Calendar className="text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Available Credits</p>
                    <p className="text-2xl font-bold text-white">{user.credits}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                    <Coins className="text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Success Rate</p>
                    <p className="text-2xl font-bold text-white">98%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="glass border-white/20 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Plus className="text-white text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Create Receipt</h2>
                <p className="text-gray-300 mb-6">Generate professional Apple-style receipts</p>
                <Link href="/create">
                  <Button className="btn-gradient px-8 py-3 rounded-lg text-white font-semibold">
                    Create Receipt
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="glass border-white/20 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Receipt className="text-white text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Recent Receipts</h2>
                <p className="text-gray-300 mb-6">View and manage your sent receipts</p>
                <Button 
                  className="btn-secondary px-8 py-3 rounded-lg text-white font-semibold"
                  onClick={() => {
                    const recentSection = document.getElementById('recent-receipts');
                    recentSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View History
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Receipts */}
          <Card className="glass border-white/20 mb-8" id="recent-receipts">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-white mb-6">Recent Receipts</h2>
              {receipts.length > 0 ? (
                <div className="space-y-4">
                  {receipts.slice(0, 5).map((receipt: any) => (
                    <div key={receipt.id} className="glass border-white/10 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-semibold">{receipt.productName}</h3>
                          <p className="text-gray-300 text-sm">To: {receipt.customerEmail}</p>
                          <p className="text-gray-400 text-xs">Order #{receipt.orderNumber}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">${(receipt.total / 100).toFixed(2)}</p>
                          <p className={`text-xs ${receipt.emailSent ? 'text-green-400' : 'text-red-400'}`}>
                            {receipt.emailSent ? '✓ Sent' : '✗ Failed'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Receipt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-300">No receipts created yet</p>
                  <Link href="/create">
                    <Button className="btn-gradient mt-4 px-6 py-2 rounded-lg text-white">
                      Create Your First Receipt
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
