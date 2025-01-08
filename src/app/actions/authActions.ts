"use server";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@/lib/zod";
import { AuthError } from "next-auth";
import bcryptjs from "bcryptjs";

export async function handleCredentialSignIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
      message: "Welcome back🎊",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.cause?.err instanceof Error) {
        return {
          success: false,
          message: error.cause.err.message,
        };
      }
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Invalid credentials",
          };
        default:
          return {
            success: false,
            message: "Something went wrong",
          };
      }
    }
    throw error;
  }
}

export async function googleSignIn() {
  await signIn("google");
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/signin" });
}

export async function credentialsSignUp({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) {
  try {
    // check validation
    const parsedCredentials = signUpSchema.safeParse({
      username,
      email,
      password,
    });
    if (!parsedCredentials.success) {
      console.error("Invalid credentials:", parsedCredentials.error.errors);
      return {
        success: false,
        message: "Invalid data",
      };
    }

    // check if email already taken
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return {
        success: false,
        message: "Email already taken. Please login to continue.",
      };
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        name: username,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "Account created successfully.",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
