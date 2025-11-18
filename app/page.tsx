"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Shield } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user, loading, login } = useAuth();
  const [loginType, setLoginType] = useState<'user' | 'admin' | null>(null);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        router.push("/admin");
      } else {
        router.push("/feed");
      }
    }
  }, [user, loading, router]);

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await login(emailOrUsername, password);
      toast.success('Logged in successfully!');
      router.push('/feed');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Hardcoded admin credentials
      if (emailOrUsername === 'karthik.admin' && password === 'test@123') {
        await login('karthik.admin', 'test@123');
        toast.success('Admin login successful!');
        router.push('/admin');
      } else {
        toast.error('Invalid admin credentials');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect in useEffect
  }

  if (loginType === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome to Vega</CardTitle>
            <CardDescription className="text-center">Choose your login type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setLoginType('user')}
              className="w-full h-20 text-lg"
              variant="default"
            >
              <User className="mr-2 h-5 w-5" />
              Login as User
            </Button>
            <Button
              onClick={() => setLoginType('admin')}
              className="w-full h-20 text-lg"
              variant="outline"
            >
              <Shield className="mr-2 h-5 w-5" />
              Login as Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            {loginType === 'admin' ? 'Admin Login' : 'User Login'}
          </CardTitle>
          <CardDescription>
            {loginType === 'admin' 
              ? 'Login with admin credentials' 
              : 'Login to your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={loginType === 'admin' ? handleAdminLogin : handleUserLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailOrUsername">
                {loginType === 'admin' ? 'Admin Username' : 'Email or Username'}
              </Label>
              <Input
                id="emailOrUsername"
                type="text"
                placeholder={loginType === 'admin' ? 'karthik.admin' : 'Enter your email or username'}
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setLoginType(null);
                  setEmailOrUsername('');
                  setPassword('');
                }}
                className="flex-1"
              >
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
          {loginType === 'user' && (
            <div className="mt-4 text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <a href="/register" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
