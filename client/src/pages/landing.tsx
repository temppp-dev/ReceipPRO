import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Receipt, Mail, Shield, Sparkles } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

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
              <Button 
                variant="ghost" 
                className="text-white hover:text-blue-300 transition-colors"
                onClick={handleLogin}
              >
                Login
              </Button>
              <Button 
                className="btn-gradient px-4 py-2 rounded-lg text-white font-medium"
                onClick={handleLogin}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Receipt className="text-white text-3xl" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Professional Receipt
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
                Generator
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
              Create beautiful, professional receipts with our premium Apple-inspired design. Perfect for businesses of all sizes.
            </p>
            <div className="flex items-center justify-center gap-6 text-gray-400 text-sm mb-8">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>99.9% uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span>10k+ users</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                <span>Enterprise ready</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="btn-gradient px-8 py-4 rounded-xl text-white font-semibold text-lg"
                onClick={handleLogin}
              >
                Get Started Free
              </Button>
              <Button 
                variant="outline"
                className="glass px-8 py-4 rounded-xl text-white font-semibold text-lg border-white/20 hover:bg-white/20 transition-all backdrop-blur-md"
                onClick={() => window.location.href = "/admin"}
              >
                🔐 Admin Access
              </Button>
            </div>
          </div>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="glass border-white/20 animate-slide-up group hover:scale-105 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                  <Sparkles className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Design</h3>
                <p className="text-gray-300">Beautiful Apple-inspired receipts with smart formatting and professional styling</p>
                <div className="mt-4 flex items-center justify-center gap-2 text-green-400 text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span>99.9% accuracy</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border-white/20 animate-slide-up group hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                  <Mail className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Instant Delivery</h3>
                <p className="text-gray-300">Send receipts instantly via email with guaranteed delivery and tracking</p>
                <div className="mt-4 flex items-center justify-center gap-2 text-blue-400 text-sm">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  <span>&lt; 3 sec delivery</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border-white/20 animate-slide-up group hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                  <Shield className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Enterprise Security</h3>
                <p className="text-gray-300">Bank-grade encryption with SOC 2 compliance and GDPR ready infrastructure</p>
                <div className="mt-4 flex items-center justify-center gap-2 text-purple-400 text-sm">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                  <span>256-bit encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1M+</div>
              <div className="text-gray-400">Receipts Sent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">Support</div>
            </div>
          </div>

          {/* Additional Features Grid */}
          <div className="mt-24 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass border-white/20 animate-slide-up hover:border-purple-500/50 transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Multi-Brand Templates</h3>
                <p className="text-gray-300 text-sm">Apple, Cartier, and custom brand templates</p>
              </CardContent>
            </Card>
            
            <Card className="glass border-white/20 animate-slide-up hover:border-blue-500/50 transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <Mail className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Smart Automation</h3>
                <p className="text-gray-300 text-sm">Auto-fill customer data and preferences</p>
              </CardContent>
            </Card>
            
            <Card className="glass border-white/20 animate-slide-up hover:border-green-500/50 transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mb-4">
                  <Shield className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Global Compliance</h3>
                <p className="text-gray-300 text-sm">Tax calculations for 50+ countries</p>
              </CardContent>
            </Card>
            
            <Card className="glass border-white/20 animate-slide-up hover:border-yellow-500/50 transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mb-4">
                  <Receipt className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Analytics Dashboard</h3>
                <p className="text-gray-300 text-sm">Track performance and customer insights</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Testimonials Section */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Trusted by businesses worldwide</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="glass border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">JS</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold">John Smith</div>
                      <div className="text-gray-400 text-sm">Tech Startup CEO</div>
                    </div>
                  </div>
                  <p className="text-gray-300">"ReceiptPro has streamlined our billing process. The Apple-style receipts look incredibly professional."</p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-secondary rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">MD</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Maria Davis</div>
                      <div className="text-gray-400 text-sm">E-commerce Owner</div>
                    </div>
                  </div>
                  <p className="text-gray-300">"Our customers love receiving these professional receipts. It's elevated our brand image significantly."</p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">RJ</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Robert Johnson</div>
                      <div className="text-gray-400 text-sm">Freelancer</div>
                    </div>
                  </div>
                  <p className="text-gray-300">"Simple, beautiful, and reliable. Exactly what I needed for my consulting business."</p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="mt-24 text-center">
            <Card className="glass border-white/20">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
                <p className="text-xl text-gray-300 mb-8">Join thousands of businesses using ReceiptPro</p>
                <Button 
                  className="btn-gradient px-12 py-4 rounded-xl text-white font-semibold text-lg transform transition-all hover:scale-105"
                  onClick={handleLogin}
                >
                  Start Your Free Trial
                </Button>
                <p className="text-gray-400 text-sm mt-4">No credit card required • Cancel anytime</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
