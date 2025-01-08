"use client";

import React from "react";
import AuthForm from "./form";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/lib/zod";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { credentialsSignUp } from "@/app/actions/authActions";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GoogleLogin from "./GoogleLogin";

const fields = [
  {
    name: "username",
    label: "Username",
    type: "text",
    placeholder: "John Doe",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "johndoe@gmail.com",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "xxxxxx",
  },
];

function SignupForm() {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    console.log(values);
    try {
      const response = await credentialsSignUp(values);
      console.log(response);

      if (response?.success) {
        router.push("/signin");
        toast.success(response.message);
      } else {
        toast.error(response?.message);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-2 ">
      <CardHeader className="space-y-2 text-left">
        <CardTitle className="text-3xl font-bold bg-clip-text">
          Sign Up
        </CardTitle>
        <CardDescription className=" text-gray-400">
          Create new account to explore
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm
          form={form}
          formfields={fields}
          onSubmit={onSubmit}
          buttonText="SignUp"
        />
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
        <GoogleLogin />
        <div className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold text-primary hover:text-primary/80 transition-colors duration-200 underline-offset-4 hover:underline"
          >
            SignIn
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export default SignupForm;
