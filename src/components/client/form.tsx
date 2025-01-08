"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface FormFieldProps {
  name: string;
  label: string;
  type: string;
  placeholder: string;
}

function AuthForm({
  form,
  formfields,
  onSubmit,
  buttonText,
}: {
  form: UseFormReturn<any>;
  formfields: FormFieldProps[];
  onSubmit: any;
  buttonText: string;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {formfields.map((item, index) => (
          <FormField
            key={index}
            control={form.control}
            name={item.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{item.label}</FormLabel>
                <FormControl>
                  <Input
                    type={item.type}
                    placeholder={item.placeholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        ))}
        <Button
          type="submit"
          className="w-full font-semibold py-2 rounded-lg transition-all duration-200"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <p>Please wait</p>
            </>
          ) : (
            <p>{buttonText}</p>
          )}
        </Button>
      </form>
    </Form>
  );
}

export default AuthForm;
