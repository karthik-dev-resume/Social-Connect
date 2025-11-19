"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { useLogin } from "./hooks/use-login";
import { BrandingSection } from "./branding-section";
import { LoginTypeSelection } from "./login-type-selection";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { Spinner } from "@/components/ui/spinner";

export function LoginTemplate() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const {
    loginType,
    setLoginType,
    isRegistering,
    setIsRegistering,
    emailOrUsername,
    setEmailOrUsername,
    password,
    setPassword,
    formData,
    submitting,
    handleUserLogin,
    handleAdminLogin,
    handleRegister,
    handleChange,
    resetForm,
    resetLoginForm,
  } = useLogin();

  // Redirect if already logged in
  // Note: This redirect is based on role, but actual login redirect is handled in use-auth.tsx
  // based on login type selection
  useEffect(() => {
    if (!loading && user) {
      // If user is on login page and already logged in, redirect based on role
      // This handles cases where user navigates directly to /login while logged in
      if (user.role === "admin") {
        router.replace("/admin-dashboard");
      } else {
        router.replace("/feed");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  // Don't render if user is logged in (will redirect)
  if (user) {
    return null;
  }

  // Show login type selection screen
  if (loginType === null) {
    return <LoginTypeSelection onSelectType={setLoginType} />;
  }

  // Show login/register form based on selected type
  return (
    <div className="min-h-screen flex">
      <BrandingSection />

      {/* Right Section - Login/Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Brand Name */}
          <h1 className="text-2xl lg:text-4xl font-bold mb-2 lg:mb-6 text-gray-900">
            Social Connect
          </h1>

          {/* Welcome Message */}
          <h2 className="text-sm lg:text-2xl font-semibold mb-6 lg:mb-10 text-gray-800">
            {isRegistering
              ? "Create an account"
              : loginType === "admin"
              ? "Admin Login"
              : "Welcome Back!"}
          </h2>

          {/* Sign Up/Login Toggle - Only for user login */}
          {loginType === "user" && !isRegistering && (
            <p className="text-gray-600 mb-4 lg:mb-8 text-xs lg:text-sm">
              Don&rsquo;t have an account?{" "}
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                className="text-primary hover:underline font-medium"
              >
                Create a new account now
              </button>
              , it&rsquo;s FREE! Takes less than a minute.
            </p>
          )}

          {loginType === "user" && isRegistering && (
            <p className="text-gray-600 mb-8 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="text-primary hover:underline font-medium"
              >
                Login here
              </button>
            </p>
          )}

          {/* Registration Form */}
          {isRegistering && loginType === "user" ? (
            <RegisterForm
              formData={formData}
              submitting={submitting}
              onChange={handleChange}
              onSubmit={handleRegister}
              onBack={() => {
                setIsRegistering(false);
                resetForm();
              }}
            />
          ) : (
            <LoginForm
              loginType={loginType}
              emailOrUsername={emailOrUsername}
              password={password}
              submitting={submitting}
              onEmailOrUsernameChange={setEmailOrUsername}
              onPasswordChange={setPassword}
              onSubmit={
                loginType === "admin" ? handleAdminLogin : handleUserLogin
              }
              onBack={() => {
                setLoginType(null);
                resetLoginForm();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
