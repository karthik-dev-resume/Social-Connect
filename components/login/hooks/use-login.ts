"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { toast } from "sonner";

export function useLogin() {
  const { login, register } = useAuth();
  const [loginType, setLoginType] = useState<"user" | "admin" | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await login(emailOrUsername, password);
      toast.success("Logged in successfully!");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to login";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (emailOrUsername === "karthik.admin" && password === "test@123") {
        await login("karthik.admin", "test@123");
        toast.success("Admin login successful!");
      } else {
        toast.error("Invalid admin credentials");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to login";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await register(formData);
      toast.success("Account created successfully!");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to register";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      email: "",
      username: "",
      password: "",
      first_name: "",
      last_name: "",
    });
  };

  const resetLoginForm = () => {
    setEmailOrUsername("");
    setPassword("");
    setIsRegistering(false);
  };

  return {
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
  };
}

