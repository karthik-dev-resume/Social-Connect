"use client";

import { Button } from "@/components/ui/button";
import { User, Shield } from "lucide-react";
import { BrandingSection } from "./branding-section";

interface LoginTypeSelectionProps {
  onSelectType: (type: "user" | "admin") => void;
}

export function LoginTypeSelection({ onSelectType }: LoginTypeSelectionProps) {
  return (
    <div className="min-h-screen flex">
      <BrandingSection />

      {/* Right Section - Login Type Selection */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 lg:from-white lg:via-white lg:to-white relative overflow-hidden">
        {/* Geometric Pattern Background - Mobile Only */}
        <div className="lg:hidden absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>
        <div className="relative z-10 w-full max-w-md flex flex-col gap-4 lg:gap-10">
          <div className="lg:hidden flex items-center justify-center mb-12 w-full">
            <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-3xl font-bold">SC</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-2xl lg:text-4xl font-bold mb-4 text-gray-900">
              Social Connect
            </h1>
            <h2 className="text-sm lg:text-lg font-medium mb-2 text-gray-800">
              Join the conversation
            </h2>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => onSelectType("user")}
              className="w-full h-10 lg:h-12 text-sm text-white"
            >
              <User className="mr-2 h-5 w-5" />
              Login as User
            </Button>
            <Button
              onClick={() => onSelectType("admin")}
              variant="outline"
              className="w-full h-10 lg:h-12 text-sm"
            >
              <Shield className="mr-2 h-5 w-5" />
              Login as Admin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

