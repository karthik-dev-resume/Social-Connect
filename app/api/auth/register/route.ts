import { NextRequest } from "next/server";
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from "@/lib/db/queries";
import {
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { User } from "@/lib/db/types";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  password: z.string().min(8, "Password must be at least 8 characters"),
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    // Check if email already exists
    const existingEmail = await getUserByEmail(validated.email);
    if (existingEmail) {
      return Response.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUsername = await getUserByUsername(validated.username);
    if (existingUsername) {
      return Response.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }

    // Hash password
    const password_hash = await hashPassword(validated.password);

    // Create user
    let user;
    try {
      user = await createUser({
        email: validated.email,
        username: validated.username,
        first_name: validated.first_name,
        last_name: validated.last_name,
        password_hash,
      });
    } catch (dbError) {
      console.error("Database error during user creation:", dbError);
      return Response.json(
        {
          error: "Failed to create user",
          details: dbError instanceof Error ? dbError.message : String(dbError),
          hint: "Check that SUPABASE_SERVICE_ROLE_KEY is set correctly and database tables exist",
        },
        { status: 500 }
      );
    }

    if (!user) {
      console.error(
        "Failed to create user - check Supabase connection and database tables"
      );
      return Response.json(
        {
          error: "Failed to create user",
          hint: "Check that SUPABASE_SERVICE_ROLE_KEY is set correctly and database tables exist",
        },
        { status: 500 }
      );
    }

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as "user" | "admin",
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token
    const supabase = createAdminClient();
    await supabase.from("refresh_tokens").insert({
      token: refreshToken,
      user_id: user.id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    });

    // Remove password_hash from response (if present)
    const { password_hash: _, ...userResponse } = user as User & {
      password_hash?: string;
    };

    return Response.json({
      user: userResponse,
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return Response.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
