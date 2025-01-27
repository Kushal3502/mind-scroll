import { NextAuthConfig } from "next-auth";
import { prisma } from "./lib/prisma";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";
import bcryptjs from "bcryptjs";

export default {
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "johndoe@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "xxxxxx",
        },
      },
      authorize: async (credentials) => {
        try {
          // validate credentials
          const parsedCredentials = signInSchema.safeParse(credentials);

          if (!parsedCredentials.success) {
            console.error(
              "Invalid credentials:",
              parsedCredentials.error.errors
            );
            throw new Error("Invalid email or password format");
          }

          // get user
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string,
            },
          });

          if (!user) {
            throw new Error("No account found with this email. Please signup.");
          }

          if (!user.password) {
            throw new Error("Please use Google sign in for this account");
          }

          const isPasswordValid = await bcryptjs.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Incorrect password");
          }

          const { ...userWithoutPassword } = user;

          return userWithoutPassword;
        } catch (error) {
          console.error("Authorization error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
} satisfies NextAuthConfig;
