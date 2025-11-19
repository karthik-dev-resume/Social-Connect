"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegisterFormProps {
  formData: {
    email: string;
    username: string;
    password: string;
    first_name: string;
    last_name: string;
  };
  submitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export function RegisterForm({
  formData,
  submitting,
  onChange,
  onSubmit,
  onBack,
}: RegisterFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="first_name"
            className="text-gray-700 text-xs lg-text-sm"
          >
            First Name
          </Label>
          <Input
            id="first_name"
            name="first_name"
            type="text"
            placeholder="John"
            value={formData.first_name}
            onChange={onChange}
            required
            className="h-10 text-xs lg:text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="last_name"
            className="text-gray-700 text-xs lg-text-sm"
          >
            Last Name
          </Label>
          <Input
            id="last_name"
            name="last_name"
            type="text"
            placeholder="Doe"
            value={formData.last_name}
            onChange={onChange}
            required
            className="h-10 text-xs lg:text-sm"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700 text-xs lg-text-sm">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={onChange}
          required
          className="h-10 text-xs lg:text-sm"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="username" className="text-gray-700 text-xs lg-text-sm">
          Username
        </Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="johndoe"
          value={formData.username}
          onChange={onChange}
          required
          minLength={3}
          maxLength={30}
          pattern="[a-zA-Z0-9_]+"
          className="h-10 text-xs lg:text-sm"
        />
        <p className="text-xs text-gray-500">
          3-30 characters, letters, numbers, and underscores only
        </p>
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="reg_password"
          className="text-gray-700 text-xs lg-text-sm"
        >
          Password
        </Label>
        <Input
          id="reg_password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={onChange}
          required
          minLength={8}
          className="h-10 text-xs lg:text-sm"
        />
        <p className="text-xs text-gray-500">At least 8 characters</p>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 h-10 lg:h-12 text-sm font-medium"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1 h-10 lg:h-12 text-white text-sm font-medium"
          disabled={submitting}
        >
          {submitting ? "Creating account..." : "Create account"}
        </Button>
      </div>
    </form>
  );
}

