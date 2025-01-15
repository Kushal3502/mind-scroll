import { string, z } from "zod";

export const signUpSchema = z.object({
  username: z.string().min(2, "Username must contains atleast 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be atleast 6 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});

export const contentSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters")
    .trim(),
  thumbnail: z
    .string()
    .url("Please provide a valid URL for the thumbnail")
    .trim(),
  tags: z.array(z.string()).min(1, "Please add at least one tag"),
  content: z.any(),
});
