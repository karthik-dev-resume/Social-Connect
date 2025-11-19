"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  loginType: "user" | "admin";
  emailOrUsername: string;
  password: string;
  submitting: boolean;
  onEmailOrUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export function LoginForm({
  loginType,
  emailOrUsername,
  password,
  submitting,
  onEmailOrUsernameChange,
  onPasswordChange,
  onSubmit,
  onBack,
}: LoginFormProps) {
  return (
    <form autoComplete="off" onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label
          htmlFor="emailOrUsername"
          className="text-gray-700 text-xs lg-text-sm"
        >
          {loginType === "admin" ? "Admin Username" : "Email or Username"}
        </Label>
        <Input
          id="emailOrUsername"
          type="text"
          autoComplete="off"
          data-form-type="other"
          placeholder={
            loginType === "admin"
              ? "Enter your admin username"
              : "Enter your email or username"
          }
          value={emailOrUsername}
          onChange={(e) => onEmailOrUsernameChange(e.target.value)}
          required
          className="h-10 text-xs lg:text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700 text-xs lg-text-sm">
          Password
        </Label>
        <Input
          autoComplete="new-password"
          id="password"
          type="password"
          data-form-type="other"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
          className="h-10 text-xs lg:text-sm"
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 h-10 lg:h-12 text-xs lg:text-sm font-medium"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1 h-10 lg:h-12 text-white text-xs lg:text-sm font-medium"
          disabled={submitting}
          variant="default"
        >
          {submitting ? "Logging in..." : "Login Now"}
        </Button>
      </div>
    </form>
  );
}

