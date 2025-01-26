"use client";

import React from "react";
import AuthForm, { FormFieldProps } from "./form";
import { useForm } from "react-hook-form";
import { signInSchema } from "@/lib/zod";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleCredentialSignIn } from "@/app/actions/authActions";
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

const fields: FormFieldProps[] = [
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

type SignInFormValues = z.infer<typeof signInSchema>;

function LoginForm() {
  const router = useRouter();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: SignInFormValues) {
    console.log(values);

    const toastId = toast.loading("Please wait...");
    try {
      const response = await handleCredentialSignIn(values);
      console.log(response);

      if (response?.success) {
        router.push("/home");
        return toast.success(response.message as string, {
          id: toastId,
        });
      } else {
        return toast.error(response.message as string, {
          id: toastId,
        });
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during signin";
      toast.error(errorMessage);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-2 ">
      <CardHeader className="space-y-2 text-left">
        <CardTitle className="text-3xl font-bold bg-clip-text">
          Sign In
        </CardTitle>
        <CardDescription className=" text-gray-400">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthForm
          // @ts-expect-error
          form={form}
          formfields={fields}
          // @ts-expect-error
          onSubmit={onSubmit}
          buttonText="SignIn"
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
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:text-primary/80 transition-colors duration-200 underline-offset-4 hover:underline"
          >
            Signup
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export default LoginForm;
