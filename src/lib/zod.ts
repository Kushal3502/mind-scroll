import { z } from "zod";

export const signUpSchema = z.object({
  username: z.string().min(2, "Username must contains atleast 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be atleast 6 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});
